function createGridHistoriaClinica(getUrl, divId, detailUrl, fieldsGrid) {
    $.ajax({
        url: getUrl,
        type: 'GET',
        success: function (lista) {
            $(divId).jsGrid({
                width: "100%",
                sorting: true,
                paging: true,
                autoload: true,
                pageSize: 5,
                pageButtonCount: 4,
                pagerFormat: "Páginas: {first} {prev} {pages} {next} {last}    {pageIndex} de {pageCount}",
                pagePrevText: "Anterior",
                pageNextText: "Siguiente",
                pageFirstText: "Primero",
                pageLastText: "Ultimo",
                deleteButtonTooltip: "Eliminar",
                searchButtonTooltip: "Buscar",
                clearFilterButtonTooltip: "Borrar filtros",
                noDataContent: "No se encontraron datos",
                autoload: false,
                data: lista,
                deleteConfirm: "¿Está seguro de eliminar el registro?",
                rowDoubleClick: function (args) {
                    $.blockUI();
                    location.href = detailUrl + args.item.id
                },
                fields: fieldsGrid
            });
        }
    });
}

function createGridHistoriaClinicaPrincipal(getUrl, divId, detailUrl, fieldsGrid) {
    $.ajax({
        url: getUrl,
        type: 'GET',
        success: function (lista) {
            $(divId).jsGrid({
                width: "100%",
                sorting: true,
                paging: true,
                autoload: true,
                pageSize: 10,
                pageButtonCount: 4,
                pagerFormat: "Páginas: {first} {prev} {pages} {next} {last}    {pageIndex} de {pageCount}",
                pagePrevText: "Anterior",
                pageNextText: "Siguiente",
                pageFirstText: "Primero",
                pageLastText: "Ultimo",
                deleteButtonTooltip: "Eliminar",
                searchButtonTooltip: "Buscar",
                clearFilterButtonTooltip: "Borrar filtros",
                noDataContent: "No se encontraron datos",
                autoload: false,
                data: lista,
                deleteConfirm: "¿Está seguro de eliminar el registro?",
                rowDoubleClick: function (args) {
                    $.blockUI();
                    location.href = detailUrl + args.item.dniPaciente
                },
                fields: fieldsGrid
            });
        }
    });
}