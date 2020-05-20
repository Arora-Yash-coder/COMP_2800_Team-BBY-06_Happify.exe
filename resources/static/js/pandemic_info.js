async function drawMap() {


    console.log("{HA_Title}")
    console.log("data in line 232")
    console.log(distribution)
    var chart = am4core.create("chartdiv", am4maps.MapChart);

    // Set map definition
    chart.geodataSource.url = "/static/BC-HA-map.min.json"

    chart.data = distribution;
    // Set projection
    chart.projection = new am4maps.projections.Mercator();

    // Create map polygon series
    var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

    // Make map load polygon (like country names) data from GeoJSON
    polygonSeries.useGeodata = true;

    // Configure series
    var polygonTemplate = polygonSeries.mapPolygons.template;
  

    polygonTemplate.tooltipText = "{HA_Title}" ;

   

        // polygonTemplate.fill = am4core.color("#74B266");

        polygonTemplate.events.on("hit", function (ev) {
        var data = ev.target.dataItem.dataContext;
        var info = document.getElementById("info");
        console.log("312 data")
        console.log(distribution)
        console.log("title")
        let a = data.HA_Title
        console.log(a)
        // alert(distribution[a] + "cases")
        info.innerHTML = "<h3>" + distribution[a]+ "cases" +" </h3>";
        // if (data.HA_Title) {
        //     info.innerHTML += distribution[a];
        //     polygonTemplate.tooltipText = "{HA_Title}" + distribution[a];
        // }
        // else {
        //     info.innerHTML += "<i>No description provided.</i>"
        // }
    })


        // Create hover state and set alternative fill color
        var hs = polygonTemplate.states.create("hover");
        hs.properties.fill = am4core.color("#367B25");

        chart.seriesContainer.draggable = false;
        chart.seriesContainer.resizable = false;
        chart.maxZoomLevel = 1;
        // DISABLED ZOOM CONTROL HERE
        // chart.zoomControl = new am4maps.ZoomControl();


    }