'use strict';

module.exports = function array(type) {
  var check = require('./' + type);

  return function (value) {
    if (value === undefined) {
      return value;
    }

    if (!Array.isArray(value)) return undefined;
    return value.map(check);
  };
};