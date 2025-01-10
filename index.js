const express = require('express');
const cors = require('cors');
const session = require('express-session');
const app = express();

// Trust proxy if behind one (e.g., Vercel)
app.set('trust proxy', 1);

// CORS Configuration for allowing cross-origin requests from React
const corsOptions = {
  origin: ['http://localhost:3000', 'https://pptinovation.vercel.app'],  // React app origin
  methods: ['GET', 'POST'],
  credentials: true,  // Allows cookies to be sent with requests
};

app.use(cors(corsOptions));

// Session middleware setup
app.use(session({
  secret: 'your-secret-keys', // Replace with a strong secret key
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true, // Prevents client-side scripts from accessing the cookie
    secure: process.env.NODE_ENV === 'production', // Ensures cookies are sent over HTTPS in production
    sameSite: 'none', // Allows cookies to be sent in cross-origin requests
    maxAge: 1000 * 60 * 60 * 24, // Cookie expiration (1 day)
  },
}));
// Sample route for login to set a session
app.post('/login', (req, res) => {
  req.session.user = { id: 1, name: 'John Doe' };
  res.json({ message: 'Logged in successfully' });
});

// Sample route for checking the session
app.get('/user', (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// Logout route to destroy the session
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to log out' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Set the port
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
