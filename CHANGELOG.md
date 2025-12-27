# Changelog

All notable changes to the Spotify Stats project will be documented in this file.

## [Unreleased]

### Removed - December 2025
- **BREAKING**: Removed `/audio-features` API dependency (deprecated by Spotify)
  - Removed `spotifyAPI.getAudioFeatures()` function
  - Removed `analytics.analyzeAudioFeatures()` function
  - Removed audio profile sections from Dashboard, Year in Review, and Reports
  - See `AUDIO_FEATURES_REMOVAL.md` for full migration guide

### Added - December 2025
- **Dashboard**: New "Music Taste Analysis" section with popularity metrics
  - Average popularity score
  - Popular tracks count (>70 popularity)
  - Hidden gems count (<40 popularity)
  
- **Year in Review**: New "Listening Habits" section
  - Average track length
  - Longest track in collection
  - Total listening time in hours
  
- **Reports**: New "Popularity Analysis" section
  - Average popularity
  - Mainstream track count
  - Hidden gems count

### Changed - December 2025
- Improved performance by removing one API call per page load
- Simplified analytics processing
- Updated `generateYearStats()` to work without audio features parameter

### Fixed - December 2025
- OAuth callback query string preservation in `.htaccess`
- Removed conflicting auth guard from `App.vue`
- Enhanced callback logging for better debugging

---

## [1.0.0] - Initial Release

### Added
- Secure OAuth 2.0 PKCE authentication with Spotify
- Dashboard with overview statistics
- Top 50 tracks view with time ranges
- Top 50 artists view with time ranges
- Genre analysis with charts
- Year in Review summary
- Listening patterns analysis
- Activity calendar (14 days)
- PDF report generation
- Responsive design for all devices
- Apache deployment support with `.htaccess`
- Comprehensive documentation

### Features
- **Authentication**
  - OAuth 2.0 PKCE flow
  - Token management
  - Secure logout
  
- **Data Views**
  - Dashboard overview
  - Top Charts (tracks, artists, genres)
  - Year in Review
  - Listening Pulse (patterns & calendar)
  - Reports (PDF generation)
  
- **Analytics**
  - Genre extraction and analysis
  - Listening pattern detection
  - Diversity scoring
  - Popularity trends
  
- **Visualizations**
  - Bar charts (genres, day patterns)
  - Doughnut charts (genre breakdown)
  - Line charts (hour patterns)
  - Progress bars (various metrics)
  - Activity heatmaps
  
- **Time Ranges**
  - Last 4 weeks (short_term)
  - Last 6 months (medium_term)
  - All time (long_term)
  
- **Export**
  - PDF report generation
  - Customizable report content
  - Professional layouts

### Technical
- Vue 3 with Composition API
- Vite build system
- Tailwind CSS styling
- Chart.js visualizations
- Vue Router for navigation
- Axios for API calls
- jsPDF for report generation

### Documentation
- Complete README
- Quick Start guide
- Setup instructions
- Feature documentation
- Development guide
- Deployment guide
- Troubleshooting guides

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 1.0.0 | Dec 2025 | Initial release with full features |
| 1.1.0 | Dec 2025 | Removed audio features, added popularity analysis |

---

## Upgrade Guide

### From 1.0.0 to 1.1.0

**Breaking Changes:**
- Audio features removed (API deprecated by Spotify)

**Action Required:**
1. Pull latest code
2. Rebuild: `npm run build`
3. Deploy updated build
4. Clear browser cache

**What Changed:**
- Dashboard: Audio profile → Music taste analysis
- Year Review: Music vibe → Listening habits
- Reports: Audio profile → Popularity analysis

**No Data Loss:** All your Spotify data remains intact.

See `AUDIO_FEATURES_REMOVAL.md` for detailed migration guide.

---

## Future Roadmap

### Planned Features
- [ ] Playlist analysis
- [ ] Social sharing capabilities
- [ ] Dark/light theme toggle
- [ ] Custom date range selection
- [ ] Historical data comparison
- [ ] Export to CSV
- [ ] Multiple language support
- [ ] Advanced filtering options

### Under Consideration
- [ ] Collaborative features
- [ ] Music recommendations
- [ ] Integration with other music services
- [ ] Mobile app version
- [ ] Desktop app version

---

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## Support

For issues, questions, or feature requests:
- Check the documentation in the project root
- Review troubleshooting guides
- Open an issue on GitHub

---

**Maintained by:** BuenGenio  
**License:** ISC  
**Repository:** spotify-stats

