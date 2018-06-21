$(document).ready(function () {
    var fieldsGrid = [
        { name: "id", width: 50, type: "number", title: "ID" },
        { name: "NombreCausa", width: 250, type: "text", title: "NOMBRE" },
        { type: "control", editButton: false, modeSwitchButton: false }
    ]

    createGrid("/causas-internacion/ajaxGetCausasInternacion", "#jsGrid", "/causas-internacion/causainternacion/", "/causas-internacion/ajaxPostEliminarCausaInternacion/", fieldsGrid, "/causas-internacion/ajaxGetCausasInternacionFiltradas")
});