import Stripe from 'stripe';
import { prisma } from '../config/database';
import { presaleService } from './presale.service';
import { PaymentMethod } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-06-30.basil',
  typescript: true,
});

export interface PaymentIntentData {
  amount: number; // Amount in USD
  currency: string;
  userId: string;
  referralCode?: string;
  metadata?: Record<string, string>;
}

export class PaymentService {
  async createPaymentIntent(data: PaymentIntentData): Promise<{
    clientSecret: string;
    paymentIntentId: string;
  }> {
    const { amount, currency, userId, referralCode, metadata } = data;

    // Calculate tokens for the amount
    const calculation = await presaleService.calculateTokens(amount);
    if (!calculation) {
      throw new Error('Unable to calculate tokens for current phase');
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        userId,
        tokensExpected: calculation.tokens.toString(),
        pricePerToken: calculation.pricePerToken.toString(),
        phase: calculation.phase.toString(),
        referralCode: referralCode || '',
        ...metadata,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret!,
      paymentIntentId: paymentIntent.id,
    };
  }

  async handleSuccessfulPayment(paymentIntentId: string): Promise<void> {
    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      throw new Error('Payment not successful');
    }

    const metadata = paymentIntent.metadata;
    const userId = metadata.userId;
    const amount = paymentIntent.amount / 100; // Convert from cents
    const referralCode = metadata.referralCode || undefined;

    if (!userId) {
      throw new Error('Missing user ID in payment metadata');
    }

    // Create presale purchase
    await presaleService.createPurchase({
      userId,
      paymentMethod: PaymentMethod.USD,
      amountPaid: amount,
      referralCode,
    });
  }

  async processWebhook(
    body: string | Buffer,
    signature: string
  ): Promise<{ processed: boolean; type: string }> {
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      throw new Error(`Webhook signature verification failed: ${err}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await this.handleSuccessfulPayment(paymentIntent.id);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', failedPayment.id);
        // Handle failed payment (maybe send notification)
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return {
      processed: true,
      type: event.type,
    };
  }

  async refundPayment(paymentIntentId: string, reason?: string): Promise<Stripe.Refund> {
    return stripe.refunds.create({
      payment_intent: paymentIntentId,
      reason: 'requested_by_customer',
      metadata: {
        refund_reason: reason || 'Admin refund',
      },
    });
  }

  async getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    return stripe.paymentIntents.retrieve(paymentIntentId);
  }

  async listCustomerPayments(customerId: string): Promise<Stripe.PaymentIntent[]> {
    const paymentIntents = await stripe.paymentIntents.list({
      customer: customerId,
      limit: 100,
    });

    return paymentIntents.data;
  }

  async createCustomer(email: string, name?: string): Promise<Stripe.Customer> {
    return stripe.customers.create({
      email,
      name,
    });
  }

  async updateCustomer(customerId: string, data: Partial<Stripe.CustomerUpdateParams>): Promise<Stripe.Customer> {
    return stripe.customers.update(customerId, data);
  }

  async createCheckoutSession(data: {
    priceData: {
      currency: string;
      product_data: {
        name: string;
        description?: string;
      };
      unit_amount: number;
    };
    quantity: number;
    successUrl: string;
    cancelUrl: string;
    metadata: Record<string, string>;
  }): Promise<Stripe.Checkout.Session> {
    return stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: data.priceData,
          quantity: data.quantity,
        },
      ],
      mode: 'payment',
      success_url: data.successUrl,
      cancel_url: data.cancelUrl,
      metadata: data.metadata,
    });
  }
}

export const paymentService = new PaymentService();