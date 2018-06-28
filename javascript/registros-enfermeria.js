var requiredMessage = "Este campo es requerido";
var formatMessage = "Este campo no tiene el formato correcto";
var minMessage = "Debe haber como mínimo";
var maxMessage = "Debe haber como máximo";
var equalMessage = "El valor debe ser igual al campo";

//Validation
var Script = function () {
    $.validator.setDefaults({
        submitHandler: function () {
            $.blockUI();
            $(".form-control:disabled").removeAttr('disabled');
            $("#FormInternaciones").submit();
            $.unblockUI();
        }
    });
    $().ready(function () {
        // validate signup form on keyup and submit
        $("#FormInternaciones").validate({
            rules: {
                medicamento: {
                    required: true
                },
                dosis: {
                    required: true
                },
                fecharegistro: {
                    required: true
                },
                horaregistro: {
                    required: true
                }
            },
            messages: {
                medicamento: {
                    required: requiredMessage,
                },
                dosis: {
                    required: requiredMessage,
                },
                fecharegistro: {
                    required: requiredMessage
                },
                horaregistro: {
                    required: requiredMessage
                }
            }
        });
    });
}();