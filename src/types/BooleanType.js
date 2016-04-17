var Type = require('./Type')
  , required = require('./common/required')
  , validator = require('validator')
  , _ = require('lodash');

class BooleanType extends Type {
  filter(value) {
    if (value === undefined) return value;
    if (_.isBoolean(value)) return value;

    try {
      return !!JSON.parse(value);
    } catch (e) {
      return undefined;
    }
  }

  validate(value, context) {
    if (!_.isBoolean(value) && value !== undefined && value !== null) {
      this.addError('Invalid number');
    }
    return this.getErrors();
  }
}

BooleanType.rules = {
  'required': required
};

module.exports = BooleanType;
