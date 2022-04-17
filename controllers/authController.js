const User = require('../models/user');
const bcrypt = require('bcryptjs');

module.exports.signup_get = (req, res) => {
  res.render('signup', { pageName: 'Signup' });
};

module.exports.signup_post = (req, res, next) => {
  const { username, password } = req.body;
  User.create({ username, password })
    .then((user) => {
      req.session.userId = user._id;
      res.redirect('/private', { user });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports.login_get = (req, res) => {
  res.render('login', { pageName: 'Login' });
};

module.exports.login_post = (req, res, next) => {
  const { username, password } = req.body;
  let user;
  User.findOne({ username })
    .then((doc) => {
      user = doc;
      if (user === null) {
        throw new Error('There is no user with that email.');
      } else {
        return bcrypt.compare(password, user.password);
      }
    })
    .then((comparisonResult) => {
      if (comparisonResult) {
        req.session.userId = user._id;
        res.redirect('/private');
      } else {
        throw new Error('Wrong password');
      }
    })
    .catch((error) => {
      next(error);
    });
};

module.exports.logout_get = (req, res) => {
  req.session.destroy();
  console.log(req.session);
  res.redirect('/');
};

module.exports.private_get = (req, res) => {
  res.render('private', { pageName: 'Private' });
};
