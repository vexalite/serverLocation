// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');

// // Create an Express application
// const app = express();

// // Connect to MongoDB (replace 'mongodb://localhost/locationdb' with your MongoDB URL)
// mongoose.connect('mongodb+srv://sahil:mongo123@cluster0.qvrhn.mongodb.net/?retryWrites=true&w=majority', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // Create a MongoDB schema and model for location data
// const locationSchema = new mongoose.Schema({
//   device: String,
//   latitude: Number,
//   longitude: Number,
//   timestamp: { type: Date, default: Date.now },
// });

// const Location = mongoose.model('Location', locationSchema);

// // Middleware for parsing JSON requests
// app.use(bodyParser.json());

// // Endpoint for receiving location data from devices
// app.post('/api/location', async (req, res) => {
//   try {
//     const { device, latitude, longitude } = req.body;

//     // Save location data to MongoDB
//     const location = new Location({ device, latitude, longitude });
//     await location.save();

//     res.status(201).json({ message: 'Location data received and saved.' });
//   } catch (error) {
//     console.error('Error saving location data:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // API endpoint to query location data based on criteria (e.g., time range)
// app.get('/api/location', async (req, res) => {
//   try {
//     // Implement your query logic here (e.g., filtering by device, time range, etc.)
//     const locationData = await Location.find().exec();

//     res.status(200).json(locationData);
//   } catch (error) {
//     console.error('Error fetching location data:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Start the Express server
// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
