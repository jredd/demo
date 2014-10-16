/**
 * Created by jredd on 10/8/14.
 */

//----------GEO LOCATION API---------
var x = document.getElementById("demo");

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition,showError);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    var latlon = position.coords.latitude+","+position.coords.longitude;

    var img_url = "http://maps.googleapis.com/maps/api/staticmap?center="
        +latlon+"&zoom=14&size=400x300&sensor=false";
    document.getElementById("mapholder").innerHTML = "<img src='"+img_url+"'>";
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred."
            break;
    }
}


//-------Table Manipulation------

trash_btn_click = function() {
    $('.trash_row_btn').click(function() {
//        console.log('trash clicked');
        var current_row = $(this).closest('tr');
//        console.log(current_row)
//        if (confirm("Will permanently remove this user.")) {
//            console.log("GOT THE OK TO KILL IT")
//        }
        $(current_row).remove();
        save_local();
    });
};

build_table = function(data) {
    var tr_list = {};

    $.each(data, function(index, data){
        var html_string = '<tr id="'+"row_"+index+'">' +
            '<td>' + data['first_name'] + ' ' + data['last_name'] + '</td>' +
            '<td>' + data['color'] + '</td>' +
            '<td>' + data['food'] + '</td>' +
            '<td>' + data['car'] + '' +
                "<span class='glyphicon glyphicon-pencil edit_btn'></span>" +
                "<span class='glyphicon glyphicon-trash trash_row_btn'></span>" +
            '</td></tr>';
        tr_list["row_"+index] = html_string;
        $('#table_body').append(html_string);
    });

    localStorage.removeItem('local_tr_list');
    localStorage.setItem('local_tr_list', JSON.stringify(tr_list));
    add_row_btns();
};

add_row_btns = function(){
    var edit_btn = $('.edit_btn');
    var trash_btn = $(".trash_row_btn");
    var hover_row = "";
    var table_row = $('tbody tr');

    edit_btn.hide();
    trash_btn.hide();

    table_row.mouseenter(function(e) {
        hover_row = $(this)[0];
        var last_child = $(hover_row.lastChild);
        last_child.children('.edit_btn').show(300);
        last_child.children('.trash_row_btn').show(300);
//        divdbl.dblclick
        $(hover_row).dblclick(function(e) {
//            $('.trash_row_btn').click(this)
            console.log(last_child.children(".trash_row_btn").click())
//            console.log($(this).children('.trash_row_btn').click())
            //.children('.trash_row_btn').click())//.childElement('.trash_row_btn'))
            $(hover_row).children('.trash_row_btn').click()
        });

    });
    table_row.mouseleave(function(e) {
        var last_child = $($(this)[0].lastChild);
        last_child.children('.edit_btn').hide(300);
        last_child.children('.trash_row_btn').hide(300);
    });

    trash_btn_click();

    edit_btn.click(function(e) {
        var column_count = $("table > tbody").find("> tr:first > td").length;
        var current_row = $(this).closest('tr');
        var parts = current_row.find('td');
        var td_string   = "";
        var row_id = current_row.attr('id');

        $.each(parts, function(index, td) {
            var td_text = "";
            if(index+1 == column_count ){
                td_text= $(td).text();//.slice(0,-4);
                td_string+=
                    "<td><input value='"+td_text+"'>" +
                        "<span class='glyphicon glyphicon-floppy-saved save_btn'></span>" +
                        "<span class='glyphicon glyphicon-remove cancel_edit_btn'></span>" +
                    "</td>";
            }else {
                td_text = $(td).text();
                td_string+= "<td><input value='"+td_text+"'></td>";
            }
        });
        var edit_row = '<tr id="'+row_id+'">' + td_string + '</tr>';
        $(hover_row).replaceWith(edit_row);

        save_button_click();
        cancel_edit_btn_click();
    });
};

save_button_click = function(){
    $(".save_btn").click(function(e) {
        var column_count = $("table > tbody").find("> tr:first > td").length;
        var current_row = $(this).closest('tr');
        var parts = current_row.find('td');//find('td');
        var td_string   = "";
        var row_id = current_row.attr('id');
        var name_split = $($(parts[0])[0]).find('input').val().split(" ");

        if (name_split.length > 1) {
            if (!(name_split[1].length)) {
                confirm("Name field needs a first and last name ex(Bill Smith)")
            }else {
                if (current_row.hasClass("new_row")) {
                    $("#add_to_json_list").removeAttr('disabled');
                }

                $.each(parts, function (index, td) {
                    var td_text = $(td).children('input').val();
                    if (index + 1 == column_count) {
                        td_string +=
                            "<td>" + td_text +
                            "<span class='glyphicon glyphicon-pencil edit_btn'></span>" +
                            "<span class='glyphicon glyphicon-trash trash_row_btn'></span>" +
                            "</td>"
                    } else {
                        td_string += "<td>" + td_text + "</td>";
                    }
                });
                var row_data = JSON.parse(localStorage.getItem('local_tr_list'));
                var new_row = '<tr id="' + row_id + '">' + td_string + '</tr>';
                row_data[row_id] = new_row;
                $(current_row).replaceWith(new_row);
                localStorage.setItem('local_tr_list', JSON.stringify(row_data));
                save_local();
                add_row_btns();
            }
        }else{
            confirm("Name field needs a first and last name ex(Bill Smith)")
        }
    });


};

save_local = function(){
    var body = $("#table_body").children('tr');
    var local_json_list = [];

    $.each(body, function (index, row) {
        var user_info = {}
        var name = $($(row).children('td')[0]).text().split(' ');

        user_info["first_name"] = name[0];
        user_info["last_name"] = name[1];
        user_info["color"] =($($(row).children('td')[1]).text());
        user_info["car"] =($($(row).children('td')[3]).text());
        user_info["food"] =($($(row).children('td')[2]).text());
        local_json_list.push(user_info)
    });
    // Use local storage to store the modified information.
    localStorage.removeItem('local_json_list');
    localStorage.setItem('local_json_list', JSON.stringify(local_json_list));
};

var local_data = localStorage.getItem('local_json_list');
if (local_data){
    var upacked_data = JSON.parse(local_data);
    build_table(upacked_data);
}else {
    $.getJSON('table_data.json', function(return_data){
        build_table(return_data);
    });
}

// Clear out the local storage information to get back to the original info
$("#reset_json_list").click(function(e){
    localStorage.removeItem('local_json_list');
    $("#add_to_json_list").removeAttr('disabled');
    $("#table_body").html("");
    $.getJSON('table_data.json', function(return_data){
        build_table(return_data);
    });

});

// Clear out the local storage information to get back to the original info
$("#add_to_json_list").click(function(e){
    var body = $("#table_body");
    var row_id = "row_"+(Number($("#table_body tr:last").attr("id").split("_")[1])+1);
    var html_string =
        "<tr id='"+row_id+"' class='new_row'> " +
//            '<td><input placeholder="Name..." autofocus></td>' +
            '<td><input placeholder="Name..." class="name_field"></td>' +
            "<td><input placeholder='Color...'></td>" +
            "<td><input placeholder='Food...'></td>" +
            "<td><input placeholder='Vehicle...'>" +
                "<span class='glyphicon glyphicon-floppy-saved save_btn'></span>" +
                "<span class='glyphicon glyphicon-remove cancel_edit_btn'></span>" +
            "</td>" +
        "</tr>";
    $(this).attr("disabled","disabled");
    body.append(html_string);

    // set focus onto the name input field
    $('.name_field').focus();
    save_button_click();
    cancel_edit_btn_click();
});

cancel_edit_btn_click = function() {
    $('.cancel_edit_btn').click(function() {
        console.log('cancel edit clicked');
        var current_row = $(this).closest('tr');
        var row_data = JSON.parse(localStorage.getItem('local_tr_list'));
        var row_id = current_row.attr('id');
        var old_row = row_data[row_id];

        current_row.replaceWith(old_row);
        if (current_row.hasClass("new_row")) {
            $("#add_to_json_list").removeAttr('disabled');
        }

        add_row_btns();
    });
};
//-------- Drag and Drop section
var drag_src_el = null;
var swatches = document.querySelectorAll('#color_swatches .swatch');

function handle_drag_start(e) {
    console.log('drag started');

    drag_src_el = this;

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handle_drop(e) {
    // this/e.target is current target element.

    if (e.stopPropagation) {
        e.stopPropagation(); // Stops some browsers from redirecting.
    }

    // Don't do anything if dropping the same column we're dragging.
    if (drag_src_el != this) {
        // Set the source column's HTML to the HTML of the column we dropped on.
        drag_src_el.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData('text/html');
    }
    var match_list = ["swatch1", "swatch2", "swatch3", "swatch4", "swatch5", "swatch6"];
    var show_congrats = true;

    $.each(swatches, function(index, li) {
        var swatch = $(li).children('span').attr('id');

        if (!(swatch == match_list[index])) {
            show_congrats = false;
        }
    });

//    if (show_congrats){
//        console.log('YAY YOU DID IT BITCH!!!')
//
//        console.log($('.swatch').blur(5000));
//
//    }else {
//        console.log('ya dumb fuck get it right')
//    }
    return false;
}

function handle_drag_end(e) {
    // this/e.target is the source node.

    [].forEach.call(swatches, function (swatch) {
        swatch.classList.remove('over');
    });
}

function handle_drag_over(e) {
    if (e.preventDefault) {
        e.preventDefault(); // Necessary. Allows us to drop.
    }

    e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

    return false;
}

function handle_drag_enter(e) {
    // this / e.target is the current hover target.
    this.classList.add('over');
}

function handle_drag_leave(e) {
    this.classList.remove('over');  // this / e.target is previous target element.
}

[].forEach.call(swatches, function(swatch) {
    swatch.addEventListener("dragstart", handle_drag_start, false);
    swatch.addEventListener("dragover", handle_drag_over, false);
    swatch.addEventListener("dragenter", handle_drag_enter, false);
    swatch.addEventListener("dragleave", handle_drag_leave, false);
    swatch.addEventListener("drop", handle_drop, false);;
    swatch.addEventListener("dragend", handle_drag_end, false);;
});
