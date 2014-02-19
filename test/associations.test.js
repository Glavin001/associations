'use strict';
var assert = require('assert');
var request = require('supertest');

var feathers = require('feathers');
var associations = require('../lib/associations');

var port = 8080;

describe('Feathers associations', function () {
  it('initializes .associate', function () {
    var app = feathers().configure(associations());

    assert.equal(typeof app.associate, 'function', 'Associate method got added');
  });

  it('associates RESTful one to one', function() {
    feathers().configure(associations())
      .use('/users', {

      })
      .use('/posts', {

      })
      .associate('/users/:userId/account', 'accounts');
      // TODO: Add test

  });

  it('associates RESTful one to many', function(done) {
    var app = feathers().configure(associations())
      .use('/users', {
        find: function(params, callback) {
          callback(null, [{
            id: 0,
            name: 'testuser'
          }]);
        }
      })
      .use('/posts', {
        find: function(params, callback) {
            console.log('find posts');
          callback(null, [{
            id: 0,
            type: 'post',
            user: params.query.userId
          }, {
            id: 1,
            type: 'post',
            user: params.query.userId
          }]);
        }
      })
      .associate('/users/:userId/posts', ['posts']);
      
      var server = app.listen(port, function() {
        var userId = 1;
          request(app)
          .get('/users/'+userId+'/posts')
          .expect(200)
          .end(function(err, res) {
            if (err) {
                return done(err);
            }
            server.close();
            assert.equal(res.body[0].user, userId);
            assert.equal(res.body[1].user, userId);
            done();
           });
      });
  });

});
