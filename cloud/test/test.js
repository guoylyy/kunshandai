var should = require('should');
var express = require('express'),
  Route = express.Route,
  assert = require('assert');
var request = require('supertest');
var winston = require('winston');
var jsdom = require("jsdom");
var jquery = require('jquery');

function log(s) {
  console.log(s);
}

describe('Route', function() {
  var url = 'http://localhost:3000/v1';
  before(function(done) {
    done();
  });

  describe('login as user', function() {
    this.timeout(4000);
    var mobilePhoneNumber = "18516171260";
    var password = "abc123";

    it('should login as a user', function (done) {

      var params = {
        mobilePhoneNumber : mobilePhoneNumber,
        password : password
      };

      request(url)
        .post('/account/login')
        .send(params)
        .end(function (err, res) {
          if (err) {
            throw err;
          }
          res.status.should.equal(200);
          done();
        });
    });

  });
});