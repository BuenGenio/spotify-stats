<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-gradient-to-r from-spotify-green to-green-600 rounded-lg shadow-xl p-8 text-white">
      <h2 class="text-4xl font-bold mb-2">Import Your Spotify History</h2>
      <p class="text-xl opacity-90">Upload your extended streaming history for complete analytics with actual play counts!</p>
    </div>

    <!-- Current Status -->
    <div v-if="dbStats.hasData" class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">📊 Current Data</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center p-4 bg-gray-50 rounded-lg">
          <div class="text-3xl font-bold text-spotify-green">{{ dbStats.totalRecords?.toLocaleString() }}</div>
          <div class="text-sm text-gray-600 mt-1">Total Plays</div>
        </div>
        <div class="text-center p-4 bg-gray-50 rounded-lg">
          <div class="text-3xl font-bold text-spotify-green">{{ dbStats.totalHours?.toLocaleString() }}</div>
          <div class="text-sm text-gray-600 mt-1">Hours Listened</div>
        </div>
        <div class="text-center p-4 bg-gray-50 rounded-lg">
          <div class="text-3xl font-bold text-spotify-green">{{ dbStats.uniqueTracks?.toLocaleString() }}</div>
          <div class="text-sm text-gray-600 mt-1">Unique Tracks</div>
        </div>
        <div class="text-center p-4 bg-gray-50 rounded-lg">
          <div class="text-3xl font-bold text-spotify-green">{{ dbStats.yearsCovered }}</div>
          <div class="text-sm text-gray-600 mt-1">Years Covered</div>
        </div>
      </div>
      <p class="text-sm text-gray-500 mt-4">
        Data from {{ new Date(dbStats.oldestDate).toLocaleDateString() }} to {{ new Date(dbStats.newestDate).toLocaleDateString() }}
      </p>
    </div>

    <!-- Import Section -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">📤 Import New Data</h3>
      
      <!-- Instructions -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h4 class="font-medium text-blue-900 mb-2">How to get your data:</h4>
        <ol class="list-decimal list-inside space-y-1 text-sm text-blue-800">
          <li>Go to <a href="https://www.spotify.com/account/privacy/" target="_blank" class="underline">Spotify Privacy Settings</a></li>
          <li>Scroll to "Download your data"</li>
          <li>Select "Extended streaming history"</li>
          <li>Wait for email (can take up to 30 days)</li>
          <li>Download and extract the ZIP file</li>
          <li>Upload the JSON files here (they're named like Streaming_History_Audio_2011-2023_0.json)</li>
        </ol>
      </div>

      <!-- File Upload Area -->
      <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-spotify-green transition-colors"
           :class="{ 'border-spotify-green bg-green-50': dragOver }"
           @drop.prevent="handleDrop"
           @dragover.prevent="dragOver = true"
           @dragleave="dragOver = false">
        <input
          ref="fileInput"
          type="file"
          multiple
          accept=".json,application/json"
          @change="handleFileSelect"
          class="hidden"
        />
        
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        
        <p class="mt-2 text-sm text-gray-600">
          <button @click="$refs.fileInput.click()" class="text-spotify-green hover:text-green-700 font-medium">
            Click to upload
          </button>
          or drag and drop
        </p>
        <p class="text-xs text-gray-500 mt-1">JSON files only. You can upload multiple files at once.</p>
      </div>

      <!-- Selected Files -->
      <div v-if="selectedFiles.length > 0" class="mt-4">
        <h4 class="font-medium text-gray-900 mb-2">Selected Files:</h4>
        <div class="space-y-2">
          <div v-for="(file, index) in selectedFiles" :key="index" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center space-x-3">
              <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span class="text-sm text-gray-700">{{ file.name }}</span>
              <span class="text-xs text-gray-500">({{ formatFileSize(file.size) }})</span>
            </div>
            <button @click="removeFile(index)" class="text-red-600 hover:text-red-800">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Import Button -->
      <div v-if="selectedFiles.length > 0" class="mt-6">
        <button
          @click="importFiles"
          :disabled="importing"
          class="btn-spotify w-full"
        >
          <span v-if="!importing">📥 Import {{ selectedFiles.length }} File(s)</span>
          <span v-else class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Importing {{ importProgress }}%...
          </span>
        </button>
      </div>

      <!-- Import Results -->
      <div v-if="importResult" class="mt-6 p-4 rounded-lg" :class="importResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'">
        <h4 class="font-medium mb-2" :class="importResult.success ? 'text-green-900' : 'text-red-900'">
          {{ importResult.success ? '✓ Import Successful!' : '✗ Import Failed' }}
        </h4>
        <p class="text-sm" :class="importResult.success ? 'text-green-700' : 'text-red-700'">
          {{ importResult.message }}
        </p>
        <div v-if="importResult.stats" class="mt-3 grid grid-cols-3 gap-2 text-sm">
          <div class="text-center p-2 bg-white rounded">
            <div class="font-bold text-green-700">{{ importResult.stats.imported?.toLocaleString() }}</div>
            <div class="text-gray-600 text-xs">Imported</div>
          </div>
          <div class="text-center p-2 bg-white rounded">
            <div class="font-bold text-gray-700">{{ importResult.stats.skipped?.toLocaleString() }}</div>
            <div class="text-gray-600 text-xs">Skipped</div>
          </div>
          <div class="text-center p-2 bg-white rounded">
            <div class="font-bold text-blue-700">{{ importResult.stats.total?.toLocaleString() }}</div>
            <div class="text-gray-600 text-xs">Total</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Management -->
    <div v-if="dbStats.hasData" class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">🗑️ Data Management</h3>
      <p class="text-sm text-gray-600 mb-4">
        All data is stored locally in your browser. No data is sent to any server.
      </p>
      <button
        @click="confirmClearData"
        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Clear All Data
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '../services/db'

const router = useRouter()

const selectedFiles = ref([])
const dragOver = ref(false)
const importing = ref(false)
const importProgress = ref(0)
const importResult = ref(null)
const dbStats = ref({ hasData: false })
const fileInput = ref(null)

const loadDbStats = async () => {
  try {
    dbStats.value = await db.getStats()
  } catch (error) {
    console.error('Error loading DB stats:', error)
  }
}

const handleDrop = (e) => {
  dragOver.value = false
  const files = Array.from(e.dataTransfer.files).filter(f => f.name.endsWith('.json'))
  selectedFiles.value = [...selectedFiles.value, ...files]
}

const handleFileSelect = (e) => {
  const files = Array.from(e.target.files)
  selectedFiles.value = [...selectedFiles.value, ...files]
}

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const importFiles = async () => {
  importing.value = true
  importProgress.value = 0
  importResult.value = null

  try {
    let allRecords = []
    let filesProcessed = 0

    for (const file of selectedFiles.value) {
      const text = await file.text()
      const data = JSON.parse(text)
      allRecords = [...allRecords, ...data]
      filesProcessed++
      importProgress.value = Math.round((filesProcessed / selectedFiles.value.length) * 50)
    }

    console.log(`✓ Parsed ${allRecords.length} records from ${selectedFiles.value.length} file(s)`)

    // Import into database
    importProgress.value = 50
    const stats = await db.importHistory(allRecords)
    importProgress.value = 100

    importResult.value = {
      success: true,
      message: `Successfully imported ${stats.imported.toLocaleString()} records! ${stats.skipped > 0 ? `(${stats.skipped} duplicates skipped)` : ''}`,
      stats
    }

    // Reload stats
    await loadDbStats()

    // Clear selection
    selectedFiles.value = []

  } catch (error) {
    console.error('Import error:', error)
    importResult.value = {
      success: false,
      message: `Import failed: ${error.message}`
    }
  } finally {
    importing.value = false
  }
}

const confirmClearData = () => {
  if (confirm('Are you sure you want to delete all imported data? This cannot be undone.')) {
    clearData()
  }
}

const clearData = async () => {
  try {
    await db.clearHistory()
    await loadDbStats()
    importResult.value = {
      success: true,
      message: 'All data has been cleared.'
    }
  } catch (error) {
    console.error('Clear error:', error)
    importResult.value = {
      success: false,
      message: `Failed to clear data: ${error.message}`
    }
  }
}

onMounted(async () => {
  await loadDbStats()
})
</script>


