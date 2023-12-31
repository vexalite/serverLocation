const express = require('express');
const bodyParser = require('body-parser');
const Redis = require('ioredis');

const app = express();

// Create a Redis client
const redisClient = new Redis({
  host: 'redis-10113.c301.ap-south-1-1.ec2.cloud.redislabs.com',
  port: 10113,
  password: 'JwDHHRmHg3UYIjpNftcr8jjm2tXcMelc',
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// Middleware for parsing JSON requests
app.use(bodyParser.json());

// Endpoint for receiving location data from devices
app.post('/api/location/:id', async (req, res) => {
  try {
    const { device, latitude, longitude, driverName, busNumber } = req.body;
    // Save location data to Redis stream
    const locationData = {
      device,
      latitude,
      longitude,
      timestamp: new Date(),
      driverName,
      busNumber
    };
  
    // Use the xadd method to add data to a Redis stream
    await redisClient.xadd('locationStream', '*', 'location', JSON.stringify(locationData));

    res.status(201).json({ message: 'Location data received and saved.' });
  } catch (error) {
    console.error('Error saving location data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// API endpoint to query location data based on criteria (e.g., time range)
// API endpoint to query location data based on busNumber
app.get('/api/location/:busNumber', async (req, res) => {
    try {
      // Extract the bus number from the URL parameter
      const busNum = req.params.busNumber;
      console.log(busNum);
      
      // Use the xrange method to fetch data from the Redis stream
      const locationData = await redisClient.xrange('locationStream', '-', '+');
      
      // Extract and filter the data based on busNumber
      const extractedData = locationData
        .map(([messageId, message]) => JSON.parse(message[1]))
        .filter(data => data.busNumber === busNum);
      
      res.status(200).json(extractedData);
    } catch (error) {
      console.error('Error fetching location data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

// Start the Express server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
