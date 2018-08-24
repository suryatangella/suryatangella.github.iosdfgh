
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    // Draw the chart and set the chart values
    function drawChart(x,y) {

        var data = google.visualization.arrayToDataTable([
            ['Task', 'Hours per Day'],
            ['Work in Progress', x],
            ['Total Exposure', y],

        ]);

        // Optional; add a title and set the width and height of the chart
        var options = {  'width': 400, 'height': 250,is3D: true};

        // Display the chart inside the <div> element with id="piechart"
        var chart = new google.visualization.PieChart(document.getElementById('piechart'));
        chart.draw(data, options);
    }
