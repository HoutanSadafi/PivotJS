describe("PivotJS", function() {
 
	it("when providing a list of values, it will return a list of those distinct values.", function(){

		var list = ['a', 'b', 'b', 'c', 'd', 'd', 'd'];

		var distinct = createDistinctValuesFromList(list);

		expect(distinct).toEqual(['a', 'b', 'c', 'd']);
	});


	it("when providing an array of objects and a property name, it will return a list of each objects property value.", function(){

		var list = [{ name : 'a' },
					{ name : 'b' },
					{ name : 'b' },
					{ name : 'c' },
					{ name : 'd' },
					{ name : 'd' },
					{ name : 'd' }];

		var values = createValuesFromListOfObjects(list, 'name');

		expect(values).toEqual(['a', 'b', 'b', 'c', 'd', 'd', 'd'])
	});


	it("when providing row heading, row value and column headers, it will return a pivot table row.", function(){

		var distinctRowValues = ['apple', 'banana', 'carrot'];
		var rowHeader = 'fruit';
		var columnHeaders = ['a', 'b', 'c', 'd'];

		var expected = [{fruit : 'apple',  a : [], b: [], c : [], d : []},
						{fruit : 'banana', a : [], b: [], c : [], d : []},
						{fruit : 'carrot', a : [], b: [], c : [], d : []}];

		var rows = createPivotRows(rowHeader, distinctRowValues, columnHeaders);

		expect(rows).toEqual(expected);
	});

	it("when providing pivoted rows and the original data, it will return all the pivoted rows with data for each column.", function(){

		var privotedRows = [{'fruit' : 'apple', 'a' : [], 'b': [], 'c' : []},
							{'fruit' : 'banana', 'a' : [], 'b': [], 'c' : []}];

		var originalData = [{ fruit : 'apple', name : 'a', value: 0 },
							{ fruit : 'apple', name : 'b', value: 1 },
							{ fruit : 'apple', name : 'c', value: 3 },
							{ fruit : 'banana', name : 'a', value: 6 },
							{ fruit : 'banana', name : 'b', value: 9 },
							{ fruit : 'banana', name : 'c', value: 2 }];

		var expected = [{'fruit' : 'apple', 'a' : [0], 'b': [1], 'c' : [3]},
						{'fruit' : 'banana', 'a' : [6], 'b': [9], 'c' : [2]}];

		var rows = mapDatumToColumnHeaders(originalData, privotedRows, 'fruit', 'name', 'value');

		expect(rows).toEqual(expected);			
	});

	it("when providing pivoted rows, distinct column headers and an aggregation function, it will return the pivoted rows after each column value has had an aggregation function executed", function(){

		var pivotedRows = [{'fruit' : 'apple', 'a' : [0, 1, 0], 'b': [1, 2], 'c' : [3, 3]},
						{'fruit' : 'banana', 'a' : [6, 0], 'b': [9, 7], 'c' : [2, 4, 5]}];

		var expected = [{'fruit' : 'apple', 'a' : 1, 'b': 3, 'c' : 6},
						{'fruit' : 'banana', 'a' : 6, 'b': 16, 'c' : 11}];

		var aggregation = function(values) {
			var sum = 0;

			values.forEach(function(el){
				sum += el;
			});

			return sum;
		};

		var rows = reduceColumnValues(pivotedRows, ['a', 'b', 'c'], aggregation);

		expect(rows).toEqual(expected);
	});


	it("when providing a unpivoted array of objects (matrix) with valid pivot config, it will return an array of objects (matrix) pivoted", function(){

		var originalData = [{ fruit : 'apple', name : 'a', value: 0 },
							{ fruit : 'apple', name : 'b', value: 1 },
							{ fruit : 'apple', name : 'c', value: 1 },
							{ fruit : 'apple', name : 'c', value: 2 },
							{ fruit : 'apple', name : 'c', value: 3 },
							{ fruit : 'banana', name : 'a', value: 6 },
							{ fruit : 'banana', name : 'a', value: 7 },
							{ fruit : 'banana', name : 'b', value: 9 },
							{ fruit : 'banana', name : 'c', value: 2 },
							{ fruit : 'carrot', name : 'c', value: 2 }];

		var expected = [{ fruit : 'apple', a : 0, b: 1, c: 6},
						{ fruit : 'banana', a : 13, b: 9, c : 2},
						{ fruit : 'carrot', a : 0, b: 0, c: 2}];

		var config = {
			row : 'fruit',
			column : 'name',
			datum : 'value',
			func : function(values) {
					var sum = 0;

					values.forEach(function(el){
						sum += el;
					});

					return sum;
				}
			};

		var pivot = new PivotJS(config);
		var actual = pivot.execute(originalData);


		expect(actual).toEqual(expected);
	});


		
});