'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var util = require('@naujs/util'),
    Promise = util.getPromise(),
    _ = require('lodash'),
    Type = require('./types/Type');

var Property = (function () {
  _createClass(Property, null, [{
    key: 'parse',
    value: function parse(properties) {
      var _this = this;

      return _.chain(properties).map(function (opts, name) {
        return [name, new _this(name, opts)];
      }).fromPairs().value();
    }
  }]);

  function Property(name, options) {
    _classCallCheck(this, Property);

    if (_.isString(options)) {
      options = {
        type: options
      };
    }

    if (!options || !options.type) {
      throw 'Missing type for ' + name;
    }

    this._name = name;
    this._options = options;

    var PropertyType = Type.getType(options.type);
    this._type = new PropertyType(options);

    this._get = options.get || function (value) {
      return value;
    };

    this._set = options.set || function (value) {
      return value;
    };

    this._value = options.default;
  }

  _createClass(Property, [{
    key: 'setter',
    value: function setter(fn) {
      this._set = fn;
    }
  }, {
    key: 'getter',
    value: function getter(fn) {
      this._get = fn;
    }
  }, {
    key: 'getOption',
    value: function getOption(key) {
      return this._options[key];
    }
  }, {
    key: 'setValue',
    value: function setValue(value) {
      value = this._type.filterValue(value);
      this._value = this._set(value);
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      return this._get(this._value);
    }
  }, {
    key: 'getErrors',
    value: function getErrors() {
      return this._errors || null;
    }
  }, {
    key: 'validate',
    value: function validate(context) {
      var _this2 = this;

      var errors = [];
      var name = this._name;
      var value = this.getValue();
      this._errors = null;

      return this._type.validateValue(value, context).then(function (errors) {
        if (errors && errors.length) return _.map(errors, function (err) {
          return util.sprintf(err, _.extend({ property: name, value: value }, _this2._options));
        });
        return errors;
      }).then(function (errors) {
        if (errors) _this2._errors = errors;
        return !errors;
      });
    }
  }]);

  return Property;
})();

Property.Type = Type;

module.exports = Property;