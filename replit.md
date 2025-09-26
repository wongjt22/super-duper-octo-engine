# Wikipedia Landmarks Map

Interactive map application displaying Wikipedia landmarks within the current map viewport.

## Current Architecture
- **Frontend**: React + Vite with Leaflet maps
- **Backend**: Express.js API server
- **Storage**: In-memory storage (MemStorage)
- **Data Source**: Wikipedia API integration

## Known Issues (P0)
1. **N+1 HTTP requests** - Sequential calls to Wikipedia API for landmark details (slow and fragile)
2. **Missing request hygiene** - No User-Agent, timeouts, retries, or rate limiting
3. **Inefficient ID lookups** - O(n) scan instead of O(1) lookup for `getLandmarkById`

## Recent Changes
- Basic map functionality working
- Wikipedia API integration in place
- Landmark display and caching system implemented