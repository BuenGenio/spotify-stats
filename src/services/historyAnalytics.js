// Analytics functions for Spotify extended history data

export const historyAnalytics = {
  // Get top tracks with actual play counts
  getTopTracks(records, limit = 50) {
    const trackMap = new Map()
    
    records.forEach(record => {
      if (!record.spotify_track_uri || record.skipped) return
      
      const uri = record.spotify_track_uri
      if (!trackMap.has(uri)) {
        trackMap.set(uri, {
          uri,
          name: record.master_metadata_track_name,
          artist: record.master_metadata_album_artist_name,
          album: record.master_metadata_album_album_name,
          playCount: 0,
          totalMs: 0,
          skipped: 0,
          completed: 0
        })
      }
      
      const track = trackMap.get(uri)
      track.playCount++
      track.totalMs += record.ms_played
      if (record.skipped) {
        track.skipped++
      } else {
        track.completed++
      }
    })
    
    return Array.from(trackMap.values())
      .sort((a, b) => b.playCount - a.playCount)
      .slice(0, limit)
      .map((track, index) => ({
        ...track,
        rank: index + 1,
        totalMinutes: Math.round(track.totalMs / 60000),
        averageMs: Math.round(track.totalMs / track.playCount),
        skipRate: ((track.skipped / track.playCount) * 100).toFixed(1)
      }))
  },

  // Get top artists with play counts
  getTopArtists(records, limit = 50) {
    const artistMap = new Map()
    
    records.forEach(record => {
      if (!record.master_metadata_album_artist_name || record.skipped) return
      
      const artist = record.master_metadata_album_artist_name
      if (!artistMap.has(artist)) {
        artistMap.set(artist, {
          name: artist,
          playCount: 0,
          totalMs: 0,
          uniqueTracks: new Set()
        })
      }
      
      const artistData = artistMap.get(artist)
      artistData.playCount++
      artistData.totalMs += record.ms_played
      if (record.spotify_track_uri) {
        artistData.uniqueTracks.add(record.spotify_track_uri)
      }
    })
    
    return Array.from(artistMap.values())
      .map(artist => ({
        ...artist,
        uniqueTracks: artist.uniqueTracks.size
      }))
      .sort((a, b) => b.playCount - a.playCount)
      .slice(0, limit)
      .map((artist, index) => ({
        name: artist.name,
        playCount: artist.playCount,
        totalMinutes: Math.round(artist.totalMs / 60000),
        uniqueTracks: artist.uniqueTracks,
        rank: index + 1
      }))
  },

  // Analyze listening patterns by time
  analyzeTimePatterns(records) {
    const hourCounts = Array(24).fill(0)
    const dayCounts = Array(7).fill(0)
    const monthCounts = Array(12).fill(0)
    
    records.forEach(record => {
      if (record.skipped) return
      
      const date = new Date(record.ts)
      hourCounts[date.getHours()]++
      dayCounts[date.getDay()]++
      monthCounts[date.getMonth()]++
    })
    
    const peakHour = hourCounts.indexOf(Math.max(...hourCounts))
    const peakDay = dayCounts.indexOf(Math.max(...dayCounts))
    const peakMonth = monthCounts.indexOf(Math.max(...monthCounts))
    
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    return {
      peakHour: `${peakHour}:00 - ${peakHour + 1}:00`,
      peakDay: dayNames[peakDay],
      peakMonth: monthNames[peakMonth],
      hourDistribution: hourCounts,
      dayDistribution: dayCounts,
      monthDistribution: monthCounts
    }
  },

  // Calculate skip statistics
  analyzeSkipBehavior(records) {
    const trackRecords = records.filter(r => r.spotify_track_uri)
    const totalPlays = trackRecords.length
    const skipped = trackRecords.filter(r => r.skipped).length
    const completed = totalPlays - skipped
    
    // Skip rate by reason
    const skipReasons = {}
    trackRecords.forEach(record => {
      if (record.skipped) {
        const reason = record.reason_end || 'unknown'
        skipReasons[reason] = (skipReasons[reason] || 0) + 1
      }
    })
    
    return {
      totalPlays,
      skipped,
      completed,
      skipRate: ((skipped / totalPlays) * 100).toFixed(1),
      completionRate: ((completed / totalPlays) * 100).toFixed(1),
      skipReasons
    }
  },

  // Analyze by platform
  analyzePlatforms(records) {
    const platformMap = new Map()
    
    records.forEach(record => {
      if (record.skipped) return
      
      const platform = record.platform || 'Unknown'
      if (!platformMap.has(platform)) {
        platformMap.set(platform, {
          platform,
          plays: 0,
          totalMs: 0
        })
      }
      
      const platformData = platformMap.get(platform)
      platformData.plays++
      platformData.totalMs += record.ms_played
    })
    
    return Array.from(platformMap.values())
      .map(p => ({
        ...p,
        totalMinutes: Math.round(p.totalMs / 60000)
      }))
      .sort((a, b) => b.plays - a.plays)
  },

  // Get year-by-year statistics
  getYearlyStats(records) {
    const yearMap = new Map()
    
    records.forEach(record => {
      if (record.skipped) return
      
      const year = new Date(record.ts).getFullYear()
      if (!yearMap.has(year)) {
        yearMap.set(year, {
          year,
          plays: 0,
          totalMs: 0,
          uniqueTracks: new Set(),
          uniqueArtists: new Set()
        })
      }
      
      const yearData = yearMap.get(year)
      yearData.plays++
      yearData.totalMs += record.ms_played
      if (record.spotify_track_uri) {
        yearData.uniqueTracks.add(record.spotify_track_uri)
      }
      if (record.master_metadata_album_artist_name) {
        yearData.uniqueArtists.add(record.master_metadata_album_artist_name)
      }
    })
    
    return Array.from(yearMap.values())
      .map(year => ({
        year: year.year,
        plays: year.plays,
        totalMinutes: Math.round(year.totalMs / 60000),
        totalHours: Math.round(year.totalMs / 3600000),
        uniqueTracks: year.uniqueTracks.size,
        uniqueArtists: year.uniqueArtists.size,
        averagePerDay: Math.round(year.plays / 365)
      }))
      .sort((a, b) => a.year - b.year)
  },

  // Get listening streaks
  getListeningStreaks(records) {
    if (records.length === 0) return { current: 0, longest: 0 }
    
    const dates = new Set(
      records
        .filter(r => !r.skipped)
        .map(r => new Date(r.ts).toISOString().split('T')[0])
    )
    
    const sortedDates = Array.from(dates).sort()
    
    let currentStreak = 1
    let longestStreak = 1
    
    for (let i = 1; i < sortedDates.length; i++) {
      const prev = new Date(sortedDates[i - 1])
      const curr = new Date(sortedDates[i])
      const diffDays = Math.round((curr - prev) / 86400000)
      
      if (diffDays === 1) {
        currentStreak++
        longestStreak = Math.max(longestStreak, currentStreak)
      } else {
        currentStreak = 1
      }
    }
    
    // Check if current streak is still active
    const today = new Date().toISOString().split('T')[0]
    const lastDate = sortedDates[sortedDates.length - 1]
    const daysSinceLast = Math.round((new Date(today) - new Date(lastDate)) / 86400000)
    
    return {
      current: daysSinceLast <= 1 ? currentStreak : 0,
      longest: longestStreak,
      lastListeningDate: lastDate
    }
  },

  // Get discovery statistics (new artists/tracks over time)
  analyzeDiscovery(records) {
    const seenArtists = new Set()
    const seenTracks = new Set()
    const discoveries = []
    
    records
      .filter(r => !r.skipped)
      .sort((a, b) => new Date(a.ts) - new Date(b.ts))
      .forEach(record => {
        const artist = record.master_metadata_album_artist_name
        const track = record.spotify_track_uri
        
        let discovered = false
        
        if (artist && !seenArtists.has(artist)) {
          seenArtists.add(artist)
          discovered = true
        }
        
        if (track && !seenTracks.has(track)) {
          seenTracks.add(track)
          discovered = true
        }
        
        if (discovered) {
          discoveries.push({
            date: new Date(record.ts).toISOString().split('T')[0],
            artist: artist,
            track: record.master_metadata_track_name
          })
        }
      })
    
    return {
      totalArtistsDiscovered: seenArtists.size,
      totalTracksDiscovered: seenTracks.size,
      discoveries: discoveries.slice(-100) // Last 100 discoveries
    }
  },

  // Get complete stats summary
  getCompleteSummary(records) {
    const totalRecords = records.length
    const trackRecords = records.filter(r => r.spotify_track_uri && !r.skipped)
    
    const totalMs = trackRecords.reduce((acc, r) => acc + r.ms_played, 0)
    const uniqueTracks = new Set(trackRecords.map(r => r.spotify_track_uri))
    const uniqueArtists = new Set(trackRecords.map(r => r.master_metadata_album_artist_name))
    
    const dates = trackRecords.map(r => new Date(r.ts))
    const oldestDate = new Date(Math.min(...dates))
    const newestDate = new Date(Math.max(...dates))
    const daysCovered = Math.round((newestDate - oldestDate) / 86400000)
    
    return {
      totalPlays: trackRecords.length,
      totalRecords,
      totalMinutes: Math.round(totalMs / 60000),
      totalHours: Math.round(totalMs / 3600000),
      totalDays: Math.round(totalMs / 86400000),
      uniqueTracks: uniqueTracks.size,
      uniqueArtists: uniqueArtists.size,
      averagePerDay: Math.round(trackRecords.length / daysCovered),
      oldestDate: oldestDate.toISOString(),
      newestDate: newestDate.toISOString(),
      daysCovered,
      yearsCovered: newestDate.getFullYear() - oldestDate.getFullYear() + 1
    }
  }
}

export default historyAnalytics


