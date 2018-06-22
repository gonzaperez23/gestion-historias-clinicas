var express = require('express');
var swig = require('swig');
var bcrypt = require('bcrypt-nodejs');

var usuario = require('../models/usuario');
var resultado = require('../models/resultado');
var generalServices = require('../services/GeneralServices');
var mid = require('../middlewares/login');

var router = express.Router();

var roles = undefined;
var especialidades = undefined;
var provincias = undefined;
var ciudades = undefined;

//Inicio métodos Generales
function obtenerFiltros(body) {
  var filtro = {};

  if (body["filtros[dni]"] != undefined) {
    filtro.dni = parseInt(body["filtros[dni]"]);
  }

  if (body["filtros[nombre]"] != undefined && body["filtros[nombre]"] != "") {
    filtro.nombre = { '$regex': new RegExp(body["filtros[nombre]"], "i") };
  }

  if (body["apellido"] != undefined && body["filtros[apellido]"] != "") {
    filtro.apellido = { '$regex': new RegExp(body["filtros[apellido]"], "i") };
  }

  if (body["email"] != undefined && body["filtros[email]"] != "") {
    filtro.email = { '$regex': new RegExp(body["filtros[email]"], "i") };
  }

  if (body["rol"] != undefined && body["filtros[rol]"] != "") {
    filtro.rol = { '$regex': new RegExp(body["filtros[rol]"], "i") };
  }

  if (body["matricula"] != undefined && body["filtros[matricula]"] != "") {
    filtro.matricula = { '$regex': new RegExp(body["filtros[matricula]"], "i") };
  }

  if (body["especialidad"] != undefined && body["filtros[especialidad]"] != "") {
    filtro.especialidad = { '$regex': new RegExp(body["filtros[especialidad]"], "i") };
  }

  return filtro;
}

function getGeneralParameters(callback) {
  if (this.roles == undefined || this.especialidades == undefined || this.provincias == undefined || this.ciudades == undefined) {
    generalServices.ObtenerRegistros('localidades', function (response) {
      if (response.estado == true) {
        obtenerProvincias(response.respuesta); obtenerCiudades(response.respuesta);
      }
      generalServices.ObtenerRegistros('roles', function (response) {
        if (response.estado == true) { this.roles = response.respuesta; }
        generalServices.ObtenerRegistros('especialidades', function (response) {
          if (response.estado == true) { this.especialidades = response.respuesta; }

          callback();
        });
      });
    });
  }
  else {
    callback();
  }
}

function objetoActualizacion(propiedades) {
  var objectToResponse = {};
  objectToResponse.id = parseInt(propiedades.id);
  objectToResponse.dni = propiedades.dni;
  objectToResponse.nombre = propiedades.nombre;
  objectToResponse.apellido = propiedades.apellido;
  objectToResponse.email = propiedades.email;
  objectToResponse.clave = propiedades.clave;
  objectToResponse.rolId = propiedades.rolId;
  objectToResponse.rol = propiedades.rol;
  objectToResponse.matricula = propiedades.matricula;
  objectToResponse.especialidadId = propiedades.especialidadId;
  objectToResponse.especialidad = propiedades.especialidad;
  objectToResponse.provincia = propiedades.provincia;
  objectToResponse.ciudad = propiedades.ciudad;

  return objectToResponse;
}

function obtenerObjetoActual(newValues, callback) {
  var filtro = {};
  filtro.id = parseInt(newValues.id);

  generalServices.ObtenerRegistrosFiltrados('usuarios', filtro, function (response) {
    if (response.estado == true) {
      var oldValue = response.respuesta[0];
      oldValue.dni = newValues.dni;
      oldValue.nombre = newValues.nombre;
      oldValue.apellido = newValues.apellido;
      oldValue.email = newValues.email;
      oldValue.clave = newValues.clave;
      oldValue.rolId = parseInt(newValues.rolId);
      oldValue.matricula = newValues.matricula;
      oldValue.especialidadId = parseInt(newValues.especialidadId);
      oldValue.provincia = newValues.provincia;
      oldValue.ciudad = newValues.ciudad;

      this.roles.forEach(value => {
        if (value.Id == oldValue.rolId) {
          oldValue.rol = value.Nombre
        }
      });

      this.especialidades.forEach(value => {
        if (value.Id == oldValue.especialidadId) {
          oldValue.especialidad = value.Nombre
        }
      });

      callback(objetoActualizacion(oldValue));

    } else {
      callback(null);
    }
  });
}

function obtenerProvincias(localidades) {
  this.provincias = [];
  localidades.forEach(function (value) {
    this.provincias.push({ Id: value.provincia, Nombre: value.provincia });
  });
}

function obtenerCiudades(localidades) {
  this.ciudades = [];
  localidades.forEach(function (value) {
    value.localidad.forEach(function (valueCiudad) {
      this.ciudades.push({ Id: valueCiudad, Nombre: valueCiudad, provincia: value.provincia });
    });
  });
}

function completarDatos(objeto) {
  this.roles.forEach(value => {
    if (value.Id == objeto.rolId) {
      objeto.rol = value.Nombre
    }
  });

  this.especialidades.forEach(value => {
    if (value.Id == objeto.especialidadId) {
      objeto.especialidad = value.Nombre
    }
  });

  return objeto;
}
//Fin métodos Generales

//Inicio métodos AJAX
router.get('/ajaxGetLocalidades/:provincia', function (req, res) {
  var resultado = [];
  var parametro = req.params.provincia.toUpperCase();
  resultado.push("Seleccione un valor...");

  this.ciudades.forEach(function (value) {
    if (value.provincia.toUpperCase() == parametro) {
      resultado.push(value.Nombre)
    }
  });

  res.send(resultado);
});

router.post('/ajaxGetUsuariosFiltrados/', function (req, res) {
  var filtros = obtenerFiltros(req.body);

  generalServices.ObtenerRegistrosFiltrados('usuarios', filtros, function (response) {
    if (response.estado == true) { res.send(response.respuesta); } else { res.send(null); }
  });
});

router.get('/ajaxGetUsuarios', function (req, res) {
  generalServices.ObtenerRegistros('usuarios', function (response) {
    if (response.estado == true) { res.send(response.respuesta); } else { res.send(null); }
  });
});

router.post('/ajaxPostEliminarUsuario', function (req, res) {
  var idUsuario = req.body.id;

  generalServices.EliminarRegistro('usuarios', parseInt(idUsuario), function (response) {
    res.send(response.estado);
  });
});
//Fin métodos AJAX

//Inicio métodos Router
router.get('/', mid.requiresLogin, function (req, res, next) {
  var result = swig.renderFile('views/usuarios/index.html', {
    pageTitle: 'Listado de usuarios',
    userRol: req.session.rol, userName: req.session.email
  });

  res.send(result);
});

router.get('/misdatos', mid.requiresLogin, function (req, res, next) {
  var model = null;
  var result = null;
  swig.invalidateCache();

  getGeneralParameters(function () {
    var filtro = {};
    filtro.id = parseInt(req.session.userId);
    generalServices.ObtenerRegistrosFiltrados('usuarios', filtro, function (response) {
      if (response.estado == true) {
        var value = response.respuesta[0];
        model = new usuario(value.id, value.dni, value.nombre, value.apellido, value.email, "",
          value.rolId, value.rol, value.matricula, value.especialidadId, value.especialidad, value.provincia, value.ciudad);
      }

      result = swig.renderFile('views/usuarios/misdatos.html', {
        pageTitle: 'Editar usuarios',
        model: model,
        resultado: null,
        roles: this.roles,
        especialidades: this.especialidades,
        provincias: this.provincias,
        userRol: req.session.rol, userName: req.session.email
      });

      res.send(result);
    });
  });
});

router.post('/misdatos', mid.requiresLogin, function (req, res, next) {
  var hash = bcrypt.hashSync(req.body.clave);
  var model = new usuario(req.body.id, parseInt(req.body.dni), req.body.nombre, req.body.apellido, req.body.email,
    hash, parseInt(req.body.rolId), "", req.body.matricula, parseInt(req.body.especialidadId), "", req.body.provincia, req.body.ciudad);

  getGeneralParameters(function () {
    req.session.destroy(function () {
      obtenerObjetoActual(model, function (response) {
        if (response != null) {
          generalServices.ActualizarRegistro('usuarios', response, model.id, function (response) {
            
            res.redirect("/login/login");
          });
        }
        else {
          var result = swig.renderFile('views/usuarios/misdatos.html', {
            model: model,
            pageTitle: 'Nuevo usuario',
            resultado: new resultado(true, "No se pudo actualizar el registro"),
            roles: this.roles,
            especialidades: this.especialidades,
            provincias: this.provincias,
            userRol: req.session.rol, userName: req.session.email
          });

          res.send(result);
        }
      });
    });
  });
});

router.get('/usuario/:id?', mid.requiresLogin, function (req, res, next) {
  var model = null;
  var result = null;
  swig.invalidateCache();

  getGeneralParameters(function () {
    if (req.params.id != null && req.params.id != undefined) {
      //obtener usuario por método
      var filtro = {};
      filtro.id = parseInt(req.params.id);
      generalServices.ObtenerRegistrosFiltrados('usuarios', filtro, function (response) {
        if (response.estado == true) {
          var value = response.respuesta[0];
          model = new usuario(value.id, value.dni, value.nombre, value.apellido, value.email, "",
            value.rolId, value.rol, value.matricula, value.especialidadId, value.especialidad, value.provincia, value.ciudad);
        }

        result = swig.renderFile('views/usuarios/usuario.html', {
          pageTitle: 'Editar usuarios',
          model: model,
          resultado: null,
          roles: this.roles,
          especialidades: this.especialidades,
          provincias: this.provincias,
          userRol: req.session.rol, userName: req.session.email
        });

        res.send(result);
      });
    }
    else {
      result = swig.renderFile('views/usuarios/usuario.html', {
        pageTitle: 'Nuevo usuarios',
        model: model,
        resultado: null,
        roles: this.roles,
        especialidades: this.especialidades,
        provincias: this.provincias,
        userRol: req.session.rol, userName: req.session.email
      });

      res.send(result);
    }
  });
});

router.post('/usuario', mid.requiresLogin, function (req, res, next) {
  var hash = bcrypt.hashSync(req.body.clave);
  var model = new usuario(req.body.id, parseInt(req.body.dni), req.body.nombre, req.body.apellido, req.body.email,
    hash, parseInt(req.body.rolId), "", req.body.matricula, parseInt(req.body.especialidadId), "", req.body.provincia, req.body.ciudad);

  getGeneralParameters(function () {
    if (req.body.id === "") {
      model = completarDatos(model);

      generalServices.InsertarRegistro('usuarios', model, function (response) {
        var insertRespuesta = response.respuesta;
        var result = swig.renderFile('views/usuarios/usuario.html', {
          model: model,
          pageTitle: 'Nuevo usuario',
          resultado: new resultado(true, insertRespuesta),
          roles: this.roles,
          especialidades: this.especialidades,
          provincias: this.provincias,
          userRol: req.session.rol, userName: req.session.email
        });

        res.send(result);
      });
    } else {
      obtenerObjetoActual(model, function (response) {
        if (response != null) {
          generalServices.ActualizarRegistro('usuarios', response, model.id, function (response) {
            var insertRespuesta = response.respuesta;

            var result = swig.renderFile('views/usuarios/usuario.html', {
              model: model,
              pageTitle: 'Nuevo usuario',
              resultado: new resultado(true, insertRespuesta),
              roles: this.roles,
              especialidades: this.especialidades,
              provincias: this.provincias,
              userRol: req.session.rol, userName: req.session.email
            });

            res.send(result);
          });
        }
        else {
          var result = swig.renderFile('views/usuarios/usuario.html', {
            model: model,
            pageTitle: 'Nuevo usuario',
            resultado: new resultado(true, "No se pudo actualizar el registro"),
            roles: this.roles,
            especialidades: this.especialidades,
            provincias: this.provincias,
            userRol: req.session.rol, userName: req.session.email
          });

          res.send(result);
        }
      });
    }
  });
});
//Fin métodos Router

module.exports = router;