import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { userService, incidentService } from '../services/supabase';
import { subscriptionService } from '../services/stripe';

// Main application store
export const useStore = create(
  persist(
    (set, get) => ({
      // User state
      user: null,
      isAuthenticated: false,
      subscription: null,
      
      // UI state
      activeSection: 'dashboard',
      isLoading: false,
      error: null,
      
      // Data state
      incidents: [],
      legalContent: [],
      
      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setActiveSection: (section) => set({ activeSection: section }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),
      
      // User actions
      updateUser: async (updates) => {
        const { user } = get();
        if (!user) return;
        
        set({ isLoading: true, error: null });
        
        try {
          const { data, error } = await userService.updateUser(user.id, updates);
          
          if (error) throw error;
          
          set({ user: { ...user, ...data }, isLoading: false });
          return { success: true, data };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },
      
      // Incident actions
      addIncident: async (incidentData) => {
        const { user, incidents } = get();
        if (!user) return;
        
        set({ isLoading: true, error: null });
        
        try {
          const { data, error } = await incidentService.createIncident({
            ...incidentData,
            user_id: user.id
          });
          
          if (error) throw error;
          
          set({ 
            incidents: [data, ...incidents],
            isLoading: false 
          });
          
          return { success: true, data };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },
      
      loadIncidents: async () => {
        const { user } = get();
        if (!user) return;
        
        set({ isLoading: true, error: null });
        
        try {
          const { data, error } = await incidentService.getUserIncidents(user.id);
          
          if (error) throw error;
          
          set({ incidents: data || [], isLoading: false });
          return { success: true, data };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },
      
      // Subscription actions
      loadSubscription: async () => {
        const { user } = get();
        if (!user) return;
        
        try {
          const result = await subscriptionService.getSubscriptionStatus(user.id);
          set({ subscription: result.plan });
          return result;
        } catch (error) {
          console.error('Error loading subscription:', error);
          set({ subscription: subscriptionService.getPlanFeatures('free') });
        }
      },
      
      upgradeSubscription: async (planId) => {
        const { user } = get();
        if (!user) return;
        
        set({ isLoading: true, error: null });
        
        try {
          const result = await subscriptionService.createCheckoutSession(
            planId,
            user.id,
            `${window.location.origin}/subscription/success`,
            `${window.location.origin}/subscription/cancel`
          );
          
          set({ isLoading: false });
          return result;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },
      
      // Utility actions
      reset: () => set({
        user: null,
        isAuthenticated: false,
        subscription: null,
        activeSection: 'dashboard',
        isLoading: false,
        error: null,
        incidents: [],
        legalContent: []
      })
    }),
    {
      name: 'guardian-guide-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        activeSection: state.activeSection
      })
    }
  )
);

// Emergency contacts store
export const useEmergencyStore = create((set, get) => ({
  contacts: [],
  isAlertActive: false,
  lastAlertTime: null,
  
  addContact: (contact) => {
    const { contacts } = get();
    const newContact = {
      id: Date.now().toString(),
      ...contact,
      createdAt: new Date().toISOString()
    };
    set({ contacts: [...contacts, newContact] });
  },
  
  removeContact: (contactId) => {
    const { contacts } = get();
    set({ contacts: contacts.filter(c => c.id !== contactId) });
  },
  
  updateContact: (contactId, updates) => {
    const { contacts } = get();
    set({
      contacts: contacts.map(c => 
        c.id === contactId ? { ...c, ...updates } : c
      )
    });
  },
  
  activateAlert: () => {
    set({ 
      isAlertActive: true, 
      lastAlertTime: new Date().toISOString() 
    });
  },
  
  deactivateAlert: () => {
    set({ isAlertActive: false });
  },
  
  sendEmergencyAlert: async (message, location) => {
    const { contacts } = get();
    
    if (contacts.length === 0) {
      throw new Error('No emergency contacts configured');
    }
    
    set({ isAlertActive: true, lastAlertTime: new Date().toISOString() });
    
    // In a real implementation, this would send actual SMS/email
    // For now, we'll simulate the alert
    const results = await Promise.allSettled(
      contacts.map(async (contact) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log(`Emergency alert sent to ${contact.name} (${contact.phone || contact.email})`);
        console.log(`Message: ${message}`);
        console.log(`Location: ${JSON.stringify(location)}`);
        
        return { contact, success: true };
      })
    );
    
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    return {
      success: failed === 0,
      sent: successful,
      failed: failed,
      total: contacts.length
    };
  }
}));

// Settings store
export const useSettingsStore = create(
  persist(
    (set, get) => ({
      // App settings
      theme: 'light',
      language: 'en',
      notifications: {
        emergency: true,
        updates: true,
        marketing: false
      },
      privacy: {
        shareLocation: true,
        shareIncidents: false,
        analytics: true
      },
      
      // Actions
      updateTheme: (theme) => set({ theme }),
      
      updateLanguage: (language) => set({ language }),
      
      updateNotifications: (notifications) => {
        const current = get().notifications;
        set({ notifications: { ...current, ...notifications } });
      },
      
      updatePrivacy: (privacy) => {
        const current = get().privacy;
        set({ privacy: { ...current, ...privacy } });
      },
      
      reset: () => set({
        theme: 'light',
        language: 'en',
        notifications: {
          emergency: true,
          updates: true,
          marketing: false
        },
        privacy: {
          shareLocation: true,
          shareIncidents: false,
          analytics: true
        }
      })
    }),
    {
      name: 'guardian-guide-settings'
    }
  )
);
