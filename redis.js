const express = require('express');
const bodyParser = require('body-parser');
const Redis = require('ioredis');

const app = express();
const port = process.env.PORT || 3000;

// Create a Redis client
const redisClient = new Redis({
    host: 'redis-10113.c301.ap-south-1-1.ec2.cloud.redislabs.com',
    port: 10113,
    password: 'JwDHHRmHg3UYIjpNftcr8jjm2tXcMelc',
});

// Handle Redis connection errors
redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// Middleware for parsing JSON requests
app.use(bodyParser.json());

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Create a Redis stream for a user
app.post('/api/user/:userId/stream', async (req, res) => {
    try {
      const { streamName } = req.body;
  
      // Use the XGROUP CREATE command to create a consumer group for the stream
      await redisClient.xgroup('CREATE', streamName, 'myGroup', '$', 'MKSTREAM');
  
      res.status(201).json({ message: 'Stream created successfully' });
    } catch (error) {
      console.error('Error creating user stream:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Add data to a user's stream
  app.post('/api/user/:userId/stream/:streamName', async (req, res) => {
    try {
      const { userId, streamName } = req.params;
    //   console.log(req.body)
      const { data } = req.body;
  
      // Use the XADD command to add data to the user's stream
      await redisClient.xadd(streamName, '*', 'data', JSON.stringify(data));
  
      res.status(201).json({ message: 'Data added to the stream' });
    } catch (error) {
      console.error('Error adding data to user stream:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  
  });
  
  // Query data from a user's stream
  app.get('/api/user/:userId/stream/:streamName', async (req, res) => {
    try {
      const { userId, streamName } = req.params;
  
      // Use the XRANGE command to fetch data from the user's stream
      const streamData = await redisClient.xrange(streamName, '-', '+');
  
      // Extract and return the data
      const extractedData = streamData.map(([messageId, message]) => {
        // Check if message.data is defined before parsing it as JSON
        // console.log(JSON.parse(message[1]))

        const data = message && message[1] ? JSON.parse(message[1]) : null;

        return {
          data,
        };
      });
  
      res.status(200).json(extractedData);
    } catch (error) {
      console.error('Error fetching data from user stream:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  