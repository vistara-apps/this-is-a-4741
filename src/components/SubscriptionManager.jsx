import React, { useState, useEffect } from 'react';
import { Crown, Check, X, CreditCard, Settings, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { SUBSCRIPTION_PLANS, subscriptionService } from '../services/stripe';
import Card from './Card';
import Button from './Button';
import Modal from './Modal';

function SubscriptionManager() {
  const { user, subscription, loadSubscription, upgradeSubscription, isLoading } = useStore();
  const [showPlans, setShowPlans] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    if (user && !subscription) {
      loadSubscription();
    }
  }, [user, subscription, loadSubscription]);

  const currentPlan = subscription || SUBSCRIPTION_PLANS.free;

  const handleUpgrade = async (planId) => {
    if (!user) return;
    
    setUpgrading(true);
    try {
      const result = await upgradeSubscription(planId);
      if (result.success) {
        // Redirect will happen automatically via Stripe
        console.log('Redirecting to Stripe checkout...');
      } else {
        console.error('Upgrade failed:', result.error);
      }
    } catch (error) {
      console.error('Upgrade error:', error);
    } finally {
      setUpgrading(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!user?.stripeCustomerId) return;
    
    try {
      await subscriptionService.createPortalSession(
        user.stripeCustomerId,
        window.location.href
      );
    } catch (error) {
      console.error('Error opening customer portal:', error);
    }
  };

  const PlanCard = ({ plan, isCurrent = false, isPopular = false }) => (
    <Card className={`relative ${isCurrent ? 'ring-2 ring-primary' : ''} ${isPopular ? 'border-accent' : ''}`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-accent text-white px-3 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}
      
      {isCurrent && (
        <div className="absolute -top-3 right-4">
          <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
            Current Plan
          </span>
        </div>
      )}

      <div className="text-center mb-4">
        <div className="w-12 h-12 bg-primary rounded-lg mx-auto mb-3 flex items-center justify-center">
          <Crown className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-text-primary">{plan.name}</h3>
        <div className="mt-2">
          <span className="text-3xl font-bold text-text-primary">${plan.price}</span>
          <span className="text-text-secondary">/{plan.interval}</span>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span className="text-sm text-text-primary">{feature}</span>
          </div>
        ))}
      </div>

      {!isCurrent && (
        <Button
          onClick={() => handleUpgrade(plan.id)}
          disabled={upgrading}
          className="w-full"
          variant={isPopular ? 'primary' : 'secondary'}
        >
          {upgrading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            `Upgrade to ${plan.name}`
          )}
        </Button>
      )}

      {isCurrent && plan.id !== 'free' && (
        <Button
          onClick={handleManageSubscription}
          variant="secondary"
          className="w-full"
        >
          <Settings className="w-4 h-4 mr-2" />
          Manage Subscription
        </Button>
      )}
    </Card>
  );

  const UsageStats = () => {
    const stats = [
      {
        label: 'Incidents This Month',
        value: user?.incidentsThisMonth || 0,
        limit: currentPlan.limitations.incidentsPerMonth,
        icon: '📝'
      },
      {
        label: 'Emergency Contacts',
        value: user?.emergencyContacts?.length || 0,
        limit: currentPlan.limitations.emergencyContacts,
        icon: '📞'
      },
      {
        label: 'Scripts Access',
        value: currentPlan.limitations.scriptsAccess,
        limit: null,
        icon: '📋'
      }
    ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-lg font-semibold text-text-primary">
              {typeof stat.value === 'number' ? stat.value : stat.value}
              {stat.limit && stat.limit !== -1 && ` / ${stat.limit}`}
              {stat.limit === -1 && ' / ∞'}
            </div>
            <div className="text-sm text-text-secondary">{stat.label}</div>
            {stat.limit && stat.limit !== -1 && typeof stat.value === 'number' && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-smooth"
                    style={{ width: `${Math.min((stat.value / stat.limit) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-6">
      <div className="px-4">
        <h1 className="text-4xl font-bold text-text-primary mb-2">Subscription</h1>
        <p className="text-text-secondary">
          Manage your GuardianGuide subscription and usage
        </p>
      </div>

      <div className="px-4">
        <UsageStats />
      </div>

      {/* Current Plan */}
      <div className="px-4">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">Current Plan</h2>
        <div className="max-w-md">
          <PlanCard plan={currentPlan} isCurrent={true} />
        </div>
      </div>

      {/* Upgrade Options */}
      {currentPlan.id !== 'premium' && (
        <div className="px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-text-primary">Upgrade Options</h2>
            <Button
              variant="secondary"
              onClick={() => setShowPlans(!showPlans)}
            >
              {showPlans ? 'Hide Plans' : 'View All Plans'}
            </Button>
          </div>

          {showPlans && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values(SUBSCRIPTION_PLANS)
                .filter(plan => plan.id !== currentPlan.id)
                .map((plan) => (
                  <PlanCard 
                    key={plan.id} 
                    plan={plan} 
                    isPopular={plan.id === 'basic'}
                  />
                ))}
            </div>
          )}
        </div>
      )}

      {/* Feature Comparison */}
      <div className="px-4">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">Feature Comparison</h2>
        <Card className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-text-primary">Feature</th>
                <th className="text-center py-3 px-4 font-medium text-text-primary">Free</th>
                <th className="text-center py-3 px-4 font-medium text-text-primary">Basic</th>
                <th className="text-center py-3 px-4 font-medium text-text-primary">Premium</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: 'Legal Scripts', free: 'Basic', basic: 'All', premium: 'All + Multilingual' },
                { feature: 'Incident Recording', free: '3/month', basic: 'Unlimited', premium: 'Unlimited' },
                { feature: 'Emergency Contacts', free: '1', basic: '3', premium: '10' },
                { feature: 'State-Specific Info', free: false, basic: true, premium: true },
                { feature: 'Priority Support', free: false, basic: false, premium: true },
                { feature: 'Legal Referrals', free: false, basic: false, premium: true }
              ].map((row, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-text-primary">{row.feature}</td>
                  <td className="py-3 px-4 text-center">
                    {typeof row.free === 'boolean' ? (
                      row.free ? <Check className="w-4 h-4 text-green-500 mx-auto" /> : <X className="w-4 h-4 text-red-500 mx-auto" />
                    ) : (
                      <span className="text-text-secondary">{row.free}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {typeof row.basic === 'boolean' ? (
                      row.basic ? <Check className="w-4 h-4 text-green-500 mx-auto" /> : <X className="w-4 h-4 text-red-500 mx-auto" />
                    ) : (
                      <span className="text-text-secondary">{row.basic}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {typeof row.premium === 'boolean' ? (
                      row.premium ? <Check className="w-4 h-4 text-green-500 mx-auto" /> : <X className="w-4 h-4 text-red-500 mx-auto" />
                    ) : (
                      <span className="text-text-secondary">{row.premium}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Billing Information */}
      {currentPlan.id !== 'free' && (
        <div className="px-4">
          <h2 className="text-2xl font-semibold text-text-primary mb-4">Billing</h2>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-text-primary">Next Billing Date</h3>
                <p className="text-text-secondary">
                  {user?.nextBillingDate ? new Date(user.nextBillingDate).toLocaleDateString() : 'Loading...'}
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={handleManageSubscription}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Manage Billing
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default SubscriptionManager;
