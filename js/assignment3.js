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
    var book_list = data.getElementsByTagName('book')
    var tab_list = ''
    $.each(book_list, function(index, book){
        var book_xml = $.parseXML(book[0]);
        var $book = $(book_xml);
        //console.log($book.find('title').text())
        var tab = '<li><a href="#tab'+(index+1)+'">Book '+(index+1)+'</a></li>';
        $('.tabs').append(tab)

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

var x=loadXMLDoc("book_information.xml");
var xml=x.responseXML;
path="/book_list/book/price";

// code for IE
if (window.ActiveXObject || xhttp.responseType=="msxml-document")
{
    xml.setProperty("SelectionLanguage","XPath");
    nodes=xml.selectNodes(path);
    //for (i=0;i<nodes.length;i++)
    //{
    //    document.write(nodes[i].childNodes[0].nodeValue);
    //    document.write("<br>");
    //}
    console.log(nodes)
}

// code for Chrome, Firefox, Opera, etc.
else if (document.implementation && document.implementation.createDocument)
{
    var nodes=xml.evaluate(path, xml, null, XPathResult.ANY_TYPE, null);
    var result=nodes.iterateNext();

    var price = 0.00;
    while (result)
    {
        //document.write(result.childNodes[0].nodeValue);
        //document.write("<br>");
        price += parseFloat(result.childNodes[0].nodeValue)
        result=nodes.iterateNext();
    }

    var total_book_price = price.toFixed(2)

    var list_info = '<ul>' +
        '<li>Total Cost of all books: '+total_book_price+'</li>' +
        '</ul>';

    $('.book_list_info').append(list_info)
}
