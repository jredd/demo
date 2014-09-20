/**
 * Created by jredd on 9/17/14.
 */
//var x = document.getElementById("demo");
//
//function get_location() {
//    if (navigator.geolocation) {
//        navigator.geolocation.getCurrentPosition(showPosition);
//    } else {
//        x.innerHTML = "Geolocation is not supported by this browser.";
//    }
//}get_location()

var white = '#FfFeFa';


// ---IMAGE DRAG AND DROP---
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    console.log(ev.dataTransfer.setData("text/html", ev.target.id));
    ev.dataTransfer.setData("text/html", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text/html");
    console.log(data);
    ev.target.appendChild(document.getElementById(data));
}

//---D3 Visualization---

function build_pie_chart() {

    var data = [
        {
            color: "Blue",
            count: 15
        },
        {
            color: "Green",
            count: 9
        },
        {
            color: "Red",
            count: 19
        },
        {
            color: "Yellow",
            count: 5
        },
        {
            color: "Purple",
            count: 11
        },
        {
            color: "Orange",
            count: 17
        }
    ];
    var total_count = 0
    // Build out the list items to display the vote count
    // also get the total count
    $.each(data, function(index, color_count) {
        var html_string = '<li>'+ color_count['color'] + ': ' + color_count['count'] + '</li>';
        $('#color_list').append(html_string)

        total_count += color_count['count']
    });

    var margin = {top: 20, right: 20, bottom: 20, left: 20};
    var width = 850 - margin.left - margin.right;
    var height = 850 - margin.top - margin.bottom;

    var radius = (Math.min(width, height) / 2)-100;
    var innerRadius = radius - 90;

    var color = d3.scale.ordinal()
        .range(["blue", "green", "red", "yellow", "purple", "orange"]);

    var arc = d3.svg.arc()
        .outerRadius(radius)
        .innerRadius(innerRadius);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function (d) {
            return d.count;
        });

    var svg = d3.select("#pie_chart").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr('class', 'pie_chart_svg')
        .append("g")
        .attr("transform", "translate(" + width/2 +  "," + ((height/2.25)) + ")");

    svg.append("text")
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .attr("class", "inside")
        .style('font-size', '4.45em')
        .style('fill', white)
        .text(function(d) { return total_count+' votes cast'; })
        .attr('opacity', 0)
        .transition()
        .delay(300)
        .duration(900)
        .attr('opacity', 1);

    var g = svg.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc")
        .attr('class', function (d) {
            return 'arc '+d.data.color.toLowerCase()+'_arc'
        });

    var arc_path = g.append("path")
        .attr("d", arc)
        .style("fill", function (d) {
            return d3.hsl(color(d.data.color)).darker(1);
        })
        .on('mouseover', function(obj) {
            svg.select("text")
                .attr("fill", function(d) { return white; })
                .transition()
                .delay(200)
                .duration(400)
                .text(function(d){
                    return obj.data.color;
                });
        })
        .on('mouseout', function(obj) {
            svg.select("text")
                .transition()
                .delay(200)
                .duration(400)
                .attr("fill", white)
                .text(function(d){
                    return total_count+' votes cast';
                });
        })
        .transition()
        .duration(800)
        .attrTween("d", tweenPie);



    var textOffset = innerRadius/6;

    function getPercent(d){
        return (d.endAngle-d.startAngle > 0.2 ?
            Math.round(1000*(d.endAngle-d.startAngle)/(Math.PI*2))/10+'%' : '');
    }

    g.append("text")
        .attr("dy", function(d){
            if ((d.startAngle+d.endAngle)/2 > Math.PI/2 && (d.startAngle+d.endAngle)/2 < Math.PI*1.5 ) {
                return 17;
            } else {
                return 5;
            }
        })
        .attr("text-anchor", function(d){
            if ((d.startAngle+d.endAngle)/2 < Math.PI ) {
                return "beginning";
            } else {
                return "end";
            }
        })
        .attr("class", "units")
        .style('fill', white)
        .attr('opacity', 0)
        .attr("transform", function(d) {
            var b = (d.startAngle + d.endAngle - Math.PI)/2;
            return "translate(" + Math.cos(((d.startAngle+d.endAngle - Math.PI)/2)) * (innerRadius+textOffset) + "," + Math.sin((d.startAngle+d.endAngle - Math.PI)/2) * (innerRadius+textOffset) + ")";
        })
        .attr("dy", function(d){
            if ((d.startAngle+d.endAngle)/2 > Math.PI/2 && (d.startAngle+d.endAngle)/2 < Math.PI*1.5 ) {
                return 17;
            } else {
                return 5;
            }
        })
        .attr("text-anchor", function(d){
            if ((d.startAngle+d.endAngle)/2 < Math.PI ) {
                return "beginning";
            } else {
                return "end";
            }
        })
        .text(getPercent)
        .transition().duration(800).attr('opacity', 1).attrTween("transform", textTween);

    function tweenPie(b) {
        var i = d3.interpolate({startAngle: 0.1*Math.PI, endAngle: 0.1*Math.PI}, b);
        return function(t) {
            return arc(i(t)); };
    }

    var oldPieData = [];

    function textTween(d, i) {
        var a;
        if(oldPieData[i]){
            a = (oldPieData[i].startAngle + oldPieData[i].endAngle - Math.PI)/2;
        } else if (!(oldPieData[i]) && oldPieData[i-1]) {
            a = (oldPieData[i-1].startAngle + oldPieData[i-1].endAngle - Math.PI)/2;
        } else if(!(oldPieData[i-1]) && oldPieData.length > 0) {
            a = (oldPieData[oldPieData.length-1].startAngle + oldPieData[oldPieData.length-1].endAngle - Math.PI)/2;
        } else {
            a = 0;
        }
        var b = (d.startAngle + d.endAngle - Math.PI)/2;

        var fn = d3.interpolateNumber(a, b);
        return function(t) {
            var val = fn(t);
            return "translate(" + Math.cos(val) * (innerRadius+textOffset) + "," + Math.sin(val) * (innerRadius+textOffset) + ")";
        };
    }

    var current_fill = '';
    var arc_select = $('.arc').children('path')

    arc_select.mouseenter(function() {
        current_fill = this.style.fill;
        console.log(current_fill, d3.hsl(current_fill).brighter(1))
        d3.select(this)
            .style('fill', d3.hsl(current_fill).brighter(1))

    });

    arc_select.mouseleave(function() {
        d3.select(this)
            .style('fill', current_fill)
    });

    var color_list = $('#color_list');

    color_list.children().mouseenter(function() {
        var arc_class = '.' + this.innerHTML.split(':')[0].toLowerCase() + '_arc';
//        console.log(this)
        d3.select(arc_class).transition().duration(300)
            .attr("transform", function (d) {
                var centroid = arc.centroid(d)
                var arc_x = centroid[0] * .2;
                var arc_y = centroid[1] * .2;
//                console.log(this)
                return 'translate(' + arc_x + ',' + arc_y + ')'
            })
            .attr('fill', function(d) {

                current_fill = this.children[0].style.fill;
                console.log(current_fill, d3.hsl(current_fill).brighter(1))
                return d3.hsl(current_fill).brighter(1)

            });
    });


    color_list.children().mouseleave(function() {
        var arc_class = '.' + this.innerHTML.split(':')[0].toLowerCase() + '_arc'
        d3.select(arc_class).transition().duration(300)
            .attr("transform", 'translate(0,0)');
    });

}build_pie_chart();



//----TABLE DATA---

$.getJSON('table_data.json', function(return_data){
    // loop throught the data and prepare the html strings
    $.each(return_data, function(index, data){
        var html_string = '<tr>' +
            '<td>' + data['first_name'] + ' ' + data['last_name'] + '</td>' +
            '<td>' + data['color'] + '</td>' +
            '<td>' + data['food'] + '</td>' +
            '<td>' + data['car'] + '</td></tr>';

        $('#table_body').append(html_string);
    })
});