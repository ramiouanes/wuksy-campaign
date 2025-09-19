# WUKSY Campaign - Supabase Configuration

## Quick Setup Instructions

### 1. Update Configuration
Edit `js/config.js` and replace the placeholder values with your actual Supabase credentials:

```javascript
const SUPABASE_CONFIG = {
    url: 'https://your-project-id.supabase.co', // Replace with your actual project URL
    anonKey: 'your-anon-key-here' // Replace with your actual anon key
};
```

**Where to find these values:**
1. Go to your Supabase project dashboard
2. Click on **Settings** → **API**
3. Copy the **Project URL** and **anon public** key

### 2. Add Scripts to HTML Pages
Add these script tags to ALL your HTML pages (before the closing `</body>` tag):

```html
<!-- Supabase Configuration -->
<script src="js/config.js"></script>

<!-- Supabase Utilities -->
<script src="js/supabase-utils.js"></script>
```

### 3. Test the Setup
1. Open your browser's developer console (F12)
2. Load any of your pages
3. You should see: "✅ Supabase initialized successfully"
4. If you see errors, check your credentials in `js/config.js`

## File Structure
```
your-project/
├── js/
│   ├── config.js           # Supabase configuration
│   └── supabase-utils.js   # All functionality functions
├── index.html              # Updated with Supabase integration
├── health_score_calculator.html
├── health_audit_kit.html
├── blood_test_upload_tool.html
└── supplement_interaction_checker.html
```

## Available Functions

After setup, you can use these functions in your pages:

### Email Capture
```javascript
const result = await WUKSY.captureEmail(email, 'main', { additional: 'data' });
```

### Quiz Results
```javascript
const result = await WUKSY.saveQuizResults(email, 'health_score', results, score);
```

### File Upload
```javascript
const result = await WUKSY.uploadBloodTest(file, email, additionalData);
```

### Analytics
```javascript
await WUKSY.trackEvent('form_completed', 'health_score', { email, score });
```

## Security Notes

- The anon key is safe to use in frontend code
- Row Level Security (RLS) is enabled on all tables
- File uploads are stored securely in Supabase Storage
- All sensitive operations require proper authentication

## Testing

1. **Email Capture**: Try signing up with different emails
2. **Quiz Results**: Complete a quiz and check if results are saved
3. **File Upload**: Upload a test file and verify storage
4. **Analytics**: Check the page_analytics table for tracking data

## Troubleshooting

### Common Issues:
1. **"Supabase not initialized"**: Check your credentials in `js/config.js`
2. **CORS errors**: Make sure your GitHub Pages URL is added to Supabase auth settings
3. **Permission denied**: Verify RLS policies are set up correctly
4. **File upload fails**: Check storage bucket permissions

### Debug Mode:
Open browser console to see detailed error messages and success confirmations.
