const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport'); // Import passport
const http = require('http'); // Missing import for 'http'
const { Server } = require('socket.io');
require('dotenv').config(); // Ensure this is loaded before using environment variables
require('./config/passport'); // Import passport configuration
const sequelize = require('./config/database'); // Your Sequelize instance
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Initialize Express app
const app = express();

// Create HTTP server for socket.io
const server = http.createServer(app);

// Initialize socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // React frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});



// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // React frontend URL
  credentials: true, // Allow credentials (cookies)
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session saving configuration 
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'defaultSecret', // Use a secure secret
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // Prevent JavaScript access
      secure: process.env.NODE_ENV === 'production', // Secure cookies in production
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Required for cross-origin cookies in production
      // used for secure https request for deploying on render thats why i added this
    },
  })
); 

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Sync database and start server
const port = process.env.PORT || 5000;

sequelize.sync({ force: true })  // force true: delete all data and create new table, if false data will remain same
  .then(() => {
    server.listen(port, () => { 
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to sync database:", error);
  });
