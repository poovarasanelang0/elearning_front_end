'use strict';

$(document).ready(function() {

	function generateData(baseval, count, yrange) {
		var i = 0;
		var series = [];
		while (i < count) {
			var x = Math.floor(Math.random() * (750 - 1 + 1)) + 1;;
			var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
			var z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;

			series.push([x, y, z]);
			baseval += 86400000;
			i++;
		}
		return series;
	}


	// Home User List Simple Line
    if($('#s-line').length > 0 ){
        var sline = {
            chart: {
                height: 300,
                type: 'area',
                toolbar: {
                  show: false,
                },
              },
              dataLabels: {
                enabled: false,
              },
              stroke: {
                curve: 'smooth',
                width: 3
              },
              series: [{
                name: 'User',
                data: [5000, 4000, 3000, 4600, 5000, 7600, 8000, 4600, 5000, 7600, 8000, 9000]
              }],
              grid: {
                row: {
                  colors: ['transparent'], // takes an array which will be repeated on columns
                  opacity: 0.2
                },
              },
              xaxis: {
                type: 'day',
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],              
              },
              colors: ['#5b298c', '#fff'],
              markers: {
                size: 5,
                colors: ['#5b298c', '#5b298c'],
                strokeColor: "#fff",
                strokeWidth: 2,
                hover: {
                  size: 7,
                }
              }
        }
    
        var chart = new ApexCharts(
          document.querySelector("#s-line"),
          sline
        );
    
        chart.render();
        }
    
	// Column chart
    if($('#sales_chart').length > 0 ){
    	var columnCtx = document.getElementById("sales_chart"),
    	columnConfig = {
    		colors: ['#5b298c', '#fda600'],
    		series: [
    			{
    			name: "New User",
    			type: "column",
    			data: [70, 150, 80, 180, 150, 175, 251, 267, 280, 315, 340, 350]
    			},
    			{
    			name: "Pending User",
    			type: "column",
    			data: [23, 42, 35, 27, 43, 22, 17, 61, 32, 105, 56, 120]
    			}
    		],
    		chart: {
    			type: 'bar',
    			fontFamily: 'Poppins, sans-serif',
    			height: 350,
    			toolbar: {
    				show: true
    			}
    		},
    		plotOptions: {
    			bar: {
    				horizontal: false,
    				columnWidth: '60%',
    				endingShape: 'rounded'
    			},
    		},
    		dataLabels: {
    			enabled: false
    		},
    		stroke: {
    			show: true,
    			width: 2,
    			colors: ['transparent']
    		},
    		xaxis: {
    			categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    		},
    		yaxis: {
    			title: {
    				text: 'Users'
    			}
    		},
    		fill: {
    			opacity: 1
    		},
    		tooltip: {
    			y: {
    				formatter: function (val) {
    					return  + val 
    				}
    			}
    		}
    	};
    	var columnChart = new ApexCharts(columnCtx, columnConfig);
    	columnChart.render();
    }

    
	//Pie Chart
    if($('#invoice_chart').length > 0 ){
    	var pieCtx = document.getElementById("invoice_chart"),
    	pieConfig = {
    		colors: ['#5b298c', '#ff737b', '#fda600', '#1ec1b0'],
    		series: [55, 40, 20, 10],
    		chart: {
    			fontFamily: 'Poppins, sans-serif',
    			height: 350,
    			type: 'donut',
    		},
    		labels: ['Paid', 'Unpaid', 'Overdue', 'Draft'],
    		legend: {show: false},
    		responsive: [{
    			breakpoint: 480,
    			options: {
    				chart: {
    					width: 200
    				},
    				legend: {
    					position: 'bottom'
    				}
    			}
    		}]
    	};
    	var pieChart = new ApexCharts(pieCtx, pieConfig);
    	pieChart.render();
	}
	

// Simple Line Area
 if($('#s-line-area').length > 0 ){
var sLineArea = {
    chart: {
        height: 350,
        type: 'area',
        toolbar: {
          show: false,
        }
    },
    // colors: ['#4361ee', '#888ea8'],
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth'
    },
    series: [{
        name: 'series1',
        data: [31, 40, 28, 51, 42, 109, 100]
    }, {
        name: 'series2',
        data: [11, 32, 45, 32, 34, 52, 41]
    }],

    xaxis: {
        type: 'datetime',
        categories: ["2018-09-19T00:00:00", "2018-09-19T01:30:00", "2018-09-19T02:30:00", "2018-09-19T03:30:00", "2018-09-19T04:30:00", "2018-09-19T05:30:00", "2018-09-19T06:30:00"],                
    },
    tooltip: {
        x: {
            format: 'dd/MM/yy HH:mm'
        },
    }
}

var chart = new ApexCharts(
    document.querySelector("#s-line-area"),
    sLineArea
);

chart.render();
}

// Simple Column
if($('#s-col').length > 0 ){
var sCol = {
    chart: {
        height: 350,
        type: 'bar',
        toolbar: {
          show: false,
        }
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'  
        },
    },
    // colors: ['#888ea8', '#4361ee'],
    dataLabels: {
        enabled: false
    },
    stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
    },
    series: [{
        name: 'Net Profit',
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
    }, {
        name: 'Revenue',
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
    }],
    xaxis: {
        categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    },
    yaxis: {
        title: {
            text: '$ (thousands)'
        }
    },
    fill: {
        opacity: 1

    },
    tooltip: {
        y: {
            formatter: function (val) {
                return "$ " + val + " thousands"
            }
        }
    }
}

var chart = new ApexCharts(
    document.querySelector("#s-col"),
    sCol
);

chart.render();
}


// Simple Column Stacked
if($('#s-col-stacked').length > 0 ){
var sColStacked = {
    chart: {
        height: 350,
        type: 'bar',
        stacked: true,
        toolbar: {
          show: false,
        }
    },
    // colors: ['#4361ee', '#888ea8', '#e3e4eb', '#d3d3d3'],
    responsive: [{
        breakpoint: 480,
        options: {
            legend: {
                position: 'bottom',
                offsetX: -10,
                offsetY: 0
            }
        }
    }],
    plotOptions: {
        bar: {
            horizontal: false,
        },
    },
    series: [{
        name: 'PRODUCT A',
        data: [44, 55, 41, 67, 22, 43]
    },{
        name: 'PRODUCT B',
        data: [13, 23, 20, 8, 13, 27]
    },{
        name: 'PRODUCT C',
        data: [11, 17, 15, 15, 21, 14]
    },{
        name: 'PRODUCT D',
        data: [21, 7, 25, 13, 22, 8]
    }],
    xaxis: {
        type: 'datetime',
        categories: ['01/01/2011 GMT', '01/02/2011 GMT', '01/03/2011 GMT', '01/04/2011 GMT', '01/05/2011 GMT', '01/06/2011 GMT'],
    },
    legend: {
        position: 'right',
        offsetY: 40
    },
    fill: {
        opacity: 1
    },
}

var chart = new ApexCharts(
    document.querySelector("#s-col-stacked"),
    sColStacked
);

chart.render();
}

// Simple Bar
if($('#s-bar').length > 0 ){
var sBar = {
    chart: {
        height: 350,
        type: 'bar',
        toolbar: {
          show: false,
        }
    },
    // colors: ['#4361ee'],
    plotOptions: {
        bar: {
            horizontal: true,
        }
    },
    dataLabels: {
        enabled: false
    },
    series: [{
        data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
    }],
    xaxis: {
        categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan', 'United States', 'China', 'Germany'],
    }
}

var chart = new ApexCharts(
    document.querySelector("#s-bar"),
    sBar
);

chart.render();
}

// Mixed Chart
if($('#mixed-chart').length > 0 ){
var options = {
  chart: {
    height: 305,
    type: 'line',
    toolbar: {
      show: false,
    }
  },
  colors: ['#5b298c', '#888ea8'],
  series: [{
    name: 'User',
    type: 'column',
    data: [140, 160, 214, 271, 227, 313, 201, 452,532, 560, 590, 620]
  }, 
  {
    name: 'Post',
    type: 'line',
    data: [127, 112, 115, 217, 218, 222, 197, 231, 322, 453, 572, 596]
  }],
  
  stroke: {
    width: [0, 4]
  },
//   title: {
//     text: 'Traffic'
//   },
//   labels: ['Jan 2022', 'Fec 2022', 'Mar 2022', 'Apr 2022', 'May 2022', 'Jun 2022', 'Jul 2022', 'Aug 2022', 'Sep 2022', 'Oct 2022', 'Nov 2022', 'Dec 2022'],
  xaxis: {
    categories: ['Jan 2022', 'Fec 2022', 'Mar 2022', 'Apr 2022', 'May 2022', 'Jun 2022', 'Jul 2022', 'Aug 2022', 'Sep 2022', 'Oct 2022', 'Nov 2022', 'Dec 2022'],
},
//   yaxis: [{
//     title: {
//       text: 'Website Blog',
//     },

//   }, 
// //   {
// //     opposite: true,
// //     title: {
// //       text: 'Social Media'
// //     }
// //   }
// ]
}

var chart = new ApexCharts(
  document.querySelector("#mixed-chart"),
  options
);

chart.render();
}

// Donut Chart

if($('#donut-chart').length > 0 ){
var donutChart = {
    chart: {
        height: 320,
        type: 'donut',
        toolbar: {
          show: false,
        }
    },
    // colors: ['#4361ee', '#888ea8', '#e3e4eb', '#d3d3d3'],
    series: [44, 55, 41, 17],
    responsive: [{
        breakpoint: 480,
        options: {
            chart: {
                width: 200
            },
            legend: {
                position: 'bottom'
            }
        }
    }]
}

var donut = new ApexCharts(
    document.querySelector("#donut-chart"),
    donutChart
);

donut.render();
}

// Radial Chart
if($('#radial-chart').length > 0 ){
var radialChart = {
    chart: {
        height: 350,
        type: 'radialBar',
        toolbar: {
          show: false,
        }
    },
    // colors: ['#4361ee', '#888ea8', '#e3e4eb', '#d3d3d3'],
    plotOptions: {
        radialBar: {
            dataLabels: {
                name: {
                    fontSize: '22px',
                },
                value: {
                    fontSize: '16px',
                },
                total: {
                    show: true,
                    label: 'Total',
                    formatter: function (w) {
                        return 249
                    }
                }
            }
        }
    },
    series: [44, 55, 67, 83],
    labels: ['Apples', 'Oranges', 'Bananas', 'Berries'],    
}

var chart = new ApexCharts(
    document.querySelector("#radial-chart"),
    radialChart
);

chart.render();
}	
	
	
  
});