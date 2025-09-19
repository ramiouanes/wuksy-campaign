# 📧 WUKSY Email Notifications Setup Guide

## Overview
Your WUKSY campaign now has a complete email notification system that sends personalized emails when users subscribe to the waitlist or complete tool analyses. This guide will help you configure EmailJS to make the system fully functional.

## 🎯 What's Been Implemented

### ✅ Email Templates Created
- **Waitlist Confirmation** - Welcome email for new subscribers
- **Blood Test Analysis** - Results notification with health score
- **Health Score Calculator** - Personalized score report
- **Health Audit Kit** - Data audit results and action plan
- **Supplement Checker** - Safety analysis and recommendations

### ✅ Integration Points
- **Subscription Process** - Automatic welcome email on signup
- **Blood Test Tool** - Email required before analysis, results sent automatically
- **All Tools** - Email notifications triggered on completion
- **Database Logging** - All email activities tracked in Supabase

### ✅ Tool Page Updates
- **Blood Test Analyzer** - Email input required, button disabled until valid email entered
- **Other Tools** - Ready for similar email requirement implementation

## 🚀 EmailJS Configuration Steps

### Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://emailjs.com)
2. Sign up for a free account
3. Verify your email address

### Step 2: Create Email Service
1. In your EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions to connect your email account
5. **Copy the Service ID** - you'll need this

### Step 3: Create Email Templates
Create these 5 templates in your EmailJS dashboard:

#### Template 1: Waitlist Confirmation (`template_waitlist`)
```
Subject: 🌱 Welcome to WUKSY - You're on the Waitlist!

Use the HTML content from: email-templates/waitlist-confirmation.html
```

#### Template 2: Blood Test Analysis (`template_blood_test`)
```
Subject: 🧬 Your Blood Test Analysis is Ready

Use the HTML content from: email-templates/blood-test-notification.html
```

#### Template 3: Health Score (`template_health_score`)
```
Subject: 📊 Your Health Score Results - {{health_score}}

Use the HTML content from: email-templates/health-score-notification.html
```

#### Template 4: Health Audit (`template_health_audit`)
```
Subject: 🔍 Your Health Data Audit Results

Use the HTML content from: email-templates/health-audit-notification.html
```

#### Template 5: Supplement Analysis (`template_supplements`)
```
Subject: ⚗️ Your Supplement Analysis Results

Use the HTML content from: email-templates/supplement-notification.html
```

### Step 4: Update Configuration
1. Open `js/email-notifications.js`
2. Update the EMAIL_CONFIG object:

```javascript
const EMAIL_CONFIG = {
    serviceId: 'YOUR_SERVICE_ID', // From Step 2
    templateIds: {
        waitlist: 'template_waitlist',
        bloodTest: 'template_blood_test', 
        healthScore: 'template_health_score',
        healthAudit: 'template_health_audit',
        supplements: 'template_supplements'
    },
    userId: 'YOUR_USER_ID' // From your EmailJS account settings
};
```

### Step 5: Update Database Schema
Run this SQL in your Supabase SQL Editor to add the email notifications table:

```sql
-- Create email_notifications table
CREATE TABLE IF NOT EXISTS public.email_notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    notification_type VARCHAR(100) NOT NULL,
    template_id VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    metadata JSONB DEFAULT '{}',
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🧪 Testing Your Setup

### Test 1: Subscription Email
1. Go to your main page
2. Enter your email in the "Join Early Access" form
3. Submit the form
4. Check your email for the welcome message

### Test 2: Blood Test Analysis Email
1. Go to the Blood Test Analyzer tool
2. Upload a test file (any PDF/image)
3. Enter your email address
4. Fill out the form and run analysis
5. Check your email for the results notification

### Test 3: Check Email Logs
1. Go to your Supabase dashboard
2. Navigate to Table Editor > email_notifications
3. Verify that email sends are being logged

## 🔧 Troubleshooting

### Common Issues

**Emails not sending:**
- Check EmailJS service configuration
- Verify template IDs match exactly
- Check browser console for JavaScript errors
- Ensure your email service has proper authentication

**Template variables not working:**
- Verify template variable names match (case-sensitive)
- Check that data is being passed correctly in the JavaScript

**Database logging not working:**
- Verify Supabase connection is working
- Check that the email_notifications table exists
- Review browser console for Supabase errors

### Debug Mode
Add this to your browser console to enable debug logging:
```javascript
window.EMAIL_DEBUG = true;
```

## 📊 Email Analytics

Monitor your email performance through:
1. **EmailJS Dashboard** - Delivery rates and usage stats
2. **Supabase Database** - Detailed logs of all email activities
3. **Browser Console** - Real-time debugging information

## 🎨 Customization

### Update Email Branding
- Modify the HTML templates in the `email-templates/` folder
- Update colors, logos, and messaging to match your brand
- Re-upload the updated HTML to your EmailJS templates

### Add New Email Types
1. Create new HTML template
2. Add template ID to `EMAIL_CONFIG`
3. Create new notification function in `js/email-notifications.js`
4. Integrate into your tool workflows

## 🚀 Going Live

### Before Launch Checklist
- [ ] EmailJS service connected and tested
- [ ] All 5 email templates uploaded and working
- [ ] Database schema updated
- [ ] Test emails sent successfully
- [ ] Email variables displaying correctly
- [ ] Unsubscribe links working (if implemented)

### Production Considerations
- **Rate Limits**: EmailJS free plan has monthly limits
- **Deliverability**: Consider upgrading to paid plan for better delivery
- **Monitoring**: Set up alerts for failed email deliveries
- **Compliance**: Ensure GDPR/CAN-SPAM compliance if applicable

## 💡 Next Steps

Consider these enhancements:
1. **Email Preferences** - Let users choose notification types
2. **A/B Testing** - Test different email templates
3. **Automation** - Set up email sequences for user nurturing
4. **Analytics Integration** - Track email opens and clicks

## 🆘 Support

If you need help:
1. Check the browser console for error messages
2. Review EmailJS documentation
3. Test with a simple template first
4. Verify all configuration values are correct

Your email notification system is now ready to engage users and provide a professional experience! 🎉
