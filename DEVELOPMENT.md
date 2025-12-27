# 🛠️ Development Guide

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git
- Code editor (VS Code recommended)

### Initial Setup

```bash
# Clone or navigate to the project
cd spotify-stats

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your Spotify credentials
# Then start development server
npm run dev
```

## 📁 Project Architecture

### Technology Stack

**Frontend Framework**
- Vue 3 (Composition API)
- Vue Router 4
- Vite (build tool)

**Styling**
- Tailwind CSS
- PostCSS
- Headless UI components

**Data Visualization**
- Chart.js
- vue-chartjs

**HTTP & API**
- Axios
- Spotify Web API

**PDF Generation**
- jsPDF
- html2canvas

### Code Organization

```
src/
├── layouts/        # Reusable layouts
├── router/         # Route configuration
├── services/       # Business logic & API
├── views/          # Page components
├── App.vue         # Root component
├── main.js         # Entry point
└── style.css       # Global styles
```

## 🔧 Development Workflow

### Running the App

```bash
# Development server (hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create `.env` file:
```env
VITE_SPOTIFY_CLIENT_ID=your_client_id
VITE_SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
```

Access in code:
```js
const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID
```

## 🎨 Styling Guidelines

### Tailwind CSS

Use utility classes:
```vue
<div class="bg-white rounded-lg shadow p-6">
  <h3 class="text-lg font-medium text-gray-900">Title</h3>
</div>
```

### Custom Colors

Defined in `tailwind.config.js`:
```js
colors: {
  spotify: {
    green: '#1DB954',
    black: '#191414',
    gray: '#121212',
  }
}
```

Use in templates:
```vue
<button class="bg-spotify-green text-white">Click me</button>
```

### Custom Components

Defined in `style.css`:
```css
.btn-spotify {
  @apply bg-spotify-green hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full;
}
```

## 🔌 API Integration

### Spotify Service (`services/spotify.js`)

#### Authentication
```js
import { spotifyAuth } from '@/services/spotify'

// Login
spotifyAuth.login()

// Check if logged in
if (spotifyAuth.isTokenValid()) {
  // User is authenticated
}

// Logout
spotifyAuth.logout()
```

#### API Calls
```js
import { spotifyAPI } from '@/services/spotify'

// Get top tracks
const tracks = await spotifyAPI.getTopTracks('medium_term', 50)

// Get top artists
const artists = await spotifyAPI.getTopArtists('short_term', 20)

// Get recently played
const recent = await spotifyAPI.getRecentlyPlayed(50)

// Get audio features
const features = await spotifyAPI.getAudioFeatures(['track_id_1', 'track_id_2'])
```

### Analytics Service (`services/analytics.js`)

```js
import { analytics } from '@/services/analytics'

// Extract genres from artists
const genres = analytics.extractGenres(artists)

// Analyze audio features
const profile = analytics.analyzeAudioFeatures(audioFeatures)

// Analyze listening patterns
const patterns = analytics.analyzeListeningPatterns(recentTracks)

// Calculate diversity score
const score = analytics.calculateDiversityScore(artistCount, genreCount)
```

## 📊 Adding Charts

### Import Chart Components
```vue
<script setup>
import { Bar, Line, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

// Register components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
</script>
```

### Create Chart Data
```vue
<script setup>
import { computed } from 'vue'

const chartData = computed(() => ({
  labels: ['Jan', 'Feb', 'Mar'],
  datasets: [{
    label: 'Tracks',
    data: [10, 20, 30],
    backgroundColor: '#1DB954'
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}
</script>
```

### Render Chart
```vue
<template>
  <div class="h-64">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
```

## 🧩 Creating New Views

### 1. Create View File

`src/views/MyNewView.vue`:
```vue
<template>
  <div>
    <div v-if="loading" class="text-center">Loading...</div>
    <div v-else>
      <!-- Your content -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { spotifyAPI } from '../services/spotify'

const loading = ref(true)
const data = ref(null)

onMounted(async () => {
  try {
    loading.value = true
    data.value = await spotifyAPI.getSomeData()
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
})
</script>
```

### 2. Add Route

`src/router/index.js`:
```js
{
  path: '/my-view',
  name: 'MyNewView',
  component: () => import('../views/MyNewView.vue')
}
```

### 3. Add Navigation Link

`src/layouts/MainLayout.vue`:
```js
const navigation = [
  // ... existing items
  { name: 'My View', path: '/my-view' }
]
```

## 🎯 Best Practices

### Vue Composition API

```vue
<script setup>
import { ref, computed, watch, onMounted } from 'vue'

// Reactive state
const count = ref(0)

// Computed properties
const doubled = computed(() => count.value * 2)

// Watchers
watch(count, (newVal) => {
  console.log('Count changed:', newVal)
})

// Lifecycle hooks
onMounted(() => {
  console.log('Component mounted')
})
</script>
```

### Error Handling

```js
const loadData = async () => {
  try {
    loading.value = true
    const data = await spotifyAPI.getData()
    // Process data
  } catch (error) {
    console.error('Error loading data:', error)
    errorMessage.value = 'Failed to load data'
  } finally {
    loading.value = false
  }
}
```

### Loading States

```vue
<template>
  <div v-if="loading" class="text-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green mx-auto"></div>
    <p class="mt-4 text-gray-600">Loading...</p>
  </div>
  
  <div v-else-if="error" class="text-red-600">
    {{ error }}
  </div>
  
  <div v-else>
    <!-- Content -->
  </div>
</template>
```

### Responsive Design

```vue
<!-- Mobile first approach -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- Items -->
</div>

<!-- Hide on mobile, show on desktop -->
<div class="hidden md:block">Desktop only</div>

<!-- Show on mobile, hide on desktop -->
<div class="md:hidden">Mobile only</div>
```

## 🐛 Debugging

### Vue DevTools
Install the Vue DevTools browser extension for debugging:
- Inspect component hierarchy
- View reactive state
- Track events
- Monitor performance

### Console Logging
```js
// Debug API responses
const data = await spotifyAPI.getTopTracks()
console.log('Top tracks:', data)

// Debug computed properties
watch(computedValue, (newVal) => {
  console.log('Computed changed:', newVal)
})
```

### Network Tab
- Monitor API calls
- Check request/response
- Verify authentication headers
- Debug CORS issues

## 🧪 Testing Tips

### Manual Testing Checklist

1. **Authentication**
   - [ ] Login flow works
   - [ ] Token stored correctly
   - [ ] Logout clears token
   - [ ] Expired token handled

2. **Data Loading**
   - [ ] All views load data
   - [ ] Loading states show
   - [ ] Errors handled gracefully
   - [ ] Empty states handled

3. **Charts**
   - [ ] Charts render correctly
   - [ ] Data updates properly
   - [ ] Responsive on resize
   - [ ] No console errors

4. **Navigation**
   - [ ] All routes work
   - [ ] Active states correct
   - [ ] Mobile menu works
   - [ ] Back button works

5. **Reports**
   - [ ] PDF generates
   - [ ] Preview shows correctly
   - [ ] Download works
   - [ ] Options apply

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

Output in `dist/` directory.

### Deploy to Netlify

1. Connect your Git repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Update Spotify Redirect URI to your domain

### Deploy to Vercel

1. Import project
2. Framework: Vite
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variables
6. Update Spotify Redirect URI

### Important: Update Redirect URI

After deployment, update in:
1. Spotify Developer Dashboard
2. Your `.env` file (or hosting env vars)

Example:
```env
VITE_SPOTIFY_REDIRECT_URI=https://yourdomain.com/callback
```

## 📚 Resources

### Documentation
- [Vue 3 Docs](https://vuejs.org/)
- [Vite Docs](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Chart.js](https://www.chartjs.org/)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)

### Tools
- [Vue DevTools](https://devtools.vuejs.org/)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (VS Code Vue extension)

## 💡 Tips & Tricks

### Hot Module Replacement
Vite supports HMR - changes appear instantly without full reload.

### Import Aliases
Use `@` for src directory:
```js
import { spotifyAPI } from '@/services/spotify'
```

### Environment-Specific Code
```js
if (import.meta.env.DEV) {
  console.log('Development mode')
}

if (import.meta.env.PROD) {
  // Production only code
}
```

### Lazy Loading Routes
Already implemented - routes load on demand:
```js
component: () => import('../views/Dashboard.vue')
```

### Optimizing Bundle Size
- Use lazy loading
- Import only what you need
- Check bundle analyzer
- Remove unused dependencies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 Code Style

- Use Composition API
- Use `<script setup>` syntax
- Use Tailwind utilities
- Follow Vue style guide
- Comment complex logic
- Use meaningful variable names

---

Happy coding! 🎉

