// IndexedDB service for storing Spotify extended history data locally

const DB_NAME = 'SpotifyStatsDB'
const DB_VERSION = 1
const STORE_NAME = 'listening_history'

class DatabaseService {
  constructor() {
    this.db = null
  }

  // Initialize database
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => {
        console.error('Database failed to open:', request.error)
        reject(request.error)
      }

      request.onsuccess = () => {
        this.db = request.result
        console.log('✓ Database opened successfully')
        resolve(this.db)
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result
        console.log('Upgrading database...')

        // Create object store for listening history
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = db.createObjectStore(STORE_NAME, { 
            keyPath: 'id',
            autoIncrement: true 
          })

          // Create indexes for efficient querying
          objectStore.createIndex('ts', 'ts', { unique: false })
          objectStore.createIndex('track_uri', 'spotify_track_uri', { unique: false })
          objectStore.createIndex('artist', 'master_metadata_album_artist_name', { unique: false })
          objectStore.createIndex('track_name', 'master_metadata_track_name', { unique: false })
          objectStore.createIndex('year', 'year', { unique: false })
          objectStore.createIndex('skipped', 'skipped', { unique: false })
          
          console.log('✓ Object store created with indexes')
        }
      }
    })
  }

  // Import listening history data
  async importHistory(historyData) {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite')
      const objectStore = transaction.objectStore(STORE_NAME)
      
      let imported = 0
      let skipped = 0

      console.log(`Starting import of ${historyData.length} records...`)

      // Process each record
      historyData.forEach((record, index) => {
        // Add computed fields
        const enrichedRecord = {
          ...record,
          year: new Date(record.ts).getFullYear(),
          month: new Date(record.ts).getMonth(),
          date: new Date(record.ts).toISOString().split('T')[0],
          hour: new Date(record.ts).getHours(),
          dayOfWeek: new Date(record.ts).getDay(),
          minutes_played: Math.round(record.ms_played / 60000),
          is_track: record.spotify_track_uri !== null,
          is_podcast: record.spotify_episode_uri !== null,
          is_audiobook: record.audiobook_uri !== null
        }

        const request = objectStore.add(enrichedRecord)
        
        request.onsuccess = () => {
          imported++
          if ((imported + skipped) % 1000 === 0) {
            console.log(`Progress: ${imported + skipped}/${historyData.length}`)
          }
        }
        
        request.onerror = () => {
          skipped++
          // Duplicate key or other error - skip this record
        }
      })

      transaction.oncomplete = () => {
        console.log(`✓ Import complete: ${imported} imported, ${skipped} skipped`)
        resolve({ imported, skipped, total: historyData.length })
      }

      transaction.onerror = () => {
        console.error('Import failed:', transaction.error)
        reject(transaction.error)
      }
    })
  }

  // Clear all data
  async clearHistory() {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite')
      const objectStore = transaction.objectStore(STORE_NAME)
      const request = objectStore.clear()

      request.onsuccess = () => {
        console.log('✓ History cleared')
        resolve()
      }

      request.onerror = () => {
        console.error('Clear failed:', request.error)
        reject(request.error)
      }
    })
  }

  // Get total count
  async getCount() {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly')
      const objectStore = transaction.objectStore(STORE_NAME)
      const request = objectStore.count()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // Get records by date range
  async getByDateRange(startDate, endDate) {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly')
      const objectStore = transaction.objectStore(STORE_NAME)
      const index = objectStore.index('ts')
      
      const range = IDBKeyRange.bound(startDate, endDate)
      const request = index.getAll(range)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // Get all records (with optional limit)
  async getAll(limit = null) {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly')
      const objectStore = transaction.objectStore(STORE_NAME)
      const request = limit ? objectStore.getAll(null, limit) : objectStore.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // Get records by year
  async getByYear(year) {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly')
      const objectStore = transaction.objectStore(STORE_NAME)
      const index = objectStore.index('year')
      const request = index.getAll(year)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // Get database statistics
  async getStats() {
    if (!this.db) await this.init()

    const count = await this.getCount()
    
    if (count === 0) {
      return {
        totalRecords: 0,
        hasData: false
      }
    }

    const allRecords = await this.getAll()
    
    const dates = allRecords.map(r => new Date(r.ts))
    const oldestDate = new Date(Math.min(...dates))
    const newestDate = new Date(Math.max(...dates))
    
    const totalMinutes = allRecords.reduce((acc, r) => acc + (r.minutes_played || 0), 0)
    const tracksOnly = allRecords.filter(r => r.is_track)
    const uniqueTracks = new Set(allRecords.map(r => r.spotify_track_uri).filter(Boolean))
    const uniqueArtists = new Set(allRecords.map(r => r.master_metadata_album_artist_name).filter(Boolean))
    
    return {
      totalRecords: count,
      hasData: true,
      oldestDate: oldestDate.toISOString(),
      newestDate: newestDate.toISOString(),
      yearsCovered: newestDate.getFullYear() - oldestDate.getFullYear() + 1,
      totalMinutes,
      totalHours: Math.round(totalMinutes / 60),
      totalDays: Math.round(totalMinutes / 60 / 24),
      trackCount: tracksOnly.length,
      uniqueTracks: uniqueTracks.size,
      uniqueArtists: uniqueArtists.size,
      averagePerDay: Math.round(count / ((newestDate - oldestDate) / 86400000))
    }
  }
}

// Export singleton instance
export const db = new DatabaseService()
export default db

