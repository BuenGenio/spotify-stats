# 📱 Mobile App Setup with Capacitor

This guide explains how to build and deploy the Spotify Stats app as a native mobile app using Capacitor.

## 🎯 What is Capacitor?

Capacitor is a cross-platform app runtime that lets you build native iOS and Android apps using web technologies (HTML, CSS, JavaScript). Your Vue.js app can run as a native mobile app!

## 📋 Prerequisites

### For Android Development:
- [Android Studio](https://developer.android.com/studio) installed
- Android SDK (comes with Android Studio)
- Java Development Kit (JDK) 11 or higher

### For iOS Development:
- macOS computer (required)
- [Xcode](https://developer.apple.com/xcode/) installed
- CocoaPods installed: `sudo gem install cocoapods`
- Apple Developer Account (for device testing and App Store)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Web App

```bash
npm run build
```

This creates the `dist/` folder with your production build.

### 3. Sync with Capacitor

```bash
npm run cap:sync
```

This copies your `dist/` folder to the native projects and updates native dependencies.

### 4. Open in Native IDE

**For Android:**
```bash
npm run cap:android
# or
npx cap open android
```

**For iOS:**
```bash
npm run cap:ios
# or
npx cap open ios
```

## 📱 Platform-Specific Setup

### Android Setup

1. **Install Android Studio**
   - Download from: https://developer.android.com/studio
   - Install Android SDK, Android SDK Platform, and Android Virtual Device

2. **Add Android Platform**
   ```bash
   npx cap add android
   ```

3. **Open in Android Studio**
   ```bash
   npm run cap:android
   ```

4. **Configure AndroidManifest.xml**
   - Add internet permission (already included by default)
   - Configure OAuth redirect URI for your app:
     ```
     spotifystats://callback
     ```

5. **Build and Run**
   - Click "Run" in Android Studio
   - Choose an emulator or connected device

### iOS Setup

1. **Install Xcode**
   - Download from Mac App Store
   - Install Command Line Tools: `xcode-select --install`

2. **Install CocoaPods**
   ```bash
   sudo gem install cocoapods
   ```

3. **Add iOS Platform**
   ```bash
   npx cap add ios
   ```

4. **Install Pods**
   ```bash
   cd ios/App
   pod install
   cd ../..
   ```

5. **Open in Xcode**
   ```bash
   npm run cap:ios
   ```

6. **Configure Info.plist**
   - Add URL scheme for OAuth callback:
     ```xml
     <key>CFBundleURLTypes</key>
     <array>
       <dict>
         <key>CFBundleURLSchemes</key>
         <array>
           <string>spotifystats</string>
         </array>
       </dict>
     </array>
     ```

7. **Build and Run**
   - Select a simulator or connected device
   - Click "Run" in Xcode

## 🔧 Configuration

### OAuth Redirect URIs for Mobile

Update your Spotify Developer Dashboard with these redirect URIs:

**Android:**
```
spotifystats://callback
```

**iOS:**
```
spotifystats://callback
```

Update your `.env` file:
```env
VITE_SPOTIFY_REDIRECT_URI=spotifystats://callback
```

### Capacitor Config

The `capacitor.config.ts` file contains:
- App ID: `com.buengenio.spotifystats`
- App Name: `Spotify Stats`
- Web directory: `dist`
- Status bar configuration
- Splash screen settings

## 📦 Available NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build the web app |
| `npm run cap:sync` | Sync web app to native projects |
| `npm run cap:copy` | Copy web app to native projects |
| `npm run cap:open` | Open native IDE (prompts for platform) |
| `npm run cap:ios` | Build, sync, and open iOS project |
| `npm run cap:android` | Build, sync, and open Android project |

## 🔌 Capacitor Plugins Included

### Core Plugins (Installed)
- **@capacitor/app** - App lifecycle and URL handling
- **@capacitor/status-bar** - Status bar styling
- **@capacitor/keyboard** - Keyboard management
- **@capacitor/haptics** - Haptic feedback
- **@capacitor/filesystem** - File system access (for history import)
- **@capacitor/share** - Native sharing

### Available But Not Installed
- **@capacitor/camera** - Camera access
- **@capacitor/geolocation** - Location services
- **@capacitor/local-notifications** - Push notifications
- **@capacitor/device** - Device information

To install more:
```bash
npm install @capacitor/plugin-name
npx cap sync
```

## 📂 Project Structure

After adding platforms:

```
spotify-stats/
├── dist/              # Web build output
├── android/           # Android native project
├── ios/               # iOS native project
├── capacitor.config.ts # Capacitor configuration
└── src/
    └── main.js        # Includes Capacitor initialization
```

## 🎨 Mobile-Specific Features

### Status Bar
- Dark style on both platforms
- Spotify green background (#191414)

### Splash Screen
- Spotify black background
- Auto-hides after 2 seconds
- Green loading spinner

### OAuth Handling
The app listens for URL schemes:
- `spotifystats://callback?code=...`
- Automatically handles OAuth redirects

## 🐛 Troubleshooting

### Build Fails
```bash
# Clean and rebuild
rm -rf dist android ios
npm run build
npx cap sync
```

### Android Studio Not Finding Files
```bash
# Sync again
npm run cap:sync
```

### iOS Pods Not Installing
```bash
cd ios/App
pod deintegrate
pod install
cd ../..
```

### OAuth Not Working
1. Verify redirect URI in Spotify Dashboard matches `spotifystats://callback`
2. Check `capacitor.config.ts` has correct scheme
3. Verify Info.plist (iOS) or AndroidManifest.xml (Android) has URL scheme

### Images Not Loading
- Check network permissions in AndroidManifest.xml
- Verify CORS settings if loading external images

## 📱 Testing

### Android
1. **Emulator**: Create AVD in Android Studio
2. **Physical Device**: Enable Developer Mode and USB debugging
3. Run from Android Studio

### iOS
1. **Simulator**: Choose from Xcode device menu
2. **Physical Device**: 
   - Connect device
   - Select in Xcode
   - May need to sign with developer certificate

## 🚀 Deployment

### Android (Google Play Store)

1. **Build Release APK/AAB**
   ```bash
   cd android
   ./gradlew assembleRelease  # APK
   ./gradlew bundleRelease    # AAB (recommended)
   ```

2. **Sign the Bundle**
   - Create keystore if needed
   - Configure signing in `build.gradle`

3. **Upload to Play Console**
   - Go to https://play.google.com/console
   - Create new app
   - Upload AAB file
   - Complete store listing

### iOS (App Store)

1. **Archive in Xcode**
   - Product → Archive
   - Wait for archive to complete

2. **Distribute**
   - Window → Organizer
   - Select archive
   - Distribute App
   - Choose App Store Connect
   - Follow prompts

3. **App Store Connect**
   - Upload via Xcode or Transporter
   - Complete app information
   - Submit for review

## 🔐 Security Considerations

### API Keys
- Never commit `.env` files
- Use environment variables in CI/CD
- For mobile, consider using Capacitor's secure storage

### OAuth
- Use URL schemes for mobile (`spotifystats://callback`)
- Consider using App Links (Android) or Universal Links (iOS) for better security

## 📚 Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Developer Guide](https://developer.android.com/guide)
- [iOS Developer Guide](https://developer.apple.com/documentation/)
- [Spotify OAuth Mobile Guide](https://developer.spotify.com/documentation/general/guides/authorization-guide/)

## 🎯 Next Steps

1. ✅ Set up development environment (Android Studio/Xcode)
2. ✅ Build web app: `npm run build`
3. ✅ Add platforms: `npx cap add android/ios`
4. ✅ Sync: `npm run cap:sync`
5. ✅ Open in IDE: `npm run cap:android/ios`
6. ✅ Configure OAuth redirect URIs
7. ✅ Test on emulator/device
8. ✅ Build for production
9. ✅ Deploy to app stores

---

**Ready to build your mobile app!** 📱🎵

For questions or issues, check the [Capacitor Docs](https://capacitorjs.com/docs) or open an issue.

