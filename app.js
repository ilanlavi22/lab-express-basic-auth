'use strict';

const path = require('path');
const express = require('express');
const expressSession = require('express-session');
const MongoStore = require('connect-mongo');
const hbs = require('hbs');
const createError = require('http-errors');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const serveFavicon = require('serve-favicon');
const baseRouter = require('./routes/base');
const authRouter = require('./routes/auth');
const { requireAuth, userSession } = require('./middleware/authMiddleWare');
const User = require('./models/user');

const app = express();

hbs.registerPartials(path.join(__dirname, 'views/partials'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(serveFavicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(
  sassMiddleware({
    src: path.join(__dirname, 'public/styles'),
    dest: path.join(__dirname, 'public/styles'),
    prefix: '/styles',
    outputStyle:
      process.env.NODE_ENV === 'development' ? 'expanded' : 'compressed',
    force: process.env.NODE_ENV === 'development',
    sourceMap: process.env.NODE_ENV === 'development'
  })
);

// Store Cookies using 'Express Session' and 'Connect Mongo' in DB
app.use(
  expressSession({
    name: 'newUser',
    secret: 'authapp',
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 // 1 day in milliseconds
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 60 * 60 // 60 minutes before connection is refreshed
    })
  })
);

app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));

app.locals.title = 'Express Auth';

app.use(authRouter);
app.use('*', userSession);
app.use('/', baseRouter);
app.get('/private', requireAuth, (req, res) =>
  res.render('private', { pageName: 'Private', private: true })
);
app.get('/profile', requireAuth, (req, res) =>
  res.render('profile', { pageName: 'Profile', profile: true })
);
app.get('/profile/edit', requireAuth, (req, res) =>
  res.render('profile_edit', { pageName: 'Profile', profile: true })
);

app.post('/profile/edit', requireAuth, (req, res, next) => {
  const userId = req.session.userId;
  const { profile } = req.body;
  User.findByIdAndUpdate(userId, { profile })
    .then(() => {
      res.status(302).redirect('/profile');
    })
    .catch((error) => {
      next(error);
    });
});

// Catch missing routes and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Catch all error handler
app.use((error, req, res, next) => {
  // Set error information, with stack only available in development
  res.locals.message = error.message;
  res.locals.error = req.app.get('env') === 'development' ? error : {};
  res.status(error.status || 500);
  res.render('error');
});

module.exports = app;
