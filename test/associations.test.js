var assert = require('assert');

var feathers = require('feathers');
var associations = require('../lib/associations');

describe('Feathers associations', function () {
  it('initializes .associate', function () {
    var app = feathers().configure(associations());

    assert.equal(typeof app.associate, 'function', 'Associate method got added');
  });

  it('associates RESTful one to one', function() {
    var app = feathers().configure(associations())
      .use('/users', {

      })
      .use('/posts', {

      })
      .associate('/users/:userId/account', 'accounts');
  });
});
