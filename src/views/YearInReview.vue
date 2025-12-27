<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="rounded-lg bg-white px-5 py-12 shadow text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green"></div>
      <p class="mt-4 text-gray-600">Generating your year in music...</p>
    </div>

    <!-- Year Review Content -->
    <div v-else class="space-y-6">
      <!-- Hero Section -->
      <div class="bg-gradient-to-r from-spotify-green to-green-600 rounded-lg shadow-xl p-8 text-white">
        <h2 class="text-4xl font-bold mb-2">Your {{ currentYear }} in Music</h2>
        <p class="text-xl opacity-90">A look back at your listening journey</p>
      </div>

      <!-- Listening Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <div class="text-5xl font-bold text-spotify-green mb-2">{{ yearStats.totalMinutes.toLocaleString() }}</div>
          <div class="text-gray-600">Minutes Listened</div>
          <div class="text-sm text-gray-400 mt-1">≈ {{ Math.round(yearStats.totalMinutes / 60) }} hours</div>
        </div>
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <div class="text-5xl font-bold text-spotify-green mb-2">{{ yearStats.trackCount }}</div>
          <div class="text-gray-600">Different Tracks</div>
        </div>
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <div class="text-5xl font-bold text-spotify-green mb-2">{{ yearStats.artistCount }}</div>
          <div class="text-gray-600">Different Artists</div>
        </div>
      </div>

      <!-- Top Track -->
      <div class="bg-white rounded-lg shadow p-8" v-if="yearStats.topTrack">
        <h3 class="text-2xl font-bold text-gray-900 mb-4">🎵 Your Most Played Track</h3>
        <div class="flex items-center space-x-6">
          <img
            :src="yearStats.topTrack.album.images[0]?.url"
            :alt="yearStats.topTrack.name"
            class="w-32 h-32 rounded-lg shadow-lg"
          />
          <div>
            <h4 class="text-3xl font-bold text-gray-900">{{ yearStats.topTrack.name }}</h4>
            <p class="text-xl text-gray-600 mt-2">{{ yearStats.topTrack.artists.map(a => a.name).join(', ') }}</p>
            <p class="text-gray-500 mt-1">{{ yearStats.topTrack.album.name }}</p>
          </div>
        </div>
      </div>

      <!-- Top Artist -->
      <div class="bg-white rounded-lg shadow p-8" v-if="yearStats.topArtist">
        <h3 class="text-2xl font-bold text-gray-900 mb-4">🎤 Your Top Artist</h3>
        <div class="flex items-center space-x-6">
          <img
            :src="yearStats.topArtist.images[0]?.url"
            :alt="yearStats.topArtist.name"
            class="w-32 h-32 rounded-full shadow-lg"
          />
          <div>
            <h4 class="text-3xl font-bold text-gray-900">{{ yearStats.topArtist.name }}</h4>
            <p class="text-xl text-gray-600 mt-2 capitalize">{{ yearStats.topArtist.genres.slice(0, 3).join(', ') }}</p>
            <div class="mt-3 flex items-center space-x-2">
              <span class="text-sm text-gray-500">Popularity:</span>
              <div class="flex-1 max-w-xs bg-gray-200 rounded-full h-2">
                <div
                  class="bg-spotify-green h-2 rounded-full"
                  :style="{ width: `${yearStats.topArtist.popularity}%` }"
                ></div>
              </div>
              <span class="text-sm font-medium text-gray-700">{{ yearStats.topArtist.popularity }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Genres -->
      <div class="bg-white rounded-lg shadow p-8">
        <h3 class="text-2xl font-bold text-gray-900 mb-4">🎸 Your Top Genres</h3>
        <div class="flex flex-wrap gap-3">
          <span
            v-for="(genre, index) in yearStats.topGenres"
            :key="genre.genre"
            class="px-4 py-2 rounded-full font-medium"
            :class="index === 0 ? 'bg-spotify-green text-white text-lg' : 'bg-gray-100 text-gray-700'"
          >
            {{ genre.genre }}
          </span>
        </div>
      </div>

      <!-- Track Duration Analysis -->
      <div class="bg-white rounded-lg shadow p-8">
        <h3 class="text-2xl font-bold text-gray-900 mb-6">⏱️ Your Listening Habits</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4">
            <div class="text-sm text-gray-600 mb-1">Average Track Length</div>
            <div class="text-3xl font-bold text-indigo-700">
              {{ Math.round(yearStats.topTrack ? (topTracks.reduce((acc, t) => acc + t.duration_ms, 0) / topTracks.length / 60000) : 0) }}m
            </div>
            <div class="text-xs text-gray-500 mt-1">minutes per track</div>
          </div>
          <div class="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4">
            <div class="text-sm text-gray-600 mb-1">Longest Track</div>
            <div class="text-3xl font-bold text-pink-700">
              {{ Math.round(Math.max(...topTracks.map(t => t.duration_ms)) / 60000) }}m
            </div>
            <div class="text-xs text-gray-500 mt-1">{{ topTracks.reduce((max, t) => t.duration_ms > max.duration_ms ? t : max, topTracks[0])?.name.substring(0, 20) }}...</div>
          </div>
          <div class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4">
            <div class="text-sm text-gray-600 mb-1">Total Listening Time</div>
            <div class="text-3xl font-bold text-amber-700">
              {{ Math.round(yearStats.totalMinutes / 60) }}h
            </div>
            <div class="text-xs text-gray-500 mt-1">hours of music</div>
          </div>
        </div>
      </div>

      <!-- Popularity Analysis -->
      <div class="bg-white rounded-lg shadow p-8" v-if="yearStats.popularityTrend">
        <h3 class="text-2xl font-bold text-gray-900 mb-4">📊 Your Music Taste</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <div class="text-3xl font-bold text-green-700">{{ yearStats.popularityTrend.mainstream }}%</div>
            <div class="text-sm text-gray-600 mt-1">Mainstream</div>
          </div>
          <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <div class="text-3xl font-bold text-blue-700">{{ yearStats.popularityTrend.average }}</div>
            <div class="text-sm text-gray-600 mt-1">Average Popularity</div>
          </div>
          <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <div class="text-3xl font-bold text-purple-700">{{ yearStats.popularityTrend.niche }}</div>
            <div class="text-sm text-gray-600 mt-1">Hidden Gems</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { spotifyAPI } from '../services/spotify'
import { analytics } from '../services/analytics'

const loading = ref(true)
const yearStats = ref({})
const topTracks = ref([])
const currentYear = new Date().getFullYear()

onMounted(async () => {
  try {
    loading.value = true

    // Fetch all time data for year review
    const [tracksData, artistsData] = await Promise.all([
      spotifyAPI.getTopTracks('long_term', 50),
      spotifyAPI.getTopArtists('long_term', 50)
    ])

    topTracks.value = tracksData.items
    yearStats.value = analytics.generateYearStats(
      tracksData.items,
      artistsData.items
    )

    loading.value = false
  } catch (error) {
    console.error('Error loading year review:', error)
    loading.value = false
  }
})
</script>

