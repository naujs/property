var Type = require('./Type')
  , required = require('./common/required')
  , validator = require('validator')
  , _ = require('lodash');

class StringType extends Type {
  filter(value) {
    return _.toString(value);
  }

  validate(value, context) {
    var min = this.getOption('min')
      , max = this.getOption('max')
      , regex = this.getOption('regex')
      , message = this.getOption('message')
      , email = this.getOption('email')
      , url = this.getOption('url');

    if (!_.isString(value) && value !== undefined && value !== null) {
      this.addError('Invalid string');
      return this.getErrors();
    }

    var len = value ? value.length : 0;

    if (min !== undefined && max !== undefined && (len < min || len > max)) {
      this.addError('%(property)s must be less than %(max)d and greater than %(min)d characters');
    } else if (min !== undefined && len < min) {
      this.addError('%(property)s must be greater than %(min)d characters');
    } else if (max !== undefined && len > max) {
      this.addError('%(property)s must be less than %(max)d characters');
    }

    if (regex && !validator.matches(value, regex.pattern || regex)) {
      this.addError(regex.message || `%(value)s does not match ${regex.pattern || regex}`);
    }

    if (email && !validator.isEmail(value)) {
      this.addError(_.isString(email) ? email : '%(value)s is not a valid email');
    }

    if (url && !validator.isURL(value)) {
      this.addError(_.isString(url) ? url : '%(value)s is not a valid url');
    }

    return this.getErrors();
  }
}

StringType.rules = {
  'required': required
};

module.exports = StringType;
