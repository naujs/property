var Component = require('@naujs/component')
  , util = require('@naujs/util')
  , Promise = util.getPromise()
  , _ = require('lodash')
  , Registry = require('@naujs/registry');

class Type extends Component {
  static define(name, NewType) {
    if (NewType.prototype instanceof Type) {
      Registry.setType(name, NewType);
    } else {
      throw 'Must be a subclass of Type';
    }
  }

  constructor(options = {}) {
    super();
    this._options = options;
  }

  getOptions() {
    return this._options;
  }

  getOption(key, defaultValue) {
    var value = this._options[key];
    if (value === undefined) return defaultValue;
    return value;
  }

  getRules() {
    return this.getClass().rules || {};
  }

  static getType(name) {
    var types = require('./');
    return Registry.getType(name) || types[name];
  }

  getType(name) {
    return this.getClass().getType(name);
  }

  filterValue(value) {
    if (value === undefined) return value;
    return this.filter(value);
  }

  filter(value) {
    throw 'Must be implemented';
  }

  validateValue(value, context) {
    var promises = _.chain(this.getRules()).toPairs().map((pair) => {
      var name = pair[0];
      var fn = pair[1];
      var opts = this.getOption(name);
      if (!opts) return null;
      return {
        validate: fn,
        options: opts
      };
    }).compact().union([{
      // TODO: optimize this, bind is very slow
      validate: function(value, options, context) {
        return this.validate(value, context);
      }.bind(this)
    }]).map((rule) => {
      return new Promise((resolve, reject) => {
        var result = rule.validate(value, rule.options, context);
        if (result && _.isFunction(result.then)) {
          result.then(resolve, reject);
        } else {
          resolve(result);
        }
      }).then((result) => {
        if (!_.isArray(result)) return [result];
        return result;
      });
    }).value();

    return Promise.all(promises).then((results) => {
      results = _.chain(results).flatten().compact().uniq().value();
      return results && results.length ? results : null;
    });
  }

  validate(value, context) {
    throw 'Must be implemented';
  }

  addError(message) {
    message = this.getOption('message', message);
    this._errors = this._errors || [];
    this._errors.push(message);
  }

  getErrors() {
    if (!this._errors || !this._errors.length) return null;
    var errors = _.uniq(this._errors);
    this._errors = [];
    return errors;
  }
}

module.exports = Type;
