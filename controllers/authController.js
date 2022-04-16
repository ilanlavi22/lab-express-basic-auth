const User = require('../models/user');

module.exports.signup_get = (req, res) => {
  res.render('signup', { pageName: 'Signup' });
};
module.exports.signup_post = (req, res, next) => {
  const { username, password } = req.body;
  User.create({ username, password })
    .then((user) => {
      res.redirect('/');
    })
    .catch((error) => {
      next(error);
    });
};
