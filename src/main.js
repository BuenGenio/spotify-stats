import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

createApp(App)
  .use(router)
  .mount('#app')

// Capacitor initialization (only loads in mobile app, not browser)
// Uses dynamic imports to avoid breaking in browser
if (typeof window !== 'undefined' && window.Capacitor) {
  Promise.all([
    import('@capacitor/app').catch(() => null),
    import('@capacitor/status-bar').catch(() => null),
    import('@capacitor/keyboard').catch(() => null)
  ]).then(([appModule, statusBarModule, keyboardModule]) => {
    if (appModule) {
      const { App: CapacitorApp } = appModule
      
      // Handle app state changes
      CapacitorApp.addListener('appStateChange', ({ isActive }) => {
        console.log('App state changed. Is active?', isActive)
      })

      // Handle OAuth callback URLs in mobile app
      CapacitorApp.addListener('appUrlOpen', (data) => {
        console.log('App opened with URL:', data)
        if (data.url && data.url.includes('callback')) {
          window.location.href = data.url
        }
      })
    }

    if (statusBarModule) {
      const { StatusBar, Style } = statusBarModule
      StatusBar.setStyle({ style: Style.Dark }).catch(() => {})
      StatusBar.setBackgroundColor({ color: '#191414' }).catch(() => {})
    }

    if (keyboardModule) {
      const { Keyboard } = keyboardModule
      Keyboard.setAccessoryBarVisible({ isVisible: true }).catch(() => {})
    }

    console.log('✓ Capacitor initialized')
  }).catch(() => {
    // Running in browser, Capacitor not available
  })
}
