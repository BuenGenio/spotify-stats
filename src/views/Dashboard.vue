<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="rounded-lg bg-white px-5 py-12 shadow text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green"></div>
      <p class="mt-4 text-gray-600">Loading your stats...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="rounded-lg bg-red-50 px-5 py-6 shadow">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <!-- Dashboard Content -->
    <div v-else class="space-y-6">
      <!-- Overview Stats -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div class="stat-card">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-spotify-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Top Tracks</dt>
                <dd class="text-2xl font-bold text-gray-900">{{ stats.trackCount }}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-spotify-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Top Artists</dt>
                <dd class="text-2xl font-bold text-gray-900">{{ stats.artistCount }}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-spotify-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Genres</dt>
                <dd class="text-2xl font-bold text-gray-900">{{ stats.genreCount }}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-spotify-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Diversity</dt>
                <dd class="text-2xl font-bold text-gray-900">{{ stats.diversityScore }}%</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Tracks and Artists -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Top Tracks -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Your Top Tracks</h3>
          <div class="space-y-3">
            <div 
              v-for="(track, index) in topTracks.slice(0, 5)" 
              :key="track.id"
              class="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded transition-colors"
            >
              <span class="text-lg font-bold text-gray-400 w-6">{{ index + 1 }}</span>
              <img 
                :src="track.album.images[2]?.url || track.album.images[0]?.url" 
                :alt="track.name"
                class="w-12 h-12 rounded shadow-sm"
              />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ track.name }}</p>
                <p class="text-sm text-gray-500 truncate">{{ track.artists.map(a => a.name).join(', ') }}</p>
              </div>
            </div>
          </div>
          <router-link 
            to="/tops" 
            class="mt-4 block text-center text-sm font-medium text-spotify-green hover:text-green-700"
          >
            View all tracks →
          </router-link>
        </div>

        <!-- Top Artists -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Your Top Artists</h3>
          <div class="space-y-3">
            <div 
              v-for="(artist, index) in topArtists.slice(0, 5)" 
              :key="artist.id"
              class="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded transition-colors"
            >
              <span class="text-lg font-bold text-gray-400 w-6">{{ index + 1 }}</span>
              <img 
                :src="artist.images[2]?.url || artist.images[0]?.url || '/placeholder.png'" 
                :alt="artist.name"
                class="w-12 h-12 rounded-full shadow-sm"
              />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ artist.name }}</p>
                <p class="text-sm text-gray-500 truncate">
                  {{ artist.genres.slice(0, 2).join(', ') || 'Various' }}
                </p>
              </div>
            </div>
          </div>
          <router-link 
            to="/tops" 
            class="mt-4 block text-center text-sm font-medium text-spotify-green hover:text-green-700"
          >
            View all artists →
          </router-link>
        </div>
      </div>

      <!-- Top Genres Chart -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Your Top Genres</h3>
        <div class="h-64">
          <Bar :data="genreChartData" :options="chartOptions" />
        </div>
      </div>

      <!-- Popularity Analysis -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Music Taste Analysis</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <div class="text-sm text-gray-600 mb-1">Average Popularity</div>
            <div class="text-3xl font-bold text-green-700">
              {{ Math.round(topTracks.reduce((acc, t) => acc + (t.popularity || 0), 0) / topTracks.length) }}
            </div>
            <div class="text-xs text-gray-500 mt-1">out of 100</div>
          </div>
          <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <div class="text-sm text-gray-600 mb-1">Popular Tracks</div>
            <div class="text-3xl font-bold text-blue-700">
              {{ topTracks.filter(t => t.popularity > 70).length }}
            </div>
            <div class="text-xs text-gray-500 mt-1">mainstream hits</div>
          </div>
          <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <div class="text-sm text-gray-600 mb-1">Hidden Gems</div>
            <div class="text-3xl font-bold text-purple-700">
              {{ topTracks.filter(t => t.popularity < 40).length }}
            </div>
            <div class="text-xs text-gray-500 mt-1">niche tracks</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { spotifyAPI } from '../services/spotify'
import { analytics } from '../services/analytics'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const loading = ref(true)
const error = ref('')
const topTracks = ref([])
const topArtists = ref([])
const topGenres = ref([])
const stats = ref({
  trackCount: 0,
  artistCount: 0,
  genreCount: 0,
  diversityScore: 0
})

const genreChartData = computed(() => ({
  labels: topGenres.value.slice(0, 10).map(g => g.genre),
  datasets: [{
    label: 'Tracks',
    data: topGenres.value.slice(0, 10).map(g => g.count),
    backgroundColor: '#1DB954',
    borderRadius: 8
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1
      }
    }
  }
}


onMounted(async () => {
  try {
    loading.value = true

    // Fetch data in parallel
    const [tracksData, artistsData] = await Promise.all([
      spotifyAPI.getTopTracks('medium_term', 50),
      spotifyAPI.getTopArtists('medium_term', 50)
    ])

    topTracks.value = tracksData.items
    topArtists.value = artistsData.items

    // Extract genres
    topGenres.value = analytics.extractGenres(topArtists.value)

    // Calculate stats
    stats.value = {
      trackCount: topTracks.value.length,
      artistCount: topArtists.value.length,
      genreCount: topGenres.value.length,
      diversityScore: analytics.calculateDiversityScore(
        topArtists.value.length,
        topGenres.value.length
      )
    }

    loading.value = false
  } catch (err) {
    console.error('Error loading dashboard:', err)
    error.value = 'Failed to load your stats. Please try again later.'
    loading.value = false
  }
})
</script>

