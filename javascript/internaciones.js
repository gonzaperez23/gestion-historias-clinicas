var requiredMessage = "Este campo es requerido";
var formatMessage = "Este campo no tiene el formato correcto";
var minMessage = "Debe haber como mínimo";
var maxMessage = "Debe haber como máximo";
var equalMessage = "El valor debe ser igual al campo";

$(document).ready(function () {
    $("#tipointernacion").change();
})

$("#tipointernacion").on('change', function () {
    if ($("#tipointernacion").val() != "QUIRURGICA") {
        $("#intervencionRealizada").val("-");
        $("#seccionQuirurgica").hide();
    } else {
        if ($("#intervencionRealizada").val() != "") { }
        else {
            $("#intervencionRealizada").val("");
        }
        $("#seccionQuirurgica").show();
    }
});

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
                causainternacion: {
                    required: true
                },
                tipointernacion: {
                    required: true
                },
                descripcionInternacion: {
                    required: true
                },
                diagnosticoPrincipal: {
                    required: true
                },
                intervencionRealizada: {
                    required: true
                },
                fechaintervencion: {
                    required: true
                },
                nombreCirujano: {
                    required: true
                },
                nombreAnestesista: {
                    required: true
                },
                prescripcionesMedicas: {
                    required: true
                }
            },
            messages: {
                causainternacion: {
                    required: requiredMessage,
                },
                tipointernacion: {
                    required: requiredMessage,
                },
                descripcionInternacion: {
                    required: requiredMessage
                },
                diagnosticoPrincipal: {
                    required: requiredMessage
                },
                intervencionRealizada: {
                    required: requiredMessage
                },
                fechaintervencion: {
                    required: requiredMessage
                },
                nombreCirujano: {
                    required: requiredMessage
                },
                nombreAnestesista: {
                    required: requiredMessage
                },
                prescripcionesMedicas: {
                    required: requiredMessage
                }
            }
        });
    });
}();