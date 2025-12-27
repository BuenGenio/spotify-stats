# 🔧 OAuth Callback Troubleshooting Guide

## Problem: Callback shows "Connect to Spotify" instead of processing the token

This guide will help you debug OAuth callback issues in production.

## ✅ Fixes Applied

### 1. Fixed `.htaccess` - Query String Preservation
**Issue**: The OAuth callback URL includes `?code=...` parameter that needs to be preserved.

**Solution**: Added `QSA` (Query String Append) flag to the rewrite rule:
```apache
RewriteRule ^ index.html [L,QSA]
```

### 2. Removed App.vue Auth Guard
**Issue**: `App.vue` had a guard that redirected users before the callback could process.

**Solution**: Removed the conflicting `onMounted` guard from `App.vue` - router guards are sufficient.

### 3. Enhanced Callback Logging
**Added extensive console logging** to help debug issues.

## 🔍 How to Debug

### Step 1: Check Browser Console

After clicking "Connect with Spotify" and being redirected back, open the browser console (F12) and look for these logs:

```
=== CALLBACK COMPONENT MOUNTED ===
Current URL: https://yourdomain.com/callback?code=...
Route path: /callback
Query params: { code: "..." }
✓ Authorization code found: AQD...
✓ Token received from Spotify
✓ Token stored in localStorage: YES
✓ Token valid: YES
✓ Authentication successful
```

### Step 2: Common Issues & Solutions

#### Issue: "No authorization code found"

**Console shows:**
```
❌ No authorization code in URL
Route query object: {}
```

**Causes:**
1. `.htaccess` not preserving query string
2. Apache `mod_rewrite` not enabled
3. `.htaccess` file not in the right location

**Solutions:**

**A. Verify .htaccess is deployed**
```bash
# Check if .htaccess exists in your web root
ls -la /var/www/spotify-stats/.htaccess
```

**B. Verify mod_rewrite is enabled**
```bash
# Check Apache modules
apache2ctl -M | grep rewrite
# Should show: rewrite_module (shared)

# If not enabled:
sudo a2enmod rewrite
sudo systemctl restart apache2
```

**C. Verify AllowOverride is set**
Check your Apache VirtualHost config:
```apache
<Directory /var/www/spotify-stats>
    Options -Indexes +FollowSymLinks
    AllowOverride All  # <-- Must be "All" not "None"
    Require all granted
</Directory>
```

**D. Test .htaccess is working**
```bash
# Create a test file
echo "RewriteEngine On" > /var/www/spotify-stats/.htaccess
echo "RewriteRule ^test$ index.html [L]" >> /var/www/spotify-stats/.htaccess

# Test it
curl -I https://yourdomain.com/test
# Should return 200 and serve index.html
```

#### Issue: "Invalid redirect URI"

**Spotify returns error:**
```
error=invalid_request
error_description=Invalid redirect URI
```

**Solution:**
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click your app
3. Click "Edit Settings"
4. Verify Redirect URIs exactly match (case-sensitive!):
   - Production: `https://yourdomain.com/callback`
   - No trailing slash
   - Must include `https://` (not `http://`)

5. Update your `.env` or build environment to match:
```env
VITE_SPOTIFY_REDIRECT_URI=https://yourdomain.com/callback
```

6. Rebuild and redeploy:
```bash
npm run build
# Deploy dist/ contents
```

#### Issue: "Failed to authenticate: 400 Bad Request"

**Console shows:**
```
❌ Authentication error
Error status: 400
Error response: { error: "invalid_grant" }
```

**Causes:**
1. Authorization code already used (can only be used once)
2. Authorization code expired (valid for 10 minutes)
3. Client ID mismatch

**Solutions:**
1. **Try logging in again** (get a fresh code)
2. **Verify Client ID matches** between:
   - Spotify Developer Dashboard
   - Your `.env` file
   - The built application (check browser console for "Client ID configured: YES")

3. **Check if PKCE is working**:
   - Open browser console
   - Go to Application → Local Storage
   - Look for `code_verifier` (should exist during login, removed after callback)

#### Issue: "Token was not stored in localStorage"

**Console shows:**
```
✓ Token received from Spotify
❌ Token stored in localStorage: NO
```

**Causes:**
1. localStorage blocked (private browsing, browser settings)
2. Storage quota exceeded
3. Browser extension interfering

**Solutions:**
1. **Test localStorage**:
```javascript
// In browser console
localStorage.setItem('test', 'value')
localStorage.getItem('test')
// Should return 'value'
```

2. **Check browser settings**:
   - Not in incognito/private mode
   - Cookies/storage enabled for your domain
   - Clear site data and try again

3. **Disable browser extensions** and try again

#### Issue: Callback redirects to login page immediately

**Behavior:**
- Lands on `/callback`
- Briefly shows loading spinner
- Immediately redirects to login page

**Causes:**
1. Router guard blocking before callback processes
2. JavaScript error preventing execution

**Solutions:**

1. **Check for JavaScript errors**:
   - Open console (F12)
   - Look for red errors
   - Check Network tab for failed requests

2. **Verify router configuration**:
   ```javascript
   // src/router/index.js should NOT block /callback
   router.beforeEach((to, from, next) => {
     if (to.meta.requiresAuth && !spotifyAuth.isTokenValid()) {
       next('/')
     } else if (to.path === '/' && spotifyAuth.isTokenValid()) {
       next('/dashboard')
     } else {
       next() // <-- Allows /callback through
     }
   })
   ```

3. **Clear localStorage and try fresh**:
   ```javascript
   // In console
   localStorage.clear()
   // Then try logging in again
   ```

## 🧪 Testing Checklist

### Local Testing (Development)
```bash
npm run dev
```
- [ ] Click "Connect with Spotify"
- [ ] Redirected to Spotify login
- [ ] After authorization, redirected to `http://localhost:3000/callback?code=...`
- [ ] Console shows "✓ Token stored in localStorage: YES"
- [ ] Redirects to dashboard
- [ ] Dashboard loads with data

### Production Testing

1. **Build with production config**:
```bash
# Update .env
VITE_SPOTIFY_CLIENT_ID=your_client_id
VITE_SPOTIFY_REDIRECT_URI=https://yourdomain.com/callback

# Build
npm run build

# Verify .htaccess is in dist/
ls -la dist/.htaccess
```

2. **Deploy**:
```bash
# Upload to server
scp -r dist/* user@server:/var/www/spotify-stats/
```

3. **Test the flow**:
- [ ] Visit `https://yourdomain.com`
- [ ] Click "Connect with Spotify"
- [ ] Login at Spotify
- [ ] **Check URL after redirect**: Should be `https://yourdomain.com/callback?code=AQDB...`
- [ ] **Open console immediately** (F12) before any redirect
- [ ] Look for the callback logs
- [ ] Should see "✓ Token stored in localStorage: YES"
- [ ] Should redirect to dashboard

## 📊 Debugging Commands

### Check Apache Configuration
```bash
# Test Apache config syntax
sudo apache2ctl configtest

# Check enabled modules
apache2ctl -M | grep rewrite

# Check error logs
sudo tail -f /var/log/apache2/error.log

# Check access logs
sudo tail -f /var/log/apache2/access.log
```

### Check .htaccess
```bash
# View .htaccess
cat /var/www/spotify-stats/.htaccess | grep -A 2 "RewriteRule"

# Should show:
# RewriteRule ^ index.html [L,QSA]
```

### Test Query String Preservation
```bash
# Test that query params are preserved
curl -v "https://yourdomain.com/callback?test=123" 2>&1 | grep -i location

# Should NOT strip ?test=123
```

### Check localStorage
```javascript
// In browser console at your domain
console.log('access_token:', localStorage.getItem('access_token'))
console.log('token_expiry:', localStorage.getItem('token_expiry'))
console.log('code_verifier:', localStorage.getItem('code_verifier'))
```

## 🆘 Still Not Working?

### Capture Full Debug Info

Open browser console and run:

```javascript
// Copy this entire block and paste in console
console.log('=== DEBUG INFO ===')
console.log('Current URL:', window.location.href)
console.log('localStorage keys:', Object.keys(localStorage))
console.log('access_token exists:', !!localStorage.getItem('access_token'))
console.log('Client ID:', import.meta.env.VITE_SPOTIFY_CLIENT_ID)
console.log('Redirect URI:', import.meta.env.VITE_SPOTIFY_REDIRECT_URI)
console.log('Current route:', window.location.pathname)

// Also check the Network tab
// Look for POST request to accounts.spotify.com/api/token
// Check if it returns 200 or an error
```

### Common Environment Issues

1. **HTTP vs HTTPS**:
   - Spotify requires HTTPS for redirect URIs
   - Exception: localhost can use HTTP

2. **Domain Mismatch**:
   - Redirect URI in code must EXACTLY match dashboard
   - Including: `http://` vs `https://`, `www.` vs no `www.`, trailing `/`

3. **Client ID Mismatch**:
   - Verify the built app uses the correct Client ID
   - Check browser console for "Client ID configured: YES"
   - Rebuild if you changed .env

4. **Cached Build**:
   - Clear browser cache (Ctrl+Shift+Delete)
   - Hard refresh (Ctrl+Shift+R)
   - Try in incognito mode

## ✅ Success Indicators

When everything works, you should see:

1. **Console logs**:
```
=== CALLBACK COMPONENT MOUNTED ===
✓ Authorization code found
✓ Token received from Spotify
✓ Token stored in localStorage: YES
✓ Token valid: YES
✓ Authentication successful
```

2. **Network tab**:
   - POST to `accounts.spotify.com/api/token` → Status 200
   - Response includes `access_token`

3. **Application tab**:
   - Local Storage shows:
     - `access_token`: `BQC...` (long string)
     - `token_expiry`: `1234567890` (timestamp)
     - No `code_verifier` (cleaned up after use)

4. **Behavior**:
   - Redirects to `/dashboard`
   - Dashboard loads your Spotify data
   - No errors in console

---

**Good luck! If you're still stuck, share the console logs and I can help debug further.** 🎵

