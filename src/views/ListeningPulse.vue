<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="rounded-lg bg-white px-5 py-12 shadow text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green"></div>
    </div>

    <!-- Content -->
    <div v-else class="space-y-6">
      <!-- Info Banner -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3 flex-1">
            <p class="text-sm text-blue-700">
              <strong>Note:</strong> This view shows your last 50 played tracks from Spotify's recent history. 
              If you haven't listened to much recently, the calendar may only show 1-2 days of data. 
              The more you listen, the more historical data will appear!
            </p>
          </div>
        </div>
      </div>

      <!-- Listening Patterns -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Your Listening Patterns</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-gradient-to-br from-spotify-green to-green-600 rounded-lg p-6 text-white">
            <div class="text-sm opacity-90 mb-1">Peak Listening Time</div>
            <div class="text-3xl font-bold">{{ patterns.peakHour }}</div>
          </div>
          <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div class="text-sm opacity-90 mb-1">Most Active Day</div>
            <div class="text-3xl font-bold">{{ patterns.peakDay }}</div>
          </div>
        </div>
      </div>

      <!-- Hour Distribution Chart -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Listening by Hour of Day</h3>
        <div class="h-64">
          <Line :data="hourChartData" :options="lineChartOptions" />
        </div>
      </div>

      <!-- Day Distribution Chart -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Listening by Day of Week</h3>
        <div class="h-64">
          <Bar :data="dayChartData" :options="barChartOptions" />
        </div>
      </div>

      <!-- Recently Played -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Recently Played</h3>
          <span class="text-xs text-gray-500">Last {{ recentTracks.length }} tracks</span>
        </div>
        <div class="space-y-2">
          <div
            v-for="item in recentTracks.slice(0, 10)"
            :key="item.played_at"
            class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div class="flex items-center space-x-3 flex-1 min-w-0">
              <img
                :src="item.track.album.images[2]?.url"
                :alt="item.track.name"
                class="w-12 h-12 rounded shadow-sm"
              />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ item.track.name }}</p>
                <p class="text-sm text-gray-500 truncate">{{ item.track.artists.map(a => a.name).join(', ') }}</p>
              </div>
            </div>
            <div class="text-sm text-gray-400 ml-4">
              {{ formatPlayedAt(item.played_at) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Activity Calendar -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="mb-4">
          <h3 class="text-lg font-medium text-gray-900">Recent Activity Calendar</h3>
          <p class="text-xs text-gray-500 mt-1">Based on your last {{ recentTracks.length }} played tracks ({{ getDateRange() }})</p>
        </div>
        <div class="grid grid-cols-7 gap-2">
          <div v-for="day in calendarDays" :key="day.date" class="text-center">
            <div class="text-xs text-gray-500 mb-1">{{ day.dayName }}</div>
            <div
              class="aspect-square rounded flex items-center justify-center text-xs font-medium"
              :class="getActivityColor(day.count)"
              :title="`${day.count} tracks on ${day.date}`"
            >
              {{ day.count > 0 ? day.count : '' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Line, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { spotifyAPI } from '../services/spotify'
import { analytics } from '../services/analytics'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const loading = ref(true)
const recentTracks = ref([])
const patterns = ref({
  peakHour: '',
  peakDay: '',
  hourDistribution: [],
  dayDistribution: []
})

const hourChartData = computed(() => ({
  labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
  datasets: [{
    label: 'Tracks Played',
    data: patterns.value.hourDistribution,
    borderColor: '#1DB954',
    backgroundColor: 'rgba(29, 185, 84, 0.1)',
    fill: true,
    tension: 0.4
  }]
}))

const dayChartData = computed(() => ({
  labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  datasets: [{
    label: 'Tracks Played',
    data: patterns.value.dayDistribution,
    backgroundColor: '#1DB954',
    borderRadius: 8
  }]
}))

const lineChartOptions = {
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

const barChartOptions = {
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

const calendarDays = computed(() => {
  const days = []
  const today = new Date()
  
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateKey = date.toISOString().split('T')[0]
    const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]
    
    const dayTracks = recentTracks.value.filter(item => {
      const playedDate = new Date(item.played_at).toISOString().split('T')[0]
      return playedDate === dateKey
    })
    
    days.push({
      date: dateKey,
      dayName,
      count: dayTracks.length
    })
  }
  
  return days
})

const formatPlayedAt = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

const getActivityColor = (count) => {
  if (count === 0) return 'bg-gray-100'
  if (count < 3) return 'bg-green-200'
  if (count < 6) return 'bg-green-400'
  if (count < 10) return 'bg-green-600 text-white'
  return 'bg-spotify-green text-white'
}

const getDateRange = () => {
  if (recentTracks.value.length === 0) return 'No data'
  
  const dates = recentTracks.value.map(item => new Date(item.played_at))
  const oldest = new Date(Math.min(...dates))
  const newest = new Date(Math.max(...dates))
  
  const diffMs = newest - oldest
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffHours < 1) return 'last hour'
  if (diffHours < 24) return `last ${diffHours} hours`
  if (diffDays < 2) return 'last day'
  return `last ${diffDays} days`
}

onMounted(async () => {
  try {
    loading.value = true

    // Spotify only returns max 50 recently played tracks
    const recentData = await spotifyAPI.getRecentlyPlayed(50)
    recentTracks.value = recentData.items

    console.log('=== LISTENING PULSE DATA ===')
    console.log('Tracks fetched:', recentTracks.value.length)
    
    if (recentTracks.value.length > 0) {
      const dates = recentTracks.value.map(item => new Date(item.played_at))
      const oldest = new Date(Math.min(...dates))
      const newest = new Date(Math.max(...dates))
      console.log('Date range:', oldest.toLocaleString(), 'to', newest.toLocaleString())
      console.log('Days covered:', Math.floor((newest - oldest) / 86400000))
    }

    patterns.value = analytics.analyzeListeningPatterns(recentTracks.value)

    loading.value = false
  } catch (error) {
    console.error('Error loading listening data:', error)
    loading.value = false
  }
})
</script>

