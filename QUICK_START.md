# ⚡ Quick Start

## 🎯 Get Running in 3 Steps

### 1️⃣ Get Spotify Credentials (2 min)

Visit: **https://developer.spotify.com/dashboard**

```
1. Click "Create an App"
2. Name: "Spotify Stats"
3. Click "Edit Settings"
4. Add Redirect URI: http://localhost:3000/callback
5. Copy your Client ID
```

### 2️⃣ Configure (30 sec)

Create `.env` file:

```bash
VITE_SPOTIFY_CLIENT_ID=your_client_id_here
VITE_SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
```

### 3️⃣ Run (1 min)

```bash
npm install
npm run dev
```

Open: **http://localhost:3000** 🎉

---

## 📱 What You'll See

### Login Page
Beautiful landing page with Spotify login button

### Dashboard
- Overview stats
- Top 5 tracks & artists
- Genre chart
- Audio profile

### Top Charts
- Your top 50 tracks
- Your top 50 artists  
- Genre breakdown
- Time range selector

### Year in Tunes
- Annual summary
- Top track & artist
- Music vibe analysis
- Listening stats

### Listening Pulse
- Recent tracks
- Activity patterns
- Listening calendar
- Peak times

### Reports
- Generate PDF reports
- Customizable content
- Download & share

---

## 🎨 Key Features

✅ **Secure OAuth** - Safe Spotify login  
✅ **Beautiful Charts** - Visual data representation  
✅ **Time Ranges** - 4 weeks, 6 months, all time  
✅ **PDF Reports** - Export your stats  
✅ **Responsive** - Works on all devices  
✅ **Privacy First** - No data stored  

---

## 🆘 Need Help?

**Invalid Client Error?**
- Check Client ID in `.env`
- Verify Redirect URI matches exactly

**No Data?**
- Make sure you have Spotify listening history
- Try different time ranges

**Port Already in Use?**
- Edit `vite.config.js` and change port

---

## 📚 More Info

- **Full Docs**: See `README.md`
- **Setup Guide**: See `SETUP.md`
- **Features**: See `FEATURES.md`
- **Development**: See `DEVELOPMENT.md`

---

**Enjoy your music stats! 🎧**

