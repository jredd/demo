/**
 * Created by jredd on 11/9/14.
 */
//Default Action

make_tabs_work = function(){
    $(".tab_content").hide(); //Hide all content
    $("ul.tabs li:first").addClass("active").show(); //Activate first tab
    $(".tab_content:first").show(); //Show first tab content

    //On Click Event
    $("ul.tabs li").click(function() {
        $("ul.tabs li").removeClass("active"); //Remove any "active" class
        $(this).addClass("active"); //Add "active" class to selected tab
        $(".tab_content").hide(); //Hide all tab content
        var activeTab = $(this).find("a").attr("href"); //Find the rel attribute value to identify the active tab + content
        $(activeTab).fadeIn(); //Fade in the active content
        return false;
    })
};

var file_data = $.get('book_information.xml', function(data){
    var book_list = data.getElementsByTagName('book');
    $.each(book_list, function(index, book){
        var tab = '<li><a href="#tab'+(index+1)+'">Book '+(index+1)+'</a></li>';
        $('.tabs').append(tab);

        // setup book content
        var title = $(book.getElementsByTagName('title')[0]).text();
        var author_first = $(book.getElementsByTagName('first')[0]).text();
        var author_last = $(book.getElementsByTagName('last')[0]).text();
        var date_of_birth = $(book.getElementsByTagName('date_of_birth')[0]).text();
        var education_level = $(book.getElementsByTagName('education_level')[0]).text();
        var published_count = $(book.getElementsByTagName('published_count')[0]).text();
        var auth_street = $(book.getElementsByTagName('author')[0].getElementsByTagName('street')).text();
        var auth_city = $(book.getElementsByTagName('author')[0].getElementsByTagName('city')).text();
        var auth_zip = $(book.getElementsByTagName('author')[0].getElementsByTagName('zip')).text();
        var auth_country = $(book.getElementsByTagName('author')[0].getElementsByTagName('country')).text();
        var ISBN = $(book.getElementsByTagName('ISBN')[0]).text();
        var price = $(book.getElementsByTagName('price')[0]).text();
        var publication_date = $(book.getElementsByTagName('publication_date')[0]).text();
        var publisher = $(book.getElementsByTagName('publisher')[0]).text();
        var pub_street = $(book.getElementsByTagName('publisher_information')[0].getElementsByTagName('street')).text();
        var pub_city = $(book.getElementsByTagName('publisher_information')[0].getElementsByTagName('city')).text();
        var pub_zip = $(book.getElementsByTagName('publisher_information')[0].getElementsByTagName('zip')).text();
        var pub_country = $(book.getElementsByTagName('publisher_information')[0].getElementsByTagName('country')).text();
        //var author_first = $(book.getElementsByTagName('author')[0].getElementsByTagName('first')).text();
            var book_content = '<div id="tab'+(index+1)+'"" class="tab_content"><h2>'+title+'</h2>' +
                '<ul class="book_info">' +
                    '<li>Author: '+author_first+' '+author_last+'</li>' +
                    '<li>Price: '+price+'$</li>' +
                    '<li>ISBN: '+ISBN+'</li>' +
                    '<li>Publication Date: '+publication_date+'</li>' +
                    '<li>Publisher: '+publisher+'</li>' +
                    //'<li>'+''+'</li>' +
                '</ul>';
            book_content += '<h3>Author Information</h3><ul class="author_info">' +
                                '<li>Author: '+author_first+' '+author_last+'</li>' +
                                '<li>Date of Birth: '+date_of_birth+'$</li>' +
                                '<li>Education: '+education_level+'</li>' +
                                '<li>Published Works: '+published_count+'</li>' +
                                '<li>Publisher: '+publisher+'</li>' +
                            '</ul><h5>Author Contact Information</h5>'+
                            '<ul>' +
                                '<li>Street: '+auth_street+'</li>'+
                                '<li>City: '+auth_city+'</li>'+
                                '<li>Zip: '+auth_zip+'</li>'+
                                '<li>Country: '+auth_country+'</li>'+
                            '</ul>';

            book_content += '<h3>Publisher Information</h3><ul class="author_info">' +
                                '<li>Published Works: '+published_count+'</li>' +
                            '</ul><h5>Publisher Contact Information</h5>'+
                            '<ul>' +
                                '<li>Street: '+pub_street+'</li>'+
                                '<li>City: '+pub_city+'</li>'+
                                '<li>Zip: '+pub_zip+'</li>'+
                                '<li>Country: '+pub_country+'</li>'+
                            '</ul>';
        $('.tab_container').append(book_content)

    });
    make_tabs_work();
});

function loadXMLDoc(dname)
{
    if (window.XMLHttpRequest)
    {
        xhttp=new XMLHttpRequest();
    }
    else
    {
        xhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.open("GET",dname,false);
    try {xhttp.responseType="msxml-document"} catch(err) {} // Helping IE
    xhttp.send("");
    return xhttp;
}
var list_info = '<ul>';
var x=loadXMLDoc("book_information.xml");
var xml=x.responseXML;
var price_path="/book_list/book/price";
var author_price_total_path = "/book_list/book/author/author_name | " +
    "/book_list/book/price";
var price_less_path="/book_list/book[price<50]/title | " +
    "/book_list/book[price<50]/publisher_information/publisher |" +
    "/book_list/book[price<50]/author/author_name";
var eduaction_path = "/book_list/book/author[education_level='MS']/author_name | " +
    "/book_list/book/author[education_level='MS']/../title";
var publish_after_path = "/book_list/book[number(translate(publication_date,'-','')) < 20011231]/title | " +
    "/book_list/book[number(translate(publication_date,'-','')) < 20011231]/author/author_name |" +
    "/book_list/book[number(translate(publication_date,'-','')) < 20011231]/publisher_information/publisher";

var get_price_info = function(path){
    if (document.implementation && document.implementation.createDocument)
    {
        var nodes=xml.evaluate(path, xml, null, XPathResult.ANY_TYPE, null);
        var result=nodes.iterateNext();

        var price = 0.00;
        while (result)
        {
            price += parseFloat(result.childNodes[0].nodeValue);
            result=nodes.iterateNext();
        }

        list_info += '<li>Total Cost of all books: ' + price.toFixed(2) +'</li>'
    }
};

var get_author_total_price_info = function(path) {
    if (document.implementation && document.implementation.createDocument) {
        var nodes = xml.evaluate(path, xml, null, XPathResult.ANY_TYPE, null);
        var result = nodes.iterateNext();

        //var book_list = [];
        var price_list = [];
        var author_list = [];

        var author_price_list = {}

        var books_list = "<li>Total cost of authors books:<ul>";

        while (result) {
            var tag_name = result.tagName;
            var node = result.childNodes[0].nodeValue;
            if (tag_name == 'price') {
                //console.log(node)
                //console.log(node);
                price_list.push(parseFloat(node))
            } else if (tag_name == 'author_name') {
                var first = result.childNodes[1].childNodes[0].nodeValue;
                var last = result.childNodes[3].childNodes[0].nodeValue;
                author_list.push(first + ' ' + last);
            }

            result = nodes.iterateNext();
        }
        $.each(author_list, function (index, author) {
            if (author_price_list[author] != undefined) {
                author_price_list[author] += price_list[index];
            }else{
                author_price_list[author] = price_list[index];
            }
            //books_list += '<li>' + book + ', ' + author_list[index] + ', ' + publisher_list[index] + '</li>'
        });

        $.each(author_price_list, function (author, cost) {
            console.log(author)
            books_list += '<li>' + author + ': ' + cost + '$</li>'
        });

        console.log(author_price_list, 'turtles')
        books_list += '</ul></li>';
        list_info += books_list;
    }
};

var get_price_less_than_info = function(path) {
    if (document.implementation && document.implementation.createDocument) {
        var nodes = xml.evaluate(path, xml, null, XPathResult.ANY_TYPE, null);
        var result = nodes.iterateNext();

        var book_list = [];
        var publisher_list = [];
        var author_list = [];

        var books_list = "<li>Books Less than 50$:<ul>";

        while (result) {
            var tag_name = result.tagName;
            var node = result.childNodes[0].nodeValue;
            if (tag_name == 'title') {
                //console.log(node)
                //console.log(node);
                book_list.push(node)
            } else if (tag_name == 'publisher') {
                //console.log(node)
                publisher_list.push(node)
            } else if (tag_name == 'author_name') {
                var first = result.childNodes[1].childNodes[0].nodeValue;
                var last = result.childNodes[3].childNodes[0].nodeValue;
                author_list.push(first + ' ' + last);
            }

            result = nodes.iterateNext();
        }
        $.each(book_list, function (index, book) {
            books_list += '<li>' + book + ', ' + author_list[index] + ', ' + publisher_list[index] + '</li>'
        });
        books_list += '</ul></li>';
        list_info += books_list;
    }
};

var get_education_level_info = function(path) {
    if (document.implementation && document.implementation.createDocument) {
        var nodes = xml.evaluate(path, xml, null, XPathResult.ANY_TYPE, null);
        var result = nodes.iterateNext();

        var book_list = [];
        var author_list = [];

        var books_list = "<li>Authors with an MS or PHD:<ul>"


        while (result) {
            var tag_name = result.tagName;
            var node = result.childNodes[0].nodeValue;
            if (tag_name == 'title') {
                book_list.push(node)
            } else if (tag_name == 'author_name') {
                var first = result.childNodes[1].childNodes[0].nodeValue;
                var last = result.childNodes[3].childNodes[0].nodeValue;
                author_list.push(first + ' ' + last);
            }

            result = nodes.iterateNext();
        }
        $.each(book_list, function (index, book) {
            books_list += '<li>' + book + ', ' + author_list[index] + '</li>'
        });

        books_list += '</ul></li>';

        list_info += books_list;
    }
};

var get_published_after_info = function(path) {
    if (document.implementation && document.implementation.createDocument) {
        var nodes = xml.evaluate(path, xml, null, XPathResult.ANY_TYPE, null);
        var result = nodes.iterateNext();

        var book_list = [];
        var publisher_list = [];
        var author_list = [];

        var books_list = "<li>Books Published after 2001: <ul>";

        while (result) {
            var tag_name = result.tagName;
            var node = result.childNodes[0].nodeValue;
            if (tag_name == 'title') {
                //console.log(node)
                //console.log(node);
                book_list.push(node)
            } else if (tag_name == 'publisher') {
                //console.log(node)
                publisher_list.push(node)
            } else if (tag_name == 'author_name') {
                var first = result.childNodes[1].childNodes[0].nodeValue;
                var last = result.childNodes[3].childNodes[0].nodeValue;
                author_list.push(first + ' ' + last);
            }

            result = nodes.iterateNext();
        }
        $.each(book_list, function (index, book) {
            books_list += '<li>' + book + ', ' + author_list[index] + ', ' + publisher_list[index] + '</li>'
        });
        books_list += '</ul></li>';
        list_info += books_list;
    }
};

get_price_info(price_path);
get_author_total_price_info(author_price_total_path);
get_education_level_info(eduaction_path);
get_price_less_than_info(price_less_path);
get_published_after_info(publish_after_path);

list_info += '</ul>';

$('.book_list_info').append(list_info)