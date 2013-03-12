var should = require('should');
var portFinder = require('portfinder')
var http = require('http')
var request = require('request')
var inspect = require('eyespect').inspector({maxLength:10820});
var middleware = require('../index')
var express = require('express')
describe('Middleware', function () {
  var role = 'middlewareTestServer'
  var app, server, port
  before(function (done) {
    portFinder.getPort(function (err, portReply) {
      should.not.exist(err)
      should.exist(portReply)
      port = portReply
      done()
    })
  })
  after(function () {
    server.close()
  })
  it('should load middleware correctly', function (done) {
    var logger = {
      debug: function (msg, data) {
        done()
      }
    }
    app = express()
    var data = {
      config: {},
      logger: logger,
      db: {},
      app: app,
      role: role
    }
    middleware(data)

    app.get('/ping', function (req, res) {
      res.end('pong')
    })
    app.get('/pong', function (req, res) {
      res.end('ping')
    })
    server = http.createServer(app)
    server.listen(port)
    var url = 'http://localhost:'+port + '/ping'
    request(url, function (err, res, body) {
      should.not.exist(err)
      res.statusCode.should.eql(200)
    })
  })
})
