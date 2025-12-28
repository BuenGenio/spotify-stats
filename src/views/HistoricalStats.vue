<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="rounded-lg bg-white px-5 py-12 shadow text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green"></div>
      <p class="mt-4 text-gray-600">Analyzing your complete listening history...</p>
    </div>

    <!-- No Data State -->
    <div v-else-if="!hasData" class="rounded-lg bg-white px-5 py-12 shadow text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">No Historical Data</h3>
      <p class="mt-1 text-sm text-gray-500">Import your Spotify extended history to see complete analytics with play counts!</p>
      <div class="mt-6">
        <router-link to="/import" class="btn-spotify">
          📤 Import History Data
        </router-link>
      </div>
    </div>

    <!-- Content -->
    <div v-else class="space-y-6">
      <!-- Summary Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="stat-card">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-spotify-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Plays</dt>
                <dd class="text-2xl font-bold text-gray-900">{{ summary.totalPlays.toLocaleString() }}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-spotify-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Time</dt>
                <dd class="text-2xl font-bold text-gray-900">{{ summary.totalDays }}d {{ summary.totalHours % 24 }}h</dd>
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
                <dt class="text-sm font-medium text-gray-500 truncate">Unique Tracks</dt>
                <dd class="text-2xl font-bold text-gray-900">{{ summary.uniqueTracks.toLocaleString() }}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-8 w-8 text-spotify-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Unique Artists</dt>
                <dd class="text-2xl font-bold text-gray-900">{{ summary.uniqueArtists.toLocaleString() }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Date Range Info -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p class="text-sm text-blue-700">
          📅 Analyzing <strong>{{ summary.yearsCovered }} years</strong> of listening history from 
          <strong>{{ new Date(summary.oldestDate).toLocaleDateString() }}</strong> to 
          <strong>{{ new Date(summary.newestDate).toLocaleDateString() }}</strong>
          ({{ summary.daysCovered.toLocaleString() }} days, averaging {{ summary.averagePerDay }} plays per day)
        </p>
      </div>

      <!-- Top Tracks with Play Counts -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">🎵 Your Most Played Tracks (With Actual Play Counts!)</h3>
        <div class="space-y-2">
          <div
            v-for="track in topTracks.slice(0, 20)"
            :key="track.uri"
            class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div class="flex items-center space-x-4 flex-1 min-w-0">
              <span class="text-xl font-bold text-gray-400 w-8 text-center">{{ track.rank }}</span>
              <img
                v-if="track.image"
                :src="track.image"
                :alt="track.name"
                class="w-12 h-12 rounded shadow-sm flex-shrink-0"
                @error="track.image = null"
              />
              <div v-else class="w-12 h-12 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                <svg class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ track.name || 'Unknown Track' }}</p>
                <p class="text-sm text-gray-500 truncate">{{ track.artist || 'Unknown Artist' }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-right">
                <div class="text-lg font-bold text-spotify-green">{{ track.playCount }}</div>
                <div class="text-xs text-gray-500">plays</div>
              </div>
              <div class="text-right">
                <div class="text-sm text-gray-600">{{ track.totalMinutes }}m</div>
                <div class="text-xs text-gray-500">listened</div>
              </div>
              <div class="text-right">
                <div class="text-sm text-gray-600">{{ track.skipRate }}%</div>
                <div class="text-xs text-gray-500">skip rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Artists with Play Counts -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">🎤 Your Most Played Artists</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="artist in topArtists.slice(0, 12)"
            :key="artist.name"
            class="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
          >
            <div class="flex items-start justify-between mb-2">
              <div class="text-2xl font-bold text-spotify-green">#{{ artist.rank }}</div>
              <div class="text-right">
                <div class="text-2xl font-bold text-gray-900">{{ artist.playCount }}</div>
                <div class="text-xs text-gray-500">plays</div>
              </div>
            </div>
            <div class="flex items-center space-x-3 mb-2">
              <img
                v-if="artist.image"
                :src="artist.image"
                :alt="artist.name"
                class="w-12 h-12 rounded-full shadow-sm flex-shrink-0"
                @error="artist.image = null"
              />
              <div v-else class="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center">
                <svg class="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h4 class="font-medium text-gray-900 truncate flex-1">{{ artist.name }}</h4>
            </div>
            <p class="text-sm text-gray-500">{{ artist.uniqueTracks }} unique tracks</p>
            <p class="text-sm text-gray-500">{{ artist.totalMinutes.toLocaleString() }} minutes</p>
          </div>
        </div>
      </div>

      <!-- Year by Year Stats -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">📅 Year by Year</h3>
        <div class="h-64">
          <Bar :data="yearlyChartData" :options="yearlyChartOptions" />
        </div>
        <div class="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <div v-for="year in yearlyStats" :key="year.year" class="bg-gray-50 rounded p-3 text-center">
            <div class="text-lg font-bold text-gray-900">{{ year.year }}</div>
            <div class="text-sm text-gray-600">{{ year.plays.toLocaleString() }} plays</div>
            <div class="text-xs text-gray-500">{{ year.totalHours }}h</div>
          </div>
        </div>
      </div>

      <!-- Skip Analysis -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">⏭️ Skip Behavior</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <div class="text-sm text-gray-600 mb-1">Completion Rate</div>
            <div class="text-4xl font-bold text-green-700">{{ skipStats.completionRate }}%</div>
            <div class="text-xs text-gray-500 mt-1">{{ skipStats.completed.toLocaleString() }} tracks completed</div>
          </div>
          <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4">
            <div class="text-sm text-gray-600 mb-1">Skip Rate</div>
            <div class="text-4xl font-bold text-red-700">{{ skipStats.skipRate }}%</div>
            <div class="text-xs text-gray-500 mt-1">{{ skipStats.skipped.toLocaleString() }} tracks skipped</div>
          </div>
          <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <div class="text-sm text-gray-600 mb-1">Total Plays</div>
            <div class="text-4xl font-bold text-blue-700">{{ skipStats.totalPlays.toLocaleString() }}</div>
            <div class="text-xs text-gray-500 mt-1">complete + skipped</div>
          </div>
        </div>
      </div>

      <!-- Listening Streaks -->
      <div v-if="streaks" class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">🔥 Listening Streaks</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 text-center">
            <div class="text-sm text-gray-600 mb-2">Current Streak</div>
            <div class="text-5xl font-bold text-orange-700">{{ streaks.current }}</div>
            <div class="text-sm text-gray-500 mt-2">days</div>
          </div>
          <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 text-center">
            <div class="text-sm text-gray-600 mb-2">Longest Streak</div>
            <div class="text-5xl font-bold text-purple-700">{{ streaks.longest }}</div>
            <div class="text-sm text-gray-500 mt-2">days</div>
          </div>
        </div>
      </div>

      <!-- Platforms -->
      <div v-if="platforms.length > 0" class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">💻 Listening Platforms</h3>
        <div class="space-y-3">
          <div v-for="platform in platforms.slice(0, 5)" :key="platform.platform" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">{{ platform.platform }}</p>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-right">
                <div class="text-lg font-bold text-spotify-green">{{ platform.plays.toLocaleString() }}</div>
                <div class="text-xs text-gray-500">plays</div>
              </div>
              <div class="text-right">
                <div class="text-sm text-gray-600">{{ platform.totalMinutes.toLocaleString() }}m</div>
                <div class="text-xs text-gray-500">listened</div>
              </div>
            </div>
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
import { db } from '../services/db'
import { historyAnalytics } from '../services/historyAnalytics'
import { spotifyAPI, spotifyAuth } from '../services/spotify'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const loading = ref(true)
const hasData = ref(false)
const summary = ref({})
const topTracks = ref([])
const topArtists = ref([])
const yearlyStats = ref([])
const skipStats = ref({})
const streaks = ref(null)
const platforms = ref([])
const loadingImages = ref(false)

const yearlyChartData = computed(() => ({
  labels: yearlyStats.value.map(y => y.year.toString()),
  datasets: [{
    label: 'Plays per Year',
    data: yearlyStats.value.map(y => y.plays),
    backgroundColor: '#1DB954',
    borderRadius: 8
  }]
}))

const yearlyChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

const fetchTrackAndArtistImages = async () => {
  try {
    console.log('Fetching track and artist images...')

    // Fetch track images
    const trackUris = topTracks.value
      .slice(0, 20)
      .map(t => t.uri)
      .filter(Boolean)

    if (trackUris.length > 0) {
      try {
        const tracksData = await spotifyAPI.getTracks(trackUris)
        const trackMap = new Map()
        
        tracksData.tracks.forEach(track => {
          if (track?.album?.images?.[0]) {
            trackMap.set(track.uri || `spotify:track:${track.id}`, track.album.images[1]?.url || track.album.images[0].url)
          }
        })

        // Add images to tracks
        topTracks.value.forEach(track => {
          const image = trackMap.get(track.uri)
          if (image) {
            track.image = image
          }
          // Also try matching by track ID extracted from URI
          if (!image && track.uri) {
            const trackId = track.uri.replace('spotify:track:', '')
            const foundTrack = tracksData.tracks.find(t => t.id === trackId)
            if (foundTrack?.album?.images?.[0]) {
              track.image = foundTrack.album.images[1]?.url || foundTrack.album.images[0].url
            }
          }
        })

        console.log(`✓ Fetched ${trackMap.size} track images`)
      } catch (error) {
        console.warn('Failed to fetch track images:', error)
      }
    }

    // Fetch artist images
    const artistNames = topArtists.value
      .slice(0, 12)
      .map(a => a.name)
      .filter(Boolean)

    if (artistNames.length > 0) {
      try {
        const artistMap = await spotifyAPI.searchArtists(artistNames)
        
        // Add images to artists
        topArtists.value.forEach(artist => {
          const artistData = artistMap.get(artist.name)
          if (artistData?.images?.[0]) {
            artist.image = artistData.images[1]?.url || artistData.images[0].url
          }
        })

        console.log(`✓ Fetched ${artistMap.size} artist images`)
      } catch (error) {
        console.warn('Failed to fetch artist images:', error)
      }
    }

  } catch (error) {
    console.error('Error fetching images:', error)
  }
}

onMounted(async () => {
  try {
    loading.value = true

    const stats = await db.getStats()
    if (!stats.hasData) {
      hasData.value = false
      loading.value = false
      return
    }

    hasData.value = true

    // Get all records
    console.log('Loading all records...')
    const allRecords = await db.getAll()
    console.log(`✓ Loaded ${allRecords.length} records`)

    // Analyze data
    summary.value = historyAnalytics.getCompleteSummary(allRecords)
    topTracks.value = historyAnalytics.getTopTracks(allRecords, 50)
    topArtists.value = historyAnalytics.getTopArtists(allRecords, 50)
    yearlyStats.value = historyAnalytics.getYearlyStats(allRecords)
    skipStats.value = historyAnalytics.analyzeSkipBehavior(allRecords)
    streaks.value = historyAnalytics.getListeningStreaks(allRecords)
    platforms.value = historyAnalytics.analyzePlatforms(allRecords)

    console.log('✓ Analysis complete')

    // Fetch images if user is authenticated
    if (spotifyAuth.isTokenValid()) {
      loadingImages.value = true
      await fetchTrackAndArtistImages()
      loadingImages.value = false
    }

    loading.value = false
  } catch (error) {
    console.error('Error loading historical stats:', error)
    loading.value = false
  }
})
</script>

