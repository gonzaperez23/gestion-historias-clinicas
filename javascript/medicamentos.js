var requiredMessage = "Este campo es requerido";
var formatMessage = "Este campo no tiene el formato correcto";
var minMessage = "Debe haber como mínimo";
var maxMessage = "Debe haber como máximo";
var equalMessage = "El valor debe ser igual al campo";

//Validation
var Script = function () {
    $.validator.setDefaults({
        submitHandler: function () { $("#FormMedicamento").submit(); }
    });
    $().ready(function () {
        // validate signup form on keyup and submit
        $("#FormMedicamento").validate({
            rules: {
                NombreMedicamento: {
                    required: true
                },
                IdTipoMedicamento: {
                    required: true
                },
                Concentracion: {
                    required: true
                }
            },
            messages: {
                IdTipoMedicamento: {
                    required: requiredMessage,
                },
                NombreMedicamento: {
                    required: requiredMessage,
                },
                Concentracion: {
                    required: requiredMessage
                }
            }
        });
    });
}();