function ajaxHelper(uri, method, data) {
    //self.error(''); // Clear error message
    return $.ajax({
        type: method,
        url: uri,
        dataType: 'json',
        contentType: 'application/json',
        data: data ? JSON.stringify(data) : null,
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("AJAX Call[" + uri + "] Fail...");
            hideLoading();
            //self.error(errorThrown);
        }
    });
}

function showLoading() {
    $('#myModal').modal('show', {
        backdrop: 'static',
        keyboard: false
    });
}

function hideLoading() {
    $('#myModal').on('shown.bs.modal', function (e) {
        $("#myModal").modal('hide');
    })
}

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

// Adiciona o html gerado em data à página
function generatePage(data) {
    for (let element of data) {
        $("#pageData").html($("#pageData").html() + generateElement(element))
    }
}

// Retorna o html de um elemento e de todos os seus sub-elementos
function generateElement(element) {
    console.log(element)
    let html_to_write = ""
    
    // Abertura da abertura
    html_to_write += "<" + element.type

    // Id
    if (element.id != undefined) {
        html_to_write += " id=\"" + element.id + "\""
    }

    // Hrefs para elementos "a"
    if (element.type == "a") {
        switch (element.href_type) {
            case 0: // Link para outra página(ou outra página numa parte específica)
                html_to_write += " href=\"page.html?pageId=" + element.href + "\""
            break

            case 1: // Link para parte do código de faina
                html_to_write += " href=\"CodigoFaina.pdf#page=" + element.href.split(",")[0] + "&zoom=" + element.href.split(",")[1] + "\" target=\"_blank\""
            break

            case 2: // Link para parte da página
                html_to_write += " href=\"#" + element.href + "\""
            break
        }
    }
    // Fecho da abertura
    html_to_write += ">"
    
    // Texto
    if (element.text != undefined) {
        html_to_write += element.text
    }

    // Adicionar elementos dentro deste, se existirem
    if (element.insides != undefined) {
        for (let subElement of element.insides) {
            html_to_write += generateElement(subElement)
        }
    }

    // Fecho
    html_to_write += "</" + element.type + ">"

    return html_to_write
}

$(document).ready(function () {
    fetch("pages/"+getUrlParameter("pageId")+".json")
    .then(Response => Response.json())
    .then(data => {
        console.log(data)
        generatePage(data)
    });

    fetch("pages.json")
    .then(Response => Response.json())
    .then(data => {
        console.log(data)
        
        document.title = Object.keys(data).find(key => data[key] === getUrlParameter("pageId")) + ' - Faina Wiki'
    })
})