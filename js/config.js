// WUKSY Campaign - Supabase Configuration
// Replace these with your actual Supabase project credentials

const SUPABASE_CONFIG = {
    url: 'https://jmezneoxfjhyxjiwylab.supabase.co', // Replace with your project URL
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptZXpuZW94ZmpoeXhqaXd5bGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyODQ5OTEsImV4cCI6MjA3Mzg2MDk5MX0._EiHXJd8sV5h5JOae9pe2rbuXbKo2jD5NekN2AIoTIU' // Replace with your anon key
};

// Initialize Supabase client (will be available globally)
let supabase = null;

// Initialize Supabase when the script loads
async function initializeSupabase() {
    try {
        // Import Supabase client from CDN
        const { createClient } = await import('https://cdn.skypack.dev/@supabase/supabase-js');
        
        // Create client
        supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        
        console.log('✅ Supabase initialized successfully');
        return supabase;
    } catch (error) {
        console.error('❌ Failed to initialize Supabase:', error);
        return null;
    }
}

// Make sure Supabase is initialized before using
window.getSupabase = async function() {
    if (!supabase) {
        await initializeSupabase();
    }
    return supabase;
};

// Initialize immediately
initializeSupabase();
