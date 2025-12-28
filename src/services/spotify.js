import axios from 'axios'

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize'
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1'

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI

const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-top-read',
  'user-read-recently-played',
  'user-library-read',
  'playlist-read-private'
].join(' ')

export const spotifyAuth = {
  // Generate a random string for PKCE
  generateCodeVerifier(length = 128) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
    const values = crypto.getRandomValues(new Uint8Array(length))
    return Array.from(values).map(x => possible[x % possible.length]).join('')
  },

  // Generate code challenge from verifier
  async generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier)
    const digest = await crypto.subtle.digest('SHA-256', data)
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  },

  // Initiate login flow
  async login() {
    console.log('Starting login flow')
    console.log('CLIENT_ID:', CLIENT_ID ? 'Present' : 'MISSING')
    console.log('REDIRECT_URI:', REDIRECT_URI || 'MISSING')
    
    if (!CLIENT_ID) {
      alert('Spotify Client ID is not configured. Please check your .env file.')
      return
    }
    
    if (!REDIRECT_URI) {
      alert('Spotify Redirect URI is not configured. Please check your .env file.')
      return
    }
    
    const codeVerifier = this.generateCodeVerifier()
    const codeChallenge = await this.generateCodeChallenge(codeVerifier)
    
    console.log('Code verifier generated, storing in localStorage')
    // Store verifier for later use
    localStorage.setItem('code_verifier', codeVerifier)
    
    // Verify it was stored
    const storedVerifier = localStorage.getItem('code_verifier')
    console.log('Code verifier stored:', storedVerifier ? 'YES' : 'NO')

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'code',
      redirect_uri: REDIRECT_URI,
      scope: SCOPES,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
    })

    const authUrl = `${SPOTIFY_AUTH_URL}?${params.toString()}`
    console.log('Redirecting to Spotify auth:', authUrl.substring(0, 80) + '...')
    window.location.href = authUrl
  },

  // Handle callback and exchange code for token
  async handleCallback(code) {
    console.log('handleCallback called')
    console.log('CLIENT_ID:', CLIENT_ID ? 'Present' : 'MISSING')
    console.log('REDIRECT_URI:', REDIRECT_URI || 'MISSING')
    
    const codeVerifier = localStorage.getItem('code_verifier')
    console.log('Code verifier:', codeVerifier ? 'Found' : 'MISSING')
    
    if (!codeVerifier) {
      throw new Error('Code verifier not found in localStorage. Please try logging in again.')
    }
    
    if (!CLIENT_ID) {
      throw new Error('VITE_SPOTIFY_CLIENT_ID is not configured. Check your .env file.')
    }
    
    if (!REDIRECT_URI) {
      throw new Error('VITE_SPOTIFY_REDIRECT_URI is not configured. Check your .env file.')
    }
    
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier,
    })

    console.log('Requesting token from Spotify...')
    
    try {
      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )

      console.log('Token response received')
      const { access_token, refresh_token, expires_in } = response.data
      
      if (!access_token) {
        throw new Error('No access token in response')
      }
      
      console.log('Storing token in localStorage...')
      localStorage.setItem('access_token', access_token)
      
      if (refresh_token) {
        localStorage.setItem('refresh_token', refresh_token)
        console.log('Refresh token stored')
      }
      
      const expiryTime = Date.now() + expires_in * 1000
      localStorage.setItem('token_expiry', expiryTime.toString())
      localStorage.removeItem('code_verifier')
      
      console.log('Token stored successfully, expires in', expires_in, 'seconds')
      console.log('Token validation:', this.isTokenValid() ? 'VALID' : 'INVALID')

      return access_token
    } catch (error) {
      console.error('Error exchanging code for token:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      throw error
    }
  },

  // Get access token
  getAccessToken() {
    return localStorage.getItem('access_token')
  },

  // Check if token is valid
  isTokenValid() {
    const token = this.getAccessToken()
    const expiry = localStorage.getItem('token_expiry')
    
    if (!token || !expiry) return false
    
    return Date.now() < parseInt(expiry)
  },

  // Logout
  logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('token_expiry')
    localStorage.removeItem('code_verifier')
  }
}

// Create axios instance with auth
const createSpotifyAPI = () => {
  const instance = axios.create({
    baseURL: SPOTIFY_API_BASE,
  })

  instance.interceptors.request.use(config => {
    const token = spotifyAuth.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  return instance
}

const api = createSpotifyAPI()

export const spotifyAPI = {
  // Get current user profile
  async getCurrentUser() {
    const response = await api.get('/me')
    return response.data
  },

  // Get top tracks
  async getTopTracks(timeRange = 'medium_term', limit = 50) {
    const response = await api.get('/me/top/tracks', {
      params: { time_range: timeRange, limit }
    })
    return response.data
  },

  // Get top artists
  async getTopArtists(timeRange = 'medium_term', limit = 50) {
    const response = await api.get('/me/top/artists', {
      params: { time_range: timeRange, limit }
    })
    return response.data
  },

  // Get recently played tracks
  async getRecentlyPlayed(limit = 50) {
    const response = await api.get('/me/player/recently-played', {
      params: { limit }
    })
    return response.data
  },

  // Note: getAudioFeatures has been removed as the /audio-features API is deprecated by Spotify

  // Get saved tracks
  async getSavedTracks(limit = 50, offset = 0) {
    const response = await api.get('/me/tracks', {
      params: { limit, offset }
    })
    return response.data
  },

  // Get user's playlists
  async getUserPlaylists(limit = 50) {
    const response = await api.get('/me/playlists', {
      params: { limit }
    })
    return response.data
  },

  // Get multiple artists by IDs
  async getArtists(artistIds) {
    const response = await api.get('/artists', {
      params: { ids: artistIds.join(',') }
    })
    return response.data
  },

  // Get tracks by URIs (for getting album artwork)
  async getTracks(trackUris) {
    // Extract track IDs from URIs (format: spotify:track:ID)
    const trackIds = trackUris
      .map(uri => uri?.replace('spotify:track:', ''))
      .filter(Boolean)
    
    if (trackIds.length === 0) return { tracks: [] }
    
    // Spotify API allows max 50 tracks per request
    const chunks = []
    for (let i = 0; i < trackIds.length; i += 50) {
      chunks.push(trackIds.slice(i, i + 50))
    }
    
    const allTracks = []
    for (const chunk of chunks) {
      try {
        const response = await api.get('/tracks', {
          params: { ids: chunk.join(',') }
        })
        // Spotify API returns tracks array directly
        if (response.data?.tracks && Array.isArray(response.data.tracks)) {
          allTracks.push(...response.data.tracks.filter(Boolean))
        }
      } catch (error) {
        console.warn('Failed to fetch tracks chunk:', error)
      }
    }
    
    return { tracks: allTracks }
  },

  // Search for artists by name (for getting artist images)
  async searchArtists(artistNames) {
    const artistMap = new Map()
    
    // Search for each artist (we'll do this in batches)
    for (const artistName of artistNames.slice(0, 20)) { // Limit to prevent too many API calls
      try {
        const response = await api.get('/search', {
          params: {
            q: artistName,
            type: 'artist',
            limit: 1
          }
        })
        
        if (response.data?.artists?.items?.[0]) {
          const artist = response.data.artists.items[0]
          artistMap.set(artistName, {
            id: artist.id,
            name: artist.name,
            images: artist.images
          })
        }
      } catch (error) {
        console.warn(`Failed to search for artist: ${artistName}`, error)
      }
    }
    
    return artistMap
  }
}

export default {
  auth: spotifyAuth,
  api: spotifyAPI
}

