let pageIds;

fetch("pages.json")
    .then(Response => Response.json())
    .then(data => {
        pageIds = data
  		// or whatever you wanna do with the data
    });

$("#search").autocomplete({
    minLength: 1,
    source: function (request, response) {
        response(Object.keys(pageIds))
    },
    
    focus: function( event, ui ) {
        $( "#search" ).val(ui.item.value);
        return false;
    },
    select: function( event, ui ) {
        window.location.href = "page.html?pageId=" + pageIds[ui.item.value]
        return false;
    }
    
})

/*
.autocomplete( "instance" )._renderItem = function( ul, item ) {
    return $( "<li>" )
        .append("<div style=''>" + item.Name + " (" + item.Id + ")</div>" )
        .appendTo( ul )
        .css({"background-color": "silver", "z-index": 10000000, "color":"black", "border-radius":"5px", "with":"10"})
};
$("#search").autocomplete("widget").addClass("list-unstyled");
$(".ui-helper-hidden-accessible").hide();
*/