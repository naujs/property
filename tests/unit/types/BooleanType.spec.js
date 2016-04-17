var BooleanType = require('../../../build/types/BooleanType');

describe('BooleanType', () => {
  var filterScenarios = [
    {
      name: 'should convert string to boolean',
      testCases: [
        {
          input: 'false',
          output: false
        },
        {
          input: 'true',
          output: true
        },
        {
          input: '1',
          output: true
        },
        {
          input: '0',
          output: false
        },
        {
          input: 'test',
          output: undefined
        }
      ]
    },
    {
      name: 'should convert number to boolean',
      testCases: [
        {
          input: 1,
          output: true
        },
        {
          input: 0,
          output: false
        },
        {
          input: 10,
          output: true
        },
        {
          input: -1,
          output: true
        }
      ]
    }
  ];

  var validateScenarios = [
    {
      name: 'should validate boolean value',
      options: {
        message: 'meh'
      },
      testCases: [
        {
          input: 1,
          output: [
            'meh'
          ]
        },
        {
          input: true,
          output: null
        },
        {
          input: false,
          output: null
        },
        {
          input: 0,
          output: [
            'meh'
          ]
        }
      ]
    }
  ];

  testMultipleScenarios(BooleanType, 'validate', validateScenarios);
  testMultipleScenarios(BooleanType, 'filter', filterScenarios);

  testRequired(BooleanType);
});
