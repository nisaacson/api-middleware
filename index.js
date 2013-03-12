var passport = require('passport');
var express = require('express');
var should = require('should');
var rk = require('required-keys');
module.exports = function(data) {
  var keys = ['config', 'logger', 'db', 'app', 'role'];
  var type = data.role
  var err = rk.truthySync(data, keys);
  should.not.exist(err, 'missing key when setting up api middleware: ' + err);
  var config = data.config;
  var logger = data.logger;
  var db = data.db;
  var app = data.app;
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(passport.initialize());
  app.use(function (req, res, next) {
    logger.debug('request received', {
      type: type,
      service: 'docparse',
      url: req.url,
      body: req.body,
      headers: req.headers,
      query: req.query
    })
    req.config = config;
    req.db = db;
    req.logger = logger;
    next();
  });
  app.use(app.router);
}
