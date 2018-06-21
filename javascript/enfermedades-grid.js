$(document).ready(function () {
    var fieldsGrid = [
        { name: "id", width: 50, type: "number", title: "ID" },
        { name: "NombreEnfermedad", width: 250, type: "text", title: "NOMBRE" },
        { type: "control", editButton: false, modeSwitchButton: false }
    ]

    createGrid("/enfermedades/ajaxGetEnfermedades", "#jsGrid", "/enfermedades/enfermedad/", "/enfermedades/ajaxPostEliminarEnfermedad/", fieldsGrid, "/enfermedades/ajaxGetEnfermedadesFiltradas")
});