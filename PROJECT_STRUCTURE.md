# Project Structure

## 📁 Directory Layout

```
spotify-stats/
├── public/                 # Static assets
│   └── vite.svg           # Favicon
├── src/
│   ├── layouts/           # Layout components
│   │   └── MainLayout.vue # Main app layout with navigation
│   ├── router/            # Vue Router configuration
│   │   └── index.js       # Route definitions
│   ├── services/          # Business logic & API
│   │   ├── spotify.js     # Spotify API client & auth
│   │   └── analytics.js   # Data processing utilities
│   ├── views/             # Page components
│   │   ├── Login.vue      # Landing/login page
│   │   ├── Callback.vue   # OAuth callback handler
│   │   ├── Dashboard.vue  # Main dashboard
│   │   ├── TopCharts.vue  # Top tracks/artists/genres
│   │   ├── YearInReview.vue    # Year summary
│   │   ├── ListeningPulse.vue  # Activity patterns
│   │   └── Reports.vue    # PDF report generator
│   ├── App.vue            # Root component
│   ├── main.js            # App entry point
│   └── style.css          # Global styles (Tailwind)
├── .env                   # Environment variables (create this!)
├── .env.example           # Environment template
├── .gitignore             # Git ignore rules
├── index.html             # HTML entry point
├── package.json           # Dependencies
├── postcss.config.js      # PostCSS configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── vite.config.js         # Vite build configuration
├── README.md              # Full documentation
├── SETUP.md               # Quick setup guide
└── PROJECT_STRUCTURE.md   # This file
```

## 🔑 Key Files

### Authentication & API (`src/services/spotify.js`)
- OAuth 2.0 PKCE flow implementation
- Spotify Web API wrapper
- Token management

### Analytics (`src/services/analytics.js`)
- Genre extraction from artists
- Audio feature analysis
- Listening pattern detection
- Diversity score calculation
- Year-end statistics generation

### Routing (`src/router/index.js`)
- Route definitions
- Authentication guards
- Lazy-loaded components

### Views

#### `Login.vue`
- Landing page
- Spotify OAuth login button
- Feature showcase

#### `Dashboard.vue`
- Overview statistics
- Top 5 tracks and artists preview
- Genre distribution chart
- Audio profile visualization

#### `TopCharts.vue`
- Time range selector (4 weeks, 6 months, all time)
- Tabbed interface (Tracks, Artists, Genres)
- Detailed lists with images and metadata
- Genre breakdown with charts

#### `YearInReview.vue`
- Annual listening summary
- Total minutes/tracks/artists
- Top track and artist highlights
- Genre preferences
- Audio profile analysis
- Popularity trends

#### `ListeningPulse.vue`
- Recently played tracks
- Listening patterns by hour/day
- Activity calendar
- Peak listening times

#### `Reports.vue`
- Customizable report options
- PDF generation
- Report preview
- Download functionality

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Colors**: Spotify green (#1DB954) as primary
- **Responsive**: Mobile-first design
- **Dark Mode**: Header uses dark theme

## 📊 Charts

Using Chart.js with vue-chartjs:
- **Bar Charts**: Genre distribution
- **Doughnut Charts**: Genre breakdown
- **Line Charts**: Listening patterns by hour
- **Progress Bars**: Audio features, popularity

## 🔐 Security

- PKCE (Proof Key for Code Exchange) for OAuth
- Client-side only (no backend required)
- Tokens stored in localStorage
- Read-only Spotify permissions

## 🚀 Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```
Output: `dist/` directory

### Preview Production Build
```bash
npm run preview
```

## 🔌 API Integration

### Spotify API Endpoints Used

1. **Authentication**
   - `POST /api/token` - Exchange code for token

2. **User Data**
   - `GET /v1/me` - Current user profile
   - `GET /v1/me/top/tracks` - Top tracks
   - `GET /v1/me/top/artists` - Top artists
   - `GET /v1/me/player/recently-played` - Recent tracks

3. **Track Data**
   - `GET /v1/audio-features` - Audio features for tracks

### Time Ranges
- `short_term`: Last 4 weeks
- `medium_term`: Last 6 months
- `long_term`: All time

## 🧩 Component Communication

```
App.vue
  └── Router
      ├── Login.vue (public)
      ├── Callback.vue (public)
      └── MainLayout.vue (protected)
          ├── Dashboard.vue
          ├── TopCharts.vue
          ├── YearInReview.vue
          ├── ListeningPulse.vue
          └── Reports.vue
```

## 📦 Dependencies

### Core
- `vue`: ^3.4.0 - Framework
- `vue-router`: ^4.2.5 - Routing
- `axios`: ^1.6.5 - HTTP client

### UI
- `@headlessui/vue`: ^1.7.16 - Unstyled components
- `@heroicons/vue`: ^2.1.1 - Icons
- `tailwindcss`: ^3.4.1 - CSS framework

### Charts
- `chart.js`: ^4.4.1 - Charting library
- `vue-chartjs`: ^5.3.0 - Vue wrapper for Chart.js

### Reports
- `jspdf`: ^2.5.1 - PDF generation
- `html2canvas`: ^1.4.1 - HTML to canvas

### Build Tools
- `vite`: ^5.0.0 - Build tool
- `@vitejs/plugin-vue`: ^5.0.0 - Vue plugin for Vite

## 🎯 Features by File

| Feature | Files Involved |
|---------|---------------|
| Authentication | `spotify.js`, `Login.vue`, `Callback.vue`, `router/index.js` |
| Dashboard Stats | `Dashboard.vue`, `spotify.js`, `analytics.js` |
| Top Charts | `TopCharts.vue`, `spotify.js`, `analytics.js` |
| Year Review | `YearInReview.vue`, `analytics.js` |
| Listening Patterns | `ListeningPulse.vue`, `analytics.js` |
| PDF Reports | `Reports.vue`, `jspdf`, `html2canvas` |
| Navigation | `MainLayout.vue`, `router/index.js` |

## 🔄 Data Flow

1. User logs in → OAuth flow → Token stored
2. Component mounts → Fetch data from Spotify API
3. Raw data → Analytics processing → Computed properties
4. Reactive data → Template rendering → Charts/UI
5. User action → New API call → Update data → Re-render


