const express = require('express');
const session = require('cookie-session');
const helmet = require('helmet');
const hpp = require('hpp');
const csurf = require('csurf');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
/* Create Express App123 */
const app = express();


// Allow requests from your React app
const corsOptions = {
    origin: ['http://localhost:3000','https://pptinovation.vercel.app'], // React app URL during development
    credentials: true, // Allow cookies to be sent with requests
};
app.use(cors(corsOptions));

/* Set Security Configs */
app.use(
    helmet({
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                "script-src": ["'self'"],
            },
        },
    })
);
app.use(hpp());

/* Set Cookie Settings */
app.use(
    session({
        name: 'session',
        secret: 'secretKeyWooo',
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Secure cookies in production
            maxAge: 60 * 60 * 1000,
        },
    })
);

/* Rate Limiting */
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

/* CSRF Protection */
app.use(csurf());
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

/* Error Handling for CSRF */
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        res.status(403).send('Invalid CSRF token');
    } else {
        next(err);
    }
});
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});
/* Start Server */
app.listen(5000, () => {
    console.log("I'm listening!");
});
