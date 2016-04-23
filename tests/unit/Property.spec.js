var Property = require('../../build/Property');

describe('Property', () => {
  var property;
  describe('#setValue', () => {
    beforeEach(() => {
      property = new Property('name', {
        type: 'string',
        set: function(value) {
          return value + 'abc';
        }
      });
    });

    it('should filter the value', () => {
      property.setValue(123);
      expect(property.getValue()).toEqual('123abc');
    });
  });

  describe('#getValue', () => {
    beforeEach(() => {
      property = new Property('name', {
        type: 'string',
        get: function(value) {
          return value + 'abc';
        }
      });
    });

    it('should support custom getter', () => {
      property.setValue(123);
      expect(property.getValue()).toEqual('123abc');
    });
  });

  describe('#validate', () => {
    beforeEach(() => {
      property = new Property('name', {
        type: 'string',
        min: 5,
        max: 10
      });
    });

    it('should validate the value using the associated type validate method', () => {
      property.setValue('test');

      return property.validate().then((result) => {
        expect(result).toEqual(false);
        expect(property.getErrors()).toEqual([
          'name must be less than 10 and greater than 5 characters'
        ]);
      });
    });

    it('should return null if there are no errors', () => {
      property.setValue('testttt');

      return property.validate().then((result) => {
        expect(result).toEqual(true);
      });
    });
  });
});
