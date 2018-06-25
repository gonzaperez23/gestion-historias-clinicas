$(document).ready(function () {
    var fieldsInternacionGrid = [
        { name: "id", width: 70, type: "number", title: "ID" },
        { name: "fechaInternacion", width: 250, type: "text", title: "FECHA INTERNACION" },
        { name: "causainternacion", width: 250, type: "text", title: "MOTIVO INTERNACION" },
        { name: "fechaAltaInternacion", width: 250, type: "text", title: "FECHA ALTA INTERNACION" }
    ]

    createGridHistoriaClinica("/historias-clinicas/ajaxGetInternaciones/" + $("#dniPaciente").val(), 
    "#jsGrid", "/historias-clinicas/historia-clinica/detalle-internacion/", fieldsInternacionGrid)
});