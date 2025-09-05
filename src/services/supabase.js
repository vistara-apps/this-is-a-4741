import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase configuration missing. Using mock data.');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database schema setup (run these in Supabase SQL editor)
export const DATABASE_SCHEMA = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  selected_state VARCHAR(100),
  emergency_contacts JSONB DEFAULT '[]',
  subscription_status VARCHAR(50) DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Incident records table
CREATE TABLE IF NOT EXISTS incident_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  location JSONB,
  officer_details TEXT,
  interaction_summary TEXT,
  shared_with JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Legal content table
CREATE TABLE IF NOT EXISTS legal_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  state VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  script_content TEXT,
  law_summary TEXT,
  category VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own incidents" ON incident_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own incidents" ON incident_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Legal content is viewable by all" ON legal_content FOR SELECT TO authenticated;
`;

// User service functions
export const userService = {
  async createUser(userData) {
    if (!supabase) {
      // Mock implementation for development
      return { data: { ...userData, id: Date.now().toString() }, error: null };
    }

    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    return { data, error };
  },

  async updateUser(userId, updates) {
    if (!supabase) {
      return { data: { ...updates, id: userId }, error: null };
    }

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    return { data, error };
  },

  async getUser(userId) {
    if (!supabase) {
      return { data: null, error: null };
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    return { data, error };
  }
};

// Incident service functions
export const incidentService = {
  async createIncident(incidentData) {
    if (!supabase) {
      return { data: { ...incidentData, id: Date.now().toString() }, error: null };
    }

    const { data, error } = await supabase
      .from('incident_records')
      .insert([incidentData])
      .select()
      .single();

    return { data, error };
  },

  async getUserIncidents(userId) {
    if (!supabase) {
      return { data: [], error: null };
    }

    const { data, error } = await supabase
      .from('incident_records')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return { data, error };
  },

  async updateIncident(incidentId, updates) {
    if (!supabase) {
      return { data: { ...updates, id: incidentId }, error: null };
    }

    const { data, error } = await supabase
      .from('incident_records')
      .update(updates)
      .eq('id', incidentId)
      .select()
      .single();

    return { data, error };
  }
};

// Legal content service functions
export const legalContentService = {
  async getLegalContent(state = null, category = null) {
    if (!supabase) {
      // Return mock data for development
      return { 
        data: [
          {
            id: '1',
            state: state || 'General',
            title: 'Fourth Amendment Rights',
            category: 'Constitutional Rights',
            script_content: 'Mock script content...',
            law_summary: 'Mock law summary...'
          }
        ], 
        error: null 
      };
    }

    let query = supabase.from('legal_content').select('*');
    
    if (state) {
      query = query.or(`state.eq.${state},state.eq.General`);
    }
    
    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    return { data, error };
  },

  async createLegalContent(contentData) {
    if (!supabase) {
      return { data: { ...contentData, id: Date.now().toString() }, error: null };
    }

    const { data, error } = await supabase
      .from('legal_content')
      .insert([contentData])
      .select()
      .single();

    return { data, error };
  }
};
