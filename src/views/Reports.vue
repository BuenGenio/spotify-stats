<template>
  <div>
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Generate Your Listening Report</h3>
      <p class="text-gray-600 mb-6">
        Create a comprehensive PDF report of your Spotify listening statistics, including your top tracks, artists, genres, and listening patterns.
      </p>

      <!-- Report Options -->
      <div class="space-y-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
          <select
            v-model="selectedTimeRange"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-spotify-green focus:border-spotify-green rounded-md"
          >
            <option value="short_term">Last 4 Weeks</option>
            <option value="medium_term">Last 6 Months</option>
            <option value="long_term">All Time</option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Include in Report</label>
          <div class="space-y-2">
            <label class="flex items-center">
              <input v-model="reportOptions.topTracks" type="checkbox" class="rounded text-spotify-green focus:ring-spotify-green" />
              <span class="ml-2 text-sm text-gray-700">Top Tracks</span>
            </label>
            <label class="flex items-center">
              <input v-model="reportOptions.topArtists" type="checkbox" class="rounded text-spotify-green focus:ring-spotify-green" />
              <span class="ml-2 text-sm text-gray-700">Top Artists</span>
            </label>
            <label class="flex items-center">
              <input v-model="reportOptions.topGenres" type="checkbox" class="rounded text-spotify-green focus:ring-spotify-green" />
              <span class="ml-2 text-sm text-gray-700">Top Genres</span>
            </label>
            <label class="flex items-center">
              <input v-model="reportOptions.listeningPatterns" type="checkbox" class="rounded text-spotify-green focus:ring-spotify-green" />
              <span class="ml-2 text-sm text-gray-700">Listening Patterns</span>
            </label>
          </div>
        </div>
      </div>

      <button
        @click="generateReport"
        :disabled="generating"
        class="btn-spotify w-full sm:w-auto"
      >
        <span v-if="!generating">📄 Generate PDF Report</span>
        <span v-else class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Generating...
        </span>
      </button>
    </div>

    <!-- Report Preview -->
    <div v-if="previewData" class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Report Preview</h3>
      
      <div ref="reportContent" class="space-y-6 p-6 bg-gray-50 rounded-lg">
        <!-- Header -->
        <div class="text-center border-b pb-6">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Spotify Listening Report</h1>
          <p class="text-gray-600">{{ getTimeRangeLabel(selectedTimeRange) }}</p>
          <p class="text-sm text-gray-500">Generated on {{ new Date().toLocaleDateString() }}</p>
        </div>

        <!-- Summary Stats -->
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center p-4 bg-white rounded-lg">
            <div class="text-2xl font-bold text-spotify-green">{{ previewData.summary.tracks }}</div>
            <div class="text-sm text-gray-600">Top Tracks</div>
          </div>
          <div class="text-center p-4 bg-white rounded-lg">
            <div class="text-2xl font-bold text-spotify-green">{{ previewData.summary.artists }}</div>
            <div class="text-sm text-gray-600">Top Artists</div>
          </div>
          <div class="text-center p-4 bg-white rounded-lg">
            <div class="text-2xl font-bold text-spotify-green">{{ previewData.summary.genres }}</div>
            <div class="text-sm text-gray-600">Genres</div>
          </div>
        </div>

        <!-- Top Tracks -->
        <div v-if="reportOptions.topTracks && previewData.topTracks">
          <h2 class="text-xl font-bold text-gray-900 mb-3">Top Tracks</h2>
          <div class="space-y-2">
            <div
              v-for="(track, index) in previewData.topTracks.slice(0, 10)"
              :key="track.id"
              class="flex items-center space-x-3 bg-white p-3 rounded"
            >
              <span class="font-bold text-gray-400 w-6">{{ index + 1 }}</span>
              <div class="flex-1">
                <p class="font-medium text-gray-900">{{ track.name }}</p>
                <p class="text-sm text-gray-500">{{ track.artists.map(a => a.name).join(', ') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Artists -->
        <div v-if="reportOptions.topArtists && previewData.topArtists">
          <h2 class="text-xl font-bold text-gray-900 mb-3">Top Artists</h2>
          <div class="space-y-2">
            <div
              v-for="(artist, index) in previewData.topArtists.slice(0, 10)"
              :key="artist.id"
              class="flex items-center space-x-3 bg-white p-3 rounded"
            >
              <span class="font-bold text-gray-400 w-6">{{ index + 1 }}</span>
              <div class="flex-1">
                <p class="font-medium text-gray-900">{{ artist.name }}</p>
                <p class="text-sm text-gray-500">{{ artist.genres.slice(0, 2).join(', ') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Genres -->
        <div v-if="reportOptions.topGenres && previewData.topGenres">
          <h2 class="text-xl font-bold text-gray-900 mb-3">Top Genres</h2>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="genre in previewData.topGenres.slice(0, 15)"
              :key="genre.genre"
              class="px-3 py-1 bg-white text-gray-700 rounded-full text-sm"
            >
              {{ genre.genre }} ({{ genre.count }})
            </span>
          </div>
        </div>

        <!-- Popularity Analysis -->
        <div v-if="previewData.topTracks">
          <h2 class="text-xl font-bold text-gray-900 mb-3">Popularity Analysis</h2>
          <div class="grid grid-cols-3 gap-4 bg-white p-4 rounded">
            <div class="text-center">
              <div class="text-2xl font-bold text-green-700">
                {{ Math.round(previewData.topTracks.reduce((acc, t) => acc + t.popularity, 0) / previewData.topTracks.length) }}
              </div>
              <div class="text-xs text-gray-600">Avg Popularity</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-700">
                {{ previewData.topTracks.filter(t => t.popularity > 70).length }}
              </div>
              <div class="text-xs text-gray-600">Mainstream</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-purple-700">
                {{ previewData.topTracks.filter(t => t.popularity < 40).length }}
              </div>
              <div class="text-xs text-gray-600">Hidden Gems</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { spotifyAPI } from '../services/spotify'
import { analytics } from '../services/analytics'

const generating = ref(false)
const selectedTimeRange = ref('medium_term')
const previewData = ref(null)
const reportContent = ref(null)

const reportOptions = ref({
  topTracks: true,
  topArtists: true,
  topGenres: true,
  listeningPatterns: false
})

const getTimeRangeLabel = (range) => {
  const labels = {
    short_term: 'Last 4 Weeks',
    medium_term: 'Last 6 Months',
    long_term: 'All Time'
  }
  return labels[range] || range
}

const generateReport = async () => {
  try {
    generating.value = true

    // Fetch data
    const [tracksData, artistsData] = await Promise.all([
      spotifyAPI.getTopTracks(selectedTimeRange.value, 50),
      spotifyAPI.getTopArtists(selectedTimeRange.value, 50)
    ])

    const topTracks = tracksData.items
    const topArtists = artistsData.items
    const topGenres = analytics.extractGenres(topArtists)

    // Prepare preview data
    previewData.value = {
      summary: {
        tracks: topTracks.length,
        artists: topArtists.length,
        genres: topGenres.length
      },
      topTracks,
      topArtists,
      topGenres
    }

    // Wait for DOM update
    await new Promise(resolve => setTimeout(resolve, 500))

    // Generate PDF
    if (reportContent.value) {
      const canvas = await html2canvas(reportContent.value, {
        scale: 2,
        backgroundColor: '#f9fafb'
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width

      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)

      // Save PDF
      const filename = `spotify-report-${getTimeRangeLabel(selectedTimeRange.value).replace(/\s+/g, '-')}-${Date.now()}.pdf`
      pdf.save(filename)
    }

    generating.value = false
  } catch (error) {
    console.error('Error generating report:', error)
    generating.value = false
    alert('Failed to generate report. Please try again.')
  }
}
</script>

