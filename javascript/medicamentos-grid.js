$(document).ready(function () {
    var fieldsGrid = [
        { name: "id", width: 50, type: "number", title: "ID" },
        { name: "NombreMedicamento", width: 250, type: "text", title: "NOMBRE" },
        { name: "NombreTipoMedicamento", width: 250, type: "text", title: "TIPO MEDICAMENTO" },
        { type: "control", editButton: false, modeSwitchButton: false }
    ]

    createGrid("/medicamentos/ajaxGetMedicamentos", "#jsGrid", "/medicamentos/medicamento/", "/medicamentos/ajaxPostEliminarMedicamento/", fieldsGrid, "/medicamentos/ajaxGetMedicamentosFiltrados")
});