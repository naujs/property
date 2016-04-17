var ObjectType = require('../../../build/types/ObjectType');

describe('ObjectType', () => {
  var filterScenarios = [
    {
      name: 'should convert string to object',
      testCases: [
        {
          input: JSON.stringify({a: 1}),
          output: {a: 1}
        },
        {
          input: 'invalid',
          output: undefined
        },
        {
          input: 'true',
          output: undefined
        }
      ]
    },
    {
      name: 'should reject array',
      testCases: [
        {
          input: [1, 2, 3],
          output: undefined
        }
      ]
    },
    {
      name: 'should return object',
      testCases: [
        {
          input: {a: 1},
          output: {a: 1}
        }
      ]
    },
    {
      name: 'should filter properties',
      options: {
        properties: {
          name: 'string',
          age: {
            type: 'number'
          },
          address: {
            type: 'object',
            properties: {
              street: 'string',
              city: 'string'
            }
          }
        }
      },
      testCases: [
        {
          input: JSON.stringify({
            invalid: 'value'
          }),
          output: undefined
        },
        {
          input: JSON.stringify({
            name: 'test',
            age: '20',
            invalid: 'value'
          }),
          output: {
            name: 'test',
            age: 20
          }
        },
        {
          input: JSON.stringify({
            name: 'test',
            age: '20',
            address: {
              street: 123,
              city: 456
            },
            invalid: 'value'
          }),
          output: {
            name: 'test',
            age: 20,
            address: {
              street: '123',
              city: '456'
            }
          }
        }
      ]
    }
  ];

  var validateScenarios = [
    {
      name: 'should validate properties',
      options: {
        properties: {
          name: {
            type: 'string',
            min: 5
          }
        }
      },
      testCases: [
        {
          input: {
            name: 'abc',
            address: {
              street: '1234'
            }
          },
          output: [
            '%(property)s.name must be greater than 5 characters'
          ]
        },

      ]
    },
    {
      name: 'should validate nested object',
      options: {
        properties: {
          name: {
            type: 'string',
            min: 5
          },
          address: {
            type: 'object',
            properties: {
              street: {
                type: 'string',
                required: true
              }
            }
          }
        }
      },
      testCases: [
        {
          input: {
            name: 'abc',
            address: {}
          },
          output: [
            '%(property)s.name must be greater than 5 characters',
            '%(property)s.address.street is required'
          ]
        }
      ]
    },
    {
      name: 'should validate nested array',
      options: {
        properties: {
          items: {
            type: 'array',
            item: {
              type: 'string',
              min: 5
            },
            unique: true
          }
        }
      },
      testCases: [
        {
          input: {
            items: ['a', 'a', 'bce', 'ef']
          },
          output: [
            '%(property)s.items must be greater than 5 characters',
            'Items in %(property)s.items must be unique'
          ]
        }
      ]
    },
    {
      name: 'should validate nested array of objects',
      options: {
        properties: {
          items: {
            type: 'array',
            item: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  min: 5
                }
              }
            },
            unique: {
              check: function(item) {
                return item.name;
              }
            }
          }
        }
      },
      testCases: [
        {
          input: {
            items: [{name: 'a'}, {name: 'a'}, {name: 'b'}]
          },
          output: [
            '%(property)s.items.name must be greater than 5 characters',
            'Items in %(property)s.items must be unique'
          ]
        }
      ]
    }
  ];

  testMultipleScenarios(ObjectType, 'filter', filterScenarios);
  testMultipleScenarios(ObjectType, 'validate', validateScenarios);

  testRequired(ObjectType);
});
