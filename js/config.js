// WUKSY Campaign - Supabase Configuration
// This file will be loaded after the Supabase library is available

const SUPABASE_CONFIG = {
    url: 'https://jmezneoxfjhyxjiwylab.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptZXpuZW94ZmpoeXhqaXd5bGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyODQ5OTEsImV4cCI6MjA3Mzg2MDk5MX0._EiHXJd8sV5h5JOae9pe2rbuXbKo2jD5NekN2AIoTIU'
};

// Initialize Supabase client (will be available globally)
let supabase = null;

// Initialize Supabase when the script loads
function initializeSupabase() {
    try {
        // Check if Supabase is available globally
        if (typeof window.supabase === 'undefined') {
            throw new Error('Supabase library not loaded');
        }
        
        // Create client using the global supabase object
        supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        
        console.log('✅ Supabase initialized successfully');
        console.log('🔗 Connected to:', SUPABASE_CONFIG.url);
        return supabase;
    } catch (error) {
        console.error('❌ Failed to initialize Supabase:', error);
        
        // Fallback: try to wait for the library to load
        if (typeof window.supabase === 'undefined') {
            console.log('⏳ Waiting for Supabase library to load...');
            setTimeout(initializeSupabase, 1000);
        }
        return null;
    }
}

// Make sure Supabase is initialized before using
window.getSupabase = function() {
    if (!supabase) {
        supabase = initializeSupabase();
    }
    return supabase;
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSupabase);
} else {
    initializeSupabase();
}
