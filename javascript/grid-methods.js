function createGrid(getUrl, divId, editUrl, deleteUrl, fieldsGrid, filterUrl) {
    $.ajax({
        url: getUrl,
        type: 'GET',
        success: function (lista) {
            $(divId).jsGrid({
                height: "90%",
                width: "100%",
                filtering: true,
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
                controller: {
                    loadData: function (request) {
                        $.ajax({
                            url: filterUrl,
                            data: { 'filtros': request },
                            type: 'POST',
                            dataType: 'json',
                            success: function (lista) {
                                $("#jsGrid").data().JSGrid.data = lista;
                                $("#jsGrid .jsgrid-header-row .jsgrid-header-cell")[0].click();
                            }
                        });
                    }
                },
                rowDoubleClick: function (args) {
                    $.blockUI();
                    location.href = editUrl + args.item.id
                },
                onItemDeleting: function (args) {
                    $.blockUI();
                    deleteElement(deleteUrl, args.item);
                },
                fields: fieldsGrid
            });
        }
    });
}

function deleteElement(deleteUrl, item) {
    $.ajax({
        url: deleteUrl,
        type: 'POST',
        dataType: 'json',
        data: { "id": item.id },
        success: function (response) {
            $.unblockUI();
            return response;
        }
    });
}