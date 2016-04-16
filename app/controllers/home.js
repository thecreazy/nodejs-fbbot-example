var express = require('express'),
  router = express.Router(),
  Article = require('../models/article');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  var articles = [new Article(), new Article()];
    res.render('index', {
      title: 'Generator-Express MVC',
      articles: articles
    });
});

router.get('/webhook', function (req, res, next) {
  if (req.query['hub.verify_token'] === 'CAAYs2ZCX4bPsBAIFzomk6DvZBnczQxTr9IRn5kotcZCJqzBlbFeNxet0O2ZB1HookjngJ0h4Rs1F0ZC3ldt1916oZCi2S1qmk75JCela5W676wk3HxzAOKoO3upU40Sp6YGSOx8SmhRCfP7tbZC17A6zr1ZAvHFI0Co9JZAZBTUNOmDDme1g3sFNssnoWZBXy2UUNMNmjYl39HWAQZDZD') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});