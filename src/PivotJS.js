

(function(){

	function PivotJS(config) {
		if ( !(this instanceof PivotJS) ){
			return new PivotJS(config);
		}

		this.config = config;
	}

	PivotJS.prototype.execute = function(data) {
		
		var rowValues = createValuesFromListOfObjects(data, this.config.row);
		var distinctRowValues = createDistinctValuesFromList(rowValues);

		var columnHeaders = createValuesFromListOfObjects(data, this.config.column);
		var distinctColumnHeaders = createDistinctValuesFromList(columnHeaders);

		var rows = createPivotRows(this.config.row, distinctRowValues, distinctColumnHeaders);
		var rows = mapDatumToColumnHeaders(data, rows, this.config.row, this.config.column, this.config.datum);
		var rows = reduceColumnValues(rows, distinctColumnHeaders, this.config.func);

		return rows;
	};

	var reduceColumnValues = function(rows, distinctColumnHeaders, func) {

		rows.forEach(function(el){

			var row = el;
			distinctColumnHeaders.forEach(function(el){
				row[el] = func(row[el]);
			});

		});

		return rows;
	};

	var mapDatumToColumnHeaders = function(data, rows, rowHeader, dataColumnKey, datum) {

		rows.forEach(function(el){

			var row = el;
			data.forEach(function(el){

				if (row[rowHeader] === el[rowHeader]) {
					var columnHeader = el[dataColumnKey];
					var value = el[datum];
					row[columnHeader].push(value);
				}
			});
		});

		return rows;
	};

	var createPivotRows = function(rowHeader, rowValues, columnHeaders ){
		var rows = [];

		rowValues.forEach(function(el){
			var row = {};

			row[rowHeader] = el;

			columnHeaders.forEach(function(el){
				row[el] = [];
			});

			rows.push(row);
		});

		return rows;
	};

	var createValuesFromListOfObjects = function(list, property) {

		var values = [];

		list.forEach(function(el){
			values.push(el[property]);
		});

		return values;
	};


	var createDistinctValuesFromList = function(list) {

		var distinct = [];

		list.forEach(function(el){
			if (distinct.indexOf(el) === -1 ){
				distinct.push(el);
			}
		});

		return distinct;
	}

	this._pivotJS = {
		reduceColumnValues : reduceColumnValues,
		mapDatumToColumnHeaders : mapDatumToColumnHeaders,
		createPivotRows : createPivotRows,
		createValuesFromListOfObjects : createValuesFromListOfObjects,
		createDistinctValuesFromList : createDistinctValuesFromList,
		PivotJS : PivotJS
	};

	this.pivotJS = (function(){
		return function(config, data){
			var pivot = new PivotJS(config);
			return pivot.execute(data);
		};
	})();

})();

