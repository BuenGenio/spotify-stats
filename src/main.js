import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

// Import Capacitor plugins
import { App as CapacitorApp } from '@capacitor/app'
import { StatusBar, Style } from '@capacitor/status-bar'
import { Keyboard } from '@capacitor/keyboard'

const app = createApp(App)
  .use(router)
  .mount('#app')

// Capacitor app initialization
CapacitorApp.addListener('appStateChange', ({ isActive }) => {
  console.log('App state changed. Is active?', isActive)
})

CapacitorApp.addListener('appUrlOpen', (data) => {
  console.log('App opened with URL:', data)
  // Handle OAuth callback URLs in mobile app
  if (data.url.includes('callback')) {
    window.location.href = data.url
  }
})

// Set status bar style
StatusBar.setStyle({ style: Style.Dark })
StatusBar.setBackgroundColor({ color: '#191414' })

// Keyboard plugin - hide keyboard on scroll
Keyboard.setAccessoryBarVisible({ isVisible: true })

console.log('✓ Capacitor initialized')
