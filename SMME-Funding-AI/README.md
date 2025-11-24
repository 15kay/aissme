# SMME Funding AI - Backend Setup

## Quick Start

1. **Install Node.js** (if not installed)
2. **Run the application:**
   ```
   double-click start.bat
   ```
3. **Open browser:** http://localhost:3000

## Manual Setup

```bash
# Install dependencies
npm install

# Start server
npm start
```

## API Endpoints

- `GET /api/applications` - Get all applications
- `PUT /api/applications/:id/status` - Update application status
- `GET /api/metrics` - Get dashboard metrics
- `POST /api/funds` - Create new fund
- `GET /api/recommendations` - Get AI recommendations

## Features

✅ **Real-time data** - Applications and metrics update automatically
✅ **Status management** - Approve/reject applications
✅ **Fund creation** - Create new funding opportunities
✅ **Live metrics** - Track SMMEs funded, jobs created, ROI
✅ **Auto-refresh** - Data updates every 30 seconds

## Files

- `server.js` - Backend API server
- `donor-portal-backend.html` - Frontend with backend integration
- `package.json` - Dependencies
- `start.bat` - Quick start script