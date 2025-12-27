# 🎵 Spotify Stats

A beautiful web application to analyze and visualize your Spotify listening habits. Discover your top tracks, artists, genres, and generate comprehensive listening reports.

![Spotify Stats](https://img.shields.io/badge/Spotify-Stats-1DB954?style=for-the-badge&logo=spotify)

## ✨ Features

- 🔐 **Secure OAuth Authentication** - Login with your Spotify account
- 📊 **Interactive Dashboard** - Overview of your music statistics
- 🎤 **Top Charts** - View your most played tracks, artists, and genres
- 🎸 **Genre Analysis** - Discover your favorite music genres with beautiful visualizations
- 📅 **Year in Review** - Get a comprehensive look at your listening year
- ⏰ **Listening Patterns** - Analyze when and how you listen to music
- 📄 **PDF Reports** - Generate and download detailed listening reports
- 🎨 **Beautiful UI** - Modern, responsive design with Tailwind CSS
- 🎉 **NEW: Historical Data Import** - Import your complete Spotify history with **actual play counts**!
  - Upload extended streaming history JSON files
  - See every song you've ever played with exact play counts
  - Year-by-year analytics, skip rates, platform usage, listening streaks
  - All data stored locally - no server uploads

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Spotify account
- Spotify Developer Application credentials

### 1. Set Up Spotify Developer Account

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create an App"
4. Fill in the app details:
   - **App Name**: Spotify Stats (or any name you prefer)
   - **App Description**: Personal music analytics application
   - **Redirect URI**: `http://localhost:3000/callback`
5. Click "Create"
6. Note your **Client ID** (you'll need this)
7. Click "Edit Settings" and add `http://localhost:3000/callback` to Redirect URIs

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file and add your Spotify credentials:

```env
VITE_SPOTIFY_CLIENT_ID=your_client_id_here
VITE_SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
```

Replace `your_client_id_here` with the Client ID from your Spotify Developer Dashboard.

### 4. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## 📖 Usage

1. **Login**: Click "Connect with Spotify" on the home page
2. **Authorize**: Grant the app permission to read your Spotify data
3. **Explore**: Navigate through different views:
   - **Dashboard**: Overview of your stats
   - **Top Charts**: Detailed view of your top music
   - **Year in Tunes**: Your year in music
   - **Listening Pulse**: Activity patterns and calendar
   - **Reports**: Generate PDF reports

## 🛠️ Tech Stack

- **Frontend Framework**: Vue 3
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Chart.js + vue-chartjs
- **UI Components**: Headless UI
- **Icons**: Heroicons
- **HTTP Client**: Axios
- **PDF Generation**: jsPDF + html2canvas

## 📊 API Endpoints Used

The app uses the following Spotify Web API endpoints:

- `/me` - Get current user profile
- `/me/top/tracks` - Get user's top tracks
- `/me/top/artists` - Get user's top artists
- `/me/player/recently-played` - Get recently played tracks
- `/audio-features` - Get audio features for tracks
- `/me/tracks` - Get user's saved tracks
- `/me/playlists` - Get user's playlists

## 🔒 Privacy & Security

- This app only requests **read-only** access to your Spotify data
- Your data is never stored on any server - all processing happens in your browser
- Authentication tokens are stored locally in your browser
- No personal data is collected or shared with third parties

## 📱 Time Ranges

The app provides three time ranges for analyzing your data:

- **Last 4 Weeks** (short_term) - Your recent listening habits
- **Last 6 Months** (medium_term) - Your seasonal trends
- **All Time** (long_term) - Your overall music taste

## 🎨 Customization

### Changing Colors

Edit `tailwind.config.js` to customize the color scheme:

```js
theme: {
  extend: {
    colors: {
      spotify: {
        green: '#1DB954',  // Change this
        black: '#191414',
        gray: '#121212',
      }
    },
  },
}
```

### Adding New Features

The app is modular and easy to extend:

- Add new views in `src/views/`
- Add new API methods in `src/services/spotify.js`
- Add new analytics functions in `src/services/analytics.js`
- Update routes in `src/router/index.js`

## 🐛 Troubleshooting

### "Invalid Client" Error

- Make sure your Client ID is correct in `.env`
- Verify the Redirect URI in Spotify Dashboard matches exactly: `http://localhost:3000/callback`

### "401 Unauthorized" Error

- Your token may have expired - try logging out and back in
- Check that all required scopes are granted during authentication

### Charts Not Displaying

- Clear your browser cache
- Check browser console for JavaScript errors
- Ensure you have sufficient data in your Spotify account

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/) for providing the data
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [Vue.js](https://vuejs.org/) for the reactive framework
- [Chart.js](https://www.chartjs.org/) for beautiful charts

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review [Spotify API Documentation](https://developer.spotify.com/documentation/web-api/)
3. Open an issue on GitHub

---

Made with ❤️ and ☕ by BuenGenio

Enjoy exploring your music! 🎧


