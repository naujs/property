'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Type = require('./Type'),
    required = require('./common/required'),
    validator = require('validator'),
    _ = require('lodash');

var BooleanType = (function (_Type) {
  _inherits(BooleanType, _Type);

  function BooleanType() {
    _classCallCheck(this, BooleanType);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(BooleanType).apply(this, arguments));
  }

  _createClass(BooleanType, [{
    key: 'filter',
    value: function filter(value) {
      if (value === undefined) return value;
      if (_.isBoolean(value)) return value;

      try {
        return !!JSON.parse(value);
      } catch (e) {
        return undefined;
      }
    }
  }, {
    key: 'validate',
    value: function validate(value, context) {
      if (!_.isBoolean(value) && value !== undefined && value !== null) {
        this.addError('Invalid number');
      }
      return this.getErrors();
    }
  }]);

  return BooleanType;
})(Type);

BooleanType.rules = {
  'required': required
};

module.exports = BooleanType;