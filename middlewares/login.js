var swig = require('swig');
var generalServices = require('../services/GeneralServices');

var roles = undefined;

function getGeneralParameters(callback) {
    if (this.roles == undefined) {
        generalServices.ObtenerRegistros('roles', function (response) {
            if (response.estado == true) {
                this.roles = response.respuesta;
            }

            callback();
        });
    }
    else {
        callback();
    }
}

function controlPermisosUsuario(rolUsuario, url) {
    var result = false;

    this.roles.forEach(value => {
        if (value.Nombre == rolUsuario) {
            var urlBase = "";
            var arrayUrl = url.split("/");
            if (arrayUrl.length > 2) {
                for (var i = 1; i < arrayUrl.length - 1; i++) {
                    urlBase += "/" + arrayUrl[i];
                }
            }
            else {
                urlBase = url;
            }

            value.Permisos.forEach(permiso => {
                if (url == "/") {
                    result = true;
                } else {
                    if (permiso == urlBase) {
                        result = true;
                    }
                }
            });
        }
    });

    return result;
}

exports.requiresLogin = function requiresLogin(req, res, next) {
    if (req.session && req.session.userId) {
        getGeneralParameters(function () {
            if (controlPermisosUsuario(req.session.rol, req.originalUrl)) {
                return next();
            } else {
                var result = swig.renderFile('views/errorlogin/permission.html', {
                    mensajeError: "No tiene los permisos necesarios para acceder a esta sección",
                    userRol: req.session.rol,
                    userName: req.session.email
                });

                res.send(result);
            }
        });
    } else {
        var result = swig.renderFile('views/errorlogin/index.html', {
            mensajeError: "Necesita iniciar sesión para ver esta sección"
        });

        res.send(result);
    }
}