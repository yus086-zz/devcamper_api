const express = require ('express');
const dotenv = require ('dotenv');
const morgan = require ('morgan');
const colors = require ('colors');
const cookieParser = require ('cookie-parser');
const errorHandler = require ('./middleware/error');
const connectDB = require ('./config/db');

// Load env vars
dotenv.config ({path: './config/config.env'});

// Connect to database
connectDB ();

// Route files
const bootcamps = require ('./routes/bootcamps');
const courses = require ('./routes/courses');
const auth = require ('./routes/auth');

const app = express ();

// Body parser
app.use (express.json ());

// Cookie Parser
app.use (cookieParser ());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use (morgan ('dev'));
}

// Mount Routers
app.use ('/api/v1/bootcamps', bootcamps);
app.use ('/api/v1/courses', courses);
app.use ('/api/v1/auth', auth);

app.use (errorHandler);

app.get ('/', (req, res) => {
  res.status (200).send ('Web Server is Running on');
});

const PORT = process.env.PORT || 5000;

const server = app.listen (PORT, () => {
  console.log (
    `Server is running on ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .bold
  );
});

// Handle unhandled promise rejections
process.on ('unhandledRejection', (err, promise) => {
  console.log (`Error: ${err.message}`.red);

  // Close server & exit pricess
  server.close (() => {
    process.exit (1);
  });
});
