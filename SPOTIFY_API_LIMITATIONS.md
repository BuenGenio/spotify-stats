# 📊 Spotify API Limitations & Data Availability

## Understanding What Data Is Available

This document explains the limitations of Spotify's Web API and how they affect what the app can display.

## 🎵 **Recently Played Tracks**

### Limitation
- **Maximum**: Only the last **50 tracks** are available
- **History**: No way to get older listening history beyond those 50 tracks
- **Time Range**: Depends on your listening habits
  - Heavy listeners: May only cover a few hours
  - Light listeners: May cover several days

### Impact on the App

**Listening Pulse View:**
- Calendar shows up to 14 days, but only has data for the timeframe covered by your last 50 tracks
- If you listened to 50 songs in one day, the calendar will only show that one day
- If you listened slowly over a week, it will show a week of data

**What We Did:**
- ✅ Added a banner explaining the limitation
- ✅ Show how many tracks were fetched (e.g., "Last 50 tracks")
- ✅ Display the actual date range covered (e.g., "last 2 days")
- ✅ Added console logging for debugging

### Example Scenarios

**Scenario 1: Heavy Listener**
```
You listen to 50 tracks per day
→ Calendar shows: Only today's data
→ Date range: "last 5 hours"
```

**Scenario 2: Moderate Listener**
```
You listen to ~10 tracks per day
→ Calendar shows: Last 5 days of data
→ Date range: "last 5 days"
```

**Scenario 3: Light Listener**
```
You listen to ~3 tracks per day
→ Calendar shows: Last 14+ days of data
→ Date range: "last 17 days"
```

## 🚫 **Play Counts**

### Limitation
- Spotify API **does not provide**:
  - Exact play counts per track
  - Total plays for a track
  - Personal listening statistics
  - Historical play data

### What's Available Instead
- ✅ Track ranking/order (1st, 2nd, 3rd most played)
- ✅ Global popularity score (0-100)
- ✅ Recently played timestamps

### Why This Matters
You'll see tracks ranked by how often you play them, but not the actual number of plays.

**Example:**
```
❌ Cannot show: "Played 127 times"
✅ Can show: "Your #1 most played track"
✅ Can show: "Popularity: 85/100"
```

## 📅 **Time Ranges**

### Available Time Ranges
Spotify provides three predefined time ranges for "Top" data:

| Range | Period | Data Quality |
|-------|--------|--------------|
| `short_term` | Last 4 weeks | Most accurate for recent trends |
| `medium_term` | Last 6 months | Balanced view |
| `long_term` | All time | Long-term favorites |

### Limitations
- ❌ Cannot specify custom date ranges (e.g., "January 2023")
- ❌ Cannot get data for specific weeks or months
- ❌ Cannot compare between different periods
- ✅ Can only use Spotify's predefined ranges

## 🎤 **Top Tracks & Artists**

### Limitations
- **Maximum per request**: 50 items
- **Ranking only**: No play counts
- **No historical snapshots**: Can't see "what were my top tracks in January"

### What's Available
- ✅ Up to 50 top tracks per time range
- ✅ Up to 50 top artists per time range
- ✅ Genre data from artists
- ✅ Popularity scores
- ✅ Album artwork and metadata

## 🎸 **Audio Features** (DEPRECATED)

### Status
- ❌ `/audio-features` endpoint **deprecated by Spotify**
- ❌ No longer available as of 2024

### Previously Provided
- Danceability
- Energy
- Valence (happiness)
- Acousticness
- Instrumentalness
- Speechiness

### Replaced With
- ✅ Popularity analysis
- ✅ Duration-based metrics
- ✅ Genre analysis

See `AUDIO_FEATURES_REMOVAL.md` for details.

## 📊 **Other Data Not Available**

### What You Cannot Get

**Personal Statistics:**
- ❌ Total listening time (beyond calculating from top tracks)
- ❌ Most played track of all time (with play count)
- ❌ Listening trends over time
- ❌ Day/week/month comparisons

**Historical Data:**
- ❌ "What did I listen to on January 15, 2023?"
- ❌ "How many songs did I play last month?"
- ❌ "Show me my December 2022 top tracks"

**Advanced Analytics:**
- ❌ Listening patterns over multiple months
- ❌ Seasonal trends
- ❌ Discovery rate (new artists per month)
- ❌ Skip rate or completion rate

**Social Features:**
- ❌ Friends' listening data
- ❌ Collaborative statistics
- ❌ Shared playlists analytics

## 💡 **Workarounds & Tips**

### To See More Historical Data

**Option 1: Listen More Often**
The more you use Spotify, the more frequently you'll have 50 tracks covering multiple days.

**Option 2: Check Multiple Time Ranges**
- View "Last 4 Weeks" for recent trends
- View "All Time" for long-term favorites
- Compare between them

**Option 3: Generate Reports Regularly**
- Save PDF reports weekly/monthly
- Compare reports over time manually
- Build your own historical archive

### To Track Play Counts

**Option 1: Use Spotify's Year-End Wrapped**
Spotify's official "Wrapped" feature (released annually) includes play counts and detailed statistics.

**Option 2: Last.fm Integration**
- Connect your Spotify to Last.fm
- Last.fm tracks everything you play
- Provides detailed historical data and statistics

**Option 3: Third-Party Apps**
Some apps offer extended tracking:
- Stats for Spotify
- Spotistats
- Obscurify
- (Note: These may also have limitations based on Spotify's API)

## 🔍 **Debugging Data Issues**

### Check Your Console

When you visit the Listening Pulse page, check the browser console (F12):

```javascript
=== LISTENING PULSE DATA ===
Tracks fetched: 50
Date range: 12/20/2025 9:00 AM to 12/27/2025 3:00 PM
Days covered: 7
```

This tells you:
- How many tracks were fetched
- The actual date range of your data
- How many days are covered

### Common Issues

**Issue: "Only seeing today's data"**
- **Cause**: You listened to 50+ tracks today
- **Solution**: This is normal! The 50-track limit means recent heavy listening will dominate

**Issue: "Calendar mostly empty"**
- **Cause**: You haven't listened much recently
- **Solution**: As you listen more, the calendar will fill in

**Issue: "Missing yesterday's data"**
- **Cause**: Your last 50 tracks don't go back that far
- **Solution**: This is a Spotify API limitation, not a bug

## 📚 **Further Reading**

### Official Spotify API Documentation
- [Get Recently Played Tracks](https://developer.spotify.com/documentation/web-api/reference/get-recently-played)
- [Get User's Top Tracks](https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks)
- [API Rate Limits](https://developer.spotify.com/documentation/web-api/concepts/rate-limits)

### Related Discussions
- [Spotify Community: API Limitations](https://community.spotify.com/t5/Spotify-for-Developers/bd-p/Spotify_Developer)
- [GitHub: Spotify Web API Issues](https://github.com/spotify/web-api/issues)

## 🎯 **Summary**

| Feature | Limit | Reason |
|---------|-------|--------|
| Recently Played | 50 tracks max | Spotify API limit |
| Top Tracks/Artists | 50 items max | Spotify API limit |
| Time Ranges | 3 predefined options | Spotify API design |
| Play Counts | Not available | Privacy/API limitation |
| Historical Data | Not available | Spotify doesn't expose via API |
| Audio Features | Deprecated | Spotify removed endpoint |

## ✅ **What Works Great**

Despite limitations, the app provides excellent insights:
- ✅ Your most played tracks and artists
- ✅ Genre preferences and diversity
- ✅ Recent listening activity
- ✅ Listening patterns (when you listen)
- ✅ Popularity trends
- ✅ Beautiful visualizations
- ✅ Exportable reports

---

**Remember:** These limitations are from Spotify's API, not the app. We've built the best possible experience within these constraints! 🎵

