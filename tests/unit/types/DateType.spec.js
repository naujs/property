var DateType = require('../../../build/types/DateType');

describe('DateType', () => {
  var filterScenarios = [
    {
      name: 'should convert string to Date object',
      testCases: [
        {
          input: '2016-04-17T14:17:57.271Z',
          output: new Date('2016-04-17T14:17:57.271Z')
        },
        {
          input: 'invalid',
          output: undefined
        }
      ]
    },
    {
      name: 'should convert string to Date object with a specific format',
      options: {
        format: 'YYYY MM DD'
      },
      testCases: [
        {
          input: '2016 04 17',
          output: new Date('2016-04-16T21:00:00.000Z')
        }
      ]
    }
  ];

  testMultipleScenarios(DateType, 'filter', filterScenarios);

  testRequired(DateType);
});
