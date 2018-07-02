var express = require('express');
var swig = require('swig');
var bcrypt = require('bcrypt-nodejs');

var paciente = require('../models/paciente');
var resultado = require('../models/resultado');
var generalServices = require('../services/GeneralServices');
var mid = require('../middlewares/login');

var router = express.Router();

var grupossanguineos = undefined;
var obrassociales = undefined;
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

  if (body["obrasocial"] != undefined && body["filtros[obrasocial]"] != "") {
    filtro.email = { '$regex': new RegExp(body["filtros[obrasocial]"], "i") };
  }

  if (body["ciudad"] != undefined && body["filtros[ciudad]"] != "") {
    filtro.rol = { '$regex': new RegExp(body["filtros[ciudad]"], "i") };
  }

  return filtro;
}

function getGeneralParameters(callback) {
  if (this.grupossanguineos == undefined && this.obrassociales == undefined && this.provincias == undefined && this.ciudades == undefined) {
    generalServices.ObtenerRegistros('localidades', function (response) {
      if (response.estado == true) {
        obtenerProvincias(response.respuesta); obtenerCiudades(response.respuesta);
      }
      generalServices.ObtenerRegistros('grupossanguineos', function (response) {
        if (response.estado == true) { this.grupossanguineos = response.respuesta; }
        generalServices.ObtenerRegistros('obrassociales', function (response) {
          if (response.estado == true) { this.obrassociales = response.respuesta; }

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

  objectToResponse.id = propiedades.id;
  objectToResponse.dni = propiedades.dni;
  objectToResponse.nombre = propiedades.nombre;
  objectToResponse.apellido = propiedades.apellido;
  objectToResponse.email = propiedades.email;
  objectToResponse.gruposanguineo = propiedades.gruposanguineo;
  objectToResponse.resumenmedico = propiedades.resumenmedico;
  objectToResponse.fechanacimiento = propiedades.fechanacimiento;
  objectToResponse.obrasocial = propiedades.obrasocial;
  objectToResponse.planobrasocial = propiedades.planobrasocial;
  objectToResponse.nroafiliado = propiedades.nroafiliado;
  objectToResponse.provincia = propiedades.provincia;
  objectToResponse.ciudad = propiedades.ciudad;
  objectToResponse.domicilio = propiedades.domicilio;
  objectToResponse.sexo = propiedades.sexo;

  return objectToResponse;
}

function obtenerObjetoActual(newValues, callback) {
  var filtro = {};
  filtro.id = parseInt(newValues.id);

  generalServices.ObtenerRegistrosFiltrados('pacientes', filtro, function (response) {
    if (response.estado == true) {
      var oldValue = response.respuesta[0];
      oldValue.dni = newValues.dni;
      oldValue.nombre = newValues.nombre;
      oldValue.apellido = newValues.apellido;
      oldValue.email = newValues.email;
      oldValue.gruposanguineo = newValues.gruposanguineo;
      oldValue.resumenmedico = newValues.resumenmedico;
      oldValue.fechanacimiento = newValues.fechanacimiento;
      oldValue.obrasocial = newValues.obrasocial;
      oldValue.planobrasocial = newValues.planobrasocial;
      oldValue.nroafiliado = newValues.nroafiliado;
      oldValue.provincia = newValues.provincia;
      oldValue.ciudad = newValues.ciudad;
      oldValue.domicilio = newValues.domicilio;
      oldValue.sexo = newValues.sexo;

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
  return objeto;
}
//Fin métodos Generales

//Inicio métodos AJAX
router.get('/ajaxGetLocalidades/:provincia', function(req, res) {
  var resultado = [];
  var parametro = req.params.provincia.toUpperCase();
  resultado.push("Seleccione un valor...");

  this.ciudades.forEach(function (value) {
    if (value.provincia.toUpperCase() == parametro)
    {
      resultado.push(value.Nombre)
    }
  });

  res.send(resultado);
});

router.post('/ajaxGetPacientesFiltrados/', function (req, res) {
  var filtros = obtenerFiltros(req.body);

  generalServices.ObtenerRegistrosFiltrados('pacientes', filtros, function (response) {
    if (response.estado == true) { res.send(response.respuesta); } else { res.send(null); }
  });
});

router.get('/ajaxGetPacientes', function (req, res) {
  generalServices.ObtenerRegistros('pacientes', function (response) {
    if (response.estado == true) { res.send(response.respuesta); } else { res.send(null); }
  });
});

router.post('/ajaxPostEliminarPaciente', function (req, res) {
  var idPaciente = req.body.id;

  generalServices.EliminarRegistro('pacientes', parseInt(idPaciente), function (response) {
    res.send(response.estado);
  });
});
//Fin métodos AJAX

//Inicio métodos Router
router.get('/', mid.requiresLogin, function (req, res, next) {
  var result = swig.renderFile('views/Pacientes/index.html', {
    pageTitle: 'Listado de pacientes',
    userRol: req.session.rol, userName: req.session.email
  });

  res.send(result);
});

router.get('/paciente/:id?', mid.requiresLogin, function (req, res, next) {
  var model = null;
  var result = null;
  swig.invalidateCache();

  getGeneralParameters(function () {
    if (req.params.id != null && req.params.id != undefined) {
      //obtener paciente por método
      var filtro = {};
      filtro.id = parseInt(req.params.id);
      generalServices.ObtenerRegistrosFiltrados('pacientes', filtro, function (response) {
        if (response.estado == true) {
          var value = response.respuesta[0];
          model = new paciente(value.id, value.dni, value.nombre, value.apellido, value.email, 
            value.gruposanguineo, value.resumenmedico, value.fechanacimiento, value.obrasocial, 
            value.planobrasocial, value.nroafiliado, value.provincia, value.ciudad, value.domicilio, 
            value.sexo);
        }

        result = swig.renderFile('views/Pacientes/paciente.html', {
          pageTitle: 'Editar pacientes',
          model: model,
          resultado: null,
          grupossanguineos: this.grupossanguineos,
          obrassociales: this.obrassociales,
          provincias: this.provincias,
          userRol: req.session.rol, userName: req.session.email
        });

        res.send(result);
      });
    }
    else {
      result = swig.renderFile('views/Pacientes/paciente.html', {
        pageTitle: 'Nuevo pacientes',
        model: model,
        resultado: null,
        grupossanguineos: this.grupossanguineos,
        obrassociales: this.obrassociales,
        provincias: this.provincias,
        userRol: req.session.rol, userName: req.session.email
      });

      res.send(result);
    }
  });
});

router.post('/paciente', mid.requiresLogin, function (req, res, next) {
  var model = new paciente(req.body.id, parseInt(req.body.dni), req.body.nombre, req.body.apellido, req.body.email, 
    req.body.gruposanguineo, req.body.resumenmedico, req.body.fechanacimiento, req.body.obrasocial, 
    req.body.planobrasocial, parseInt(req.body.nroafiliado), req.body.provincia, req.body.ciudad, req.body.domicilio, 
    req.body.sexo);

  getGeneralParameters(function () {
    if (req.body.id === "") {
      model = completarDatos(model);

      generalServices.InsertarRegistro('pacientes', model, function (response) {
        var insertRespuesta = response.respuesta;

        generalServices.InsertarPacienteSinHc(model, function (response) { 
          var result = swig.renderFile('views/Pacientes/paciente.html', {
            model: model,
            pageTitle: 'Nuevo paciente',
            resultado: new resultado(true, insertRespuesta),
            obrassociales: this.obrassociales,
            grupossanguineos: this.grupossanguineos,
            provincias: this.provincias,
            userRol: req.session.rol, userName: req.session.email
          });
  
          res.send(result);
        });
      });
    } else {
      obtenerObjetoActual(model, function (response) {
        if (response != null) {
          generalServices.ActualizarRegistro('pacientes', response, model.id, function (response) {
            var insertRespuesta = response.respuesta;

            var result = swig.renderFile('views/Pacientes/paciente.html', {
              model: model,
              pageTitle: 'Nuevo paciente',
              resultado: new resultado(true, insertRespuesta),
              grupossanguineos: this.grupossanguineos,
              obrassociales: this.obrassociales,
              provincias: this.provincias,
              userRol: req.session.rol, userName: req.session.email
            });

            res.send(result);
          });
        }
        else {
          var result = swig.renderFile('views/Pacientes/paciente.html', {
            model: model,
            pageTitle: 'Nuevo paciente',
            resultado: new resultado(true, "No se pudo actualizar el registro"),
            grupossanguineos: this.grupossanguineos,
            obrassociales: this.obrassociales,
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