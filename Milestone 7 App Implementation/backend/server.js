// Import necessary modules
const express = require('express');
const app = express();
const cors = require('cors');
const connection = require('./db');
const helmet = require('helmet');

// Import routes
const UserRoutes = require('./routes/users');
const AuthRoutes = require('./routes/auth');
const SchoolDonationRoutes = require('./routes/schooldonations');
const ElderDonationRoutes = require('./routes/elderDonations');
const foodRoutes = require('./routes/foodRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const FoodSubmissionRoutes = require('./routes/FoodSubmissionRoutes');

// Connect to database
connection();

// Middleware setup
app.use(express.json());

app.use(cors({
    origin: '*', // Allow all origins (for development; be specific in production)
  }));


app.use(helmet()); 

//test route
app.get('/', (req, res) => {
    res.send('Hi From Hunger Busters API v1 \n;]');
});

//Routes
app.use('/api/v1/users', UserRoutes);
app.use('/api/v1/auth', AuthRoutes);
app.use('/api/v1/school-donations', SchoolDonationRoutes);
app.use('/api/v1/elder-donations', ElderDonationRoutes);
app.use('/api/foods', foodRoutes);


// Define the port for the server to listen on
const port = process.env.PORT || 3543;

// Start the server
app.listen(port, () => console.log(`Server listening on port ${port}...`));

// Export the Express app
module.exports = app;