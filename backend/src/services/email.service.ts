import sgMail from '@sendgrid/mail';
import { cache } from '../config/redis';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

export interface EmailOptions {
  to: string | string[];
  template: EmailTemplate;
  dynamicData?: Record<string, any>;
}

export class EmailService {
  private fromEmail: string;

  constructor() {
    this.fromEmail = process.env.EMAIL_FROM || 'noreply@pronova.com';
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const { to, template, dynamicData } = options;

      // Replace dynamic data in template
      let processedHtml = template.html;
      let processedText = template.text || '';
      let processedSubject = template.subject;

      if (dynamicData) {
        Object.entries(dynamicData).forEach(([key, value]) => {
          const placeholder = `{{${key}}}`;
          processedHtml = processedHtml.replace(new RegExp(placeholder, 'g'), String(value));
          processedText = processedText.replace(new RegExp(placeholder, 'g'), String(value));
          processedSubject = processedSubject.replace(new RegExp(placeholder, 'g'), String(value));
        });
      }

      const msg = {
        to: Array.isArray(to) ? to : [to],
        from: this.fromEmail,
        subject: processedSubject,
        html: processedHtml,
        text: processedText,
      };

      await sgMail.send(msg);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  async sendWelcomeEmail(userEmail: string, userName: string, verificationToken: string): Promise<boolean> {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    const template: EmailTemplate = {
      subject: 'Welcome to Pronova - Verify Your Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">Welcome to Pronova!</h1>
          <p>Hi {{userName}},</p>
          <p>Thank you for joining the Pronova presale! To get started, please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{verificationUrl}}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p>If the button doesn't work, copy and paste this link in your browser:</p>
          <p style="word-break: break-all;">{{verificationUrl}}</p>
          <p>This link will expire in 24 hours.</p>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 14px;">
            If you didn't create an account with Pronova, please ignore this email.
          </p>
        </div>
      `,
      text: `
        Welcome to Pronova!
        
        Hi {{userName}},
        
        Thank you for joining the Pronova presale! To get started, please verify your email address by visiting:
        {{verificationUrl}}
        
        This link will expire in 24 hours.
        
        If you didn't create an account with Pronova, please ignore this email.
      `,
    };

    return this.sendEmail({
      to: userEmail,
      template,
      dynamicData: {
        userName,
        verificationUrl,
      },
    });
  }

  async sendPasswordResetEmail(userEmail: string, userName: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const template: EmailTemplate = {
      subject: 'Reset Your Pronova Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">Password Reset Request</h1>
          <p>Hi {{userName}},</p>
          <p>We received a request to reset your password for your Pronova account. Click the button below to reset it:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{resetUrl}}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>If the button doesn't work, copy and paste this link in your browser:</p>
          <p style="word-break: break-all;">{{resetUrl}}</p>
          <p>This link will expire in 1 hour.</p>
          <p><strong>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</strong></p>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 14px;">
            For security reasons, this link can only be used once.
          </p>
        </div>
      `,
      text: `
        Password Reset Request
        
        Hi {{userName}},
        
        We received a request to reset your password for your Pronova account. Visit this link to reset it:
        {{resetUrl}}
        
        This link will expire in 1 hour.
        
        If you didn't request this password reset, please ignore this email.
      `,
    };

    return this.sendEmail({
      to: userEmail,
      template,
      dynamicData: {
        userName,
        resetUrl,
      },
    });
  }

  async sendKycApprovalEmail(userEmail: string, userName: string): Promise<boolean> {
    const template: EmailTemplate = {
      subject: 'KYC Verification Approved - Welcome to Pronova Presale',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #10B981;">KYC Verification Approved!</h1>
          <p>Hi {{userName}},</p>
          <p>Great news! Your KYC verification has been approved. You can now participate in the Pronova presale.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{presaleUrl}}" style="background-color: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Start Investing
            </a>
          </div>
          <p>What you can now do:</p>
          <ul>
            <li>Purchase PRON tokens during the presale</li>
            <li>Refer friends and earn bonuses</li>
            <li>Access your personalized dashboard</li>
          </ul>
          <p>Thank you for being part of the Pronova community!</p>
        </div>
      `,
      text: `
        KYC Verification Approved!
        
        Hi {{userName}},
        
        Great news! Your KYC verification has been approved. You can now participate in the Pronova presale.
        
        Visit: {{presaleUrl}}
        
        What you can now do:
        - Purchase PRON tokens during the presale
        - Refer friends and earn bonuses
        - Access your personalized dashboard
        
        Thank you for being part of the Pronova community!
      `,
    };

    return this.sendEmail({
      to: userEmail,
      template,
      dynamicData: {
        userName,
        presaleUrl: `${process.env.FRONTEND_URL}/presale`,
      },
    });
  }

  async sendKycRejectionEmail(userEmail: string, userName: string, reason: string): Promise<boolean> {
    const template: EmailTemplate = {
      subject: 'KYC Verification Update Required',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #EF4444;">KYC Verification Needs Attention</h1>
          <p>Hi {{userName}},</p>
          <p>We've reviewed your KYC submission and need some additional information or corrections.</p>
          <div style="background-color: #FEF2F2; border-left: 4px solid #EF4444; padding: 15px; margin: 20px 0;">
            <p><strong>Reason:</strong> {{reason}}</p>
          </div>
          <p>Please review the feedback and resubmit your documents:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{kycUrl}}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Update KYC Documents
            </a>
          </div>
          <p>If you have any questions, please contact our support team.</p>
        </div>
      `,
      text: `
        KYC Verification Needs Attention
        
        Hi {{userName}},
        
        We've reviewed your KYC submission and need some additional information or corrections.
        
        Reason: {{reason}}
        
        Please review the feedback and resubmit your documents at: {{kycUrl}}
        
        If you have any questions, please contact our support team.
      `,
    };

    return this.sendEmail({
      to: userEmail,
      template,
      dynamicData: {
        userName,
        reason,
        kycUrl: `${process.env.FRONTEND_URL}/kyc`,
      },
    });
  }

  async sendPurchaseConfirmationEmail(
    userEmail: string,
    userName: string,
    transactionDetails: {
      amount: number;
      tokens: number;
      paymentMethod: string;
      transactionId: string;
    }
  ): Promise<boolean> {
    const template: EmailTemplate = {
      subject: 'Purchase Confirmation - Pronova Tokens',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #10B981;">Purchase Confirmed!</h1>
          <p>Hi {{userName}},</p>
          <p>Thank you for your purchase! Your transaction has been confirmed.</p>
          <div style="background-color: #F0FDF4; border: 1px solid #10B981; padding: 20px; margin: 20px 0; border-radius: 6px;">
            <h3 style="color: #10B981; margin-top: 0;">Transaction Details</h3>
            <p><strong>Amount Paid:</strong> ${{amount}}</p>
            <p><strong>PRON Tokens:</strong> {{tokens}}</p>
            <p><strong>Payment Method:</strong> {{paymentMethod}}</p>
            <p><strong>Transaction ID:</strong> {{transactionId}}</p>
          </div>
          <p>Your tokens will be available for claiming after the presale ends. You can track your investments in your dashboard:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{dashboardUrl}}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Dashboard
            </a>
          </div>
        </div>
      `,
      text: `
        Purchase Confirmed!
        
        Hi {{userName}},
        
        Thank you for your purchase! Your transaction has been confirmed.
        
        Transaction Details:
        - Amount Paid: ${{amount}}
        - PRON Tokens: {{tokens}}
        - Payment Method: {{paymentMethod}}
        - Transaction ID: {{transactionId}}
        
        Your tokens will be available for claiming after the presale ends.
        View your dashboard: {{dashboardUrl}}
      `,
    };

    return this.sendEmail({
      to: userEmail,
      template,
      dynamicData: {
        userName,
        amount: transactionDetails.amount,
        tokens: transactionDetails.tokens,
        paymentMethod: transactionDetails.paymentMethod,
        transactionId: transactionDetails.transactionId,
        dashboardUrl: `${process.env.FRONTEND_URL}/dashboard`,
      },
    });
  }

  async sendBulkEmail(recipients: string[], template: EmailTemplate, dynamicData?: Record<string, any>): Promise<boolean> {
    try {
      const emailPromises = recipients.map(recipient =>
        this.sendEmail({ to: recipient, template, dynamicData })
      );

      const results = await Promise.allSettled(emailPromises);
      const successCount = results.filter(result => result.status === 'fulfilled').length;

      console.log(`Bulk email sent: ${successCount}/${recipients.length} successful`);
      return successCount > 0;
    } catch (error) {
      console.error('Bulk email sending failed:', error);
      return false;
    }
  }

  async isEmailSentRecently(email: string, type: string, windowMinutes: number = 5): Promise<boolean> {
    const cacheKey = `email_sent:${type}:${email}`;
    const lastSent = await cache.get(cacheKey);
    
    if (lastSent) {
      const timeSinceLastSent = Date.now() - parseInt(lastSent);
      return timeSinceLastSent < windowMinutes * 60 * 1000;
    }

    // Mark as sent
    await cache.set(cacheKey, Date.now().toString(), windowMinutes * 60);
    return false;
  }
}

export const emailService = new EmailService();