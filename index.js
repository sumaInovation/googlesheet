

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { use } = require('passport');

const app = express();

app.use(express.json());
app.use(cookieParser('your-secret-key')); // For signed cookies

// Allow CORS
app.use(
  cors({
    origin: 'https://pptinovation.vercel.app', // Replace with your frontend domain
    credentials: true, // Allow cookies to be sent in cross-origin requests
  })
);

// Login route
app.post('/login', (req, res) => {
  const { username } = req.body;
   console.log(username);
  if (username) {
    // Set a secure cookie
    res.cookie('username', username, {
      httpOnly: true,
      secure: true, // Set to true in production (requires HTTPS)
      sameSite: 'None', // Required for cross-origin cookies
      signed: true, // For signed cookies
      maxAge: 7*60*60 * 1000, // 7 days
    });
    res.status(200).json({ message: 'Login successfuly' });
  } else {
    res.status(400).json({ message: 'Invalid username' });
  }
});

// Session route
app.get('/session', (req, res) => {
  const username = req.signedCookies.username;
   console.log(username);
  if (username) {
    res.status(200).json({ username });
  } else {
    res.status(401).json({ message: 'No active session' });
  }
});

// Logout route
app.post('/logout', (req, res) => {
  res.clearCookie('username', {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
  });
  res.status(200).json({ message: 'Logout successful' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
