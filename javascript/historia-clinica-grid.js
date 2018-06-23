$(document).ready(function () {
    var fieldsInternacionGrid = [
        { name: "id", width: 70, type: "number", title: "ID" },
        { name: "FechaInternacion", width: 350, type: "text", title: "FECHA INTERNACION" },
        { name: "MotivoInternacion", width: 350, type: "text", title: "MOTIVO INTERNACION" }
    ]

    createGridHistoriaClinica("/historias-clinicas/ajaxGetInternaciones/" + $("#dniPaciente").val(), 
    "#jsGrid", "/historias-clinicas/detalle-internacion/", fieldsInternacionGrid)
});