import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Clock, Users, AlertTriangle, Plus, Trash2, CheckCircle } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import Modal from './Modal';
import { useLocalStorage } from '../hooks/useLocalStorage';

function EmergencyAlert({ user, location }) {
  const [emergencyContacts, setEmergencyContacts] = useLocalStorage('emergency-contacts', user?.emergencyContacts || []);
  const [showAddContact, setShowAddContact] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendAlert = () => {
    if (emergencyContacts.length === 0) {
      alert('Please add emergency contacts first');
      return;
    }

    // Mock sending alert
    const alertMessage = generateAlertMessage();
    console.log('Sending emergency alert:', alertMessage);
    
    setAlertSent(true);
    setCountdown(10);
    
    // Reset after 10 seconds
    setTimeout(() => {
      setAlertSent(false);
    }, 10000);
  };

  const generateAlertMessage = () => {
    const locationText = location 
      ? `Location: ${location.latitude}, ${location.longitude}` 
      : 'Location: Not available';
    
    return `🚨 EMERGENCY ALERT FROM GUARDIANGUIDE 🚨

${user?.email || 'User'} has sent an emergency alert.

Time: ${new Date().toLocaleString()}
${locationText}

This is an automated message from GuardianGuide app. Please check on this person immediately.

If this is a false alarm, please ignore.`;
  };

  const handleAddContact = (e) => {
    e.preventDefault();
    const contact = {
      id: Date.now().toString(),
      ...newContact
    };
    setEmergencyContacts([...emergencyContacts, contact]);
    setNewContact({ name: '', phone: '', relationship: '' });
    setShowAddContact(false);
  };

  const handleDeleteContact = (contactId) => {
    setEmergencyContacts(emergencyContacts.filter(contact => contact.id !== contactId));
  };

  return (
    <div className="space-y-6 pt-6">
      <div className="px-4">
        <h1 className="text-4xl font-bold text-text-primary mb-2">Emergency Alert</h1>
        <p className="text-text-secondary">
          Instantly notify your trusted contacts in case of emergency
        </p>
      </div>

      {/* Alert Status */}
      {alertSent && (
        <div className="mx-4">
          <Card className="bg-green-50 border border-green-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-green-800">Alert Sent Successfully</h3>
                <p className="text-sm text-green-600">
                  Your emergency contacts have been notified. Auto-reset in {countdown}s
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Emergency Button */}
      <div className="px-4">
        <Card className="text-center py-8">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-red-500 rounded-full mx-auto flex items-center justify-center animate-pulse-slow">
              <AlertTriangle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary">Emergency Alert</h2>
            <p className="text-text-secondary max-w-md mx-auto">
              Press the button below to immediately send your location and an emergency message to all your contacts.
            </p>
            <Button
              variant="danger"
              size="lg"
              onClick={handleSendAlert}
              disabled={alertSent}
              className="text-xl py-4 px-8 rounded-full"
            >
              {alertSent ? 'Alert Sent' : 'SEND EMERGENCY ALERT'}
            </Button>
            <p className="text-sm text-text-secondary">
              {emergencyContacts.length} contact{emergencyContacts.length !== 1 ? 's' : ''} will be notified
            </p>
          </div>
        </Card>
      </div>

      {/* Current Location */}
      <div className="mx-4">
        <Card>
          <h3 className="font-semibold text-text-primary mb-3 flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Current Location</span>
          </h3>
          {location ? (
            <div className="space-y-2">
              <p className="text-text-secondary">
                <strong>Coordinates:</strong> {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </p>
              <p className="text-text-secondary">
                <strong>Accuracy:</strong> ±{Math.round(location.accuracy)}m
              </p>
              <p className="text-sm text-text-secondary">
                Location will be included in emergency alerts
              </p>
            </div>
          ) : (
            <div className="text-center py-4">
              <MapPin className="w-8 h-8 text-text-secondary mx-auto mb-2" />
              <p className="text-text-secondary">Location not available</p>
              <p className="text-sm text-text-secondary">
                Enable location services for more accurate emergency alerts
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Emergency Contacts */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-text-primary">Emergency Contacts</h2>
          <Button
            onClick={() => setShowAddContact(true)}
            size="sm"
            className="flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </Button>
        </div>

        {emergencyContacts.length === 0 ? (
          <Card className="text-center py-8">
            <Users className="w-12 h-12 text-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">No Emergency Contacts</h3>
            <p className="text-text-secondary mb-4">
              Add trusted contacts who will be notified in case of emergency.
            </p>
            <Button onClick={() => setShowAddContact(true)}>Add First Contact</Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {emergencyContacts.map((contact) => (
              <Card key={contact.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-text-primary">{contact.name}</h4>
                      <p className="text-sm text-text-secondary">{contact.phone}</p>
                      {contact.relationship && (
                        <p className="text-xs text-text-secondary">{contact.relationship}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="icon"
                    size="sm"
                    onClick={() => handleDeleteContact(contact.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Safety Tips */}
      <div className="mx-4">
        <Card className="bg-blue-50 border border-blue-200">
          <h3 className="font-medium text-text-primary mb-2">Emergency Safety Tips</h3>
          <ul className="text-sm text-text-secondary space-y-1">
            <li>• Only use in genuine emergencies</li>
            <li>• Keep your emergency contacts list updated</li>
            <li>• Ensure location services are enabled</li>
            <li>• Inform contacts about this app and what alerts mean</li>
            <li>• Test the system occasionally with trusted contacts</li>
          </ul>
        </Card>
      </div>

      {/* Add Contact Modal */}
      <Modal 
        isOpen={showAddContact} 
        onClose={() => setShowAddContact(false)}
        title="Add Emergency Contact"
      >
        <form onSubmit={handleAddContact} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Name *
            </label>
            <input
              type="text"
              required
              value={newContact.name}
              onChange={(e) => setNewContact({...newContact, name: e.target.value})}
              placeholder="Contact's full name"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={newContact.phone}
              onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
              placeholder="+1 (555) 123-4567"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Relationship
            </label>
            <input
              type="text"
              value={newContact.relationship}
              onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
              placeholder="e.g., Family, Friend, Lawyer"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowAddContact(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Add Contact
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default EmergencyAlert;