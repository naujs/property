'use strict';

var _ = require('lodash');

module.exports = function string(value) {
  if (value === undefined) return value;
  return _.toString(value);
};