'use strict';

var moment = require('moment');

module.exports = function date(value) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var date = moment(value, options.format);

  if (!date.isValid()) return undefined;

  return date.toDate();
};