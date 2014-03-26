PivotJS
=======

A simple library for providing Pivot-like functionality. By providing an array of objects (psuedo table), and a configuration, PivotJS can generate an array of objects pivoted arounded a specified property.

## Usage

### Configuration

PivotJS takes a configuration object which defines the pivot row, column, datum - these are all just the various properties of an object in your array - and an aggregation function .

```javascript

//configuration for the following table:
var source = [{ date: '2014-03-15', fruit : 'Apple', count: 1 },
              { date: '2014-03-15', fruit : 'Apple', count: 4 },
              { date: '2014-03-16', fruit : 'Banana', count: 3 },
              { date: '2014-03-15', fruit : 'Banana', count: 3 },
              { date: '2014-03-15', fruit : 'Banana', count: 1 },
              { date: '2014-03-16', fruit : 'Banana', count: 3 },
              { date: '2014-03-17', fruit : 'Orange', count: 17 }];

var config = {
  row : 'date',
  column : 'fruit',
  datum : 'count',
  func : function(values) {
    var sum = 0;
    
    values.forEach(function(el){
		    sum += el;
		  });

		  return sum;
  }
};

```

Calling PivotJS with the above data source and configuration will generate an array of objects, with each row being a unique date, and a property per fruit, with the property value being the summation of the count property.

```javascript

var result = pivotJS(config, source);

//result would like this:

var result = [{date: '2014-03-15', Apple: 5, Banana: 4, Orange: 0 },
	      {date: '2014-03-16', Apple: 0, Banana: 6, Orange 0 },
	      {date: '2014-03-17', Apple: 0, Banana: 0, Orange: 17}];

```
