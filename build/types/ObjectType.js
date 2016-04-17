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

var ObjectType = (function (_Type) {
  _inherits(ObjectType, _Type);

  function ObjectType() {
    _classCallCheck(this, ObjectType);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ObjectType).apply(this, arguments));
  }

  _createClass(ObjectType, [{
    key: '_getProperties',
    value: function _getProperties() {
      var _this2 = this;

      if (!this._properties) {
        var properties = this.getOption('properties', []);

        this._properties = _.chain(properties).map(function (opts, prop) {
          var itemType = _.isString(opts) ? opts : opts.type;
          var itemOpts = _.isObject(opts) ? opts : {};
          var type = _this2.getType(itemType);
          if (!type) {
            console.warn('Type ' + itemType + ' is not found');
            return null;
          } else {
            type = new type(itemOpts);
          }

          return [prop, type];
        }).compact().fromPairs().value();
      }

      return this._properties;
    }
  }, {
    key: 'filter',
    value: function filter(value) {
      if (!_.isObject(value) && !_.isString(value)) return undefined;
      if (_.isArray(value)) return undefined;

      var properties = this._getProperties();

      if (_.isString(value)) {
        try {
          value = JSON.parse(value);
          if (!_.isObject(value)) return undefined;
        } catch (e) {
          return undefined;
        }
      }

      if (_.isEmpty(properties)) return value;

      var filteredValue = _.chain(value).toPairs().map(function (pair) {
        var name = pair[0],
            value = pair[1];

        var type = properties[name];
        if (!type) return null;
        return [name, type.filterValue(value)];
      }).compact().fromPairs().value();

      return _.isEmpty(filteredValue) ? undefined : filteredValue;
    }
  }, {
    key: 'validate',
    value: function validate(value, context) {
      if (!_.isArray(value) && !_.isObject(value) && value !== undefined && value !== null) {
        this.addError('Invalid object');
      }

      var properties = this._getProperties();

      if (_.isEmpty(properties)) return Promise.resolve(null);

      var promises = _.map(properties, function (type, name) {
        return type.validateValue(value[name], context).then(function (results) {
          if (results) return _.map(results, function (result) {
            var opts = type.getOptions();
            opts = _.extend({}, opts, opts.item); // handle array item options
            return util.sprintf(result, _.extend({ property: '%(property)s.' + name }, opts));
          });
          return results;
        });
      });

      return Promise.all(promises).then(function (results) {
        results = _.chain(results).flatten().compact().uniq().value();
        return results.length ? results : null;
      });
    }
  }]);

  return ObjectType;
})(Type);

ObjectType.rules = {
  'required': required
};

module.exports = ObjectType;