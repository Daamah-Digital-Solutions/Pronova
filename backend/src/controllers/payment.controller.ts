import { Request, Response, NextFunction } from 'express';
import { paymentService } from '../services/payment.service';
import { AppError, asyncHandler } from '../middleware/error.middleware';

export const createPaymentIntent = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { amount, currency, referralCode } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError('Authentication required', 401);
  }

  if (!amount || amount <= 0) {
    throw new AppError('Invalid amount', 400);
  }

  if (!currency) {
    throw new AppError('Currency is required', 400);
  }

  const result = await paymentService.createPaymentIntent({
    amount,
    currency,
    userId,
    referralCode,
  });

  res.status(201).json({
    success: true,
    data: result,
  });
});

export const createCheckoutSession = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { amount, tokenAmount, referralCode } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError('Authentication required', 401);
  }

  if (!amount || amount <= 0) {
    throw new AppError('Invalid amount', 400);
  }

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  const session = await paymentService.createCheckoutSession({
    priceData: {
      currency: 'usd',
      product_data: {
        name: 'Pronova Tokens',
        description: `Purchase ${tokenAmount} PRON tokens`,
      },
      unit_amount: Math.round(amount * 100), // Convert to cents
    },
    quantity: 1,
    successUrl: `${frontendUrl}/presale/success?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${frontendUrl}/presale?cancelled=true`,
    metadata: {
      userId,
      amount: amount.toString(),
      tokenAmount: tokenAmount.toString(),
      referralCode: referralCode || '',
    },
  });

  res.status(201).json({
    success: true,
    data: {
      sessionId: session.id,
      url: session.url,
    },
  });
});

export const handleWebhook = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const signature = req.headers['stripe-signature'] as string;
  
  if (!signature) {
    throw new AppError('Missing Stripe signature', 400);
  }

  const result = await paymentService.processWebhook(req.body, signature);

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getPaymentStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { paymentIntentId } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError('Authentication required', 401);
  }

  const paymentIntent = await paymentService.getPaymentIntent(paymentIntentId);

  // Verify the payment intent belongs to the user
  if (paymentIntent.metadata.userId !== userId) {
    throw new AppError('Payment not found', 404);
  }

  res.status(200).json({
    success: true,
    data: {
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      created: paymentIntent.created,
      metadata: paymentIntent.metadata,
    },
  });
});

export const refundPayment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { paymentIntentId } = req.params;
  const { reason } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError('Authentication required', 401);
  }

  // Check if user is admin (you might want to add admin role check here)
  const userRole = req.user?.role;
  if (userRole !== 'ADMIN') {
    throw new AppError('Admin access required', 403);
  }

  const refund = await paymentService.refundPayment(paymentIntentId, reason);

  res.status(200).json({
    success: true,
    message: 'Refund processed successfully',
    data: {
      refundId: refund.id,
      amount: refund.amount! / 100,
      status: refund.status,
    },
  });
});