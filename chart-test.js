$(function () {
    // Create the chart

    var timeIterVal = [1,1,1,1,1,
                       5,5,5,5,5,
                       30,30,30,30,30, 
                       60,60,60,60,60, 
                       300,300,300,300,300,
                       1800,1800,1800,1800,1800, 
                       3600,3600,3600,3600,3600];

    var socketiotimeIterVal = [1,1,1,1,1,
                                5,5,5,5,5,
                                30,30,30,30,30, 
                                60,60,60,60,60, 
                                300,300,300,300,300];

    var  cplusBandwidth = [16.3666, 19.5179, 16.8915, 12.8952, 13.4720,
                           20.2533, 14.0900, 13.9993, 13.9746, 15.2748,
                           13.4022, 18.0188, 17.6447, 17.2069, 17.8542,
                           17.7374, 18.4933, 17.3154, 17.7888, 17.5741,
                           18.1153, 17.8781, 20.2750, 18.5768, 18.4956,
                           18.9000, 18.6198, 20.3170, 22.3379, 24.0760,
                           23.0717, 23.7305, 14.1724, 16.7679, 20.8466];

    var nodejsBandwidth = [16.2051, 16.0147, 15.6262, 15.6275, 16.4663, 
                           15.9384, 15.7885, 15.7377, 15.8419, 15.8905,
                           15.5214, 15.3816, 15.3701, 15.4470, 15.2616,
                           14.9319, 15.3805, 15.3814, 15.5795, 15.1035,
                           15.3273, 15.1707, 15.2477, 14.3100, 17.7113,
                           21.1948, 21.2200, 20.9214, 20.6939, 20.4914,
                           20.3412, 20.2045, 18.4296, 20.2005, 20.2025];

    var socketioBandwidth = [1.8893, 3.5496, 2.6335, 1.3740, 3.4923,
                             2.6450, 2.8053, 2.8511, 2.8625, 2.8969,
                             2.8034, 2.7671, 2.8625, 2.8625, 2.8606,
                             2.7671, 2.5763, 2.7194, 2.5286, 2.3387,
                             2.2994, 2.3664, 2.1375, 2.1561, 2.0994,
                             2.1389, 2.1151, 2.1644, 2.0992, 2.0992,
                             2.1111, 2.0984, 2.1000, 2.1000, 2.1747];

    var Socketio = [];
    Socketio[0] = {};
    Socketio[0].datasize = "50Bytes";
    Socketio[0].bandwidth = [0.0651, 0.4593, 0.5711, 0.4778, 0.5245,
                             0.4811, 0.4547, 0.4278, 0.4785, 0.4655,
                             0.4545, 0.4545, 0.4545, 0.4492, 0.4451,
                             0.4476, 0.4426, 0.4458, 0.4458, 0.4458,
                             0.5455, 0.5652, 0.5535, 0.5577, 0.5617];

    Socketio[1] = {};
    Socketio[1].datasize = "100Bytes";
    Socketio[1].bandwidth = [0.6838, 0.5807, 0.7484, 0.4812, 0.5576,
                             0.7629, 0.7271, 0.6462, 0.6350, 0.7382,
                             0.6866, 0.6830, 0.6763, 0.6751, 0.6866,
                             0.6866, 0.6866, 0.6866, 0.6866, 0.6866,
                             0.6825, 0.6813, 0.6816, 0.6781, 0.6713];

    Socketio[2] = {};
    Socketio[2].datasize = "500Bytes";
    Socketio[2].bandwidth = [0.0009, 2.2006, 2.2010, 2.2010, 2.2010,
                             1.7608, 1.7608, 1.3924, 1.2488, 1.7608,
                             1.3313, 1.3832, 1.4673, 1.4673, 1.4516,
                             1.3917, 1.4041, 1.5405, 1.4675, 1.5133,
                             1.4435, 1.4484, 1.4936, 1.4307, 1.4527];

    Socketio[3] = {};
    Socketio[3].datasize = "1000Bytes";
    Socketio[3].bandwidth = [0.0019, 2.3832, 2.3841, 2.3841, 2.3841,
                             1.9073, 1.9073, 1.9073, 1.9073, 1.9073,
                             1.5894, 1.6689, 1.6689, 1.6563, 1.6074,
                             1.6662, 1.6689, 1.6689, 1.6689, 1.6689,
                             1.6530, 1.6291, 1.6450, 1.6609, 1.6530];

    Socketio[4] = {};
    Socketio[4].datasize = "10000Bytes";
    Socketio[4].bandwidth = [0.0190, 2.3746, 2.3841, 2.3841, 2.3841,
                             1.9073, 1.9073, 1.9073, 1.9073, 1.9073,
                             1.8278, 1.8278, 1.9073, 1.8386, 1.8170,
                             1.8499, 1.8418, 1.7917, 1.8150, 1.8010,
                             1.8437, 1.8437, 1.8437, 1.8437, 1.8119];

    Socketio[5] = {};
    Socketio[5].datasize = "50000Bytes";
    Socketio[5].bandwidth = [0.0953, 2.8133, 2.8610, 2.8610, 2.8610,
                             2.2888, 2.2888, 2.2888, 2.2888, 2.2888,
                             2.1934, 2.1934, 2.1934, 2.0980, 2.1282,
                             2.1306, 2.1457, 2.0980, 2.1457, 2.1934,
                             2.1789, 2.1506, 2.1457, 2.1707, 2.1589];

    Socketio[6] = {};
    Socketio[6].datasize = "100000Bytes";
    Socketio[6].bandwidth = [0.1907, 2.7656, 2.8610, 2.8610, 2.8610,
                             2.2888, 2.2888, 2.2888, 2.2888, 2.2888,
                             2.0980, 2.0980, 2.1298, 2.1489, 2.2061,
                             2.1934, 2.2888, 2.1934, 2.2013, 2.1918,
                             2.2303, 2.2506, 2.2672, 2.2532, 2.2411];

    $('#CplusAndNodejs').highcharts(
    {
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: 'Test Communication BandWith in C++ and Nodejs'
        },        
        xAxis: [{
            categories: timeIterVal,
            crosshair: true,
            labels: {
                format: '{value}S',
            }
        }],
        yAxis: [{ 
            lineWidth: 0,
            gridLineWidth: 0,
            title: {
                text: 'Bandwidth',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                format: '{value}MB/s',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            }
        }],
        tooltip: {
            formatter: function () {
                var s = '<b> Test Time: ' + this.x + 's</b>';
                $.each(this.points, function () {
                    s += '<br/>' + this.series.name + ': ' +
                        this.y + ' MB/s';
                });
                return s;
            },
            shared: true
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            x: 80,
            verticalAlign: 'top',
            y: 55,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        series: [{
            name: 'C++     ',
            type: 'spline',
            data: cplusBandwidth,
            marker: {
                enabled: false
            },
        }, {
            name: 'Nodejs   ',
            type: 'spline',
            data: nodejsBandwidth,
        },{
            name: 'Socketio ',
            type: 'spline',
            data: socketioBandwidth,
        }]
    });

    $('#Socketio').highcharts(
    {
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: 'Test Socket.io Communication BandWith of different datasize'
        },        
        xAxis: [{
            categories: timeIterVal,
            crosshair: true,
            labels: {
                format: '{value}S',
            }
        }],
        yAxis: [{ // First yAxis
            gridLineWidth: 0,
            title: {
                text: 'Bandwidth ',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                format: '{value}MB/s',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            }
        }],
        tooltip: {
            formatter: function () {
                var s = '<b> Test Time: ' + this.x + 's</b>';
                $.each(this.points, function () {
                    s += '<br/>' + this.series.name + ': ' +
                        this.y + ' MB/s';
                });
                return s;
            },           
            shared: true
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            x: 80,
            verticalAlign: 'top',
            y: 85,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        series: [{
            name: Socketio[0].datasize,
            type: 'spline',
            data: Socketio[0].bandwidth,
            dashStyle: 'shortdot',
        }, {
            name: Socketio[1].datasize,
            type: 'spline',
            data: Socketio[1].bandwidth,
        }, {
            name: Socketio[2].datasize,
            type: 'spline',
            data: Socketio[2].bandwidth,
        }, {
            name: Socketio[3].datasize,
            type: 'spline',
            data: Socketio[3].bandwidth,
        }, {
            name: Socketio[4].datasize,
            type: 'spline',
            data: Socketio[4].bandwidth,
        },{
            name: Socketio[5].datasize,
            type: 'spline',
            data: Socketio[5].bandwidth,
        },{
            name: Socketio[6].datasize,
            type: 'spline',
            data: Socketio[6].bandwidth,
        }
        ]
    });
});

