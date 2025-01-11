// const express = require('express');
// const session = require('express-session');
// const cors = require('cors');

// const app = express();

// // Enable CORS for your React app
// app.use(
//   cors({
//     origin: 'https://pptinovation.vercel.app', // Frontend URL
//     credentials: true, // Allow cookies
//   })
// );

// // Session configuration
// app.use(
//   session({
//     secret: 'your-secret-key', // Change this to a secure key
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
//       secure: false, // Set true if using HTTPS
//       maxAge: 24 * 60 * 60 * 1000, // 1 day
//     },
//   })
// );

// app.use(express.json());

// // User login endpoint
// app.post('/login', (req, res) => {
//   const { username } = req.body;

//   if (username) {
//     req.session.username = username; // Store username in session
//     res.status(200).json({ message: 'Login successful', username });
//   } else {
//     res.status(400).json({ message: 'Invalid username' });
//   }
// });

// // Check session endpoint
// app.get('/session', (req, res) => {
//   if (req.session.username) {
//     res.status(200).json({ username: req.session.username });
//   } else {
//     res.status(401).json({ message: 'No active session' });
//   }
// });

// // User logout endpoint
// app.post('/logout', (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       return res.status(500).json({ message: 'Logout failed' });
//     }
//     res.clearCookie('connect.sid'); // Clear the session cookie
//     res.status(200).json({ message: 'Logout successful' });
//   });
// });

// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


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
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
