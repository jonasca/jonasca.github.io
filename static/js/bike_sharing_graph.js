d3.queue()
    .defer(d3.json, "https://jonasca.github.io/data/bike_sharing_dashboard_data.json" )
    .await(makeGraphs); // Queue lets data load completely before creating charts
    
function makeGraphs(error, data) {
    
    //Clean data
    var records = data;
    
    records.forEach(function(d) {
        // Space for transforming data - nothing as of now
    });
    
    console.log(records[0]);
    // Good place to check if datatime worked, with console.log(records[0].timestamp); console.log("everything ran");
    
    //Create a Crossfilter instance, used for multi-dimensional data manipulation in js
	var ndx = crossfilter(records);
    
	//Define Dimensions
	var countDim = ndx.dimension(function(d) { return d['count']; });
	var casualDim = ndx.dimension(function(d) { return d['casual']; });
	var registeredDim = ndx.dimension(function(d) { return d['registered']; });
	var dateDim = ndx.dimension(function(d) { return d["datetime"]; });
	var yearDim = ndx.dimension(function(d) { return d["year"]; });
	var monthDim = ndx.dimension(function(d) { return d["month"]; });
	var dayDim = ndx.dimension(function(d) { return d["day"]; });
	var weekdayDim = ndx.dimension(function(d) { return d["weekday"]; });
	var hourDim = ndx.dimension(function(d) { return d["hour"]; });
	var seasonDim = ndx.dimension(function(d) { return d["season"]; });
	var weatherDim = ndx.dimension(function(d) { return d["weather"]; });
	var allDim = ndx.dimension(function(d) {return d;});
	
	//Group Data
	var countGroup = countDim.group();
	var casualGroup = casualDim.group();
	var registeredGroup = registeredDim.group();
	var dateGroup = dateDim.group();
	var yearGroup = yearDim.group();
	var monthGroup = monthDim.group();
	var dayGroup = dayDim.group();
	var weekdayGroup = weekdayDim.group();
	// Add the others later
	var all = ndx.groupAll();
	
	var countND = dc.numberDisplay("#count-nd");
	//var timeChart = dc.barChart("#time-chart");
	var seasonChart = dc.rowChart("#season-row-chart");
	var weatherChart = dc.rowChart("#weather-row-chart");
	//var phoneBrandChart = dc.rowChart("#phone-brand-row-chart");
	var weekdayChart = dc.rowChart("#weekday-row-chart");
    
};
