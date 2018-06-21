var requiredMessage = "Este campo es requerido";
var formatMessage = "Este campo no tiene el formato correcto";
var minMessage = "Debe haber como mínimo";
var maxMessage = "Debe haber como máximo";
var equalMessage = "El valor debe ser igual al campo";

//Validation
var Script = function () {
    $.validator.setDefaults({
        submitHandler: function () { $("#FormEnfermedad").submit(); }
    });
    $().ready(function () {
        // validate signup form on keyup and submit
        $("#FormEnfermedad").validate({
            rules: {
                NombreEnfermedad: {
                    required: true
                },
                EsContagiosa: {
                    required: true
                }
            },
            messages: {
                NombreEnfermedad: {
                    required: requiredMessage,
                },
                EsContagiosa: {
                    required: requiredMessage
                }
            }
        });
    });
}();