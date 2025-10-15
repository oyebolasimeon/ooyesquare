# Crimson Arc - Backend

Node.js/Express API server for the Crimson Arc application.

## Overview

This is a RESTful API server built with Express.js, featuring CORS support, environment-based configuration, and modular structure.

## Tech Stack

- **Node.js** - JavaScript runtime environment
- **Express.js v5** - Fast, unopinionated web framework
- **CORS** - Enable Cross-Origin Resource Sharing
- **dotenv** - Load environment variables
- **nodemon** - Development auto-reload

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
PORT=3000
NODE_ENV=development
```

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on the port specified in your `.env` file (default: 3000).

## API Endpoints

### Root Endpoint
```
GET /
```
Returns a welcome message and server information.

**Response:**
```json
{
  "message": "Welcome to Crimson Arc Backend API",
  "version": "1.0.0",
  "status": "running"
}
```

### Health Check
```
GET /api/health
```
Returns the health status of the server.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-15T12:00:00.000Z"
}
```

## Project Structure

```
backend/
├── index.js           # Main application file
├── package.json       # Dependencies and scripts
├── .env              # Environment variables (not in git)
├── .gitignore        # Git ignore rules
└── README.md         # This file
```

## Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with nodemon

## Features

- ✅ RESTful API architecture
- ✅ CORS enabled for frontend communication
- ✅ Environment-based configuration
- ✅ JSON request/body parsing
- ✅ URL-encoded body parsing
- ✅ Error handling middleware
- ✅ Development auto-reload

## Development

### Adding New Routes

1. Define your route in `index.js`:
```javascript
app.get('/api/your-endpoint', (req, res) => {
  res.json({ message: 'Your response' });
});
```

2. For complex applications, consider creating separate route files:
```javascript
// routes/users.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ users: [] });
});

module.exports = router;

// In index.js
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);
```

### Error Handling

The application includes a global error handler. To throw errors:

```javascript
app.get('/api/example', (req, res, next) => {
  try {
    // Your logic here
    throw new Error('Something went wrong');
  } catch (error) {
    next(error);
  }
});
```

## Next Steps

- [ ] Add database integration (MongoDB, PostgreSQL, etc.)
- [ ] Implement authentication (JWT, OAuth, etc.)
- [ ] Add input validation (express-validator)
- [ ] Implement logging (Winston, Morgan)
- [ ] Add API documentation (Swagger)
- [ ] Set up testing (Jest, Mocha)
- [ ] Add rate limiting
- [ ] Implement caching (Redis)

## Dependencies

### Production
- `express` - Web framework
- `cors` - CORS middleware
- `dotenv` - Environment variable loader

### Development
- `nodemon` - Auto-reload during development

## Troubleshooting

### Port Already in Use
If you get an "EADDRINUSE" error, either:
1. Change the PORT in your `.env` file
2. Kill the process using the port:
   ```bash
   lsof -ti:3000 | xargs kill
   ```

### CORS Issues
Make sure CORS is properly configured in `index.js` and the frontend is making requests to the correct backend URL.

## License

ISC

