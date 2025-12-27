// Analytics and data processing utilities

export const analytics = {
  // Extract top genres from artists
  extractGenres(artists) {
    const genreCount = {}
    
    artists.forEach(artist => {
      if (artist.genres) {
        artist.genres.forEach(genre => {
          genreCount[genre] = (genreCount[genre] || 0) + 1
        })
      }
    })

    return Object.entries(genreCount)
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count)
  },

  // Calculate listening stats
  calculateListeningStats(tracks) {
    const totalTracks = tracks.length
    const uniqueArtists = new Set(tracks.flatMap(t => t.artists?.map(a => a.id) || []))
    const uniqueAlbums = new Set(tracks.map(t => t.album?.id).filter(Boolean))

    return {
      totalTracks,
      uniqueArtists: uniqueArtists.size,
      uniqueAlbums: uniqueAlbums.size,
    }
  },

  // Note: analyzeAudioFeatures has been removed as the /audio-features API is deprecated by Spotify

  // Group tracks by time period (for calendar view)
  groupByTimePeriod(recentTracks) {
    const grouped = {}
    
    recentTracks.forEach(item => {
      const date = new Date(item.played_at)
      const dateKey = date.toISOString().split('T')[0]
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(item)
    })

    return grouped
  },

  // Calculate popularity trends
  calculatePopularityTrend(tracks) {
    const avgPopularity = tracks.reduce((acc, track) => acc + (track.popularity || 0), 0) / tracks.length
    const popularTracks = tracks.filter(t => t.popularity > 70).length
    const nicheTracks = tracks.filter(t => t.popularity < 40).length

    return {
      average: Math.round(avgPopularity),
      popular: popularTracks,
      niche: nicheTracks,
      mainstream: ((popularTracks / tracks.length) * 100).toFixed(1)
    }
  },

  // Find listening patterns (time of day, day of week)
  analyzeListeningPatterns(recentTracks) {
    const hourCounts = Array(24).fill(0)
    const dayCounts = Array(7).fill(0)

    recentTracks.forEach(item => {
      const date = new Date(item.played_at)
      hourCounts[date.getHours()]++
      dayCounts[date.getDay()]++
    })

    const peakHour = hourCounts.indexOf(Math.max(...hourCounts))
    const peakDay = dayCounts.indexOf(Math.max(...dayCounts))

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    return {
      peakHour: `${peakHour}:00 - ${peakHour + 1}:00`,
      peakDay: dayNames[peakDay],
      hourDistribution: hourCounts,
      dayDistribution: dayCounts
    }
  },

  // Calculate diversity score
  calculateDiversityScore(artists, genres) {
    const artistScore = Math.min((artists / 10) * 100, 100) // Normalize to 100
    const genreScore = Math.min((genres / 5) * 100, 100)
    
    return Math.round((artistScore + genreScore) / 2)
  },

  // Generate year-end statistics
  generateYearStats(topTracks, topArtists) {
    const totalMinutes = topTracks.reduce((acc, track) => acc + (track.duration_ms || 0), 0) / 60000
    const topGenres = this.extractGenres(topArtists).slice(0, 5)
    const popularityTrend = this.calculatePopularityTrend(topTracks)

    return {
      totalMinutes: Math.round(totalMinutes),
      topTrack: topTracks[0],
      topArtist: topArtists[0],
      topGenres,
      popularityTrend,
      trackCount: topTracks.length,
      artistCount: topArtists.length
    }
  }
}

export default analytics

