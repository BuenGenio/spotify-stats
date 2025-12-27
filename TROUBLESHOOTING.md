# 🔧 Troubleshooting Guide

## OAuth Callback Issues

### Issue: Callback returns to login page without storing token

This is the most common issue. Here's how to diagnose and fix it:

#### Step 1: Check Browser Console

Open your browser's Developer Tools (F12) and look for console logs during the callback:

**What to look for:**
```
✓ Good:
  "Callback mounted"
  "Starting authentication with code: ..."
  "Token received and stored: YES"
  "Token verified in storage: YES"
  "Redirecting to dashboard"

✗ Bad:
  "Code verifier: MISSING"
  "CLIENT_ID: MISSING"
  "REDIRECT_URI: MISSING"
  "Error exchanging code for token"
```

#### Step 2: Common Causes & Solutions

##### 1. Environment Variables Not Loaded

**Symptom:** Console shows "CLIENT_ID: MISSING" or "REDIRECT_URI: MISSING"

**Cause:** `.env` file not created or variables not prefixed with `VITE_`

**Solution:**
```bash
# Create .env file in project root
cp .env.example .env

# Edit .env and add your credentials
VITE_SPOTIFY_CLIENT_ID=your_actual_client_id
VITE_SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
```

**Important:** 
- Variables MUST start with `VITE_` to be exposed to the browser
- Restart dev server after changing `.env`
- In production, ensure environment variables are set in your build process

##### 2. Code Verifier Missing

**Symptom:** Console shows "Code verifier: MISSING"

**Cause:** localStorage was cleared or login didn't complete properly

**Solution:**
1. Clear your browser cache and localStorage
2. Start fresh from the login page
3. Don't open callback URL directly in a new tab

**To clear localStorage:**
```javascript
// Open browser console and run:
localStorage.clear()
location.reload()
```

##### 3. Redirect URI Mismatch

**Symptom:** Spotify shows "INVALID_CLIENT: Invalid redirect URI"

**Cause:** Redirect URI in code doesn't match Spotify Dashboard

**Solution:**
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Open your app
3. Click "Edit Settings"
4. Under "Redirect URIs", ensure you have EXACTLY:
   - Development: `http://localhost:3000/callback`
   - Production: `https://yourdomain.com/callback`
5. Make sure `.env` matches exactly (including protocol, port, path)

##### 4. CORS or Network Errors

**Symptom:** Console shows network error when calling `https://accounts.spotify.com/api/token`

**Cause:** CORS issue or network problem

**Solution:**
- This shouldn't happen as Spotify API supports CORS
- Check your browser's Network tab for the actual error
- Ensure you're not blocking third-party cookies
- Try a different browser or incognito mode

##### 5. Token Exchange Failed

**Symptom:** Console shows "Error exchanging code for token" with 400 or 401 error

**Possible causes:**
- Invalid Client ID
- Code already used (refresh the login, don't reuse callback URL)
- Code verifier mismatch
- Wrong redirect URI

**Solution:**
```bash
# Verify your Client ID in .env matches Spotify Dashboard
# Clear localStorage and try again
localStorage.clear()

# Check Spotify Dashboard for correct Client ID
```

#### Step 3: Enable Debug Mode

In development, a debug button (🔍) appears in the bottom-right corner:

1. Click the debug button
2. Check all values show green checkmarks
3. Click "Copy Debug Info" to share with support

#### Step 4: Test Step-by-Step

**Manual testing process:**

1. **Clear everything:**
   ```javascript
   localStorage.clear()
   ```

2. **Reload and click login:**
   - Watch console for "Starting login flow"
   - Should see "Code verifier stored: YES"
   - Should redirect to Spotify

3. **After authorizing on Spotify:**
   - Watch console for "Callback mounted"
   - Should see "Query params: {code: '...'}"
   - Should see "Token received and stored: YES"

4. **If it fails at any step:**
   - Note which step failed
   - Check the console error message
   - See solutions above

## Production Deployment Issues

### Issue: Works locally but not in production

#### Environment Variables in Production

**For Apache/static hosting:**

Environment variables are baked into the JavaScript at build time. You need to:

1. **Set variables BEFORE building:**
   ```bash
   # Create .env for production
   echo "VITE_SPOTIFY_CLIENT_ID=your_id" > .env
   echo "VITE_SPOTIFY_REDIRECT_URI=https://yourdomain.com/callback" >> .env
   
   # Build
   npm run build
   ```

2. **Verify in build:**
   ```bash
   # Check that variables are in the built file
   grep -r "VITE" dist/assets/*.js
   # Should NOT find "VITE_" strings (they're replaced with actual values)
   ```

**For Netlify:**
1. Go to Site Settings → Build & Deploy → Environment
2. Add variables:
   - `VITE_SPOTIFY_CLIENT_ID`
   - `VITE_SPOTIFY_REDIRECT_URI`

**For Vercel:**
1. Go to Project Settings → Environment Variables
2. Add same variables as above

### Issue: 404 on callback in production

**Symptom:** Callback URL shows Apache 404 page

**Cause:** `.htaccess` not working or not present

**Solution:**

1. **Verify `.htaccess` exists:**
   ```bash
   ls -la /var/www/spotify-stats/.htaccess
   ```

2. **Check Apache config allows .htaccess:**
   ```apache
   <Directory /var/www/spotify-stats>
       AllowOverride All  # Must be "All", not "None"
   </Directory>
   ```

3. **Verify mod_rewrite is enabled:**
   ```bash
   apache2ctl -M | grep rewrite
   # Should show: rewrite_module (shared)
   ```

4. **Enable if not enabled:**
   ```bash
   sudo a2enmod rewrite
   sudo systemctl restart apache2
   ```

5. **Test .htaccess is working:**
   ```bash
   # Visit a non-existent route
   curl https://yourdomain.com/test-fake-route
   # Should return your index.html, not 404
   ```

## Debugging Commands

### Check Environment Variables (Development)

```javascript
// Open browser console
console.log('Client ID:', import.meta.env.VITE_SPOTIFY_CLIENT_ID)
console.log('Redirect:', import.meta.env.VITE_SPOTIFY_REDIRECT_URI)
```

### Check localStorage

```javascript
// Open browser console
console.log('Access Token:', localStorage.getItem('access_token'))
console.log('Token Expiry:', new Date(parseInt(localStorage.getItem('token_expiry'))))
console.log('Code Verifier:', localStorage.getItem('code_verifier'))
```

### Clear Everything and Start Fresh

```javascript
// Open browser console
localStorage.clear()
location.href = '/'
```

### Test Token Validity

```javascript
// Open browser console
import { spotifyAuth } from './services/spotify'
console.log('Token valid:', spotifyAuth.isTokenValid())
```

## Common Error Messages

### "Code verifier not found in localStorage"

**Cause:** You navigated directly to the callback URL or localStorage was cleared

**Solution:** Start from the login page and go through the full flow

### "VITE_SPOTIFY_CLIENT_ID is not configured"

**Cause:** Environment variable not set or not prefixed with `VITE_`

**Solution:** 
1. Create `.env` file
2. Add `VITE_SPOTIFY_CLIENT_ID=your_id`
3. Restart dev server

### "Invalid redirect URI"

**Cause:** Redirect URI mismatch

**Solution:** Ensure `.env` and Spotify Dashboard have EXACT same URI

### "Token was not stored properly"

**Cause:** localStorage might be disabled or quota exceeded

**Solution:**
1. Check browser privacy settings allow localStorage
2. Clear localStorage to free up space
3. Try incognito mode

## Still Having Issues?

### Collect Debug Information

1. Open browser console (F12)
2. Go to login page
3. Click login button
4. Copy ALL console output
5. After callback, copy ALL console output again
6. Click debug button (🔍) and copy debug info

### Check These Files

```bash
# Verify files exist
ls -la .env
ls -la public/.htaccess
ls -la src/services/spotify.js

# Check .env format
cat .env
# Should show:
# VITE_SPOTIFY_CLIENT_ID=...
# VITE_SPOTIFY_REDIRECT_URI=...
```

### Test in Different Browser

Sometimes browser extensions or settings cause issues. Try:
- Chrome Incognito
- Firefox Private Window
- Different browser entirely

### Network Tab Analysis

1. Open DevTools → Network tab
2. Go through login flow
3. Look for request to `https://accounts.spotify.com/api/token`
4. Check response:
   - **200 OK**: Good, check if token is being stored
   - **400 Bad Request**: Check request payload
   - **401 Unauthorized**: Client ID or redirect URI issue
   - **CORS error**: Browser/network issue

## Quick Checklist

Before asking for help, verify:

- [ ] `.env` file exists with correct variables
- [ ] Variables start with `VITE_`
- [ ] Dev server restarted after creating `.env`
- [ ] Redirect URI in `.env` matches Spotify Dashboard EXACTLY
- [ ] Client ID in `.env` matches Spotify Dashboard
- [ ] Browser console shows no environment variable errors
- [ ] localStorage is enabled in browser
- [ ] Not using callback URL directly (start from login)
- [ ] `.htaccess` exists in production
- [ ] `mod_rewrite` enabled in Apache (production)

---

**Most issues are caused by environment variables not being set correctly!**

