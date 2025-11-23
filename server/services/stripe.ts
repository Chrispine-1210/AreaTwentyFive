import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export async function createPaymentIntent(
  amount: number,
  orderId: string,
  customerEmail: string
) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'mwk',
      metadata: { orderId },
      receipt_email: customerEmail,
    });
    return paymentIntent;
  } catch (error) {
    console.error('Stripe payment intent error:', error);
    throw error;
  }
}

export async function confirmPayment(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error('Stripe retrieve error:', error);
    throw error;
  }
}

export async function refundPayment(paymentIntentId: string) {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });
    return refund;
  } catch (error) {
    console.error('Stripe refund error:', error);
    throw error;
  }
}
