// WUKSY Campaign - Email Notifications Service
// EmailJS Integration for sending automated emails

const EMAIL_CONFIG = {
    serviceId: 'service_wuksy', // Replace with your EmailJS service ID
    templateIds: {
        waitlist: 'template_waitlist',
        bloodTest: 'template_blood_test', 
        healthScore: 'template_health_score',
        healthAudit: 'template_health_audit',
        supplements: 'template_supplements'
    },
    userId: 'wuksy_campaign' // Replace with your EmailJS user ID
};

/**
 * Initialize EmailJS
 */
function initializeEmailJS() {
    try {
        if (typeof emailjs !== 'undefined') {
            emailjs.init(EMAIL_CONFIG.userId);
            console.log('✅ EmailJS initialized successfully');
            return true;
        } else {
            console.warn('⚠️ EmailJS library not loaded');
            return false;
        }
    } catch (error) {
        console.error('❌ Failed to initialize EmailJS:', error);
        return false;
    }
}

/**
 * Send waitlist confirmation email
 */
async function sendWaitlistConfirmation(email, userData = {}) {
    try {
        const templateParams = {
            to_email: email,
            user_name: userData.name || email.split('@')[0],
            signup_source: userData.source || 'main',
            signup_date: new Date().toLocaleDateString(),
            member_count: '2,847+',
            early_access_link: 'https://wuksy.com/early-access',
            unsubscribe_link: `https://wuksy.com/unsubscribe?email=${encodeURIComponent(email)}`
        };

        const result = await emailjs.send(
            EMAIL_CONFIG.serviceId,
            EMAIL_CONFIG.templateIds.waitlist,
            templateParams
        );

        // Log the notification
        await logEmailNotification(email, 'waitlist_confirmation', 'sent', {
            emailjs_response: result,
            template_params: templateParams
        });

        console.log('✅ Waitlist confirmation email sent:', result);
        return { success: true, messageId: result.text };
    } catch (error) {
        console.error('❌ Failed to send waitlist confirmation:', error);
        
        // Log the failure
        await logEmailNotification(email, 'waitlist_confirmation', 'failed', {
            error: error.message,
            error_code: error.status
        });

        return { success: false, error: error.message };
    }
}

/**
 * Send blood test analysis notification
 */
async function sendBloodTestNotification(email, analysisData = {}) {
    try {
        const templateParams = {
            to_email: email,
            user_name: email.split('@')[0],
            health_score: analysisData.healthScore || 'N/A',
            key_findings: analysisData.keyFindings || 'Analysis completed',
            recommendations_count: analysisData.recommendationsCount || 0,
            files_processed: analysisData.filesProcessed || 1,
            analysis_date: new Date().toLocaleDateString(),
            view_results_link: 'https://wuksy.com/results',
            unsubscribe_link: `https://wuksy.com/unsubscribe?email=${encodeURIComponent(email)}`
        };

        const result = await emailjs.send(
            EMAIL_CONFIG.serviceId,
            EMAIL_CONFIG.templateIds.bloodTest,
            templateParams
        );

        await logEmailNotification(email, 'blood_test_completion', 'sent', {
            emailjs_response: result,
            analysis_data: analysisData
        });

        console.log('✅ Blood test notification sent:', result);
        return { success: true, messageId: result.text };
    } catch (error) {
        console.error('❌ Failed to send blood test notification:', error);
        await logEmailNotification(email, 'blood_test_completion', 'failed', { error: error.message });
        return { success: false, error: error.message };
    }
}

/**
 * Send health score notification
 */
async function sendHealthScoreNotification(email, scoreData = {}) {
    try {
        const templateParams = {
            to_email: email,
            user_name: email.split('@')[0],
            health_score: scoreData.score || 'N/A',
            score_category: scoreData.category || 'Good',
            top_strength: scoreData.topStrength || 'Overall wellness awareness',
            improvement_area: scoreData.improvementArea || 'Lifestyle optimization',
            personalized_tips: scoreData.tips || 'Continue your wellness journey',
            assessment_date: new Date().toLocaleDateString(),
            view_results_link: 'https://wuksy.com/health-score',
            unsubscribe_link: `https://wuksy.com/unsubscribe?email=${encodeURIComponent(email)}`
        };

        const result = await emailjs.send(
            EMAIL_CONFIG.serviceId,
            EMAIL_CONFIG.templateIds.healthScore,
            templateParams
        );

        await logEmailNotification(email, 'health_score_completion', 'sent', {
            emailjs_response: result,
            score_data: scoreData
        });

        console.log('✅ Health score notification sent:', result);
        return { success: true, messageId: result.text };
    } catch (error) {
        console.error('❌ Failed to send health score notification:', error);
        await logEmailNotification(email, 'health_score_completion', 'failed', { error: error.message });
        return { success: false, error: error.message };
    }
}

/**
 * Send health audit notification
 */
async function sendHealthAuditNotification(email, auditData = {}) {
    try {
        const templateParams = {
            to_email: email,
            user_name: email.split('@')[0],
            audit_score: auditData.auditScore || 'Completed',
            critical_gaps: auditData.criticalGaps || 3,
            action_items: auditData.actionItems || 5,
            priority_focus: auditData.priorityFocus || 'Data tracking consistency',
            audit_date: new Date().toLocaleDateString(),
            download_report_link: 'https://wuksy.com/audit-report',
            unsubscribe_link: `https://wuksy.com/unsubscribe?email=${encodeURIComponent(email)}`
        };

        const result = await emailjs.send(
            EMAIL_CONFIG.serviceId,
            EMAIL_CONFIG.templateIds.healthAudit,
            templateParams
        );

        await logEmailNotification(email, 'health_audit_completion', 'sent', {
            emailjs_response: result,
            audit_data: auditData
        });

        console.log('✅ Health audit notification sent:', result);
        return { success: true, messageId: result.text };
    } catch (error) {
        console.error('❌ Failed to send health audit notification:', error);
        await logEmailNotification(email, 'health_audit_completion', 'failed', { error: error.message });
        return { success: false, error: error.message };
    }
}

/**
 * Send supplement interaction notification
 */
async function sendSupplementNotification(email, supplementData = {}) {
    try {
        const templateParams = {
            to_email: email,
            user_name: email.split('@')[0],
            safety_score: supplementData.safetyScore || 'Good',
            supplements_checked: supplementData.supplementsCount || 0,
            interactions_found: supplementData.interactionsFound || 0,
            timing_recommendations: supplementData.timingRecommendations || 'Optimized schedule available',
            check_date: new Date().toLocaleDateString(),
            view_results_link: 'https://wuksy.com/supplement-results',
            unsubscribe_link: `https://wuksy.com/unsubscribe?email=${encodeURIComponent(email)}`
        };

        const result = await emailjs.send(
            EMAIL_CONFIG.serviceId,
            EMAIL_CONFIG.templateIds.supplements,
            templateParams
        );

        await logEmailNotification(email, 'supplement_check_completion', 'sent', {
            emailjs_response: result,
            supplement_data: supplementData
        });

        console.log('✅ Supplement notification sent:', result);
        return { success: true, messageId: result.text };
    } catch (error) {
        console.error('❌ Failed to send supplement notification:', error);
        await logEmailNotification(email, 'supplement_check_completion', 'failed', { error: error.message });
        return { success: false, error: error.message };
    }
}

/**
 * Log email notification to database
 */
async function logEmailNotification(email, notificationType, status, metadata = {}) {
    try {
        const supabase = window.getSupabase();
        if (!supabase) {
            console.warn('⚠️ Supabase not available for logging email notification');
            return;
        }

        const { data, error } = await supabase
            .from('email_notifications')
            .insert([{
                email,
                notification_type: notificationType,
                template_id: EMAIL_CONFIG.templateIds[notificationType.split('_')[0]] || notificationType,
                status,
                metadata,
                sent_at: status === 'sent' ? new Date().toISOString() : null
            }]);

        if (error) {
            console.warn('⚠️ Failed to log email notification:', error);
        } else {
            console.log('📝 Email notification logged successfully');
        }
    } catch (error) {
        console.warn('⚠️ Error logging email notification:', error);
    }
}

/**
 * Get email notification history for a user
 */
async function getEmailNotificationHistory(email, limit = 10) {
    try {
        const supabase = window.getSupabase();
        if (!supabase) throw new Error('Supabase not initialized');

        const { data, error } = await supabase
            .from('email_notifications')
            .select('*')
            .eq('email', email)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('❌ Failed to get email notification history:', error);
        return { success: false, error: error.message };
    }
}

// Initialize EmailJS when the script loads
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for EmailJS library to load
    setTimeout(initializeEmailJS, 1000);
});

// Make functions globally available
window.EmailNotifications = {
    sendWaitlistConfirmation,
    sendBloodTestNotification,
    sendHealthScoreNotification,
    sendHealthAuditNotification,
    sendSupplementNotification,
    logEmailNotification,
    getEmailNotificationHistory,
    initializeEmailJS
};
