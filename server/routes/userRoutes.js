const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

const router = express.Router();

// Register user api
router.post('/register', async (req, res) => {
  try {
    console.log('Request Body:', req.body); // Log the request body
    const { name, email, password} = req.body;
    console.log('Email:', email); // Log the extracted email
    if (!name || !email || !password) {
      return res.status(400).send({ error: 'All fields are required' });
    }
    // Check if user is already registered
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).send({ error: 'Email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword}); // Ensure email is included
    res.status(201).send(user);
  } catch (err) {
    console.error('Error:', err); // Log errors
    res.status(400).send(err);
  }
});

// Login api
router.post('/login', (req, res, next) => {
  // Use Passport's authentication method
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      // Handle server errors
      console.error('Login error:', err);
      return res.status(500).send({ error: 'An internal server error occurred' });
    }

    if (!user) {
      // If the user is not found or the password is incorrect
      return res.status(401).send({ error: info.message });
    }

    // If authentication succeeds, log the user in
    req.login(user, (err) => {
      if (err) {
        console.error('Error during login:', err);
        return res.status(500).send({ error: 'Login failed' });
      }

      // Successful login response
      return res.status(200).send({ message: 'Logged in successfully' });
    });
  })(req, res, next);
});

// Logout route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send({ error: "Logout failed" });
    req.session.destroy((err) => {
      if (err) return res.status(500).send({ error: "Session destruction failed" });
      res.clearCookie("connect.sid", { path: "/" }); // Ensure the session cookie is cleared
      res.status(200).send({ message: "Logged out successfully" });
    });
  });
});

// GET /get-user - Fetch authenticated user's data
router.get("/get-user",  async (req, res) => {
  try {
    // Check if the user is authenticated
    if (!req.user) {
      return res.status(401).send({ error: "User is not authenticated." });
    }
    // Fetch the user data from the database using the user ID (from req.user)
    const user = await User.findByPk(req.user.id);
    // If user is not found, return an error
    if (!user) {
      return res.status(401).send({ error: "User not found." });
    }
    // Return the user data
    return res.json({
      user,
      message: "User data fetched successfully.",
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send({ error: "An error occurred while fetching user data." });
  }
});



module.exports = router;
