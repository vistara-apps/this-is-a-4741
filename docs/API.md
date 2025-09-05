# GuardianGuide API Documentation

This document outlines the API integrations and backend services used by GuardianGuide.

## Overview

GuardianGuide integrates with several external services to provide comprehensive functionality:

- **Supabase**: Backend-as-a-Service for data storage and user authentication
- **OpenAI**: AI-powered content generation for dynamic scripts and legal summaries
- **Stripe**: Payment processing and subscription management
- **Browser APIs**: Geolocation for emergency services

## Supabase Integration

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  selected_state VARCHAR(100),
  emergency_contacts JSONB DEFAULT '[]',
  subscription_status VARCHAR(50) DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Incident Records Table
```sql
CREATE TABLE incident_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  location JSONB,
  officer_details TEXT,
  interaction_summary TEXT,
  shared_with JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Legal Content Table
```sql
CREATE TABLE legal_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  state VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  script_content TEXT,
  law_summary TEXT,
  category VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### API Methods

#### User Service

**Create User**
```javascript
const { data, error } = await userService.createUser({
  email: 'user@example.com',
  selectedState: 'California',
  emergencyContacts: [
    { name: 'John Doe', phone: '+1234567890' }
  ]
});
```

**Update User**
```javascript
const { data, error } = await userService.updateUser(userId, {
  selectedState: 'New York',
  emergencyContacts: updatedContacts
});
```

**Get User**
```javascript
const { data, error } = await userService.getUser(userId);
```

#### Incident Service

**Create Incident**
```javascript
const { data, error } = await incidentService.createIncident({
  user_id: userId,
  location: { latitude: 37.7749, longitude: -122.4194 },
  officer_details: 'Badge #1234, Officer Smith',
  interaction_summary: 'Traffic stop on Highway 101'
});
```

**Get User Incidents**
```javascript
const { data, error } = await incidentService.getUserIncidents(userId);
```

#### Legal Content Service

**Get Legal Content**
```javascript
const { data, error } = await legalContentService.getLegalContent('California', 'Constitutional Rights');
```

## OpenAI Integration

### Script Generation

**Generate Rights Script**
```javascript
const script = await scriptService.generateScript(
  'Traffic Stop',
  'California',
  { userContext: 'First-time interaction' }
);

// Returns:
{
  title: "Traffic Stop - California",
  steps: [
    {
      action: "Stay Calm",
      script: "Remain calm and keep your hands visible at all times.",
      note: "Your safety is the top priority."
    }
  ],
  stateSpecific: ["In California, you have specific rights..."],
  disclaimer: "This information is for educational purposes only..."
}
```

**Generate Legal Summary**
```javascript
const summary = await scriptService.generateLegalSummary(
  'Fourth Amendment Rights',
  'California'
);

// Returns:
{
  title: "Fourth Amendment Rights",
  summary: "Brief overview of the legal concept",
  keyPoints: ["Key point 1", "Key point 2"],
  stateSpecific: ["California-specific information"],
  disclaimer: "Legal disclaimer"
}
```

### Emergency Message Generation

**Generate Emergency Alert**
```javascript
const message = await emergencyService.generateEmergencyMessage(
  { latitude: 37.7749, longitude: -122.4194, address: "123 Main St" },
  { name: "John Doe" },
  'police_interaction'
);

// Returns formatted emergency message string
```

## Stripe Integration

### Subscription Plans

```javascript
const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    features: ['Basic legal scripts', 'General state information'],
    limitations: { incidentsPerMonth: 3, emergencyContacts: 1 }
  },
  basic: {
    id: 'basic',
    name: 'Basic',
    price: 1.99,
    stripePriceId: 'price_basic_monthly',
    features: ['All legal scripts', 'State-specific information'],
    limitations: { incidentsPerMonth: -1, emergencyContacts: 3 }
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 4.99,
    stripePriceId: 'price_premium_monthly',
    features: ['All Basic features', 'Multilingual scripts'],
    limitations: { incidentsPerMonth: -1, emergencyContacts: 10 }
  }
};
```

### Payment Methods

**Create Checkout Session**
```javascript
const result = await subscriptionService.createCheckoutSession(
  'basic',
  userId,
  'https://app.com/success',
  'https://app.com/cancel'
);
```

**Create Customer Portal Session**
```javascript
const result = await subscriptionService.createPortalSession(
  customerId,
  'https://app.com/account'
);
```

**Get Subscription Status**
```javascript
const { subscription, plan } = await subscriptionService.getSubscriptionStatus(userId);
```

### Webhook Events

Handle these Stripe webhook events in your backend:

- `checkout.session.completed`: Subscription created
- `customer.subscription.updated`: Plan changed
- `customer.subscription.deleted`: Subscription cancelled
- `invoice.payment_succeeded`: Payment successful
- `invoice.payment_failed`: Payment failed

## Browser APIs

### Geolocation API

**Get Current Location**
```javascript
const { location, error } = useGeolocation();

// Returns:
{
  latitude: 37.7749,
  longitude: -122.4194,
  accuracy: 10,
  timestamp: 1640995200000
}
```

## Error Handling

### Standard Error Response Format

```javascript
{
  success: false,
  error: {
    code: 'VALIDATION_ERROR',
    message: 'Invalid input provided',
    details: {
      field: 'email',
      reason: 'Invalid email format'
    }
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR`: Input validation failed
- `AUTHENTICATION_ERROR`: User not authenticated
- `AUTHORIZATION_ERROR`: User not authorized for action
- `NOT_FOUND`: Resource not found
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `SERVICE_UNAVAILABLE`: External service unavailable
- `SUBSCRIPTION_REQUIRED`: Feature requires paid subscription

## Rate Limiting

### API Limits

- **OpenAI API**: 3 requests per minute for free users, 10 for premium
- **Supabase**: Standard rate limits apply
- **Stripe**: Standard rate limits apply
- **Emergency Alerts**: 1 per minute to prevent spam

### Implementation

```javascript
// Rate limiting is handled automatically by the services
// Users will receive appropriate error messages when limits are exceeded
```

## Security

### Authentication

- JWT tokens for API authentication
- Row Level Security (RLS) in Supabase
- Secure session management

### Data Protection

- All sensitive data encrypted at rest
- HTTPS for all API communications
- Input validation and sanitization
- SQL injection prevention

### Privacy

- Minimal data collection
- User consent for data sharing
- GDPR compliance features
- Data export and deletion capabilities

## Testing

### Mock Services

For development and testing, mock implementations are provided:

```javascript
// Mock Supabase responses
if (!supabase) {
  return { data: mockData, error: null };
}

// Mock OpenAI responses
if (!openai) {
  return mockScript;
}

// Mock Stripe responses
if (!stripePromise) {
  return { success: true, checkoutUrl: mockUrl };
}
```

### Test Data

Use the following test data for development:

```javascript
const testUser = {
  id: 'test-user-123',
  email: 'test@example.com',
  selectedState: 'California',
  emergencyContacts: [
    { name: 'Test Contact', phone: '+1234567890' }
  ]
};

const testIncident = {
  id: 'test-incident-123',
  user_id: 'test-user-123',
  location: { latitude: 37.7749, longitude: -122.4194 },
  officer_details: 'Test Officer',
  interaction_summary: 'Test interaction'
};
```

## Deployment

### Environment Variables

Required environment variables for production:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# OpenAI
VITE_OPENAI_API_KEY=sk-your-openai-key

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-key

# App Configuration
VITE_APP_ENV=production
VITE_APP_VERSION=1.0.0
```

### Backend Requirements

For production deployment, you'll need:

1. **Supabase Project**: Set up database, authentication, and RLS policies
2. **Stripe Account**: Configure products, prices, and webhooks
3. **OpenAI Account**: API key with sufficient credits
4. **Domain**: SSL certificate for HTTPS

### Monitoring

Recommended monitoring setup:

- **Error Tracking**: Sentry or similar service
- **Analytics**: Privacy-focused analytics (optional)
- **Performance**: Web Vitals monitoring
- **Uptime**: Service availability monitoring

## Support

For API-related questions:

1. Check this documentation
2. Review the source code in `/src/services/`
3. Test with mock data first
4. Check external service documentation
5. Contact support if issues persist

## Changelog

### v1.0.0
- Initial API implementation
- Supabase integration
- OpenAI integration
- Stripe integration
- Basic error handling

### Future Versions
- Enhanced error handling
- API versioning
- Rate limiting improvements
- Additional AI features
- Mobile app APIs
