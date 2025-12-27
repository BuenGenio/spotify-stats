# Quick Setup Guide

## 🚀 5-Minute Setup

### Step 1: Get Spotify Credentials (2 minutes)

1. Visit: https://developer.spotify.com/dashboard
2. Click "Create an App"
3. Enter:
   - Name: `Spotify Stats`
   - Description: `Personal music analytics`
4. Click "Edit Settings" → Add Redirect URI: `http://localhost:3000/callback`
5. Copy your **Client ID**

### Step 2: Configure App (1 minute)

Create a `.env` file in the project root:

```bash
VITE_SPOTIFY_CLIENT_ID=paste_your_client_id_here
VITE_SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
```

### Step 3: Install & Run (2 minutes)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:3000 and enjoy! 🎉

## 🎯 What You Get

- **Dashboard**: Overview of your music stats
- **Top Charts**: Your most played tracks, artists, and genres
- **Year in Tunes**: Annual music summary
- **Listening Pulse**: Activity patterns and calendar
- **Reports**: Generate PDF reports of your stats

## 🔧 Common Issues

### "Invalid Client" Error
- Double-check your Client ID in `.env`
- Ensure Redirect URI is exactly: `http://localhost:3000/callback`

### No Data Showing
- Make sure you have listening history on Spotify
- Try different time ranges (4 weeks, 6 months, all time)

### Port Already in Use
Edit `vite.config.js` to change the port:
```js
server: {
  port: 3001  // Change to any available port
}
```

## 📚 Need More Help?

See the full [README.md](./README.md) for detailed documentation.

