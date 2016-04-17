var Type = require('./Type')
  , required = require('./common/required')
  , moment = require('moment');

class DateType extends Type {
  _formatDate(value) {
    return moment(value, this.getOption('format'));
  }

  filter(value) {
    var d = this._formatDate(value);
    if (d.isValid()) return d.toDate();
  }

  validate(value, context) {
    var date = this._formatDate(value);
    if (!date.isValid()) {
      this.addError('Invalid date');
    }

    return this.getErrors();
  }
}

DateType.rules = {
  'required': required
};

module.exports = DateType;
