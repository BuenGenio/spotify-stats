# 🎵 Historical Data Import Feature

## Overview

This feature allows you to import your complete Spotify extended streaming history and analyze it with **actual play counts** and advanced metrics that the Spotify API doesn't provide!

## 🎯 What This Unlocks

### Data You Get From Extended History

**vs Spotify API** (limited to 50 recent tracks, no play counts):

| Feature | Spotify API | Extended History |
|---------|-------------|------------------|
| **History Range** | Last 50 tracks only | Complete history (years!) |
| **Play Counts** | ❌ No | ✅ **YES!** Actual counts |
| **Skip Data** | ❌ No | ✅ Skip rate per track |
| **Platform Info** | ❌ No | ✅ Desktop, mobile, etc. |
| **Exact Timestamps** | Last 50 only | Every play ever |
| **Total Listen Time** | ❌ No | ✅ Complete history |
| **Year-by-Year Stats** | ❌ No | ✅ Full breakdown |
| **Listening Streaks** | ❌ No | ✅ Current & longest |

## 📥 How to Get Your Data

### Step 1: Request from Spotify

1. Go to [Spotify Account Privacy Settings](https://www.spotify.com/account/privacy/)
2. Scroll down to **"Download your data"**
3. Select **"Extended streaming history"** (not the basic one!)
4. Click **"Request data"**
5. Wait for email (can take **up to 30 days**)

### Step 2: Download Your Data

- You'll receive an email with a download link
- Download the ZIP file (can be several MB or even GB!)
- Extract the ZIP file

### Step 3: Import Into the App

1. Navigate to **"Import History"** in the app
2. Upload the JSON files (named like `Streaming_History_Audio_2011-2023_0.json`)
3. You can upload multiple files at once
4. Wait for import to complete
5. View your complete stats in **"Historical Stats"**!

## 📊 New Features

### 1. Historical Stats View (`/historical`)

**What It Shows:**
- ✅ **Total plays** - Actual count of every track you've played
- ✅ **Top tracks with play counts** - Know exactly how many times you've played each song!
- ✅ **Top artists with play counts** - Real numbers, not just rankings
- ✅ **Year-by-year breakdown** - See how your listening evolved
- ✅ **Skip behavior** - Skip rate, completion rate
- ✅ **Listening streaks** - Current and longest streaks
- ✅ **Platform analysis** - Desktop vs mobile vs other
- ✅ **Complete timeline** - From your first ever Spotify play

**Example Output:**
```
🎵 Your Most Played Tracks
1. Track Name - Artist            237 plays  |  14.2h  |  5.2% skip rate
2. Another Track                  198 plays  |  11.8h  |  8.3% skip rate
...
```

### 2. Import History View (`/import`)

**Features:**
- Drag & drop JSON files
- Multi-file upload
- Progress tracking
- Duplicate detection (won't import twice)
- Data management (clear all data)
- Current data statistics

### 3. IndexedDB Storage

**Technical Details:**
- All data stored **locally in your browser**
- No data sent to any server
- Fast queries with indexed fields
- Efficient for large datasets (millions of records)
- Automatic data enrichment (adds year, month, date fields)

## 🔍 What the Data Looks Like

### Extended History JSON Format

Each record contains:

```json
{
  "ts": "2011-04-01T02:55:32Z",              // Timestamp
  "platform": "Windows 7...",                 // Platform used
  "ms_played": 12674,                         // Milliseconds played
  "conn_country": "HK",                       // Country
  "master_metadata_track_name": "Track",      // Track name
  "master_metadata_album_artist_name": "...", // Artist
  "master_metadata_album_album_name": "...",  // Album
  "spotify_track_uri": "spotify:track:...",   // Track URI
  "reason_start": "clickrow",                 // Why started
  "reason_end": "endplay",                    // Why ended
  "shuffle": false,                           // Shuffle on/off
  "skipped": false,                           // Was it skipped?
  "offline": false,                           // Offline mode?
  "incognito_mode": false                     // Private session?
}
```

### Enriched Data (Added by App)

The app automatically adds:
- `year` - Year of play
- `month` - Month of play (0-11)
- `date` - ISO date string
- `hour` - Hour of day (0-23)
- `dayOfWeek` - Day of week (0-6)
- `minutes_played` - Milliseconds converted to minutes
- `is_track` - Boolean (track vs podcast vs audiobook)
- `is_podcast` - Boolean
- `is_audiobook` - Boolean

## 📈 Analytics Functions

### Available Analytics

**Track Analysis:**
```javascript
historyAnalytics.getTopTracks(records, limit)
// Returns: Top tracks with play counts, total time, skip rates
```

**Artist Analysis:**
```javascript
historyAnalytics.getTopArtists(records, limit)
// Returns: Top artists with play counts, unique tracks
```

**Time Patterns:**
```javascript
historyAnalytics.analyzeTimePatterns(records)
// Returns: Peak hours, days, months, distributions
```

**Skip Behavior:**
```javascript
historyAnalytics.analyzeSkipBehavior(records)
// Returns: Skip rates, completion rates, reasons
```

**Platform Analysis:**
```javascript
historyAnalytics.analyzePlatforms(records)
// Returns: Usage by platform (desktop, mobile, etc.)
```

**Yearly Stats:**
```javascript
historyAnalytics.getYearlyStats(records)
// Returns: Year-by-year breakdown
```

**Listening Streaks:**
```javascript
historyAnalytics.getListeningStreaks(records)
// Returns: Current and longest streaks
```

## 🗄️ Database Operations

### Basic Operations

```javascript
import { db } from '@/services/db'

// Initialize database
await db.init()

// Import history data
const result = await db.importHistory(jsonData)
// Returns: { imported, skipped, total }

// Get all records
const records = await db.getAll()

// Get records by year
const records2023 = await db.getByYear(2023)

// Get records by date range
const records = await db.getByDateRange('2023-01-01', '2023-12-31')

// Get statistics
const stats = await db.getStats()

// Get count
const count = await db.getCount()

// Clear all data
await db.clearHistory()
```

### Database Indexes

For fast queries, the following indexes are created:
- `ts` - Timestamp
- `track_uri` - Track URI
- `artist` - Artist name
- `track_name` - Track name
- `year` - Year
- `skipped` - Skip status

## 💾 Storage Considerations

### Browser Storage Limits

- **IndexedDB**: Typically 50% of available disk space
- **Recommended**: At least 1GB free space
- **Large histories**: 10+ years = ~50MB-500MB of data

### Performance

- **Import speed**: ~1,000-5,000 records/second
- **Query speed**: Very fast with indexes
- **Memory usage**: Minimal (streams data)

### Data Persistence

- Data persists across browser sessions
- Clearing browser data will remove it
- Not synced across devices
- Survives app updates

## 🎨 UI Components

### Import View Features

1. **Drag & Drop Zone**
   - Upload multiple JSON files at once
   - Visual feedback on drag
   - File size display

2. **Progress Tracking**
   - Percentage complete
   - Records imported count
   - Duplicate detection

3. **Current Data Display**
   - Total records
   - Hours listened
   - Unique tracks/artists
   - Years covered

4. **Data Management**
   - Clear all data button
   - Confirmation dialogs
   - Import history

### Historical Stats View Features

1. **Summary Cards**
   - Total plays
   - Total time (days + hours)
   - Unique tracks
   - Unique artists

2. **Top Lists**
   - Play counts (actual numbers!)
   - Listen time per track/artist
   - Skip rates
   - Rankings

3. **Year-by-Year Chart**
   - Bar chart of plays per year
   - Detailed stats per year
   - Growth visualization

4. **Skip Analysis**
   - Completion rate
   - Skip rate
   - Total plays breakdown

5. **Listening Streaks**
   - Current streak
   - Longest streak ever
   - Visual indicators

6. **Platform Breakdown**
   - Usage by device/platform
   - Time per platform
   - Play counts

## 🔒 Privacy & Security

### Local Storage Only

- **No server upload**: All data stays in your browser
- **No tracking**: We don't collect any data
- **No external services**: Everything processes locally
- **IndexedDB**: Browser's secure storage

### Data Control

- **You own your data**: Import/export/delete anytime
- **Transparent processing**: Open source analytics
- **Privacy friendly**: Works completely offline

## 🚀 Future Enhancements

Potential additions:
- [ ] Export processed stats to JSON
- [ ] Compare different time periods
- [ ] Advanced filtering options
- [ ] Custom date range selection
- [ ] Playlist analysis from history
- [ ] Discovery timeline visualization
- [ ] Social comparison (anonymized)
- [ ] Genre evolution over time
- [ ] Artist discovery patterns

## 🐛 Troubleshooting

### Import Fails

**Problem**: "Failed to parse JSON"
- **Solution**: Make sure you're uploading the correct files (Streaming_History_Audio_*.json)

**Problem**: "Import hangs"
- **Solution**: Large files can take time. Wait for progress indicator. Check browser console.

**Problem**: "Duplicate records"
- **Solution**: This is normal! The app automatically skips duplicates.

### No Data Showing

**Problem**: Import succeeded but stats show zero
- **Solution**: Refresh the page, check browser console for errors

**Problem**: Only recent data showing
- **Solution**: Make sure you requested "Extended" history, not basic download

### Performance Issues

**Problem**: Slow queries
- **Solution**: Normal for first load with large datasets. Subsequent loads are faster.

**Problem**: Browser crashes
- **Solution**: Try importing smaller batches (one file at a time)

## 📞 Support

If you encounter issues:

1. Check browser console (F12) for errors
2. Verify JSON file format matches expected structure
3. Try with a smaller test file first
4. Clear data and re-import if needed
5. Make sure you have enough disk space

## 🎉 Example Use Cases

### Track Your Musical Journey

See exactly how your taste evolved:
- Which year you discovered your favorite artist
- How many times you've played your wedding song
- Your most loyal track (highest play count!)

### Discover Patterns

- What time of day you listen most
- Your most productive listening year
- Platform preferences (mobile vs desktop)

### Share Stats

Generate impressive stats to share:
- "I've listened to [Artist] 2,847 times!"
- "My longest listening streak: 127 days"
- "Total time on Spotify: 247 days!"

---

**Enjoy exploring your complete music history!** 🎵📊

*This feature transforms your Spotify Stats app from showing API-limited data to displaying your COMPLETE listening history with ACTUAL play counts!*

