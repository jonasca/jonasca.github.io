d3.queue()
    .defer(d3.json, "https://jonasca.github.io/data/bike_sharing_dashboard_data.json" )
    .await(makeGraphs); // Queue lets data load completely before creating charts
    
function makeGraphs(error, data) {
    
var records = data;
    
records.forEach(function(d) {
    d.datetime = new Date(d.datetime);
});
    
var m = {top: 10, right: 20, bottom: 10, left: 20}; // margin
var w = 1000 - m.left - m.right;
var h = 500 - m.top - m.bottom;
var barPadding = 2;
          
// Crossfilter instance, used for large data manipulation in js
var df = crossfilter(records);    

// Define dimensions
var dateDim = df.dimension(function(d) { return d.datetime; });
var weekdayDim = df.dimension(function(d) { var day = d.weekday; switch (day) {
        case 'Monday': return '0.Monday';
        case 'Tuesday': return '1.Tuesday';
        case 'Wednesday': return '2.Wednesday';
        case 'Thursday': return '3.Thursday';
        case 'Friday': return '4.Friday';
        case 'Saturday': return '5.Saturday';
        case 'Sunday': return '6.Sunday'; } });
var monthDim = df.dimension(function(d) { var month = d.month; switch (month) {
        case 'January': return '00.January';
        case 'February': return '01.February';
        case 'March': return '02.March';
        case 'April': return '03.April';
        case 'May': return '04.May';
        case 'June': return '05.June';
        case 'July': return '06.July';
        case 'August': return '07.August';
        case 'September': return '08.September';
        case 'October': return '09.October';
        case 'November': return '10.November';
        case 'December': return '11.December'; } });
var yearDim = df.dimension(function(d) {return d.year; });
var seasonDim = df.dimension(function(d) { var season = d.season; switch (season) {
        case 'Autumn': return '0.Autumn';
        case 'Winter': return '1.Winter';
        case 'Spring': return '2.Spring';
        case 'Summer': return '3.Summer'; } });
var weatherDim = df.dimension(function(d) { var weather = d.weather; switch (weather) {
        case 'Clear': return '0.Clear';
        case 'Cloudy': return '1.Cloudy';
        case 'Light Precipitation': return '2.Light Precipitation';
        case 'Heavy Precipitation': return '3.Heavy Precipitation'; } });
var countDim = df.dimension(function(d) {return d.count; });
var allDim = df.dimension(function(d) {return d;});  

// Testing dc, y value
var casualDate = dateDim.group().reduceSum(function(d) {return d.casual;});
var registeredDate = dateDim.group().reduceSum(function(d) { return d.registered; });


// Group data
var weekdayGroup = weekdayDim.group();
var monthGroup = monthDim.group();
var yearGroup = yearDim.group();
var seasonGroup = seasonDim.group();
var weatherGroup = weatherDim.group();
var all = df.groupAll();

// Getting extremes for axes
var minDate = dateDim.bottom(1)[0].datetime;
var maxDate = dateDim.top(1)[0].datetime;
var maxCount = countDim.top(1)[0].count;

// Charts
var barChart = dc.barChart('#bike-sharing-chart');
var weekdayChart = dc.rowChart('#weekday-row-chart');
var monthChart = dc.rowChart('#month-row-chart');
var yearChart = dc.rowChart('#year-row-chart');
var seasonChart = dc.rowChart('#season-row-chart');
var weatherChart = dc.rowChart('#weather-row-chart');

barChart // Fix: Isn't separating b/w casual and registered users
    .width(w)
    .height(h)
    .dimension(dateDim)
    .group(casualDate, 'casual Riders')
    .stack(registeredDate, 'registered Riders')
    //.renderArea(true)
    .x(d3.time.scale().domain([minDate,maxDate]))
    .yAxisLabel('Count per whatever')
    .legend(dc.legend().x(50).y(10).itemHeight(13).gap(5))
    .brushOn(false)
    .on('renderlet', function(barChart) {barChart.selectAll('rect').on("click", function(d) {console.log('click'+d);});}); // Highlights when mouse is hovering, buggy since too many datapoints
    
monthChart
    .width(w/3)
    .height(h/3)
    .dimension(monthDim)
    .group(monthGroup)
    .transitionDuration(500)
    .label(function (d) {return d.key.split('.')[1]; })
    .renderLabel(true)
    .elasticX(true);

yearChart
    .width(w/3)
    .height(h/3)
    .dimension(yearDim)
    .group(yearGroup)
    .transitionDuration(500)
    .renderLabel(true)
    .xAxis().ticks(5); // xAxis & ticks does not chain, so should either be last or separate call
    
seasonChart
    .width(w/3)
    .height(h/3)
    .dimension(seasonDim)
    .group(seasonGroup)
    .transitionDuration(500)
    .renderLabel(true)
    .label(function (d) {return d.key.split('.')[1]; })
    .xAxis().ticks(5); // var xAxisseasonChart = seasonChart.xAxis().ticks(5);
    
weekdayChart
    .width(w/3)
    .height(h/3)
    .dimension(weekdayDim)
    .group(weekdayGroup)
    .transitionDuration(500)
    .label(function (d) {return d.key.split('.')[1]; })
    .renderLabel(true);
    
 weatherChart
    .width(w/3)
    .height(h/3)
    .dimension(weatherDim)
    .group(weatherGroup)
    .transitionDuration(500)
    .label(function (d) {return d.key.split('.')[1]; })
    .renderLabel(true);
    
    
dc.renderAll();

}; // Closing brackets from makeGraphs fn
