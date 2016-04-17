var Type = require('./Type')
  , required = require('./common/required')
  , validator = require('validator')
  , _ = require('lodash');

class NumberType extends Type {
  filter(value) {
    return _.toNumber(value);
  }

  validate(value, context) {
    var min = this.getOption('min')
      , max = this.getOption('max')
      , message = this.getOption('message');

    if (!_.isNumber(value) && value !== undefined && value !== null) {
      this.addError('Invalid number');
      return this.getErrors();
    }

    if (min !== undefined && max !== undefined && (value < min || value > max)) {
      this.addError('%(property)s must be less than %(max)d and greater than %(min)d');
    } else if (min !== undefined && value < min) {
      this.addError('%(property)s must be greater than %(min)d');
    } else if (max !== undefined && value > max) {
      this.addError('%(property)s must be less than %(max)d');
    }

    return this.getErrors();
  }
}

NumberType.rules = {
  'required': required
};

module.exports = NumberType;
