var clients = [];
var listaUsuarios = null;

$(document).ready(function () {
    var fieldsGrid = [
        { name: "dni", width: 50, type: "number", title: "DNI" },
        { name: "nombre", width: 100, type: "text", title: "NOMBRE"},
        { name: "apellido", width: 70, type: "text", title: "APELLIDO" },
        { name: "email", width: 150, type: "text", title: "EMAIL" },
        { name: "rol", width: 90, type: "text", title: "ROL" },
        { name: "especialidad", width: 90, type: "text", title: "ESPECIALIDAD" },
        { type: "control", editButton: false, modeSwitchButton: false }
    ]

    createGrid("/usuarios/ajaxGetUsuarios", "#jsGrid", "/usuarios/usuario/", "/usuarios/ajaxPostEliminarUsuario/", fieldsGrid, "/usuarios/ajaxGetUsuariosFiltrados")
});