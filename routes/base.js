const { Router } = require('express');

const baseRouter = Router();

baseRouter.get('/', (req, res, next) => {
  res.render('index', { pageName: 'Home' });
});

module.exports = baseRouter;
