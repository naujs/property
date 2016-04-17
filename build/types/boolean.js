'use strict';

var _ = require('lodash');

module.exports = function boolean(value) {
  if (_.isBoolean(value)) return value;

  try {
    return !!JSON.parse(value);
  } catch (e) {
    return undefined;
  }
};