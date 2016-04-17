var Type = require('./Type')
  , required = require('./common/required')
  , validator = require('validator')
  , _ = require('lodash')
  , util = require('@naujs/util')
  , Promise = util.getPromise();

class ObjectType extends Type {
  _getProperties() {
    if (!this._properties) {
      var properties = this.getOption('properties', []);

      this._properties = _.chain(properties).map((opts, prop) => {
        var itemType = _.isString(opts) ? opts : opts.type;
        var itemOpts = _.isObject(opts) ? opts : {};
        var type = this.getType(itemType);
        if (!type) {
          console.warn(`Type ${itemType} is not found`);
          return null;
        } else {
          type = new type(itemOpts);
        }

        return [prop, type];
      }).compact().fromPairs().value();
    }

    return this._properties;
  }

  filter(value) {
    if (!_.isObject(value) && !_.isString(value)) return undefined;
    if (_.isArray(value)) return undefined;

    var properties = this._getProperties();

    if (_.isString(value)) {
      try {
        value = JSON.parse(value);
        if (!_.isObject(value)) return undefined;
      } catch (e) { return undefined; }
    }

    if (_.isEmpty(properties)) return value;

    var filteredValue = _.chain(value).toPairs().map((pair) => {
      var name = pair[0]
        , value = pair[1];

      var type = properties[name];
      if (!type) return null;
      return [name, type.filterValue(value)];
    }).compact().fromPairs().value();

    return _.isEmpty(filteredValue) ? undefined : filteredValue;
  }

  validate(value, context) {
    if (!_.isArray(value) && !_.isObject(value) && value !== undefined && value !== null) {
      this.addError('Invalid object');
    }

    var properties = this._getProperties();

    if (_.isEmpty(properties)) return Promise.resolve(null);

    var promises = _.map(properties, (type, name) => {
      return type.validateValue(value[name], context).then((results) => {
        if (results) return _.map(results, (result) => {
          var opts = type.getOptions();
          opts = _.extend({}, opts, opts.item); // handle array item options
          return util.sprintf(result, _.extend({property: `%(property)s.${name}`}, opts));
        });
        return results;
      });
    });

    return Promise.all(promises).then((results) => {
      results = _.chain(results).flatten().compact().uniq().value();
      return results.length ? results : null;
    });
  }
}

ObjectType.rules = {
  'required': required
};

module.exports = ObjectType;
