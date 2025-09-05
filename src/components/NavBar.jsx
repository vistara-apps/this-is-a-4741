import React, { useState } from 'react';
import { Menu, X, Home, FileText, Shield, AlertTriangle, Phone, User } from 'lucide-react';

function NavBar({ activeSection, setActiveSection, user }) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'scripts', label: 'Scripts', icon: FileText },
    { id: 'laws', label: 'Laws', icon: Shield },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
    { id: 'emergency', label: 'Emergency', icon: Phone },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-surface shadow-card lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-text-primary">GuardianGuide</span>
          </div>
          
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md hover:bg-gray-100 transition-fast"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="border-t border-gray-200 bg-surface">
            <div className="px-4 py-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-fast ${
                      isActive 
                        ? 'bg-primary text-white' 
                        : 'text-text-secondary hover:text-text-primary hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-surface shadow-card">
          <div className="flex items-center px-6 py-4 border-b border-gray-200">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center mr-3">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-text-primary">GuardianGuide</span>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-fast ${
                    isActive 
                      ? 'bg-primary text-white' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {user && (
            <div className="px-4 py-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {user.email || 'User'}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {user.subscriptionStatus || 'Free'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Main Content Offset */}
      <div className="hidden lg:block lg:pl-64">
        {/* This div provides the left padding for desktop layout */}
      </div>
    </>
  );
}

export default NavBar;