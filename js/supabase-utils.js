// WUKSY Campaign - Supabase Utility Functions

/**
 * Email Capture Functions
 */

// Capture email signup with source tracking
async function captureEmail(email, source, metadata = {}) {
    try {
        const supabase = await window.getSupabase();
        if (!supabase) throw new Error('Supabase not initialized');

        // Check if email already exists
        const { data: existingUser } = await supabase
            .from('subscribers')
            .select('email, source')
            .eq('email', email)
            .single();

        if (existingUser) {
            // Update metadata if user exists but from different source
            if (existingUser.source !== source) {
                await supabase
                    .from('subscribers')
                    .update({ 
                        metadata: { ...metadata, sources: [existingUser.source, source] },
                        updated_at: new Date().toISOString()
                    })
                    .eq('email', email);
            }
            return { success: true, isNew: false, message: 'Welcome back! You\'re already subscribed.' };
        }

        // Insert new subscriber
        const { data, error } = await supabase
            .from('subscribers')
            .insert([{
                email,
                source,
                metadata: {
                    ...metadata,
                    user_agent: navigator.userAgent,
                    referrer: document.referrer,
                    timestamp: new Date().toISOString()
                }
            }])
            .select();

        if (error) throw error;

        // Track analytics
        await trackEvent('email_signup', source, { email });

        return { success: true, isNew: true, data: data[0] };
    } catch (error) {
        console.error('Email capture error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Quiz Results Functions
 */

// Save quiz results to database
async function saveQuizResults(email, quizType, results, score, recommendations = {}) {
    try {
        const supabase = await window.getSupabase();
        if (!supabase) throw new Error('Supabase not initialized');

        const { data, error } = await supabase
            .from('quiz_results')
            .insert([{
                email,
                quiz_type: quizType,
                results,
                score,
                recommendations
            }])
            .select();

        if (error) throw error;

        // Track analytics
        await trackEvent('quiz_completed', quizType, { email, score });

        return { success: true, data: data[0] };
    } catch (error) {
        console.error('Save quiz results error:', error);
        return { success: false, error: error.message };
    }
}

// Get latest quiz results for an email
async function getQuizResults(email, quizType) {
    try {
        const supabase = await window.getSupabase();
        if (!supabase) throw new Error('Supabase not initialized');

        const { data, error } = await supabase
            .from('quiz_results')
            .select('*')
            .eq('email', email)
            .eq('quiz_type', quizType)
            .order('created_at', { ascending: false })
            .limit(1);

        if (error) throw error;

        return { success: true, data: data[0] || null };
    } catch (error) {
        console.error('Get quiz results error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * File Upload Functions
 */

// Upload blood test file
async function uploadBloodTest(file, email, additionalData = {}) {
    try {
        const supabase = await window.getSupabase();
        if (!supabase) throw new Error('Supabase not initialized');

        // Generate unique file path
        const timestamp = Date.now();
        const fileName = `${email.replace('@', '_at_')}/${timestamp}_${file.name}`;

        // Upload file to storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('blood-tests')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) throw uploadError;

        // Store file reference in database
        const { data: dbData, error: dbError } = await supabase
            .from('blood_test_uploads')
            .insert([{
                email,
                file_path: uploadData.path,
                file_name: file.name,
                file_size: file.size,
                file_type: file.type,
                processing_status: 'pending',
                extracted_data: additionalData
            }])
            .select();

        if (dbError) throw dbError;

        // Track analytics
        await trackEvent('file_uploaded', 'blood_test', { email, file_size: file.size });

        return { success: true, data: dbData[0], filePath: uploadData.path };
    } catch (error) {
        console.error('File upload error:', error);
        return { success: false, error: error.message };
    }
}

// Get file upload status
async function getUploadStatus(email, uploadId) {
    try {
        const supabase = await window.getSupabase();
        if (!supabase) throw new Error('Supabase not initialized');

        const { data, error } = await supabase
            .from('blood_test_uploads')
            .select('*')
            .eq('email', email)
            .eq('id', uploadId)
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Get upload status error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Supplement Interactions Functions
 */

// Save supplement interaction analysis
async function saveSupplementAnalysis(email, supplements, interactionResults, safetyScore, timingRecommendations) {
    try {
        const supabase = await window.getSupabase();
        if (!supabase) throw new Error('Supabase not initialized');

        const { data, error } = await supabase
            .from('supplement_interactions')
            .insert([{
                email,
                supplements,
                interaction_results: interactionResults,
                safety_score: safetyScore,
                timing_recommendations: timingRecommendations
            }])
            .select();

        if (error) throw error;

        // Track analytics
        await trackEvent('supplement_analysis', 'completed', { 
            email, 
            safety_score: safetyScore,
            supplement_count: supplements.length 
        });

        return { success: true, data: data[0] };
    } catch (error) {
        console.error('Save supplement analysis error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Analytics Functions
 */

// Track events for analytics
async function trackEvent(eventType, pageName, metadata = {}) {
    try {
        const supabase = await window.getSupabase();
        if (!supabase) return; // Don't throw error for analytics

        await supabase
            .from('page_analytics')
            .insert([{
                page_name: pageName,
                event_type: eventType,
                email: metadata.email || null,
                metadata: {
                    ...metadata,
                    url: window.location.href,
                    timestamp: new Date().toISOString(),
                    user_agent: navigator.userAgent
                }
            }]);
    } catch (error) {
        console.warn('Analytics tracking failed:', error);
    }
}

// Track page view
async function trackPageView(pageName, email = null) {
    await trackEvent('page_view', pageName, { email });
}

/**
 * Utility Functions
 */

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show loading state on button
function setButtonLoading(button, isLoading, loadingText = 'Loading...') {
    if (isLoading) {
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = `<i data-lucide="loader-2" width="16" height="16" style="animation: spin 1s linear infinite; margin-right: 0.5rem;"></i>${loadingText}`;
        button.disabled = true;
    } else {
        button.innerHTML = button.dataset.originalText || button.innerHTML;
        button.disabled = false;
        // Re-initialize Lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
}

// Show success message
function showSuccessMessage(element, message, duration = 5000) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
        background: var(--primary-600, #10b981); 
        color: white; 
        padding: 1rem; 
        border-radius: 0.5rem; 
        margin-top: 1rem; 
        text-align: center;
        animation: fadeInUp 0.5s ease-out;
    `;
    successDiv.innerHTML = `🌱 <strong>${message}</strong>`;
    
    element.appendChild(successDiv);
    
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, duration);
}

// Show error message
function showErrorMessage(element, message, duration = 5000) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        background: #dc3545; 
        color: white; 
        padding: 1rem; 
        border-radius: 0.5rem; 
        margin-top: 1rem; 
        text-align: center;
        animation: fadeInUp 0.5s ease-out;
    `;
    errorDiv.innerHTML = `❌ <strong>${message}</strong>`;
    
    element.appendChild(errorDiv);
    
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, duration);
}

// Initialize page analytics when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    const pageName = document.title.includes('Health Score') ? 'health_score' :
                    document.title.includes('Health Data Audit') ? 'health_audit' :
                    document.title.includes('Blood Test') ? 'blood_test' :
                    document.title.includes('Supplement') ? 'supplement' :
                    'main';
    
    trackPageView(pageName);
});

// Export functions for global use
window.WUKSY = {
    captureEmail,
    saveQuizResults,
    getQuizResults,
    uploadBloodTest,
    getUploadStatus,
    saveSupplementAnalysis,
    trackEvent,
    trackPageView,
    isValidEmail,
    setButtonLoading,
    showSuccessMessage,
    showErrorMessage
};
