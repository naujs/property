'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Component = require('@naujs/component'),
    util = require('@naujs/util'),
    Promise = util.getPromise(),
    _ = require('lodash'),
    Registry = require('@naujs/registry');

var Type = (function (_Component) {
  _inherits(Type, _Component);

  _createClass(Type, null, [{
    key: 'define',
    value: function define(name, NewType) {
      if (NewType.prototype instanceof Type) {
        Registry.setType(name, NewType);
      } else {
        // TODO: support object declaration
        throw 'Must be a subclass of Type';
      }
    }
  }]);

  function Type() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Type);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Type).call(this));

    _this._options = options;
    return _this;
  }

  _createClass(Type, [{
    key: 'getOptions',
    value: function getOptions() {
      return this._options;
    }
  }, {
    key: 'getOption',
    value: function getOption(key, defaultValue) {
      var value = this._options[key];
      if (value === undefined) return defaultValue;
      return value;
    }
  }, {
    key: 'getRules',
    value: function getRules() {
      return this.getClass().rules || {};
    }
  }, {
    key: 'getType',
    value: function getType(name) {
      return this.getClass().getType(name);
    }
  }, {
    key: 'filterValue',
    value: function filterValue(value) {
      if (value === undefined) return value;
      return this.filter(value);
    }
  }, {
    key: 'filter',
    value: function filter(value) {
      throw 'Must be implemented';
    }
  }, {
    key: 'validateValue',
    value: function validateValue(value, context) {
      var _this2 = this;

      var promises = _.chain(this.getRules()).toPairs().map(function (pair) {
        var name = pair[0];
        var fn = pair[1];
        var opts = _this2.getOption(name);
        if (!opts) return null;
        return {
          validate: fn,
          options: opts
        };
      }).compact().union([{
        // TODO: optimize this, bind is very slow
        validate: (function (value, options, context) {
          return this.validate(value, context);
        }).bind(this)
      }]).map(function (rule) {
        return new Promise(function (resolve, reject) {
          var result = rule.validate(value, rule.options, context);
          if (result && _.isFunction(result.then)) {
            result.then(resolve, reject);
          } else {
            resolve(result);
          }
        }).then(function (result) {
          if (!_.isArray(result)) return [result];
          return result;
        });
      }).value();

      return Promise.all(promises).then(function (results) {
        results = _.chain(results).flatten().compact().uniq().value();
        return results && results.length ? results : null;
      });
    }
  }, {
    key: 'validate',
    value: function validate(value, context) {
      throw 'Must be implemented';
    }
  }, {
    key: 'addError',
    value: function addError(message) {
      message = this.getOption('message', message);
      this._errors = this._errors || [];
      this._errors.push(message);
    }
  }, {
    key: 'getErrors',
    value: function getErrors() {
      if (!this._errors || !this._errors.length) return null;
      var errors = _.uniq(this._errors);
      this._errors = [];
      return errors;
    }
  }], [{
    key: 'getType',
    value: function getType(name) {
      var types = require('./');
      return Registry.getType(name) || types[name];
    }
  }]);

  return Type;
})(Component);

module.exports = Type;