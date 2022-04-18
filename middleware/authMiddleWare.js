const User = require('../models/user');

const userSession = (req, res, next) => {
  const userId = req.session.userId;
  if (userId) {
    User.findById(userId)
      .then((user) => {
        req.user = user;
        res.locals.user = user;
        next();
      })
      .catch((error) => {
        // We're telling express to execute the catch all error handler
        next(error);
      });
  } else {
    res.locals.user = null;
    // We tell express to move on and handle the request elsewhere
    next();
  }
};

const requireAuth = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
    next();
  }
};

module.exports = {
  requireAuth,
  userSession
};
