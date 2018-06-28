$(document).ready(function () {
    var fieldsInternacionGrid = [
        { name: "id", width: 70, type: "number", title: "ID" },
        { name: "medicamento", width: 250, type: "text", title: "MEDICAMENTO APLICADO" },
        { name: "dosis", width: 150, type: "text", title: "DOSIS" },
        { name: "fecharegistro", width: 150, type: "text", title: "FECHA APLICACIÓN" },
        { name: "horaregistro", width: 150, type: "text", title: "HORA APLICACIÓN" },
        { name: "eliminado", width: 150, type: "text", title: "¿ELIMINADO?" },
    ]

    createGridHistoriaClinica("/historias-clinicas/ajaxGetRegistrosEnfermeria/" + $("#id").val(), 
    "#jsGrid", "/historias-clinicas/internacion/registro-enfermeria/0/0/", fieldsInternacionGrid)
});