var Type = require('./Type')
  , required = require('./common/required')
  , validator = require('validator')
  , _ = require('lodash')
  , util = require('@naujs/util')
  , Promise = util.getPromise();

class ArrayType extends Type {
  _getItemType() {
    var item = this.getOption('item');

    var type = null;
    if (item) {
      var itemType = _.isString(item) ? item : item.type;
      type = this.getType(itemType);
      if (type) {
        type = new type(_.isObject(item) ? item : {});
      } else {
        console.warn(`Type ${itemType} is not found`);
      }
    }

    return type;
  }

  filter(value) {
    if (!_.isArray(value)) return undefined;
    var type = this._getItemType();

    return _.map(value, (v) => {
      if (!type) return v;
      return type.filterValue(v);
    });
  }

  validate(value, context) {
    if (!_.isArray(value) && value !== undefined && value !== null) {
      this.addError('Invalid array');
    }

    var max = this.getOption('max')
      , min = this.getOption('min')
      , unique = this.getOption('unique');

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
      var promises = _.map(value, (v) => {
        return type.validateValue(v, context);
      });
      promises.push(promise);

      return Promise.all(promises).then((results) => {
        return _.chain(results).flatten().compact().uniq().value();
      }).then((results) => {
        return results.length ? results : null;
      });
    }

    return promise;
  }
}

ArrayType.rules = {
  'required': required
};

module.exports = ArrayType;
