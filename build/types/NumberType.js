'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Type = require('./Type'),
    required = require('./common/required'),
    validator = require('validator'),
    _ = require('lodash');

var NumberType = (function (_Type) {
  _inherits(NumberType, _Type);

  function NumberType() {
    _classCallCheck(this, NumberType);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(NumberType).apply(this, arguments));
  }

  _createClass(NumberType, [{
    key: 'filter',
    value: function filter(value) {
      return _.toNumber(value);
    }
  }, {
    key: 'validate',
    value: function validate(value, context) {
      var min = this.getOption('min'),
          max = this.getOption('max'),
          message = this.getOption('message');

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
  }]);

  return NumberType;
})(Type);

NumberType.rules = {
  'required': required
};

module.exports = NumberType;