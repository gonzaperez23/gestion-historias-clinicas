var clients = [];
var listaPacientes = null;

$(document).ready(function () {
    var fieldsGrid = [
        { name: "dni", width: 50, type: "number", title: "DNI" },
        { name: "nombre", width: 100, type: "text", title: "NOMBRE"},
        { name: "apellido", width: 100, type: "text", title: "APELLIDO" },
        { name: "obrasocial", width: 130, type: "text", title: "OBRA SOCIAL" },
        { name: "ciudad", width: 120, type: "text", title: "CIUDAD" },
        { type: "control", editButton: false, modeSwitchButton: false }
    ]

    createGrid("/pacientes/ajaxGetPacientes", "#jsGrid", "/pacientes/paciente/", "/pacientes/ajaxPostEliminarPaciente/", fieldsGrid, "/pacientes/ajaxGetPacientesFiltrados")
});