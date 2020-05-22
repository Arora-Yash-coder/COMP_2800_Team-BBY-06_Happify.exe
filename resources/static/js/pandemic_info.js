//WHEN THE BUTTON IS CLICKED,
//THE LINE GRAPH WILL SHOW
$("#line_graph_button").click(() => {
    $("#line_graph").show()
    $("#bar_graph").hide()
})

//WHEN THE BUTTON IS CLICKED,
//THE BAR GRAPH WILL SHOW
$("#bar_graph_button").click(() => {
    $("#bar_graph").show()
    $("#line_graph").hide()
})

//days IS THE ARRAY TO STORE WHICH DAY IT IS IN.
var days = []
var infected_num = []
async function getLineData() {
    console.log("doing")
    let get_data = await $.ajax({
        type: "get",
        url: "/parse_covid_line_data",

        dataType: "json",
        success: function (response) {
            data = response
            console.log(data)

            for (var i in data) {
                console.log(data[i]._id)
                days.push(data[i]._id.substring(5))
                console.log(data[i].count)
                infected_num.push(data[i].count)
            }
            return


        }
    });
}

//LINE CHART start
//DRAWING LINE GRPAH
//HELPED BY THIS DOCUMENT SOURCE: https://tobiasahlin.com/blog/chartjs-charts-to-get-you-started/
//CONETNET:

async function drawLineGraph() {
    new Chart(document.getElementById("line-chart"), {
        type: 'line',
        data: {
            //days
            labels: days,

            datasets: [{
                    data: infected_num,
                    label: "COVID NEWLY CONFIRMED CASES",
                    borderColor: "#3e95cd",
                    fill: true
                },
        
            ]
        },
        options: {
            title: {
                display: true,
                text: 'CASE DISTRIBUTION'
            }
        }
    });

}
//LINE CHART end
//DRAWING LINE GRPAH
//HELPED BY THIS DOCUMENT SOURCE: https://tobiasahlin.com/blog/chartjs-charts-to-get-you-started/



//distribution IS AN OBJECT THAT WILL BE STORING 
//SECTION RELATED DATA AND BE USED IN THE AMCHARTS 
//MAP DISPLAY.
var distribution = {
    "4 Vancouver Island": null,
    "2 Fraser": null,
    "1 Interior": null,
    "3 Vancouver Coastal": null,
    "5 Northen": null,

};
//THE SECTION IS AN ARRAY
var section = [];
//WHILE THE NUMBER WILL BE STORED IN HERE
var infected_num_section = [];

//THE FUNCTION TO GET BAR CHART DATA.
async function getBarData() {
    console.log("doing")
    let get_data = await $.ajax({
        type: "get",
        url: "/parse_covid_bar_data",

        dataType: "json",
        success: function (response) {
            data = response
            console.log(data)
            //DATA PROCESSING, IT SENDS THE DATA INTO THE FORMAT I WANT
            for (var i in data) {
                console.log(data[i]._id)
                section.push(data[i]._id)
                console.log(data[i].count)
                infected_num_section.push(data[i].count)
                //IF THE ID IS VANCOUVER ISLAND
                //PUT INTO THE OBJECT '4 Vancouver Island'
                //ALL THE SAME FOR OTHER AREAS.
                if (data[i]._id == "Vancouver Island") {
                    distribution["4 Vancouver Island"] = data[i].count
                } else if (data[i]._id == "Fraser") {
                    distribution["2 Fraser"] = data[i].count

                } else if (data[i]._id == "Interior") {
                    distribution["1 Interior"] = data[i].count

                } else if (data[i]._id == "Vancouver Coastal") {
                    distribution["3 Vancouver Coastal"] = data[i].count

                } else {
                    distribution["5 Northern"] = data[i].count

                }
            }
            return


        }
    });
}

//RADAR CHART start
//DRAWING RADAR GRPAH
//HELPED BY THIS DOCUMENT SOURCE: https://tobiasahlin.com/blog/chartjs-charts-to-get-you-started/
//CONETNET:

//THE FUNCTION TO DEPICT THE BAR CHART
async function drawBarGraph() {

    new Chart(document.getElementById("bar-chart"), {
        type: 'polarArea',
        data: {
            labels: section,
            datasets: [{
                //THE HEADER OF THE CHART
                label: "Cases",

                backgroundColor: "rgba(179,181,198,0.6)",
                borderColor: "rgba(227,71,43,1)",

                data: infected_num_section
            }]
        },
        options: {
            title: {
                display: true,
                // text: 'Distribution in % of world population'
            }
        }
    });

}

//RADAR CHART end
//DRAWING RADAR GRPAH
//HELPED BY THIS DOCUMENT SOURCE: https://tobiasahlin.com/blog/chartjs-charts-to-get-you-started/



//GET LINEGRAPH DATA FIRST
getLineData().then(() => {
    //THEN DEPICT THE 
    drawLineGraph()
}).then(() => {
    getBarData().then(() => {
        drawBarGraph().then(drawMap())
    })
})




// DRAWGRAPH()
$(".choice_btn").click((e) => {
    $(e.target.parentNode.parentNode).css("display", "none")
    $(e.target.parentNode.parentNode).css("height", "0")
    $(e.target.parentNode.parentNode).remove()
})

//DRAWS THE MAP
async function drawMap() {
    //ANCHARTS MAP start
    //THE FOLLOWING CODE IS FINISHED WITH THE HELP OF THE OFFCIAL DOCUMENT OF 
    //AMCHARTS
    //SOURCE: https://www.amcharts.com/docs/v4/chart-types/map/
  

    console.log("{HA_Title}")
    console.log("data in line 232")
    console.log(distribution)
    var chart = am4core.create("chartdiv", am4maps.MapChart);

    // SET MAP DEFINITION
    chart.geodataSource.url = "/static/BC-HA-map.min.json"

    chart.data = distribution;
    // SET PROJECTION
    chart.projection = new am4maps.projections.Mercator();

    // CREATE MAP POLYGON SERIES
    var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

    // MAKE MAP LOAD POLYGON (LIKE COUNTRY NAMES) DATA FROM GEOJSON
    polygonSeries.useGeodata = true;

    // CONFIGURE SERIES
    var polygonTemplate = polygonSeries.mapPolygons.template;
  
    //HA_Title IS THE TITLE IN THE SHP FILE.
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
        
        //APPENDS THE CASE INFO INTO THE HTML DIV.
        info.innerHTML = "<h3>" + distribution[a]+ "cases" +" </h3>";
    
    })


        // CREATE HOVER STATE AND SET ALTERNATIVE FILL COLOR
        var hs = polygonTemplate.states.create("hover");
        hs.properties.fill = am4core.color("#367B25");

        chart.seriesContainer.draggable = false;
        chart.seriesContainer.resizable = false;
        chart.maxZoomLevel = 1;
        // DISABLED ZOOM CONTROL HERE
        // chart.zoomControl = new am4maps.ZoomControl();


    }


      // WHEN THE USER SCROLLS THE PAGE, EXECUTE MYFUNCTION
      window.onscroll = function () {
        myFunction()
    };

    // GET THE NAVBAR
    var navbar = document.getElementById("navbar");

    // GET THE OFFSET POSITION OF THE NAVBAR
    var sticky = navbar.offsetTop;

    // ADD THE STICKY CLASS TO THE NAVBAR WHEN YOU REACH ITS SCROLL POSITION. REMOVE "STICKY" WHEN YOU LEAVE THE SCROLL POSITION
    function myFunction() {
        if (window.pageYOffset >= sticky) {
            navbar.classList.remove("regular");
            navbar.classList.add("sticky");
        } else {
            navbar.classList.remove("sticky");
            navbar.classList.add("regular");
        }
    }
    //ANCHARTS MAP end
    //THE FOLLOWING CODE IS FINISHED WITH THE HELP OF THE OFFCIAL DOCUMENT OF 
    //AMCHARTS
    //SOURCE: https://www.amcharts.com/docs/v4/chart-types/map/
  