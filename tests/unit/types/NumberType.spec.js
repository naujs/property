var NumberType = require('../../../build/types/NumberType');

describe('NumberType', () => {
  var filterScenarios = [
    {
      name: 'should convert string to number',
      testCases: [
        {
          input: '123',
          output: 123
        },
        {
          input: '123.123',
          output: 123.123
        }
      ]
    },
    {
      name: 'should convert boolean to number',
      testCases: [
        {
          input: true,
          output: 1
        },
        {
          input: false,
          output: 0
        }
      ]
    }
  ];

  var validateScenarios = [
    {
      name: 'should validate min and max',
      options: {
        min: 5,
        max: 8
      },
      testCases: [
        {
          input: 6,
          output: null
        },
        {
          input: 7,
          output: null
        },
        {
          input: 5.1,
          output: null
        },
        {
          input: 7.9,
          output: null
        },
        {
          input: 9,
          output: [
            '%(property)s must be less than %(max)d and greater than %(min)d'
          ]
        },
        {
          input: 4.9,
          output: [
            '%(property)s must be less than %(max)d and greater than %(min)d'
          ]
        }
      ]
    },
    {
      name: 'should validate max',
      options: {
        max: 10
      },
      testCases: [
        {
          input: 10,
          output: null
        },
        {
          input: 9,
          output: null
        },
        {
          input: 9.9,
          output: null
        },
        {
          input: 10.1,
          output: [
            '%(property)s must be less than %(max)d'
          ]
        },
        {
          input: 10.0001,
          output: [
            '%(property)s must be less than %(max)d'
          ]
        },
        {
          input: 11,
          output: [
            '%(property)s must be less than %(max)d'
          ]
        }
      ]
    },
    {
      name: 'should validate max',
      options: {
        min: 10
      },
      testCases: [
        {
          input: 10,
          output: null
        },
        {
          input: 10.1,
          output: null
        },
        {
          input: 9.9,
          output: [
            '%(property)s must be greater than %(min)d'
          ]
        },
        {
          input: 9.999999,
          output: [
            '%(property)s must be greater than %(min)d'
          ]
        },
        {
          input: 9,
          output: [
            '%(property)s must be greater than %(min)d'
          ]
        }
      ]
    }
  ];

  testMultipleScenarios(NumberType, 'validate', validateScenarios);
  testMultipleScenarios(NumberType, 'filter', filterScenarios);

  testRequired(NumberType);
});
