const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Cache for user data to avoid repeated database queries
const userCache = {};

// Passport local strategy for authentication
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password' });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serialize user into session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  console.log(`Deserializing user with ID: ${id}`);
  try {
    if (userCache[id]) {
      console.log(`Using cached user with ID: ${id}`);
      return done(null, userCache[id]);
    }

    console.log(`Fetching user with ID: ${id} from database`);
    const user = await User.findByPk(id);
    userCache[id] = user; // Cache the user
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;