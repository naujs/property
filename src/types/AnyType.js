var Type = require('./Type')
  , required = require('./common/required')
  , validator = require('validator');

class AnyType extends Type {
  filter(value) {
    return value;
  }

  validate(value, context) {
    return null;
  }
}

AnyType.rules = {
  'required': required
};

module.exports = AnyType;
