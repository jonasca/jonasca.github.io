d3.queue()
    .defer(d3.json, "https://jonasca.github.io/data/bike_sharing_dashboard_data.json" )
    .await(makeGraphs); // Queue lets data load completely before creating charts
    
function makeGraphs(error, data) {
    
    //Clean data
    var records = data;
    
    records.forEach(function(d) {
        
        //d.timestamp = new Date(d.timestamp)    // bc d3.json  is returning date in string format
        //d["timestamp"].setMinutes(0);
        //d["timestamp"].setSeconds(0);
        //d.longitude = +d.longitude;
        //d.latitude = +d.latitude;
    });
    
    console.log(records[0]);
    // Good place to check if datatime worked, with console.log(records[0].timestamp); console.log("everything ran");
    
};
