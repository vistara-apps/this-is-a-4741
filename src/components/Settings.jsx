import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Moon, 
  Sun, 
  Globe, 
  Smartphone,
  Save,
  Trash2,
  Download,
  Upload,
  AlertTriangle
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useSettingsStore, useEmergencyStore } from '../store/useStore';
import Card from './Card';
import Button from './Button';
import Modal from './Modal';

function Settings() {
  const { user, updateUser, reset: resetStore } = useStore();
  const { 
    theme, 
    language, 
    notifications, 
    privacy, 
    updateTheme, 
    updateLanguage, 
    updateNotifications, 
    updatePrivacy,
    reset: resetSettings
  } = useSettingsStore();
  const { contacts, reset: resetEmergency } = useEmergencyStore();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: theme === 'dark' ? Moon : Sun },
    { id: 'data', label: 'Data', icon: Download }
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save user profile changes
      if (user) {
        await updateUser({
          // Add any profile updates here
        });
      }
      
      // Settings are automatically saved via Zustand persist
      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = () => {
    const data = {
      user: user,
      settings: { theme, language, notifications, privacy },
      emergencyContacts: contacts,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guardian-guide-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = async () => {
    try {
      // In a real app, this would call an API to delete the account
      console.log('Account deletion requested');
      
      // Reset all local data
      resetStore();
      resetSettings();
      resetEmergency();
      
      // Redirect to home or login
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const ProfileTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={user?.email || ''}
          disabled
          className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-text-secondary"
        />
        <p className="text-xs text-text-secondary mt-1">
          Email cannot be changed. Contact support if needed.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Selected State
        </label>
        <select
          value={user?.selectedState || ''}
          onChange={(e) => updateUser({ selectedState: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">Select a state...</option>
          {[
            'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
            'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
            'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
            'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
            'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
            'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
            'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
            'Wisconsin', 'Wyoming'
          ].map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Account Created
        </label>
        <p className="text-text-secondary">
          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
        </p>
      </div>
    </div>
  );

  const NotificationsTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-text-primary">Emergency Alerts</h3>
            <p className="text-sm text-text-secondary">
              Receive notifications for emergency situations
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.emergency}
              onChange={(e) => updateNotifications({ emergency: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-text-primary">App Updates</h3>
            <p className="text-sm text-text-secondary">
              Get notified about new features and updates
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.updates}
              onChange={(e) => updateNotifications({ updates: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-text-primary">Marketing Communications</h3>
            <p className="text-sm text-text-secondary">
              Receive promotional emails and offers
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.marketing}
              onChange={(e) => updateNotifications({ marketing: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const PrivacyTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-text-primary">Share Location</h3>
            <p className="text-sm text-text-secondary">
              Allow the app to access your location for emergency alerts
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={privacy.shareLocation}
              onChange={(e) => updatePrivacy({ shareLocation: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-text-primary">Share Incident Data</h3>
            <p className="text-sm text-text-secondary">
              Allow anonymized incident data to be used for research
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={privacy.shareIncidents}
              onChange={(e) => updatePrivacy({ shareIncidents: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-text-primary">Analytics</h3>
            <p className="text-sm text-text-secondary">
              Help improve the app by sharing usage analytics
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={privacy.analytics}
              onChange={(e) => updatePrivacy({ analytics: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const AppearanceTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-3">
          Theme
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => updateTheme('light')}
            className={`p-4 border rounded-md flex items-center space-x-3 ${
              theme === 'light' ? 'border-primary bg-primary/5' : 'border-gray-300'
            }`}
          >
            <Sun className="w-5 h-5" />
            <span>Light</span>
          </button>
          <button
            onClick={() => updateTheme('dark')}
            className={`p-4 border rounded-md flex items-center space-x-3 ${
              theme === 'dark' ? 'border-primary bg-primary/5' : 'border-gray-300'
            }`}
          >
            <Moon className="w-5 h-5" />
            <span>Dark</span>
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-3">
          Language
        </label>
        <select
          value={language}
          onChange={(e) => updateLanguage(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
        </select>
      </div>
    </div>
  );

  const DataTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-text-primary mb-3">Export Data</h3>
        <p className="text-sm text-text-secondary mb-4">
          Download all your data including profile, incidents, and settings.
        </p>
        <Button onClick={handleExportData} variant="secondary">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      <div className="border-t pt-6">
        <h3 className="font-medium text-text-primary mb-3 text-red-600">Danger Zone</h3>
        <p className="text-sm text-text-secondary mb-4">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <Button 
          onClick={() => setShowDeleteConfirm(true)} 
          variant="secondary"
          className="border-red-300 text-red-600 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Account
        </Button>
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'profile': return <ProfileTab />;
      case 'notifications': return <NotificationsTab />;
      case 'privacy': return <PrivacyTab />;
      case 'appearance': return <AppearanceTab />;
      case 'data': return <DataTab />;
      default: return <ProfileTab />;
    }
  };

  return (
    <div className="space-y-6 pt-6">
      <div className="px-4">
        <h1 className="text-4xl font-bold text-text-primary mb-2">Settings</h1>
        <p className="text-text-secondary">
          Manage your account preferences and privacy settings
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="px-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4">
        <Card className="p-6">
          {renderActiveTab()}
        </Card>
      </div>

      {/* Save Button */}
      <div className="px-4">
        <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
          {saving ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Account"
      >
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <div>
              <h3 className="text-lg font-medium text-text-primary">Are you absolutely sure?</h3>
              <p className="text-text-secondary">This action cannot be undone.</p>
            </div>
          </div>
          
          <p className="text-sm text-text-secondary mb-6">
            This will permanently delete your account, all incident records, emergency contacts, 
            and any other data associated with your account. You will not be able to recover this information.
          </p>

          <div className="flex space-x-3">
            <Button
              onClick={() => setShowDeleteConfirm(false)}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Settings;
