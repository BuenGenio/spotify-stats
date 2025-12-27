# 🚀 Deployment Guide

## Apache Server Deployment

This guide covers deploying the Spotify Stats application to an Apache web server.

### Prerequisites

- Apache 2.4+ with `mod_rewrite` enabled
- Node.js 18+ for building
- SSH access to your server

## 📦 Building for Production

### 1. Update Environment Variables

Create or update your `.env` file with production URLs:

```env
VITE_SPOTIFY_CLIENT_ID=your_client_id_here
VITE_SPOTIFY_REDIRECT_URI=https://yourdomain.com/callback
```

**Important**: Update the redirect URI in your Spotify Developer Dashboard to match your production URL.

### 2. Build the Application

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### 3. Verify Build

Check that `dist/` contains:
- `index.html`
- `assets/` directory with JS and CSS files
- `.htaccess` file (copied from `public/.htaccess`)

## 🔧 Apache Configuration

### Enable Required Modules

Ensure these Apache modules are enabled:

```bash
sudo a2enmod rewrite
sudo a2enmod deflate
sudo a2enmod headers
sudo a2enmod expires
sudo systemctl restart apache2
```

### Virtual Host Configuration

#### Option 1: Root Directory

If deploying to document root (e.g., `https://yourdomain.com`):

```apache
<VirtualHost *:443>
    ServerName yourdomain.com
    DocumentRoot /var/www/spotify-stats
    
    <Directory /var/www/spotify-stats>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /path/to/cert.pem
    SSLCertificateKeyFile /path/to/key.pem
    
    # Optional: Force HTTPS
    ErrorLog ${APACHE_LOG_DIR}/spotify-stats-error.log
    CustomLog ${APACHE_LOG_DIR}/spotify-stats-access.log combined
</VirtualHost>

# Redirect HTTP to HTTPS
<VirtualHost *:80>
    ServerName yourdomain.com
    Redirect permanent / https://yourdomain.com/
</VirtualHost>
```

#### Option 2: Subdirectory

If deploying to a subdirectory (e.g., `https://yourdomain.com/spotify-stats`):

```apache
<VirtualHost *:443>
    ServerName yourdomain.com
    DocumentRoot /var/www/html
    
    Alias /spotify-stats /var/www/spotify-stats
    
    <Directory /var/www/spotify-stats>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # For subdirectory, update RewriteBase in .htaccess
        RewriteEngine On
        RewriteBase /spotify-stats/
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule ^ index.html [L]
    </Directory>
    
    SSLEngine on
    SSLCertificateFile /path/to/cert.pem
    SSLCertificateKeyFile /path/to/key.pem
</VirtualHost>
```

**Note**: If deploying to a subdirectory, update your router base path in `src/router/index.js`:

```javascript
const router = createRouter({
  history: createWebHistory('/spotify-stats/'),  // Add base path
  routes
})
```

## 📤 Deployment Steps

### Using SCP/SFTP

```bash
# Build the app
npm run build

# Copy to server
scp -r dist/* user@yourserver:/var/www/spotify-stats/

# Or use rsync for better performance
rsync -avz --delete dist/ user@yourserver:/var/www/spotify-stats/
```

### Using Git

```bash
# On your server
cd /var/www/spotify-stats
git pull origin main
npm install
npm run build

# Copy built files
cp -r dist/* /var/www/spotify-stats/
```

### Set Correct Permissions

```bash
# On your server
sudo chown -R www-data:www-data /var/www/spotify-stats
sudo chmod -R 755 /var/www/spotify-stats
```

## 🔒 Security Checklist

### Before Deploying

- [ ] Never commit `.env` file to Git
- [ ] Update redirect URI in Spotify Dashboard
- [ ] Use HTTPS (SSL certificate)
- [ ] Verify `.htaccess` blocks access to sensitive files
- [ ] Test that `.env` file is not accessible via browser
- [ ] Enable security headers in Apache

### Test Security

```bash
# Test that .env is blocked
curl https://yourdomain.com/.env
# Should return 403 Forbidden

# Test that source files are blocked
curl https://yourdomain.com/package.json
# Should return 403 Forbidden
```

## 🧪 Testing Production Build

### Local Testing

Test the production build locally before deploying:

```bash
npm run preview
```

This serves the `dist/` folder at `http://localhost:4173`

### Production Testing

After deployment, test these scenarios:

1. **Direct URL Access**
   - Visit `https://yourdomain.com`
   - Should load the app

2. **OAuth Callback**
   - Log in with Spotify
   - Should redirect to `/callback`
   - Should authenticate successfully

3. **Deep Links**
   - Visit `https://yourdomain.com/dashboard` directly
   - Should load the dashboard (not 404)

4. **Page Refresh**
   - Navigate to any route
   - Refresh the page
   - Should stay on the same route (not 404)

5. **Assets Loading**
   - Check browser console for errors
   - Verify all CSS and JS files load
   - Check that images display correctly

## 🐛 Troubleshooting

### Issue: 404 on Callback

**Problem**: OAuth callback returns 404

**Solution**: 
1. Verify `.htaccess` is in the root of your document directory
2. Check that `mod_rewrite` is enabled
3. Verify `AllowOverride All` in Apache config

```bash
# Check if mod_rewrite is enabled
apache2ctl -M | grep rewrite

# Should show: rewrite_module (shared)
```

### Issue: OAuth Redirect URI Mismatch

**Problem**: Spotify returns "INVALID_CLIENT: Invalid redirect URI"

**Solution**:
1. Update redirect URI in Spotify Dashboard to match exactly
2. Include protocol (https://)
3. Match the path exactly (case-sensitive)
4. Update `.env` file with same URI

### Issue: Assets Not Loading

**Problem**: CSS/JS files return 404

**Solution**:
1. Check that files were copied to server correctly
2. Verify file permissions (755 for directories, 644 for files)
3. Check Apache error logs

```bash
tail -f /var/log/apache2/error.log
```

### Issue: .htaccess Not Working

**Problem**: Rewrite rules not being applied

**Solution**:
1. Verify `AllowOverride All` in Apache VirtualHost config
2. Restart Apache after changes
3. Check for syntax errors

```bash
# Test Apache configuration
sudo apache2ctl configtest

# Restart Apache
sudo systemctl restart apache2
```

### Issue: Cache Problems

**Problem**: Updates not showing after deployment

**Solution**:
1. Clear browser cache (Ctrl+Shift+R)
2. Verify index.html has no-cache headers
3. Check .htaccess cache rules

## 📊 Monitoring

### Apache Logs

Monitor your application:

```bash
# Watch access logs
tail -f /var/log/apache2/access.log

# Watch error logs
tail -f /var/log/apache2/error.log

# Filter for errors only
grep "error" /var/log/apache2/error.log
```

### Performance Tips

1. **Enable HTTP/2** for better performance
2. **Use CDN** for static assets (optional)
3. **Enable Browser Caching** (already in .htaccess)
4. **Enable GZIP Compression** (already in .htaccess)
5. **Monitor server resources** (CPU, RAM, disk)

## 🔄 Updating the App

### Deployment Workflow

```bash
# 1. On your local machine
git pull origin main
npm install
npm run build

# 2. Test locally
npm run preview

# 3. Deploy to server
rsync -avz --delete dist/ user@yourserver:/var/www/spotify-stats/

# 4. Clear cache (if needed)
# Visit your site with Ctrl+Shift+R
```

### Automated Deployment

Consider setting up automated deployment with:
- **GitHub Actions** + SCP
- **GitLab CI/CD**
- **Jenkins**
- **Deploy hooks**

Example GitHub Action:

```yaml
name: Deploy to Apache

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install and Build
        run: |
          npm install
          npm run build
        env:
          VITE_SPOTIFY_CLIENT_ID: ${{ secrets.SPOTIFY_CLIENT_ID }}
          VITE_SPOTIFY_REDIRECT_URI: ${{ secrets.REDIRECT_URI }}
      
      - name: Deploy to Server
        uses: easingthemes/ssh-deploy@v2.1.5
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          REMOTE_USER: ${{ secrets.REMOTE_USER }}
          TARGET: /var/www/spotify-stats
          SOURCE: "dist/"
```

## 🌐 Custom Domain Setup

If using a custom domain:

1. **DNS Configuration**
   - Point A record to your server IP
   - Add CNAME for www subdomain (optional)

2. **SSL Certificate**
   ```bash
   # Using Let's Encrypt
   sudo certbot --apache -d yourdomain.com -d www.yourdomain.com
   ```

3. **Update Spotify Dashboard**
   - Add new redirect URI with your domain
   - Update `.env` with new URI

## ✅ Post-Deployment Checklist

- [ ] App loads at production URL
- [ ] OAuth login works
- [ ] OAuth callback works
- [ ] All routes accessible
- [ ] Page refresh works on all routes
- [ ] Browser back button works
- [ ] Assets load correctly (CSS, JS, images)
- [ ] Charts render properly
- [ ] PDF generation works
- [ ] Mobile responsive
- [ ] HTTPS enabled
- [ ] Security headers present
- [ ] `.env` file not accessible
- [ ] Error logs are clean
- [ ] Performance is acceptable

## 📞 Support

If you encounter issues:

1. Check Apache error logs
2. Verify .htaccess syntax
3. Test mod_rewrite is enabled
4. Verify Spotify redirect URI
5. Check browser console for errors

---

**Happy Deploying! 🚀**

