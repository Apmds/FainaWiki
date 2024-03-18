let page_data;

$('#pageCode').bind('input propertychange', function() {
    try {
        page_data = JSON.parse($("#pageCode").val())
    	generatePage(page_data, false)
    } catch (error) {
        console.log("Json mal formatado para gerar página...")
    }
});

$("#format-btn").click(function () {
    try {
        $('#pageCode').val(JSON.stringify(JSON.parse($("#pageCode").val()), "null", 4))
    } catch (error) {
        console.log("Json mal formatado para formatar...")
    }
})

$("#p-btn").click(function () {addTextToCode("{\"type\":\"p\",\"text\":\"\"}")})

$("#insides-btn").click(function () {addTextToCode("\"insides\": [{\"type\":\"\",\"text\":\"\"},{\"type\":\"\",\"text\":\"\"},{\"type\":\"\",\"text\":\"\"}]")})

$("#save-btn").click(function () {
    download($("#pageCode").val(), $("#name-input").val()+".json")
})

$("#page-file-input").change(function (e) {
    let filename = $("#page-file-input").val().split("\\")
    $("#name-input").val(filename[filename.length - 1].substring(0, filename[filename.length - 1].lastIndexOf('.')))

    var file = e.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var contents = e.target.result;
                $("#pageCode").val(contents)
                try {
                    generatePage(JSON.parse(contents), false)                    
                } catch (error) {
                    console.log("Json mal formatado para gerar página...")
                }
            };
            reader.readAsText(file); // This reads the file as text, you can also use readAsDataURL or readAsBinaryString
        }
})

document.getElementById('pageCode').addEventListener('keydown', function(e) {
    if (e.key == 'Tab') {
      e.preventDefault();
      var start = this.selectionStart;
      var end = this.selectionEnd;
  
      // set textarea value to: text before caret + 4 spaces + text after caret
      this.value = this.value.substring(0, start) +
        "    " + this.value.substring(end);
  
      // put caret at right position again
      this.selectionStart =
        this.selectionEnd = start + 4;
    }

    if (e.key == "{") {
        var start = this.selectionStart;
        var end = this.selectionEnd;

        this.value = this.value.substring(0, start) +
        "}" + this.value.substring(end);

        this.selectionStart = this.selectionEnd = start;
    }

    if (e.key == "[") {
        var start = this.selectionStart;
        var end = this.selectionEnd;

        this.value = this.value.substring(0, start) +
        "]" + this.value.substring(end);

        this.selectionStart = this.selectionEnd = start;
    }
  });

function addTextToCode(txt_to_add) {
    let start = $("#pageCode").prop("selectionStart");
    let end = $("#pageCode").prop("selectionEnd");

    $("#pageCode").val($("#pageCode").val().substring(0, start) + txt_to_add + $("#pageCode").val().substring(end))

    // put caret at right position again
    $("#pageCode").prop("selectionStart", start + txt_to_add.length - 2)
    $("#pageCode").prop("selectionEnd", start + txt_to_add.length - 2)

    $("#pageCode").focus()
}

// Adiciona o html gerado em data à página
function generatePage(data, add=true) {
    if (!add) {
        $("#pageRepresentation").html("")
    }
    for (let element of data) {
        $("#pageRepresentation").html($("#pageRepresentation").html() + generateElement(element))
    }
}

function download(content, fileName="page.json", contentType="application/json") {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href)
    a.remove()
}

// Retorna o html de um elemento e de todos os seus sub-elementos
function generateElement(element) {
    //console.log(element)
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
    if (localStorage.getItem("page") == undefined) {
        localStorage.setItem("page", "{}")
    }

    page_data = JSON.parse(localStorage.getItem("page"))
})