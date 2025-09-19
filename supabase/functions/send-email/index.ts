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
        htmlContent: html,
        textContent: `Welcome to WUKSY - Your Wellness Journey Begins!
        
Hi ${to.split('@')[0]},

You're now part of our exclusive wellness community! 

What's Next:
- Try our free preview tools
- Get early access when we launch
- Receive personalized wellness insights

Visit: https://wuksy.com

Questions? Just reply to this email.

Best regards,
The WUKSY Team

© 2024 WUKSY. All rights reserved.`,
        // Add these for better deliverability
        replyTo: {
          email: fromEmail,
          name: fromName
        },
        tags: ['wuksy-campaign', 'waitlist']
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

// Email templates with proper variable interpolation
const EMAIL_TEMPLATES = {
  waitlist: {
    subject: '🌱 Welcome to WUKSY - You\'re on the Waitlist!',
    getHtml: (data: any) => {
      const userName = data.user_name || data.name || 'Wellness Enthusiast'
      const memberCount = data.member_count || '2,847+'
      const signupDate = data.signup_date || new Date().toLocaleDateString()
      const earlyAccessLink = data.early_access_link || 'https://wuksy.com'
      
      return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to WUKSY</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              margin: 0; 
              padding: 0; 
              background-color: #f8fafc; 
              line-height: 1.6;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background: white; 
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            }
            .header { 
              background: linear-gradient(135deg, #6b9d6b, #5a8a5a); 
              padding: 40px 30px; 
              text-align: center; 
              color: white; 
            }
            .logo { 
              font-size: 2rem; 
              font-weight: 700; 
              margin-bottom: 10px; 
              letter-spacing: 2px; 
            }
            .content { padding: 40px 30px; }
            .welcome-message { 
              font-size: 1.3rem; 
              font-weight: 600; 
              color: #1e293b; 
              margin-bottom: 20px; 
              text-align: center; 
            }
            .intro-text { 
              font-size: 1.1rem; 
              margin-bottom: 30px; 
              text-align: center; 
              color: #64748b; 
            }
            .cta-button { 
              display: inline-block; 
              background: linear-gradient(135deg, #6b9d6b, #5a8a5a); 
              color: white; 
              text-decoration: none; 
              padding: 15px 30px; 
              border-radius: 8px; 
              font-weight: 600; 
              margin: 20px 0; 
            }
            .footer { 
              background: #1e293b; 
              color: #94a3b8; 
              padding: 30px; 
              text-align: center; 
              font-size: 0.9rem; 
            }
            .next-steps {
              margin-top: 30px; 
              padding: 20px; 
              background: #fef3cd; 
              border-radius: 8px;
              border-left: 4px solid #f59e0b;
            }
            .next-steps h3 {
              color: #92400e; 
              margin-bottom: 10px;
            }
            .next-steps ul {
              color: #92400e; 
              padding-left: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">WUKSY</div>
              <div>AI-Powered Personalized Wellness</div>
            </div>
            <div class="content">
              <h1 class="welcome-message">🌱 Welcome to Your Wellness Journey, ${userName}!</h1>
              <p class="intro-text">
                You're now part of an exclusive community of <strong>${memberCount}</strong> wellness enthusiasts 
                getting early access to the future of personalized health optimization.
              </p>
              <div style="text-align: center; margin: 40px 0;">
                <h3 style="color: #1e293b; margin-bottom: 15px;">🔬 Try Preview Tools While You Wait</h3>
                <p style="margin-bottom: 20px; color: #64748b;">
                  Get a taste of WUKSY's capabilities with our free preview tools available now.
                </p>
                <a href="${earlyAccessLink}" class="cta-button">
                  🔬 Try Preview Tools Now
                </a>
              </div>
              <div class="next-steps">
                <h3>🚀 What Happens Next?</h3>
                <ul>
                  <li>We'll send you exclusive updates as we approach launch</li>
                  <li>You'll get first access when WUKSY goes live</li>
                  <li>Special early-bird pricing will be reserved for you</li>
                  <li>Bonus: Free health optimization consultation (valued at $200)</li>
                </ul>
              </div>
              <div style="margin-top: 30px; text-align: center; color: #64748b;">
                <p><strong>Questions?</strong> Just reply to this email - we read every message personally.</p>
              </div>
            </div>
            <div class="footer">
              <p>© 2024 WUKSY. All rights reserved.</p>
              <p style="margin-top: 10px; font-size: 0.8rem;">
                You signed up for early access on ${signupDate}.<br>
                <a href="mailto:support@wuksy.com" style="color: #94a3b8;">Contact Support</a>
              </p>
            </div>
          </div>
        </body>
      </html>
      `
    }
  },

  bloodTest: {
    subject: '🧬 Your Blood Test Analysis is Ready',
    getHtml: (data: any) => {
      const userName = data.user_name || 'Wellness Enthusiast'
      const healthScore = data.health_score || 'Processing'
      const filesProcessed = data.files_processed || 1
      const analysisDate = data.analysis_date || new Date().toLocaleDateString()
      
      return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Blood Test Analysis</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); }
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
              <h1 style="text-align: center; color: #1e293b;">Your Personalized Blood Analysis is Ready, ${userName}!</h1>
              <div class="score-display">
                <div class="score-number">${healthScore}</div>
                <div style="font-size: 1.1rem; color: #991b1b; font-weight: 600;">Wellness Harmony Score</div>
                <p style="margin-top: 15px; color: #991b1b;">
                  Based on analysis of ${filesProcessed} file(s) processed on ${analysisDate}
                </p>
              </div>
              <div style="text-align: center; margin: 40px 0;">
                <h3 style="color: #1e293b;">📋 Your Analysis Includes</h3>
                <ul style="text-align: left; display: inline-block; color: #64748b;">
                  <li>Comprehensive biomarker analysis</li>
                  <li>Personalized recommendations</li>
                  <li>Health optimization action plan</li>
                  <li>Supplement and lifestyle guidance</li>
                </ul>
              </div>
              <div style="padding: 20px; background: #fef3cd; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <p style="color: #92400e; font-size: 0.9rem;">
                  <strong>Medical Disclaimer:</strong> This analysis is for educational purposes only and should not replace professional medical advice. Always consult with qualified healthcare professionals.
                </p>
              </div>
            </div>
            <div class="footer">
              <p>© 2024 WUKSY. All rights reserved.</p>
              <p style="margin-top: 10px; font-size: 0.8rem;">Analysis completed on ${analysisDate}.</p>
            </div>
          </div>
        </body>
      </html>
      `
    }
  },

  healthScore: {
    subject: '📊 Your Health Score Results',
    getHtml: (data: any) => {
      const userName = data.user_name || 'Wellness Enthusiast'
      const healthScore = data.health_score || 'N/A'
      const scoreCategory = data.score_category || 'Good'
      const topStrength = data.top_strength || 'Overall wellness awareness'
      const improvementArea = data.improvement_area || 'Lifestyle optimization'
      
      return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Health Score Results</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 40px 30px; text-align: center; color: white; }
            .logo { font-size: 2rem; font-weight: 700; margin-bottom: 10px; letter-spacing: 2px; }
            .content { padding: 40px 30px; }
            .score-display { text-align: center; margin: 30px 0; padding: 30px; background: linear-gradient(135deg, #eff6ff, #dbeafe); border-radius: 12px; }
            .score-number { font-size: 3rem; font-weight: 800; color: #2563eb; margin-bottom: 10px; }
            .insight-card { margin: 20px 0; padding: 20px; border-radius: 12px; }
            .strength-card { background: #f0fdf4; border-left: 4px solid #10b981; }
            .improvement-card { background: #fffbeb; border-left: 4px solid #f59e0b; }
            .footer { background: #1e293b; color: #94a3b8; padding: 30px; text-align: center; font-size: 0.9rem; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">WUKSY</div>
              <div>📊 Your Health Score Results</div>
            </div>
            <div class="content">
              <h1 style="text-align: center; color: #1e293b;">Your Personalized Health Score is Ready, ${userName}!</h1>
              <div class="score-display">
                <div class="score-number">${healthScore}</div>
                <div style="font-size: 1.1rem; color: #1e40af; font-weight: 600;">Health Optimization Score</div>
                <div style="margin-top: 15px; padding: 8px 16px; background: #2563eb; color: white; border-radius: 20px; font-size: 0.9rem; display: inline-block;">
                  ${scoreCategory}
                </div>
              </div>
              <div class="insight-card strength-card">
                <h4 style="color: #166534; margin-bottom: 10px;">💪 Your Top Strength</h4>
                <p style="color: #166534; margin: 0;">${topStrength} - You're excelling in this area and setting a great foundation for overall wellness.</p>
              </div>
              <div class="insight-card improvement-card">
                <h4 style="color: #92400e; margin-bottom: 10px;">🎯 Priority Improvement Area</h4>
                <p style="color: #92400e; margin: 0;">${improvementArea} - Focusing here will have the biggest impact on your overall health score.</p>
              </div>
            </div>
            <div class="footer">
              <p>© 2024 WUKSY. All rights reserved.</p>
              <p style="margin-top: 10px; font-size: 0.8rem;">Assessment completed today.</p>
            </div>
          </div>
        </body>
      </html>
      `
    }
  },

  healthAudit: {
    subject: '🔍 Your Health Data Audit Results',
    getHtml: (data: any) => {
      const userName = data.user_name || 'Wellness Enthusiast'
      const auditScore = data.audit_score || 'Completed'
      const criticalGaps = data.critical_gaps || 3
      const actionItems = data.action_items || 5
      
      return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Health Data Audit Results</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #7c3aed, #6d28d9); padding: 40px 30px; text-align: center; color: white; }
            .logo { font-size: 2rem; font-weight: 700; margin-bottom: 10px; letter-spacing: 2px; }
            .content { padding: 40px 30px; }
            .audit-summary { text-align: center; margin: 30px 0; padding: 30px; background: linear-gradient(135deg, #faf5ff, #f3e8ff); border-radius: 12px; }
            .audit-score { font-size: 2.5rem; font-weight: 800; color: #7c3aed; margin-bottom: 10px; }
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
              <h1 style="text-align: center; color: #1e293b;">Your Health Data Audit Results Are Ready, ${userName}!</h1>
              <div class="audit-summary">
                <div class="audit-score">${auditScore}</div>
                <div style="font-size: 1.1rem; color: #6d28d9; font-weight: 600;">Data Tracking Effectiveness</div>
              </div>
              <div style="margin: 30px 0; padding: 25px; background: #fef2f2; border-radius: 12px; border-left: 4px solid #ef4444;">
                <h3 style="color: #dc2626; margin-bottom: 15px;">⚠️ Critical Data Gaps: ${criticalGaps}</h3>
                <p style="color: #dc2626;">These gaps are preventing you from getting the full picture of your health.</p>
              </div>
              <div style="margin: 30px 0; padding: 25px; background: #f0fdf4; border-radius: 12px; border-left: 4px solid #22c55e;">
                <h3 style="color: #166534; margin-bottom: 15px;">✅ Action Items: ${actionItems}</h3>
                <p style="color: #166534;">Follow these steps to optimize your health tracking.</p>
              </div>
            </div>
            <div class="footer">
              <p>© 2024 WUKSY. All rights reserved.</p>
              <p style="margin-top: 10px; font-size: 0.8rem;">Audit completed today.</p>
            </div>
          </div>
        </body>
      </html>
      `
    }
  },

  supplements: {
    subject: '⚗️ Your Supplement Analysis Results',
    getHtml: (data: any) => {
      const userName = data.user_name || 'Wellness Enthusiast'
      const safetyScore = data.safety_score || 'Good'
      const supplementsChecked = data.supplements_checked || 0
      const interactionsFound = data.interactions_found || 0
      
      return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Supplement Analysis Results</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #059669, #047857); padding: 40px 30px; text-align: center; color: white; }
            .logo { font-size: 2rem; font-weight: 700; margin-bottom: 10px; letter-spacing: 2px; }
            .content { padding: 40px 30px; }
            .safety-display { text-align: center; margin: 30px 0; padding: 30px; background: linear-gradient(135deg, #f0fdf4, #dcfce7); border-radius: 12px; }
            .safety-score { font-size: 2.5rem; font-weight: 800; color: #059669; margin-bottom: 10px; }
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
              <h1 style="text-align: center; color: #1e293b;">Your Supplement Stack Analysis is Ready, ${userName}!</h1>
              <div class="safety-display">
                <div class="safety-score">${safetyScore}</div>
                <div style="font-size: 1.1rem; color: #047857; font-weight: 600;">Safety Rating</div>
                <p style="margin-top: 15px; color: #047857;">
                  ${supplementsChecked} supplements analyzed • ${interactionsFound} interactions found
                </p>
              </div>
              <div style="margin: 30px 0; padding: 25px; background: #f0fdf4; border-radius: 12px; border-left: 4px solid #22c55e;">
                <h3 style="color: #166534; margin-bottom: 15px;">✅ Analysis Complete</h3>
                <p style="color: #166534; margin: 0;">Your supplement combination has been analyzed for safety and effectiveness.</p>
              </div>
            </div>
            <div class="footer">
              <p>© 2024 WUKSY. All rights reserved.</p>
              <p style="margin-top: 10px; font-size: 0.8rem;">Analysis completed today.</p>
            </div>
          </div>
        </body>
      </html>
      `
    }
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
    const subject = emailTemplate.subject
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

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: emailSent ? 'Email sent successfully' : 'Email failed to send',
        email_sent: emailSent,
        preview: {
          to,
          subject,
          template_used: template
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