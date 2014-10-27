/**
 * Created by jredd on 10/26/14.
 */


simpleCart({

    //cartColumns: [
    //    { view: "remove", text: "Remove", label: false}
    //],

    //cartColumns: [
    //    { attr: "item_name", label: "Name"},
    //    { view: "currency", attr: "price", label: "Price"},
    //    { view: "decrement", label: false},
    //    { attr: "quantity", label: "Qty"},
    //    { view: "increment", label: false},
    //    { view: "currency", attr: "total", label: "SubTotal" },
    //    { view: "remove", text: "Remove", label: false}
    //],

    //cartStyle: "div",

    checkout: {
        type: "PayPal",
        email: "jredd@gmail.com"
    }
});

//$('.clear_cart').click(function(e) {
//    e.preventDefault();
//    simpleCart.empty();
//});

//----Build TABLE DATA---
$.getJSON('skill_pricing.json', function(return_data){
    // loop throught the data and prepare the html strings
    var count = 1;
    var html_string = '<div class="row margin-top"><div class="col-lg-10"> ';
    $.each(return_data, function(index, data){
        //html_string += '<li>'+data.item_name+'</li>'

        html_string += '<div class="simpleCart_shelfItem col-lg-3"><div class="cart_item">';
        html_string += '<img src="'+data.icon_url+'" align="middle" height="150" width="150" alt="item icon">';
        html_string += '<h3 class="item_name">'+data.item_name+'</h3>';
        //html_string += '<p><input type="text" value="1" class="item_Quantity"><br>';
        html_string += '<span class="item_price">Hourly Rate '+data.price+' </span>';
        html_string +='<select class="item_Quantity"><option value="1">1</option><option value="2">2</option><option value="3">3</option>';
        html_string += '<option value="4">4</option><option value="5">5</option><option value="6">6</option></select><br>';
        html_string += '<a class="item_add btn btn-xs btn-success center-block" href="javascript:;">Add to Cart</a></p></div></div>';

        if (count == 4) {
            html_string += '</div></div>';
            html_string += '<div class="row margin-top"><div class="col-lg-10"> ';
            count = 0;
        }
        count += 1;


    });

    html_string += '</div></div>';
    //console.log(html_string);

    $('.cart').append(html_string);


});