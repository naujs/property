var ArrayType = require('../../../build/types/ArrayType');

describe('ArrayType', () => {
  var filterScenarios = [
    {
      name: 'should filter non-array',
      testCases: [
        {
          input: [],
          output: []
        },
        {
          input: [1, 2, 3],
          output: [1, 2, 3]
        },
        {
          input: 1,
          output: undefined
        },
        {
          input: '1',
          output: undefined
        },
        {
          input: true,
          output: undefined
        }
      ]
    },
    {
      name: 'should apply itemType filter using short form',
      options: {
        item: 'string'
      },
      testCases: [
        {
          input: [1, '2', 3, '4', true, false],
          output: ['1', '2', '3', '4', 'true', 'false']
        }
      ]
    },
    {
      name: 'should apply item type filter using full form',
      options: {
        item: {
          type: 'string'
        }
      },
      testCases: [
        {
          input: [1, '2', 3, '4', true, false],
          output: ['1', '2', '3', '4', 'true', 'false']
        }
      ]
    }
  ];

  var validateScenarios = [
    {
      name: 'should validate min and max items',
      options: {
        min: 3,
        max: 5
      },
      testCases: [
        {
          input: [1, 2, 3, 4, 5],
          output: null
        },
        {
          input: [1, 2],
          output: [
            '%(property)s must have between %(min)d and %(min)d items'
          ]
        },
        {
          input: [1, 2, 3, 4, 5, 6],
          output: [
            '%(property)s must have between %(min)d and %(min)d items'
          ]
        }
      ]
    },
    {
      name: 'should validate min items',
      options: {
        min: 3
      },
      testCases: [
        {
          input: [1, 2, 3, 4, 5],
          output: null
        },
        {
          input: [1, 2],
          output: [
            '%(property)s must have more than %(min)d items'
          ]
        }
      ]
    },
    {
      name: 'should validate max items',
      options: {
        max: 5
      },
      testCases: [
        {
          input: [1, 2, 3, 4, 5],
          output: null
        },
        {
          input: [1, 2, 3, 4, 5, 6],
          output: [
            '%(property)s must have less than %(max)d items'
          ]
        }
      ]
    },
    {
      name: 'should validate uniqueness of the items',
      options: {
        unique: true
      },
      testCases: [
        {
          input: ['a', 'a', 'b'],
          output: [
            'Items in %(property)s must be unique'
          ]
        },
        {
          input: ['a', 'b', 'c'],
          output: null
        }
      ]
    },
    {
      name: 'should validate uniqueness of the items using custom error message',
      options: {
        unique: 'Meh'
      },
      testCases: [
        {
          input: ['a', 'a', 'b'],
          output: [
            'Meh'
          ]
        },
        {
          input: ['a', 'b', 'c'],
          output: null
        }
      ]
    },
    {
      name: 'should validate uniqueness of the items using custom function',
      options: {
        unique: {
          check: function(item) {
            return item.a;
          }
        }
      },
      testCases: [
        {
          input: [{a: 1}, {a: 1}, {a: 2}],
          output: [
            'Items in %(property)s must be unique'
          ]
        }
      ]
    },
    {
      name: 'should validate typed items',
      options: {
        unique: true,
        item: {
          type: 'string',
          min: 3,
          message: 'Meh'
        }
      },
      testCases: [
        {
          input: ['a', 'a', 'b'],
          output: [
            'Meh',
            'Items in %(property)s must be unique'
          ]
        },
        {
          input: ['abc', 'def', 'ghi'],
          output: null
        }
      ]
    }
  ];

  testMultipleScenarios(ArrayType, 'filter', filterScenarios);
  testMultipleScenarios(ArrayType, 'validate', validateScenarios);

  testRequired(ArrayType);
});
