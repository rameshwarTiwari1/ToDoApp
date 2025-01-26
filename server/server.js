const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport'); // Import passport
const http = require('http'); 
const { Server } = require('socket.io');
require('dotenv').config(); 
require('./config/passport'); // Import passport configuration
const sequelize = require('./config/database'); // Sequelize instance
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Initialize Express app
const app = express();

// Create HTTP server for socket.io
const server = http.createServer(app);

// Initialize socket.io
const io = new Server(server, {
  cors: {
    origin: ["https://todosite.vercel.app"], // React frontend URLs
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
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
  origin: ['https://todosite.vercel.app', 'https://todoapp-4t5z.onrender.com'], // React frontend URLs
  credentials: true, // Allow credentials (cookies)
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session saving configuration
app.set("trust proxy", 1); // Trust first proxy

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'defaultSecret', // Use a secure secret
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // Prevent JavaScript access
      secure: process.env.NODE_ENV === 'production', // Secure cookies in production
      sameSite:"none", // Required for cross-origin cookies in production
    },
  })
);

// Passport initialization  
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

app.use((req, res, next) => {
  console.log("Session Data:", req.session);
  next();
});


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
