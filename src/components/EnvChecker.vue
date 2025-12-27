<template>
  <div v-if="showDebug" class="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg text-xs max-w-sm z-50">
    <button @click="showDebug = false" class="absolute top-2 right-2 text-gray-400 hover:text-white">✕</button>
    <h3 class="font-bold mb-2">🔍 Environment Debug</h3>
    <div class="space-y-1">
      <div>
        <span class="text-gray-400">Client ID:</span> 
        <span :class="clientId ? 'text-green-400' : 'text-red-400'">
          {{ clientId ? '✓ Set' : '✗ Missing' }}
        </span>
      </div>
      <div>
        <span class="text-gray-400">Redirect URI:</span> 
        <span :class="redirectUri ? 'text-green-400' : 'text-red-400'">
          {{ redirectUri ? redirectUri : '✗ Missing' }}
        </span>
      </div>
      <div>
        <span class="text-gray-400">Token:</span> 
        <span :class="hasToken ? 'text-green-400' : 'text-yellow-400'">
          {{ hasToken ? '✓ Present' : '○ None' }}
        </span>
      </div>
      <div>
        <span class="text-gray-400">Token Valid:</span> 
        <span :class="isValid ? 'text-green-400' : 'text-yellow-400'">
          {{ isValid ? '✓ Valid' : '○ No' }}
        </span>
      </div>
      <div>
        <span class="text-gray-400">Code Verifier:</span> 
        <span :class="hasVerifier ? 'text-green-400' : 'text-yellow-400'">
          {{ hasVerifier ? '✓ Present' : '○ None' }}
        </span>
      </div>
    </div>
    <button 
      @click="copyDebugInfo" 
      class="mt-3 w-full bg-spotify-green text-white px-3 py-1 rounded text-xs hover:bg-green-600"
    >
      Copy Debug Info
    </button>
  </div>
  <button 
    v-else
    @click="showDebug = true" 
    class="fixed bottom-4 right-4 bg-gray-900 text-white px-3 py-2 rounded-full shadow-lg text-xs hover:bg-gray-800 z-50"
    title="Show debug info"
  >
    🔍
  </button>
</template>

<script setup>
import { ref, computed } from 'vue'
import { spotifyAuth } from '../services/spotify'

const showDebug = ref(false)

const clientId = computed(() => import.meta.env.VITE_SPOTIFY_CLIENT_ID)
const redirectUri = computed(() => import.meta.env.VITE_SPOTIFY_REDIRECT_URI)
const hasToken = computed(() => !!spotifyAuth.getAccessToken())
const isValid = computed(() => spotifyAuth.isTokenValid())
const hasVerifier = computed(() => !!localStorage.getItem('code_verifier'))

const copyDebugInfo = () => {
  const info = {
    clientId: clientId.value ? 'Set' : 'Missing',
    redirectUri: redirectUri.value || 'Missing',
    hasToken: hasToken.value,
    isValid: isValid.value,
    hasVerifier: hasVerifier.value,
    currentUrl: window.location.href,
    localStorage: {
      access_token: !!localStorage.getItem('access_token'),
      refresh_token: !!localStorage.getItem('refresh_token'),
      token_expiry: localStorage.getItem('token_expiry'),
      code_verifier: !!localStorage.getItem('code_verifier')
    }
  }
  
  navigator.clipboard.writeText(JSON.stringify(info, null, 2))
  alert('Debug info copied to clipboard!')
}
</script>

