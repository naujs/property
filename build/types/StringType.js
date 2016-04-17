'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Type = require('./Type'),
    required = require('./common/required'),
    validator = require('validator'),
    _ = require('lodash');

var StringType = (function (_Type) {
  _inherits(StringType, _Type);

  function StringType() {
    _classCallCheck(this, StringType);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(StringType).apply(this, arguments));
  }

  _createClass(StringType, [{
    key: 'filter',
    value: function filter(value) {
      return _.toString(value);
    }
  }, {
    key: 'validate',
    value: function validate(value, context) {
      var min = this.getOption('min'),
          max = this.getOption('max'),
          regex = this.getOption('regex'),
          message = this.getOption('message'),
          email = this.getOption('email'),
          url = this.getOption('url');

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
        this.addError(regex.message || '%(value)s is not valid');
      }

      if (email && !validator.isEmail(value)) {
        this.addError(_.isString(email) ? email : '%(value)s is not a valid email');
      }

      if (url && !validator.isURL(value)) {
        this.addError(_.isString(url) ? url : '%(value)s is not a valid url');
      }

      return this.getErrors();
    }
  }]);

  return StringType;
})(Type);

StringType.rules = {
  'required': required
};

module.exports = StringType;