'use strict';

var _ = require('lodash');

module.exports = function (value, options) {
  if (!options) return value;

  if (_.isBoolean(options)) options = {};

  var message = options.message || '%(property)s is required';
  if (value === undefined || value === null) return message;
  return null;
};