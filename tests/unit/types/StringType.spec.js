var StringType = require('../../../build/types/StringType');

describe('StringType', () => {
  var filterScenarios = [
    {
      name: 'should convert number to string',
      testCases: [
        {
          input: 123,
          output: '123'
        },
        {
          input: 123.123,
          output: '123.123'
        },
        {
          input: -123,
          output: '-123'
        }
      ]
    },
    {
      name: 'should convert array to string',
      testCases: [
        {
          input: [1, 2, 3],
          output: '1,2,3'
        },
        {
          input: [],
          output: ''
        }
      ]
    },
    {
      name: 'should convert boolean to string',
      testCases: [
        {
          input: true,
          output: 'true'
        },
        {
          input: false,
          output: 'false'
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
          input: '123456',
          output: null
        },
        {
          input: '1234',
          output: [
            '%(property)s must be less than %(max)d and greater than %(min)d characters'
          ]
        },
        {
          input: '123456789',
          output: [
            '%(property)s must be less than %(max)d and greater than %(min)d characters'
          ]
        }
      ]
    },
    {
      name: 'should validate min',
      options: {
        min: 5
      },
      testCases: [
        {
          input: '123456',
          output: null
        },
        {
          input: '1234',
          output: [
            '%(property)s must be greater than %(min)d characters'
          ]
        },
        {
          input: '12345678',
          output: null
        }
      ]
    },
    {
      name: 'should validate max',
      options: {
        max: 8
      },
      testCases: [
        {
          input: '123456',
          output: null
        },
        {
          input: '12345',
          output: null
        },
        {
          input: '123456789',
          output: [
            '%(property)s must be less than %(max)d characters'
          ]
        }
      ]
    },
    {
      name: 'should validate using regex',
      options: {
        regex: /abc/
      },
      testCases: [
        {
          input: 'abc',
          output: null
        },
        {
          input: '123',
          output: [
            '%(value)s does not match /abc/'
          ]
        }
      ]
    },
    {
      name: 'should validate using regex with custom error message',
      options: {
        regex: {
          pattern: /abc/,
          message: 'meh'
        }
      },
      testCases: [
        {
          input: 'abc',
          output: null
        },
        {
          input: '123',
          output: [
            'meh'
          ]
        }
      ]
    },
    {
      name: 'should validate email',
      options: {
        email: true
      },
      testCases: [
        {
          input: 'valid@email.com',
          output: null
        },
        {
          input: 'invalid',
          output: [
            '%(value)s is not a valid email'
          ]
        }
      ]
    },
    {
      name: 'should validate email with custom error message',
      options: {
        email: 'Email!!!'
      },
      testCases: [
        {
          input: 'valid@email.com',
          output: null
        },
        {
          input: 'invalid',
          output: [
            'Email!!!'
          ]
        }
      ]
    },
    {
      name: 'should validate email with main custom error message',
      options: {
        email: 'Email!!!',
        message: 'Must be an email'
      },
      testCases: [
        {
          input: 'invalid',
          output: [
            'Must be an email'
          ]
        }
      ]
    },
    {
      name: 'should validate url',
      options: {
        url: true
      },
      testCases: [
        {
          input: 'http://test.com',
          output: null
        },
        {
          input: 'https://test.com',
          output: null
        },
        {
          input: 'http://test.com/abc/xyz',
          output: null
        },
        {
          input: 'http://test.com?test=1',
          output: null
        },
        {
          input: 'http://www.test.com',
          output: null
        },
        {
          input: 'invalid',
          output: [
            '%(value)s is not a valid url'
          ]
        }
      ]
    },
    {
      name: 'should validate url with custom error message',
      options: {
        url: 'Must be an URL'
      },
      testCases: [
        {
          input: 'invalid',
          output: [
            'Must be an URL'
          ]
        }
      ]
    },
    {
      name: 'should validate url with main custom error message',
      options: {
        url: 'Must be an URL',
        message: 'URL!!!'
      },
      testCases: [
        {
          input: 'invalid',
          output: [
            'URL!!!'
          ]
        }
      ]
    },
    {
      name: 'should validate multiple rules',
      options: {
        min: 5,
        max: 10,
        regex: /^\d+$/
      },
      testCases: [
        {
          input: '123a',
          output: [
            '%(property)s must be less than %(max)d and greater than %(min)d characters',
            '%(value)s does not match /^\\d+$/'
          ]
        }
      ]
    }
  ];

  testMultipleScenarios(StringType, 'validate', validateScenarios);
  testMultipleScenarios(StringType, 'filter', filterScenarios);

  testRequired(StringType);
});
