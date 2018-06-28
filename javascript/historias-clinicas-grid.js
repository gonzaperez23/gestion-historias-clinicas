$(document).ready(function () {
    var fieldsInternacionGrid = [
        { name: "id", width: 100, type: "number", title: "ID HIST. CLIN." },
        { name: "dniPaciente", width: 100, type: "number", title: "DNI PACIENTE" },
        { name: "paciente.nombre", width: 150, type: "text", title: "NOMBRE PACIENTE" },
        { name: "paciente.apellido", width: 150, type: "text", title: "APELLIDO PACIENTE" },
        { name: "fechaCreacion", width: 150, type: "text", title: "FECHA APERTURA" }
    ]

    createGridHistoriaClinicaPrincipal("/historias-clinicas/ajaxGetHistoriasClinicas/", 
    "#jsGrid", "/historias-clinicas/historia-clinica/", fieldsInternacionGrid)
});