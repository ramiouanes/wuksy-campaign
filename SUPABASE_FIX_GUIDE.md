# 🔧 Supabase Setup Fix Guide

## The Problem
You're getting **406 (Not Acceptable)** errors because your Supabase database doesn't have the required tables set up yet. The error "The schema must be one of the following: api" means the tables don't exist in the expected `public` schema.

## ✅ Solution Steps

### Step 1: Set Up Database Tables
1. **Go to your Supabase Dashboard**
   - Visit [supabase.com](https://supabase.com) and log in
   - Navigate to your project: `jmezneoxfjhyxjiwylab`

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Database Setup Script**
   - Copy the entire contents of `database_setup.sql` (created in your project)
   - Paste it into the SQL Editor
   - Click "Run" to execute the script

4. **Verify Tables Were Created**
   - After running the script, you should see a success message
   - Go to "Table Editor" in the sidebar
   - You should now see these tables:
     - `subscribers`
     - `quiz_results` 
     - `blood_test_uploads`
     - `supplement_interactions`
     - `page_analytics`

### Step 2: Verify Your Configuration
Your `js/config.js` has been updated with the correct schema configuration. The key changes:

```javascript
// Now explicitly uses 'public' schema
supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
    db: {
        schema: 'public'
    },
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
```

### Step 3: Test the Fix
1. **Clear Browser Cache**
   - Press `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac) to hard refresh
   - Or clear your browser cache completely

2. **Test Email Signup**
   - Go to your homepage
   - Enter your email in the "Join Early Access" form
   - Click the button
   - Check the browser console (F12) for messages

3. **Expected Success Messages**
   ```
   ✅ Supabase initialized successfully
   🔗 Connected to: https://jmezneoxfjhyxjiwylab.supabase.co
   📊 Using schema: public
   ```

### Step 4: Verify Data Storage
1. **Check Supabase Dashboard**
   - Go to "Table Editor" → "subscribers"
   - You should see your email entry with timestamp

2. **Check Analytics**
   - Go to "Table Editor" → "page_analytics"
   - You should see page view and signup events

## 🚨 Troubleshooting

### If you still get errors:

#### Error: "relation 'public.subscribers' does not exist"
- The database setup script didn't run properly
- Try running the SQL script again
- Make sure you're in the correct Supabase project

#### Error: "insufficient_privilege" 
- Your RLS policies might not be set up correctly
- Re-run the database setup script (it's safe to run multiple times)

#### Error: "Failed to fetch"
- Check your internet connection
- Verify your Supabase URL and API key are correct
- Make sure your Supabase project is not paused

#### Still getting 406 errors?
- Check if your Supabase project has any custom schemas
- Verify the anon key has the correct permissions
- Try creating a fresh API key in Supabase Dashboard → Settings → API

## 📊 What the Script Creates

### Tables:
- **subscribers**: Stores email signups with source tracking
- **quiz_results**: Stores health assessment results
- **blood_test_uploads**: Tracks uploaded blood test files
- **supplement_interactions**: Stores supplement analysis results  
- **page_analytics**: Tracks user interactions and events

### Security:
- ✅ Row Level Security (RLS) enabled
- ✅ Anonymous insert/read policies
- ✅ Secure file storage bucket
- ✅ Proper indexing for performance

## 🎉 After Setup

Once this is working, you'll be able to:
- ✅ Capture email signups
- ✅ Store quiz results
- ✅ Upload and track files
- ✅ Monitor user analytics
- ✅ All tools will work seamlessly

## Need Help?

If you're still having issues after following these steps, check:
1. Supabase project status (not paused)
2. API key permissions
3. Browser console for specific error messages
4. Network tab for failed requests

The most common issue is simply not running the database setup script - make sure to complete Step 1 first!
