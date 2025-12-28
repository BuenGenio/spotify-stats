<template>
  <div>
    <!-- Time Range Selector -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="flex space-x-2">
        <button
          v-for="range in timeRanges"
          :key="range.value"
          @click="selectedTimeRange = range.value"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors',
            selectedTimeRange === range.value
              ? 'bg-spotify-green text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ range.label }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="rounded-lg bg-white px-5 py-12 shadow text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green"></div>
    </div>

    <!-- Content Tabs -->
    <div v-else>
      <div class="border-b border-gray-200 mb-6">
        <nav class="-mb-px flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
              activeTab === tab.id
                ? 'border-spotify-green text-spotify-green'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Tracks Tab -->
      <div v-show="activeTab === 'tracks'" class="space-y-4">
        <div class="bg-white rounded-lg shadow">
          <div class="p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Your Top {{ topTracks.length }} Tracks</h3>
            <div class="space-y-2">
              <div
                v-for="(track, index) in topTracks"
                :key="track.id"
                class="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <span class="text-xl font-bold text-gray-400 w-8 text-center">{{ index + 1 }}</span>
                <img
                  :src="track.album.images[2]?.url || track.album.images[0]?.url"
                  :alt="track.name"
                  class="w-16 h-16 rounded shadow"
                />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ track.name }}</p>
                  <p class="text-sm text-gray-500 truncate">{{ track.artists.map(a => a.name).join(', ') }}</p>
                  <p class="text-xs text-gray-400 truncate">{{ track.album.name }}</p>
                </div>
                <div class="text-right">
                  <div class="flex items-center space-x-2">
                    <div class="text-sm text-gray-500">{{ formatDuration(track.duration_ms) }}</div>
                    <div class="w-12 text-sm text-gray-400">
                      {{ track.popularity }}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Artists Tab -->
      <div v-show="activeTab === 'artists'" class="space-y-4">
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Your Top {{ topArtists.length }} Artists</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="(artist, index) in topArtists"
              :key="artist.id"
              class="relative group"
            >
              <div class="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                <div class="absolute top-2 left-2 bg-spotify-green text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm z-10">
                  {{ index + 1 }}
                </div>
                <img
                  :src="artist.images[1]?.url || artist.images[0]?.url || '/placeholder.png'"
                  :alt="artist.name"
                  class="w-full aspect-square object-cover rounded-lg shadow mb-3"
                />
                <h4 class="font-medium text-gray-900 truncate">{{ artist.name }}</h4>
                <p class="text-sm text-gray-500 truncate">
                  {{ artist.genres.slice(0, 2).join(', ') || 'Various genres' }}
                </p>
                <div class="mt-2 flex items-center justify-between">
                  <span class="text-xs text-gray-400">Popularity</span>
                  <span class="text-sm font-medium text-gray-700">{{ artist.popularity }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Genres Tab -->
      <div v-show="activeTab === 'genres'" class="space-y-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Genre Chart -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Top Genres Distribution</h3>
            <div class="h-80">
              <Doughnut :data="genrePieData" :options="pieOptions" />
            </div>
          </div>

          <!-- Genre List -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Genre Breakdown</h3>
            <div class="space-y-3">
              <div v-for="(genre, index) in topGenres.slice(0, 15)" :key="genre.genre" class="flex items-center justify-between">
                <div class="flex items-center space-x-3 flex-1">
                  <span class="text-sm font-bold text-gray-400 w-6">{{ index + 1 }}</span>
                  <span class="text-sm font-medium text-gray-900 capitalize truncate">{{ genre.genre }}</span>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      class="bg-spotify-green h-2 rounded-full"
                      :style="{ width: `${(genre.count / topGenres[0].count) * 100}%` }"
                    ></div>
                  </div>
                  <span class="text-sm text-gray-500 w-8 text-right">{{ genre.count }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { Bar, Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { spotifyAPI } from '../services/spotify'
import { analytics } from '../services/analytics'

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const loading = ref(true)
const activeTab = ref('tracks')
const selectedTimeRange = ref('medium_term')

const tabs = [
  { id: 'tracks', name: 'Tracks' },
  { id: 'artists', name: 'Artists' },
  { id: 'genres', name: 'Genres' }
]

const timeRanges = [
  { label: 'Last 4 Weeks', value: 'short_term' },
  { label: 'Last 6 Months', value: 'medium_term' },
  { label: 'All Time', value: 'long_term' }
]

const topTracks = ref([])
const topArtists = ref([])
const topGenres = ref([])

const genrePieData = computed(() => ({
  labels: topGenres.value.slice(0, 10).map(g => g.genre),
  datasets: [{
    data: topGenres.value.slice(0, 10).map(g => g.count),
    backgroundColor: [
      '#1DB954', '#1ed760', '#1aa34a', '#169c46', '#128a3e',
      '#0e7835', '#0a662c', '#065423', '#03421a', '#013011'
    ]
  }]
}))

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
}

const formatDuration = (ms) => {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const loadData = async () => {
  try {
    loading.value = true

    const [tracksData, artistsData] = await Promise.all([
      spotifyAPI.getTopTracks(selectedTimeRange.value, 50),
      spotifyAPI.getTopArtists(selectedTimeRange.value, 50)
    ])

    topTracks.value = tracksData.items
    topArtists.value = artistsData.items
    topGenres.value = analytics.extractGenres(topArtists.value)

    loading.value = false
  } catch (error) {
    console.error('Error loading data:', error)
    loading.value = false
  }
}

watch(selectedTimeRange, loadData)

onMounted(loadData)
</script>



