'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Type = require('./Type'),
    required = require('./common/required'),
    validator = require('validator'),
    _ = require('lodash'),
    util = require('@naujs/util'),
    Promise = util.getPromise();

var ArrayType = (function (_Type) {
  _inherits(ArrayType, _Type);

  function ArrayType() {
    _classCallCheck(this, ArrayType);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ArrayType).apply(this, arguments));
  }

  _createClass(ArrayType, [{
    key: '_getItemType',
    value: function _getItemType() {
      var item = this.getOption('item');

      var type = null;
      if (item) {
        var itemType = _.isString(item) ? item : item.type;
        type = this.getType(itemType);
        if (type) {
          type = new type(_.isObject(item) ? item : {});
        } else {
          console.warn('Type ' + itemType + ' is not found');
        }
      }

      return type;
    }
  }, {
    key: 'filter',
    value: function filter(value) {
      if (!_.isArray(value)) return undefined;
      var type = this._getItemType();

      return _.map(value, function (v) {
        if (!type) return v;
        return type.filterValue(v);
      });
    }
  }, {
    key: 'validate',
    value: function validate(value, context) {
      if (!_.isArray(value) && value !== undefined && value !== null) {
        this.addError('Invalid array');
      }

      var max = this.getOption('max'),
          min = this.getOption('min'),
          unique = this.getOption('unique');

      var len = value ? value.length : 0;

      if (min !== undefined && max !== undefined && (len < min || len > max)) {
        this.addError('%(property)s must have between %(min)d and %(min)d items');
      } else if (min !== undefined && len < min) {
        this.addError('%(property)s must have more than %(min)d items');
      } else if (max !== undefined && len > max) {
        this.addError('%(property)s must have less than %(max)d items');
      }

      if (unique) {
        var message = unique.message ? unique.message : 'Items in %(property)s must be unique';
        message = _.isString(unique) ? unique : message;

        var failed;
        if (unique.check) {
          failed = _.uniqBy(value, unique.check).length !== len;
        } else {
          failed = _.uniq(value).length !== len;
        }

        if (failed) this.addError(message);
      }

      var type = this._getItemType();
      var promise = Promise.resolve(this.getErrors());
      if (type) {
        var promises = _.map(value, function (v) {
          return type.validateValue(v, context);
        });
        promises.push(promise);

        return Promise.all(promises).then(function (results) {
          return _.chain(results).flatten().compact().uniq().value();
        }).then(function (results) {
          return results.length ? results : null;
        });
      }

      return promise;
    }
  }]);

  return ArrayType;
})(Type);

ArrayType.rules = {
  'required': required
};

module.exports = ArrayType;