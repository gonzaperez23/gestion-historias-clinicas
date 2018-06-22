var express = require('express');
var router = express.Router();
var swig = require('swig');

var medicamento = require('../models/medicamento');
var resultado = require('../models/resultado');
var generalServices = require('../services/GeneralServices');
var mid = require('../middlewares/login');

var tiposMedicamentos = null;

//Inicio métodos Generales
function obtenerFiltros(body) {
  var filtro = {};

  if (body["filtros[id]"] != undefined) {
    filtro.id = parseInt(body["filtros[id]"]);
  }

  if (body["filtros[NombreMedicamento]"] != undefined && body["filtros[NombreMedicamento]"] != "") {
    filtro.NombreMedicamento = { '$regex': body["filtros[NombreMedicamento]"].toUpperCase() };
  }

  if (body["filtros[NombreTipoMedicamento]"] != undefined && body["filtros[NombreTipoMedicamento]"] != "") {
    filtro.NombreTipoMedicamento = { '$regex': body["filtros[NombreTipoMedicamento]"].toUpperCase() };
  }

  return filtro;
}

function getGeneralParameters(callback) {
  generalServices.ObtenerRegistros('tipos-medicamentos', function (response) {
    if (response.estado == true) { this.tiposMedicamentos = response.respuesta; }
    callback();
  });
}

function objetoActualizacion(propiedades) {
  var objectToResponse = {};
  objectToResponse.id = propiedades.id;
  objectToResponse.NombreMedicamento = propiedades.NombreMedicamento;
  objectToResponse.Concentracion = propiedades.Concentracion;
  objectToResponse.IdTipoMedicamento = propiedades.IdTipoMedicamento;
  objectToResponse.NombreTipoMedicamento = propiedades.NombreTipoMedicamento;
  objectToResponse.Observaciones = propiedades.Observaciones;

  return objectToResponse;
}

function obtenerObjetoActual(newValues, callback) {
  var filtro = {};
  filtro.id = parseInt(newValues.id);

  generalServices.ObtenerRegistrosFiltrados('medicamentos', filtro, function (response) {
    if (response.estado == true) {
      var oldValue = response.respuesta[0];
      oldValue.NombreMedicamento = newValues.NombreMedicamento;
      oldValue.Concentracion = newValues.Concentracion;
      oldValue.IdTipoMedicamento = parseInt(newValues.IdTipoMedicamento);
      oldValue.NombreTipoMedicamento = newValues.NombreTipoMedicamento;
      oldValue.Observaciones = newValues.Observaciones;
      
      filtro.id = oldValue.IdTipoMedicamento
      generalServices.ObtenerRegistrosFiltrados('tipos-medicamentos', filtro, function (response) {
        if (response.estado == true) { 
          oldValue.NombreTipoMedicamento = response.respuesta[0].NombreTipoMedicamento;
          callback(objetoActualizacion(oldValue));
        } else { 
          callback(null);
        }
      });
    } else {
      callback(null);
    }
  });
}
//Fin métodos AJAX

//Inicio métodos AJAX
router.get('/ajaxGetMedicamentos/', function (req, res) {
  generalServices.ObtenerRegistros('medicamentos', function (response) {
    if (response.estado == true) { res.send(response.respuesta); } else { res.send(null); }
  });
});


router.post('/ajaxGetMedicamentosFiltrados/', function (req, res) {
  var filtros = obtenerFiltros(req.body);

  generalServices.ObtenerRegistrosFiltrados('medicamentos', filtros, function (response) {
    if (response.estado == true) { res.send(response.respuesta); } else { res.send(null); }
  });
});

router.post('/ajaxPostEliminarMedicamento', function (req, res) {
  var idMedicamento = req.body.id;

  generalServices.EliminarRegistro('medicamentos', parseInt(idMedicamento), function (response) {
    res.send(response.estado);
  });
});
//Fin métodos AJAX

//Inicio métodos Router
router.get('/', mid.requiresLogin, function (req, res, next) {
  var result = swig.renderFile('views/medicamentos/index.html', {
    userRol: req.session.rol, userName: req.session.email,
    pageTitle: 'Listado de medicamentos',
  });

  res.send(result);
});

router.get('/medicamento/:id?', mid.requiresLogin, function (req, res, next) {
  var model = null;
  var result = null;
  swig.invalidateCache();
  
  getGeneralParameters(function (response) {
    if (req.params.id != null && req.params.id != undefined) {
      //obtener usuario por método
      var filtro = {};
      filtro.id = parseInt(req.params.id);
      generalServices.ObtenerRegistrosFiltrados('medicamentos', filtro, function (response) {
        if (response.estado == true) {
          var value = response.respuesta[0];
          model = new medicamento(value.id, value.NombreMedicamento, value.Concentracion, value.IdTipoMedicamento, value.NombreTipoMedicamento, value.Observaciones);
        }

        result = swig.renderFile('views/medicamentos/medicamento.html', {
          pageTitle: 'Nuevo medicamento',
          model: model,
          resultado: null,
          tiposMedicamentos: this.tiposMedicamentos,
          userRol: req.session.rol, userName: req.session.email
        });

        res.send(result);
      });
    }
    else {
      result = swig.renderFile('views/medicamentos/medicamento.html', {
        pageTitle: 'Nuevo medicamento',
        model: model,
        resultado: null,
        tiposMedicamentos: this.tiposMedicamentos,
        userRol: req.session.rol, userName: req.session.email
      });

      res.send(result);
    }
  });
});

router.post('/medicamento', mid.requiresLogin, function (req, res, next) {
  model = new medicamento(req.body.id, req.body.NombreMedicamento, req.body.Concentracion, parseInt(req.body.IdTipoMedicamento), req.body.NombreTipoMedicamento, req.body.Observaciones);

  var filtroTipoMedicamento = {};
  filtroTipoMedicamento.id = model.IdTipoMedicamento;
  getGeneralParameters(function (response) {
    generalServices.ObtenerRegistrosFiltrados('tipos-medicamentos', filtroTipoMedicamento, function (response) {
      if (response.estado == true) {
        model.NombreTipoMedicamento = response.respuesta[0].NombreTipoMedicamento
        if (req.body.id === "") {
          generalServices.InsertarRegistro('medicamentos', model, function (response) {
            var insertEstado = response.estado;
            var insertRespuesta = response.respuesta;

            result = swig.renderFile('views/medicamentos/medicamento.html', {
              pageTitle: 'Nuevo medicamento',
              model: model,
              resultado: new resultado(insertEstado, insertRespuesta),
              tiposMedicamentos: this.tiposMedicamentos,
              userRol: req.session.rol, userName: req.session.email
            });

            res.send(result);
          });
        }
        else {
          obtenerObjetoActual(req.body, function (response) {
            if (response != null) {
              generalServices.ActualizarRegistro('medicamentos', response, model.id, function (response) {
                var insertEstado = response.estado;
                var insertRespuesta = response.respuesta;

                result = swig.renderFile('views/medicamentos/medicamento.html', {
                  pageTitle: 'Editar medicamento',
                  model: model,
                  resultado: new resultado(insertEstado, insertRespuesta),
                  tiposMedicamentos: this.tiposMedicamentos,
                  userRol: req.session.rol, userName: req.session.email
                });

                res.send(result);
              });
            }
            else {
              result = swig.renderFile('views/medicamentos/medicamento.html', {
                pageTitle: 'Editar medicamento',
                model: model,
                resultado: new resultado(false, "No se pudo encontrar el registro a actualizar."),
                tiposMedicamentos: this.tiposMedicamentos,
                userRol: req.session.rol, userName: req.session.email
              });

              res.send(result);
            }
          });
        }
      } else {
        result = swig.renderFile('views/medicamentos/medicamento.html', {
          pageTitle: 'Nuevo medicamento',
          model: model,
          resultado: new resultado(false, "No se pudo encontrar el tipo de medicamento seleccionado."),
          tiposMedicamentos: this.tiposMedicamentos,
          userRol: req.session.rol, userName: req.session.email
        });
      }
    });
  });
});
//Fin métodos Router

module.exports = router;