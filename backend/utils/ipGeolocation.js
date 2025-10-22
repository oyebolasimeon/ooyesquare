const axios = require('axios');

// Get IP address from request
const getClientIP = (req) => {
  // Check various headers that might contain the real IP
  const forwarded = req.headers['x-forwarded-for'];
  const real = req.headers['x-real-ip'];
  const cloudflare = req.headers['cf-connecting-ip'];
  
  if (forwarded) {
    // X-Forwarded-For can contain multiple IPs, get the first one
    return forwarded.split(',')[0].trim();
  }
  
  if (real) {
    return real;
  }
  
  if (cloudflare) {
    return cloudflare;
  }
  
  // Fallback to socket address
  return req.socket.remoteAddress || req.connection.remoteAddress;
};

// Geolocate IP address using ip-api.com (free, no API key required)
const geolocateIP = async (ipAddress) => {
  try {
    // Skip geolocation for local/private IPs
    if (!ipAddress || 
        ipAddress === '::1' || 
        ipAddress === '127.0.0.1' || 
        ipAddress.startsWith('192.168.') ||
        ipAddress.startsWith('10.') ||
        ipAddress.startsWith('172.')) {
      return {
        city: 'Local',
        region: 'Local',
        country: 'Local',
        timezone: 'Local',
        coordinates: {
          latitude: null,
          longitude: null
        }
      };
    }

    // Use ip-api.com for geolocation (free tier: 45 requests/minute)
    const response = await axios.get(`http://ip-api.com/json/${ipAddress}`, {
      timeout: 5000 // 5 second timeout
    });

    if (response.data && response.data.status === 'success') {
      return {
        city: response.data.city || 'Unknown',
        region: response.data.regionName || 'Unknown',
        country: response.data.country || 'Unknown',
        timezone: response.data.timezone || 'Unknown',
        coordinates: {
          latitude: response.data.lat || null,
          longitude: response.data.lon || null
        }
      };
    }

    // If geolocation fails, return unknown
    return {
      city: 'Unknown',
      region: 'Unknown',
      country: 'Unknown',
      timezone: 'Unknown',
      coordinates: {
        latitude: null,
        longitude: null
      }
    };
  } catch (error) {
    console.error('IP Geolocation error:', error.message);
    // Return unknown on error
    return {
      city: 'Unknown',
      region: 'Unknown',
      country: 'Unknown',
      timezone: 'Unknown',
      coordinates: {
        latitude: null,
        longitude: null
      }
    };
  }
};

module.exports = {
  getClientIP,
  geolocateIP
};

