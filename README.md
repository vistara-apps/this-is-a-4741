# GuardianGuide 🛡️

**Stay informed and protected: Instant legal scripts and emergency alerts.**

GuardianGuide is a mobile-first web application providing on-demand legal scripts and state-specific law summaries for individuals interacting with law enforcement, with integrated emergency documentation and alerts.

![GuardianGuide Screenshot](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=GuardianGuide+Dashboard)

## 🌟 Features

### Core Features

- **📋 On-Demand Rights Scripts**: Step-by-step scripts for common law enforcement interactions with state-specific guidance
- **⚖️ State-Specific Legal Cheat Sheet**: Quick reference for your rights and relevant laws based on your location
- **📝 Incident Record & Share**: One-tap incident logging with automatic formatting for sharing with contacts or legal counsel
- **🚨 Emergency Alert Network**: Instant emergency notifications to pre-selected contacts with location data

### Additional Features

- **💳 Subscription Management**: Flexible pricing tiers with Stripe integration
- **🔧 Comprehensive Settings**: Account management, privacy controls, and app preferences
- **🤖 AI-Powered Content**: Dynamic script generation using OpenAI
- **📱 Mobile-First Design**: Responsive design optimized for mobile devices
- **🔒 Privacy-Focused**: Local data storage with optional cloud sync
- **🌐 Multi-Language Support**: Available in multiple languages (Premium feature)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Modern web browser
- (Optional) Supabase account for backend services
- (Optional) OpenAI API key for dynamic content
- (Optional) Stripe account for payments

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/this-is-a-4741.git
   cd this-is-a-4741
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your API keys:
   ```env
   # Supabase Configuration (Optional)
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

   # OpenAI Configuration (Optional)
   VITE_OPENAI_API_KEY=your_openai_api_key_here

   # Stripe Configuration (Optional)
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **State Management**: Zustand with persistence
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Payments**: Stripe
- **AI**: OpenAI GPT-3.5/4
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### Project Structure

```
src/
├── components/          # React components
│   ├── Button.jsx      # Reusable button component
│   ├── Card.jsx        # Card container component
│   ├── Modal.jsx       # Modal dialog component
│   ├── NavBar.jsx      # Navigation component
│   ├── ScriptsSection.jsx
│   ├── LegalCheatSheet.jsx
│   ├── IncidentRecorder.jsx
│   ├── EmergencyAlert.jsx
│   ├── SubscriptionManager.jsx
│   └── Settings.jsx
├── services/           # API services
│   ├── supabase.js    # Database operations
│   ├── openai.js      # AI content generation
│   └── stripe.js      # Payment processing
├── store/             # State management
│   └── useStore.js    # Zustand stores
├── hooks/             # Custom React hooks
│   ├── useGeolocation.js
│   └── useLocalStorage.js
├── App.jsx            # Main application component
└── main.jsx          # Application entry point
```

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Run the SQL schema from `src/services/supabase.js`
3. Enable Row Level Security (RLS)
4. Add your Supabase URL and anon key to `.env`

### OpenAI Setup

1. Get an API key from OpenAI
2. Add it to your `.env` file
3. Note: In production, API calls should go through your backend

### Stripe Setup

1. Create a Stripe account
2. Get your publishable key
3. Set up webhook endpoints for subscription events
4. Add price IDs to `src/services/stripe.js`

## 📱 Usage

### Getting Started

1. **Onboarding**: Complete the initial setup by selecting your state and adding emergency contacts
2. **Explore Features**: Navigate through the different sections using the bottom navigation
3. **Customize Settings**: Adjust privacy, notifications, and appearance preferences

### Key Workflows

#### Using Rights Scripts
1. Go to "Rights Scripts" section
2. Select a scenario (e.g., "Traffic Stop")
3. Follow the step-by-step guidance
4. Use the audio playback feature if available

#### Recording an Incident
1. Tap "Record Incident" 
2. Fill in the incident details
3. Add location and officer information
4. Save and optionally share with contacts

#### Emergency Alerts
1. Set up emergency contacts in settings
2. Use the "Emergency Alert" feature
3. One-tap sends location and alert message
4. Contacts receive immediate notification

## 🔒 Privacy & Security

- **Local-First**: Data stored locally by default
- **Optional Cloud Sync**: Choose what data to sync
- **End-to-End Encryption**: Sensitive data encrypted
- **No Tracking**: Privacy-focused analytics only
- **GDPR Compliant**: Full data export and deletion

## 💰 Subscription Plans

### Free Plan
- Basic legal scripts
- General state information
- Limited incident recording (3/month)
- 1 emergency contact

### Basic Plan ($1.99/month)
- All legal scripts
- State-specific information
- Unlimited incident recording
- 3 emergency contacts
- Email support

### Premium Plan ($4.99/month)
- All Basic features
- Multilingual scripts
- Advanced documentation
- 10 emergency contacts
- Priority support
- Legal consultation referrals

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Testing (when implemented)
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use ESLint and Prettier for code formatting
- Follow React best practices
- Use TypeScript for new features (migration in progress)
- Write meaningful commit messages

## 📚 API Documentation

### Supabase Tables

#### Users
```sql
- id: UUID (Primary Key)
- email: VARCHAR(255) UNIQUE
- selected_state: VARCHAR(100)
- emergency_contacts: JSONB
- subscription_status: VARCHAR(50)
- created_at: TIMESTAMP
```

#### Incident Records
```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key)
- timestamp: TIMESTAMP
- location: JSONB
- officer_details: TEXT
- interaction_summary: TEXT
- shared_with: JSONB
```

#### Legal Content
```sql
- id: UUID (Primary Key)
- state: VARCHAR(100)
- title: VARCHAR(255)
- script_content: TEXT
- law_summary: TEXT
- category: VARCHAR(100)
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Docker

```bash
# Build the image
docker build -t guardian-guide .

# Run the container
docker run -p 3000:3000 guardian-guide
```

### Manual Deployment

```bash
# Build the application
npm run build

# Serve the dist folder with any static file server
npx serve dist
```

## 🤝 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact support@guardianguide.app (if configured)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Legal Experts**: For guidance on constitutional rights information
- **Open Source Community**: For the amazing tools and libraries
- **Beta Testers**: For feedback and bug reports
- **Contributors**: Everyone who helped make this project better

## 🔮 Roadmap

### Upcoming Features

- [ ] **Mobile App**: Native iOS and Android applications
- [ ] **Offline Mode**: Full functionality without internet
- [ ] **Voice Commands**: Hands-free operation
- [ ] **Legal Network**: Connect with verified attorneys
- [ ] **Community Features**: Share experiences anonymously
- [ ] **Advanced Analytics**: Personal interaction insights
- [ ] **Integration APIs**: Connect with legal services

### Technical Improvements

- [ ] **TypeScript Migration**: Full TypeScript support
- [ ] **PWA Features**: Service workers, offline caching
- [ ] **Performance**: Code splitting, lazy loading
- [ ] **Testing**: Comprehensive test coverage
- [ ] **Accessibility**: WCAG 2.1 AA compliance
- [ ] **Internationalization**: Full i18n support

---

**⚠️ Legal Disclaimer**: This application provides educational information only and does not constitute legal advice. Always consult with a qualified attorney for specific legal guidance. Laws vary by jurisdiction and change over time.

**🛡️ Stay Safe**: Your safety is the top priority. Always comply with lawful orders and de-escalate situations when possible.
