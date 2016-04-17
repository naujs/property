/*eslint max-nested-callbacks:0*/

var _ = require('lodash')
  , util = require('@naujs/util')
  , Promise = util.getPromise();

global.commonValidatorTests = (validate, validInput, invalidInput, options) => {
  options = options || {};

  it('should return the value if the input is valid', () => {
    expect(validate(validInput, options)).toEqual(validInput);
  });

  it('should throw error message if the input is invalid', () => {
    try {
      validate(invalidInput, options);
      fail();
    } catch (e) {
      expect(typeof e).toEqual('string');
    }
  });

  it('should support custom error message', () => {
    options.message = 'test';
    try {
      validate(invalidInput, options);
      fail();
    } catch (e) {
      expect(e).toEqual('test');
    }
  });
};

global.testUndefinedOrNullValue = function(validate) {
  it('should return if the value is undefined or null', () => {
    expect(validate(undefined)).toEqual(undefined);
    expect(validate(null)).toEqual(null);
  });
};

global.testMultipleScenarios = function(Type, method, scenarios) {
  describe(`#${method}`, () => {
    scenarios.forEach(function(scenario) {
      it(`${scenario.name}`, () => {
        var type = new Type(scenario.options);
        return Promise.all(_.map(scenario.testCases, (testCase) => {
          return util.tryPromise(type[method].call(type, testCase.input, testCase.context)).then((result) => {
            expect(result).toEqual(testCase.output);
          });
        }));
      });
    });
  });
};

global.testRequired = function(Type) {
  var type;
  describe('required', () => {
    beforeEach(() => {
      type = new Type({
        required: true
      });
    });

    it('should use required validator', () => {
      return type.validateValue(undefined).then((errors) => {
        expect(errors).toEqual([
          '%(property)s is required'
        ]);
      });
    });
  });
};
