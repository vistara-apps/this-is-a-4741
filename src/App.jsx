import React, { useState, useEffect } from 'react';
import { Shield, MapPin, FileText, AlertTriangle, Menu, X, ChevronRight, Phone, Clock, User } from 'lucide-react';
import NavBar from './components/NavBar';
import Button from './components/Button';
import Card from './components/Card';
import Modal from './components/Modal';
import ScriptsSection from './components/ScriptsSection';
import LegalCheatSheet from './components/LegalCheatSheet';
import IncidentRecorder from './components/IncidentRecorder';
import EmergencyAlert from './components/EmergencyAlert';
import { useGeolocation } from './hooks/useGeolocation';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [user, setUser] = useLocalStorage('guardian-user', null);
  const [showOnboarding, setShowOnboarding] = useState(!user);
  const { location, error: locationError } = useGeolocation();

  // Mock user creation for demo
  const handleOnboardingComplete = (userData) => {
    setUser(userData);
    setShowOnboarding(false);
  };

  const features = [
    {
      id: 'scripts',
      title: 'Rights Scripts',
      description: 'Step-by-step guidance for police interactions',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      id: 'laws',
      title: 'Legal Cheat Sheet',
      description: 'State-specific laws and rights',
      icon: Shield,
      color: 'bg-green-500'
    },
    {
      id: 'incidents',
      title: 'Record Incident',
      description: 'Document encounters quickly',
      icon: AlertTriangle,
      color: 'bg-orange-500'
    },
    {
      id: 'emergency',
      title: 'Emergency Alert',
      description: 'One-tap help notification',
      icon: Phone,
      color: 'bg-red-500'
    }
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'scripts':
        return <ScriptsSection userState={user?.selectedState} />;
      case 'laws':
        return <LegalCheatSheet userState={user?.selectedState} />;
      case 'incidents':
        return <IncidentRecorder userId={user?.userId} />;
      case 'emergency':
        return <EmergencyAlert user={user} location={location} />;
      default:
        return (
          <div className="space-y-6">
            {/* Hero Section */}
            <div className="text-center py-8 px-4">
              <div className="w-16 h-16 bg-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-text-primary mb-2">GuardianGuide</h1>
              <p className="text-text-secondary text-lg">Stay informed and protected</p>
              {user?.selectedState && (
                <div className="flex items-center justify-center mt-4 text-text-secondary">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{user.selectedState}</span>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 px-4">
              <Card className="text-center">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-text-secondary">Available</div>
              </Card>
              <Card className="text-center">
                <div className="text-2xl font-bold text-primary">50+</div>
                <div className="text-sm text-text-secondary">States Covered</div>
              </Card>
            </div>

            {/* Features Grid */}
            <div className="px-4">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature) => (
                  <Card 
                    key={feature.id} 
                    className="cursor-pointer hover:shadow-lg transition-smooth"
                    onClick={() => setActiveSection(feature.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 ${feature.color} rounded-md flex items-center justify-center`}>
                        <feature.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-text-primary">{feature.title}</h3>
                        <p className="text-sm text-text-secondary mt-1">{feature.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-text-secondary" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="px-4">
              <h2 className="text-2xl font-semibold text-text-primary mb-4">Recent Activity</h2>
              <Card>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-text-secondary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-text-secondary">
                      {user ? 'Welcome back! Stay safe and informed.' : 'Complete onboarding to get started.'}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <NavBar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        user={user}
      />
      
      <main className="max-w-3xl mx-auto px-6 pb-20">
        {renderActiveSection()}
      </main>

      {/* Onboarding Modal */}
      <Modal isOpen={showOnboarding} onClose={() => setShowOnboarding(false)}>
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      </Modal>
    </div>
  );
}

// Onboarding Component
function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    selectedState: '',
    emergencyContacts: []
  });

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'
  ];

  const handleComplete = () => {
    const userData = {
      userId: Date.now().toString(),
      email: formData.email,
      selectedState: formData.selectedState,
      emergencyContacts: formData.emergencyContacts,
      subscriptionStatus: 'free'
    };
    onComplete(userData);
  };

  const steps = [
    {
      title: 'Welcome to GuardianGuide',
      content: (
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <p className="text-text-secondary">Your digital companion for legal rights and emergency documentation.</p>
        </div>
      )
    },
    {
      title: 'Select Your State',
      content: (
        <div>
          <p className="text-text-secondary mb-4">Choose your state to get relevant legal information:</p>
          <select 
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            value={formData.selectedState}
            onChange={(e) => setFormData({...formData, selectedState: e.target.value})}
          >
            <option value="">Select a state...</option>
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
      )
    },
    {
      title: 'Emergency Contact',
      content: (
        <div>
          <p className="text-text-secondary mb-4">Add an emergency contact (optional):</p>
          <input 
            type="text" 
            placeholder="Contact name"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent mb-3"
            onChange={(e) => {
              const contacts = [...formData.emergencyContacts];
              if (contacts[0]) {
                contacts[0].name = e.target.value;
              } else {
                contacts[0] = { name: e.target.value, phone: '' };
              }
              setFormData({...formData, emergencyContacts: contacts});
            }}
          />
          <input 
            type="tel" 
            placeholder="Phone number"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            onChange={(e) => {
              const contacts = [...formData.emergencyContacts];
              if (contacts[0]) {
                contacts[0].phone = e.target.value;
              } else {
                contacts[0] = { name: '', phone: e.target.value };
              }
              setFormData({...formData, emergencyContacts: contacts});
            }}
          />
        </div>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between text-sm text-text-secondary mb-2">
          <span>Step {step + 1} of {steps.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-smooth"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-text-primary mb-4">
        {steps[step].title}
      </h2>
      
      {steps[step].content}

      <div className="flex justify-between mt-6">
        <Button 
          variant="secondary" 
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
        >
          Back
        </Button>
        
        {step === steps.length - 1 ? (
          <Button 
            onClick={handleComplete}
            disabled={!formData.selectedState}
          >
            Get Started
          </Button>
        ) : (
          <Button 
            onClick={() => setStep(step + 1)}
            disabled={step === 1 && !formData.selectedState}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
}

export default App;