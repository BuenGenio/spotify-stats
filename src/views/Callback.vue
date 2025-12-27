<template>
  <div class="min-h-screen bg-gradient-to-br from-spotify-black via-gray-900 to-spotify-gray flex items-center justify-center">
    <div class="text-center">
      <div class="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-spotify-green"></div>
      <p class="mt-4 text-white text-lg">{{ message }}</p>
      <p v-if="error" class="mt-2 text-red-400">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { spotifyAuth } from '../services/spotify'

const router = useRouter()
const route = useRoute()
const message = ref('Connecting to Spotify...')
const error = ref('')

onMounted(async () => {
  console.log('=== CALLBACK COMPONENT MOUNTED ===')
  console.log('Current URL:', window.location.href)
  console.log('Route path:', route.path)
  console.log('Route fullPath:', route.fullPath)
  console.log('Query params:', route.query)
  console.log('Client ID configured:', import.meta.env.VITE_SPOTIFY_CLIENT_ID ? 'YES' : 'NO')
  console.log('Redirect URI:', import.meta.env.VITE_SPOTIFY_REDIRECT_URI)
  
  const code = route.query.code
  const errorParam = route.query.error
  const errorDescription = route.query.error_description

  if (errorParam) {
    console.error('OAuth error received from Spotify:', errorParam)
    console.error('Error description:', errorDescription)
    error.value = `Authentication failed: ${errorDescription || errorParam}`
    setTimeout(() => router.push('/'), 3000)
    return
  }

  if (!code) {
    console.error('❌ No authorization code in URL')
    console.error('Full URL:', window.location.href)
    console.error('Route query object:', JSON.stringify(route.query))
    error.value = 'No authorization code found. Please try logging in again.'
    setTimeout(() => router.push('/'), 3000)
    return
  }

  try {
    console.log('✓ Authorization code found:', code.substring(0, 20) + '...')
    message.value = 'Exchanging authorization code...'
    
    console.log('Calling spotifyAuth.handleCallback()...')
    const token = await spotifyAuth.handleCallback(code)
    console.log('✓ Token received from Spotify')
    
    // Verify token was stored
    const storedToken = spotifyAuth.getAccessToken()
    const tokenExpiry = localStorage.getItem('token_expiry')
    
    console.log('✓ Token stored in localStorage:', storedToken ? 'YES' : 'NO')
    console.log('✓ Token expiry:', tokenExpiry ? new Date(parseInt(tokenExpiry)).toISOString() : 'NONE')
    console.log('✓ Token valid:', spotifyAuth.isTokenValid() ? 'YES' : 'NO')
    
    if (!storedToken) {
      throw new Error('Token was not stored in localStorage')
    }
    
    if (!spotifyAuth.isTokenValid()) {
      throw new Error('Token was stored but is not valid')
    }
    
    message.value = 'Success! Redirecting to dashboard...'
    console.log('✓ Authentication successful, redirecting...')
    
    // Wait to ensure everything is saved
    await new Promise(resolve => setTimeout(resolve, 500))
    
    console.log('Navigating to /dashboard')
    await router.push('/dashboard')
    console.log('✓ Navigation complete')
  } catch (err) {
    console.error('❌ Authentication error:', err)
    console.error('Error type:', err.constructor.name)
    console.error('Error message:', err.message)
    console.error('Error response:', err.response?.data)
    console.error('Error status:', err.response?.status)
    
    const errorMsg = err.response?.data?.error_description 
      || err.response?.data?.error 
      || err.message 
      || 'Unknown error occurred'
    
    error.value = `Failed to authenticate: ${errorMsg}`
    console.log('Will redirect to login in 5 seconds...')
    setTimeout(() => router.push('/'), 5000)
  }
})
</script>

