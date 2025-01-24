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

const isProduction = process.env.NODE_ENV === 'production';
// Trust proxies in production (required for Render or similar platforms)
if (isProduction) {
  app.set('trust proxy', 1); // Trust the first proxy i used render for deployment thats why I'm doing all this
}
// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'defaultSecret', // Use a secure secret
    resave: false, // Do not save session if unmodified
    saveUninitialized: false, // Do not create session until something is stored
    cookie: {
      httpOnly: true, // Prevent JavaScript access
      secure: isProduction, // Use secure cookies in production
      sameSite: isProduction ? 'none' : 'lax', // Cross-origin support in production
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

sequelize.sync({ force: false })  // force true: delete all data and create new table, if false data will remain same
  .then(() => {
    server.listen(port, () => { 
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to sync database:", error);
  });
