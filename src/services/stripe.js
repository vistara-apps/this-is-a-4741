import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

let stripePromise = null;

if (stripePublishableKey) {
  stripePromise = loadStripe(stripePublishableKey);
} else {
  console.warn('Stripe publishable key not found. Subscription features will use mock data.');
}

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      'Basic legal scripts',
      'General state information',
      'Limited incident recording',
      'Community support'
    ],
    limitations: {
      incidentsPerMonth: 3,
      scriptsAccess: 'basic',
      emergencyContacts: 1
    }
  },
  basic: {
    id: 'basic',
    name: 'Basic',
    price: 1.99,
    interval: 'month',
    stripePriceId: 'price_basic_monthly', // Replace with actual Stripe price ID
    features: [
      'All legal scripts',
      'State-specific information',
      'Unlimited incident recording',
      'Email support',
      'Emergency alerts'
    ],
    limitations: {
      incidentsPerMonth: -1, // unlimited
      scriptsAccess: 'full',
      emergencyContacts: 3
    }
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 4.99,
    interval: 'month',
    stripePriceId: 'price_premium_monthly', // Replace with actual Stripe price ID
    features: [
      'All Basic features',
      'Multilingual scripts',
      'Advanced documentation',
      'Priority support',
      'Emergency network',
      'Legal consultation referrals'
    ],
    limitations: {
      incidentsPerMonth: -1, // unlimited
      scriptsAccess: 'premium',
      emergencyContacts: 10
    }
  }
};

// Subscription service
export const subscriptionService = {
  async createCheckoutSession(planId, userId, successUrl, cancelUrl) {
    if (!stripePromise) {
      // Mock implementation for development
      console.log('Mock checkout session created for plan:', planId);
      return { 
        success: true, 
        checkoutUrl: `${successUrl}?session_id=mock_session_${planId}` 
      };
    }

    try {
      // In a real implementation, this would call your backend API
      // which would create the Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          userId,
          successUrl,
          cancelUrl
        }),
      });

      const session = await response.json();

      if (session.error) {
        throw new Error(session.error);
      }

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      return { success: false, error: error.message };
    }
  },

  async createPortalSession(customerId, returnUrl) {
    if (!stripePromise) {
      console.log('Mock portal session created');
      return { success: true, portalUrl: returnUrl };
    }

    try {
      // In a real implementation, this would call your backend API
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          returnUrl
        }),
      });

      const session = await response.json();

      if (session.error) {
        throw new Error(session.error);
      }

      window.location.href = session.url;
      return { success: true };
    } catch (error) {
      console.error('Error creating portal session:', error);
      return { success: false, error: error.message };
    }
  },

  async getSubscriptionStatus(userId) {
    // In a real implementation, this would call your backend API
    // to get the user's subscription status from Stripe
    try {
      const response = await fetch(`/api/subscription-status/${userId}`);
      const data = await response.json();
      
      return {
        success: true,
        subscription: data.subscription,
        plan: SUBSCRIPTION_PLANS[data.subscription?.planId] || SUBSCRIPTION_PLANS.free
      };
    } catch (error) {
      console.error('Error getting subscription status:', error);
      // Return free plan as fallback
      return {
        success: false,
        subscription: null,
        plan: SUBSCRIPTION_PLANS.free
      };
    }
  },

  getPlanFeatures(planId) {
    return SUBSCRIPTION_PLANS[planId] || SUBSCRIPTION_PLANS.free;
  },

  canAccessFeature(userPlan, feature) {
    const plan = SUBSCRIPTION_PLANS[userPlan] || SUBSCRIPTION_PLANS.free;
    
    switch (feature) {
      case 'premium_scripts':
        return plan.limitations.scriptsAccess === 'premium';
      case 'unlimited_incidents':
        return plan.limitations.incidentsPerMonth === -1;
      case 'multiple_emergency_contacts':
        return plan.limitations.emergencyContacts > 1;
      case 'multilingual_support':
        return plan.id === 'premium';
      case 'priority_support':
        return plan.id === 'premium';
      default:
        return true;
    }
  },

  getRemainingIncidents(userPlan, usedIncidents) {
    const plan = SUBSCRIPTION_PLANS[userPlan] || SUBSCRIPTION_PLANS.free;
    
    if (plan.limitations.incidentsPerMonth === -1) {
      return -1; // unlimited
    }
    
    return Math.max(0, plan.limitations.incidentsPerMonth - usedIncidents);
  }
};

// Webhook handler for Stripe events (for backend implementation)
export const STRIPE_WEBHOOK_EVENTS = {
  CHECKOUT_SESSION_COMPLETED: 'checkout.session.completed',
  CUSTOMER_SUBSCRIPTION_CREATED: 'customer.subscription.created',
  CUSTOMER_SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
  CUSTOMER_SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
  INVOICE_PAYMENT_SUCCEEDED: 'invoice.payment_succeeded',
  INVOICE_PAYMENT_FAILED: 'invoice.payment_failed'
};

// Example backend webhook handler structure
export const handleStripeWebhook = async (event) => {
  switch (event.type) {
    case STRIPE_WEBHOOK_EVENTS.CHECKOUT_SESSION_COMPLETED:
      // Handle successful subscription creation
      console.log('Subscription created:', event.data.object);
      break;
    
    case STRIPE_WEBHOOK_EVENTS.CUSTOMER_SUBSCRIPTION_UPDATED:
      // Handle subscription updates (plan changes, etc.)
      console.log('Subscription updated:', event.data.object);
      break;
    
    case STRIPE_WEBHOOK_EVENTS.CUSTOMER_SUBSCRIPTION_DELETED:
      // Handle subscription cancellation
      console.log('Subscription cancelled:', event.data.object);
      break;
    
    case STRIPE_WEBHOOK_EVENTS.INVOICE_PAYMENT_FAILED:
      // Handle failed payments
      console.log('Payment failed:', event.data.object);
      break;
    
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
};
