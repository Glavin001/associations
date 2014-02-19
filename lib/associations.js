/*
 * feathers-associations
 * https://github.com/feathersjs/associations
 *
 * Copyright (c) 2014 David Luecke
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('lodash');
var Proto = require('uberproto');
var stripSlashes = function (name) {
  return name.replace(/^\/|\/$/g, '');
};

module.exports = function() {
  return function() {
    var app = this;

    Proto.mixin({
      _associations: {},

      associate: function(path, target) {
        this._associations[stripSlashes(path)] = target;
        return this;
      },

      setup: function() {
        var self = this;

        _.each(self.services, function(service, servicePath) {
          _.each(self._associations, function(target, assocationPath) {
            // If we are associating with this service
            if(assocationPath.indexOf(servicePath) === 0) {
              var targetService = app.lookup(_.isArray(target) ? target[0] : target);

              if(app.rest && app.enabled('feathers rest')) {
                app.get('/' + assocationPath, function(req, res, next) {
                  req.feathers.query = req.feathers.query || {};
                  _.extend(req.feathers.query, req.params);
                  next();
                }, app.rest.find(targetService));
              }

              // TODO
              // if(app.io && app.enabled('feathers socketio')) {}
              // if(app.primus && app.enabled('feathers primus')) {}
            }
          });
        });

        return this._super.apply(this, arguments);
      }
    }, app);
  };
};
