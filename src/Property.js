var util = require('@naujs/util')
  , Promise = util.getPromise()
  , _ = require('lodash')
  , Type = require('./types/Type');

class Property {
  constructor(name, options) {
    if (_.isString(options)) {
      options = {
        type: options
      };
    }

    if (!options || !options.type) {
      throw `Missing type for ${name}`;
    }

    this._name = name;
    this._options = options;

    var PropertyType = Type.getType(options.type);
    this._type = new PropertyType(options);

    this._get = options.get || function(value) {
      return value;
    };

    this._set = options.set || function(value) {
      return value;
    };

    this._value = options.default;
  }

  setter(fn) {
    this._set = fn;
  }

  getter(fn) {
    this._get = fn;
  }

  getOption(key) {
    return this._options[key];
  }

  setValue(value) {
    value = this._type.filterValue(value);
    this._value = this._set(value);
  }

  getValue() {
    return this._get(this._value);
  }

  validate(context) {
    var errors = [];
    var name = this._name;
    var value = this.getValue();

    return this._type.validateValue(value, context).then((errors) => {
      if (errors && errors.length) return _.map(errors, (err) => {
        return util.sprintf(err, _.extend({property: name, value: value}, this._options));
      });
      return errors;
    });
  }
}
Property.Type = Type;

module.exports = Property;
