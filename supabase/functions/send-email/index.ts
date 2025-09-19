// Supabase Edge Function for sending emails
// This replaces EmailJS with a free, serverless solution

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  to: string
  template: 'waitlist' | 'bloodTest' | 'healthScore' | 'healthAudit' | 'supplements'
  data: Record<string, any>
}

// SMTP Email Sending Function using Brevo (free tier: 300 emails/day)
async function sendEmailViaSMTP(to: string, subject: string, html: string): Promise<boolean> {
  try {
    const brevoApiKey = Deno.env.get('BREVO_API_KEY')
    const fromEmail = Deno.env.get('FROM_EMAIL') || 'noreply@wuksy.com'
    const fromName = Deno.env.get('FROM_NAME') || 'WUKSY Team'

    if (!brevoApiKey) {
      console.error('❌ BREVO_API_KEY not found in environment variables')
      return false
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: fromName,
          email: fromEmail
        },
        to: [{
          email: to,
          name: to.split('@')[0]
        }],
        subject: subject,
        htmlContent: html
      })
    })

    if (response.ok) {
      const result = await response.json()
      console.log('✅ Email sent successfully via Brevo:', result.messageId)
      return true
    } else {
      const error = await response.text()
      console.error('❌ Failed to send email via Brevo:', error)
      return false
    }
  } catch (error) {
    console.error('❌ SMTP Error:', error)
    return false
  }
}

// Email templates
const EMAIL_TEMPLATES = {
  waitlist: {
    subject: '🌱 Welcome to WUKSY - You\'re on the Waitlist!',
    getHtml: (data: any) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to WUKSY</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            .header { background: linear-gradient(135deg, #6b9d6b, #5a8a5a); padding: 40px 30px; text-align: center; color: white; }
            .logo { font-size: 2rem; font-weight: 700; margin-bottom: 10px; letter-spacing: 2px; }
            .content { padding: 40px 30px; }
            .welcome-message { font-size: 1.3rem; font-weight: 600; color: #1e293b; margin-bottom: 20px; text-align: center; }
            .intro-text { font-size: 1.1rem; margin-bottom: 30px; text-align: center; color: #64748b; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #6b9d6b, #5a8a5a); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .footer { background: #1e293b; color: #94a3b8; padding: 30px; text-align: center; font-size: 0.9rem; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">WUKSY</div>
              <div>AI-Powered Personalized Wellness</div>
            </div>
            <div class="content">
              <h1 class="welcome-message">🌱 Welcome to Your Wellness Journey, ${data.user_name}!</h1>
              <p class="intro-text">
                You're now part of an exclusive community of <strong>${data.member_count}</strong> wellness enthusiasts 
                getting early access to the future of personalized health optimization.
              </p>
              <div style="text-align: center; margin: 40px 0;">
                <h3 style="color: #1e293b; margin-bottom: 15px;">🔬 Try Preview Tools While You Wait</h3>
                <p style="margin-bottom: 20px; color: #64748b;">
                  Get a taste of WUKSY's capabilities with our free preview tools available now.
                </p>
                <a href="${data.early_access_link}" class="cta-button">
                  🔬 Try Preview Tools Now
                </a>
              </div>
              <div style="margin-top: 30px; padding: 20px; background: #fef3cd; border-radius: 8px;">
                <h3 style="color: #92400e; margin-bottom: 10px;">🚀 What Happens Next?</h3>
                <ul style="color: #92400e; padding-left: 20px;">
                  <li>We'll send you exclusive updates as we approach launch</li>
                  <li>You'll get first access when WUKSY goes live</li>
                  <li>Special early-bird pricing will be reserved for you</li>
                  <li>Bonus: Free health optimization consultation (valued at $200)</li>
                </ul>
              </div>
            </div>
            <div class="footer">
              <p>© 2024 WUKSY. All rights reserved.</p>
              <p style="margin-top: 10px; font-size: 0.8rem;">
                You're receiving this because you signed up for early access on ${data.signup_date}.
              </p>
            </div>
          </div>
        </body>
      </html>
    `
  },

  bloodTest: {
    subject: `🧬 Your Blood Test Analysis is Ready - Score: ${(data: any) => data.health_score}`,
    getHtml: (data: any) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Your Blood Test Analysis</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            .header { background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 40px 30px; text-align: center; color: white; }
            .logo { font-size: 2rem; font-weight: 700; margin-bottom: 10px; letter-spacing: 2px; }
            .content { padding: 40px 30px; }
            .score-display { text-align: center; margin: 30px 0; padding: 30px; background: linear-gradient(135deg, #fef2f2, #fee2e2); border-radius: 12px; }
            .score-number { font-size: 3rem; font-weight: 800; color: #dc2626; margin-bottom: 10px; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .footer { background: #1e293b; color: #94a3b8; padding: 30px; text-align: center; font-size: 0.9rem; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">WUKSY</div>
              <div>🧬 Blood Test Analysis Complete</div>
            </div>
            <div class="content">
              <h1 style="text-align: center; color: #1e293b;">Your Personalized Blood Analysis is Ready, ${data.user_name}!</h1>
              <div class="score-display">
                <div class="score-number">${data.health_score}</div>
                <div style="font-size: 1.1rem; color: #991b1b; font-weight: 600;">Wellness Harmony Score</div>
                <p style="margin-top: 15px; color: #991b1b;">
                  Based on analysis of ${data.files_processed} file(s) processed on ${data.analysis_date}
                </p>
              </div>
              <div style="text-align: center; margin: 40px 0;">
                <h3 style="color: #1e293b;">📋 View Your Complete Report</h3>
                <p style="color: #64748b; margin-bottom: 20px;">
                  Access your detailed analysis, personalized recommendations, and action plan.
                </p>
                <a href="${data.view_results_link}" class="cta-button">
                  🧬 View Complete Analysis
                </a>
              </div>
              <div style="padding: 20px; background: #fef3cd; border-radius: 8px;">
                <p style="color: #92400e; font-size: 0.9rem;">
                  <strong>Medical Disclaimer:</strong> This analysis is for educational purposes only and should not replace professional medical advice.
                </p>
              </div>
            </div>
            <div class="footer">
              <p>© 2024 WUKSY. All rights reserved.</p>
              <p style="margin-top: 10px; font-size: 0.8rem;">Analysis completed on ${data.analysis_date}.</p>
            </div>
          </div>
        </body>
      </html>
    `
  },

  healthScore: {
    subject: `📊 Your Health Score Results - ${(data: any) => data.health_score}`,
    getHtml: (data: any) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Your Health Score Results</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 40px 30px; text-align: center; color: white; }
            .logo { font-size: 2rem; font-weight: 700; margin-bottom: 10px; letter-spacing: 2px; }
            .content { padding: 40px 30px; }
            .score-display { text-align: center; margin: 30px 0; padding: 30px; background: linear-gradient(135deg, #eff6ff, #dbeafe); border-radius: 12px; }
            .score-number { font-size: 3rem; font-weight: 800; color: #2563eb; margin-bottom: 10px; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .footer { background: #1e293b; color: #94a3b8; padding: 30px; text-align: center; font-size: 0.9rem; }
            .insight-card { margin: 20px 0; padding: 20px; border-radius: 12px; }
            .strength-card { background: #f0fdf4; border-left: 4px solid #10b981; }
            .improvement-card { background: #fffbeb; border-left: 4px solid #f59e0b; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">WUKSY</div>
              <div>📊 Your Health Score Results</div>
            </div>
            <div class="content">
              <h1 style="text-align: center; color: #1e293b;">Your Personalized Health Score is Ready, ${data.user_name}!</h1>
              <div class="score-display">
                <div class="score-number">${data.health_score}</div>
                <div style="font-size: 1.1rem; color: #1e40af; font-weight: 600;">Health Optimization Score</div>
                <div style="margin-top: 15px; padding: 8px 16px; background: #2563eb; color: white; border-radius: 20px; font-size: 0.9rem; display: inline-block;">
                  ${data.score_category}
                </div>
              </div>
              <div class="insight-card strength-card">
                <h4 style="color: #166534; margin-bottom: 10px;">💪 Your Top Strength</h4>
                <p style="color: #166534; margin: 0;">${data.top_strength} - You're excelling in this area and setting a great foundation for overall wellness.</p>
              </div>
              <div class="insight-card improvement-card">
                <h4 style="color: #92400e; margin-bottom: 10px;">🎯 Priority Improvement Area</h4>
                <p style="color: #92400e; margin: 0;">${data.improvement_area} - Focusing here will have the biggest impact on your overall health score.</p>
              </div>
              <div style="text-align: center; margin: 40px 0;">
                <h3 style="color: #1e293b;">📋 Get Your Detailed Report</h3>
                <a href="${data.view_results_link}" class="cta-button">
                  📊 View Full Health Report
                </a>
              </div>
            </div>
            <div class="footer">
              <p>© 2024 WUKSY. All rights reserved.</p>
              <p style="margin-top: 10px; font-size: 0.8rem;">Assessment completed on ${data.assessment_date}.</p>
            </div>
          </div>
        </body>
      </html>
    `
  },

  healthAudit: {
    subject: '🔍 Your Health Data Audit Results',
    getHtml: (data: any) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Your Health Data Audit Results</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            .header { background: linear-gradient(135deg, #7c3aed, #6d28d9); padding: 40px 30px; text-align: center; color: white; }
            .logo { font-size: 2rem; font-weight: 700; margin-bottom: 10px; letter-spacing: 2px; }
            .content { padding: 40px 30px; }
            .audit-summary { text-align: center; margin: 30px 0; padding: 30px; background: linear-gradient(135deg, #faf5ff, #f3e8ff); border-radius: 12px; }
            .audit-score { font-size: 2.5rem; font-weight: 800; color: #7c3aed; margin-bottom: 10px; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #7c3aed, #6d28d9); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .footer { background: #1e293b; color: #94a3b8; padding: 30px; text-align: center; font-size: 0.9rem; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">WUKSY</div>
              <div>🔍 Health Data Audit Complete</div>
            </div>
            <div class="content">
              <h1 style="text-align: center; color: #1e293b;">Your Health Data Audit Results Are Ready, ${data.user_name}!</h1>
              <div class="audit-summary">
                <div class="audit-score">${data.audit_score}</div>
                <div style="font-size: 1.1rem; color: #6d28d9; font-weight: 600;">Data Tracking Effectiveness</div>
              </div>
              <div style="margin: 30px 0; padding: 25px; background: #fef2f2; border-radius: 12px;">
                <h3 style="color: #dc2626; margin-bottom: 15px;">⚠️ Critical Data Gaps: ${data.critical_gaps}</h3>
                <p style="color: #dc2626;">These gaps are preventing you from getting the full picture of your health.</p>
              </div>
              <div style="margin: 30px 0; padding: 25px; background: #f0fdf4; border-radius: 12px;">
                <h3 style="color: #166534; margin-bottom: 15px;">✅ Action Items: ${data.action_items}</h3>
                <p style="color: #166534;">Follow these steps to optimize your health tracking.</p>
              </div>
              <div style="text-align: center; margin: 40px 0;">
                <h3 style="color: #1e293b;">📋 Download Your Complete Audit Report</h3>
                <a href="${data.download_report_link}" class="cta-button">
                  🔍 Download Full Report
                </a>
              </div>
            </div>
            <div class="footer">
              <p>© 2024 WUKSY. All rights reserved.</p>
              <p style="margin-top: 10px; font-size: 0.8rem;">Audit completed on ${data.audit_date}.</p>
            </div>
          </div>
        </body>
      </html>
    `
  },

  supplements: {
    subject: '⚗️ Your Supplement Analysis Results',
    getHtml: (data: any) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Your Supplement Analysis Results</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            .header { background: linear-gradient(135deg, #059669, #047857); padding: 40px 30px; text-align: center; color: white; }
            .logo { font-size: 2rem; font-weight: 700; margin-bottom: 10px; letter-spacing: 2px; }
            .content { padding: 40px 30px; }
            .safety-display { text-align: center; margin: 30px 0; padding: 30px; background: linear-gradient(135deg, #f0fdf4, #dcfce7); border-radius: 12px; }
            .safety-score { font-size: 2.5rem; font-weight: 800; color: #059669; margin-bottom: 10px; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #059669, #047857); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .footer { background: #1e293b; color: #94a3b8; padding: 30px; text-align: center; font-size: 0.9rem; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">WUKSY</div>
              <div>⚗️ Supplement Analysis Complete</div>
            </div>
            <div class="content">
              <h1 style="text-align: center; color: #1e293b;">Your Supplement Stack Analysis is Ready, ${data.user_name}!</h1>
              <div class="safety-display">
                <div class="safety-score">${data.safety_score}</div>
                <div style="font-size: 1.1rem; color: #047857; font-weight: 600;">Safety Rating</div>
                <p style="margin-top: 15px; color: #047857;">
                  ${data.supplements_checked} supplements analyzed for interactions
                </p>
              </div>
              <div style="margin: 30px 0; padding: 25px; background: #f0fdf4; border-radius: 12px;">
                <h3 style="color: #166534; margin-bottom: 15px;">✅ Good News - No Major Interactions Detected</h3>
                <p style="color: #166534; margin: 0;">Your current supplement combination appears to be safe with no significant negative interactions identified.</p>
              </div>
              <div style="margin: 30px 0; padding: 25px; background: #f0f9ff; border-radius: 12px;">
                <h3 style="color: #0c4a6e; margin-bottom: 15px;">⏰ Optimized Timing Schedule</h3>
                <p style="color: #0c4a6e;">${data.timing_recommendations}</p>
              </div>
              <div style="text-align: center; margin: 40px 0;">
                <h3 style="color: #1e293b;">📋 Get Your Detailed Analysis</h3>
                <a href="${data.view_results_link}" class="cta-button">
                  ⚗️ View Complete Analysis
                </a>
              </div>
            </div>
            <div class="footer">
              <p>© 2024 WUKSY. All rights reserved.</p>
              <p style="margin-top: 10px; font-size: 0.8rem;">Analysis completed on ${data.check_date}.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, template, data }: EmailRequest = await req.json()

    // Validate request
    if (!to || !template || !EMAIL_TEMPLATES[template]) {
      return new Response(
        JSON.stringify({ error: 'Invalid request parameters' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get template
    const emailTemplate = EMAIL_TEMPLATES[template]
    const subject = typeof emailTemplate.subject === 'function' 
      ? emailTemplate.subject(data) 
      : emailTemplate.subject
    const html = emailTemplate.getHtml(data)

    // Initialize Supabase client for logging
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Actually send the email using Brevo (free tier: 300 emails/day)
    const emailSent = await sendEmailViaSMTP(to, subject, html)
    
    console.log(`📧 Email sent to: ${to}`)
    console.log(`📧 Subject: ${subject}`)
    console.log(`📧 Template: ${template}`)
    console.log(`📧 Status: ${emailSent ? 'SUCCESS' : 'FAILED'}`)

    // Log the email to the database
    const { error: logError } = await supabase
      .from('email_notifications')
      .insert([{
        email: to,
        notification_type: `${template}_notification`,
        template_id: template,
        status: emailSent ? 'sent' : 'failed',
        metadata: {
          subject,
          template_data: data,
          sent_via: 'brevo_smtp',
          email_sent: emailSent
        },
        sent_at: emailSent ? new Date().toISOString() : null
      }])

    if (logError) {
      console.error('Failed to log email:', logError)
    }

    // Return success response with email content for testing
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email processed successfully',
        preview: {
          to,
          subject,
          html: html.substring(0, 200) + '...' // Preview of HTML
        }
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error processing email request:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
