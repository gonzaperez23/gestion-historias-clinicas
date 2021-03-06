var requiredMessage = "Este campo es requerido";
var formatMessage = "Este campo no tiene el formato correcto";
var minMessage = "Debe haber como mínimo";
var maxMessage = "Debe haber como máximo";
var equalMessage = "El valor debe ser igual al campo";

$("#provincia").on('change', function () {
    if ($("#provincia").val() != "") {
        $.ajax({
            url: "/pacientes/ajaxGetLocalidades/" + $("#provincia").val(),
            type: 'GET',
            dataType: 'json',
            success: function (lista) {
                var select = document.getElementById("ciudad");
                vaciarCombo(select);

                lista.forEach(element => {
                    var option = document.createElement("option");
                    option.id = element;
                    option.text = element;

                    select.add(option);
                });
            }
        });

        $("#ciudad").removeAttr("disabled")
    } else {
        var select = document.getElementById("ciudad");
        vaciarCombo(select);

        var option = document.createElement("option");
        option.id = "";
        option.text = "Seleccione un valor...";

        select.add(option);

        $("#ciudad").attr("disabled", "disabled")
    }
});

function vaciarCombo(combo) {
    var i;
    for (i = combo.options.length - 1; i >= 0; i--) {
        combo.remove(i);
    }
}

function actualizarValorCiudad(valor) {
    $("#provincia").change();
    $.blockUI();
    setTimeout(function(){
        var options = document.getElementById("ciudad").options;
        for (var i = 0, optionsLength = options.length; i < optionsLength; i++) {
            if (options[i].id == valor) {
                document.getElementById("ciudad").selectedIndex = i;
            }
        }

        $.unblockUI();
    }, 3000);
}

//Validation
var Script = function () {
    $.validator.setDefaults({
        submitHandler: function () {
            $.blockUI();
            $("#FormPaciente").submit();
            $.unblockUI();
        }
    });

    $().ready(function () {
        // validate signup form on keyup and submit
        $("#FormPaciente").validate({
            rules: {
                dni: {
                    required: true,
                    minlength: 8
                },
                nombre: {
                    required: true
                },
                apellido: {
                    required: true
                },
                email: {
                    required: true,
                    email: true
                },
                gruposanguineo: {
                    required: true
                },
                fechanacimiento: {
                    required: true
                },
                provincia: {
                    required: true
                },
                ciudad: {
                    required: true
                },
                domicilio: {
                    required: true
                },
                sexo: {
                    required: true
                }
            },
            messages: {
                dni: {
                    required: requiredMessage,
                    minlength: minMessage + "8 caracteres"
                },
                nombre: {
                    required: requiredMessage
                },
                apellido: {
                    required: requiredMessage
                },
                email: {
                    required: requiredMessage,
                    email: formatMessage
                },
                gruposanguineo: {
                    required: requiredMessage
                },
                fechanacimiento: {
                    required: requiredMessage
                },
                provincia: {
                    required: requiredMessage
                },
                ciudad: {
                    required: requiredMessage
                },
                domicilio: {
                    required: requiredMessage
                },
                sexo: {
                    required: requiredMessage
                }                
            }
        });
    });
}();