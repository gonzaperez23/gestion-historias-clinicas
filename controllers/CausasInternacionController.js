var express = require('express');
var router = express.Router();
var swig = require('swig');

var causaInternacion = require('../models/causaInternacion');
var resultado = require('../models/resultado');
var generalServices = require('../services/GeneralServices');
var mid = require('../middlewares/login');

//Inicio métodos Generales
function obtenerFiltros(body) {
  var filtro = {};

  if (body["filtros[id]"] != undefined) {
    filtro.id = parseInt(body["filtros[id]"]);
  }

  if (body["filtros[NombreCausa]"] != undefined && body["filtros[NombreCausa]"] != "") {
    filtro.NombreCausa = { '$regex': new RegExp(body["filtros[NombreCausa]"], "i") };
  }

  return filtro;
}

function objetoActualizacion(propiedades) {
  var objectToResponse = {};
  objectToResponse.id = propiedades.id;
  objectToResponse.NombreCausa = propiedades.NombreCausa;
  objectToResponse.Observaciones = propiedades.Observaciones;

  return objectToResponse;
}

function obtenerObjetoActual(newValues, callback) {
  var filtro = {};
  filtro.id = parseInt(newValues.id);

  generalServices.ObtenerRegistrosFiltrados('causas-internacion', filtro, function (response) {
    if (response.estado == true) {
      var oldValue = response.respuesta[0];
      oldValue.NombreCausa = newValues.NombreCausa;
      oldValue.Observaciones = newValues.Observaciones;

      callback(objetoActualizacion(oldValue));

    } else {
      callback(null);
    }
  });
}
//Fin métodos AJAX

//Inicio métodos AJAX
router.get('/ajaxGetCausasInternacion/', function (req, res) {
  generalServices.ObtenerRegistros('causas-internacion', function (response) {
    if (response.estado == true) { res.send(response.respuesta); } else { res.send(null); }
  });
});


router.post('/ajaxGetCausasInternacionFiltradas/', function (req, res) {
  var filtros = obtenerFiltros(req.body);

  generalServices.ObtenerRegistrosFiltrados('causas-internacion', filtros, function (response) {
    if (response.estado == true) { res.send(response.respuesta); } else { res.send(null); }
  });
});

router.post('/ajaxPostEliminarCausaInternacion', function (req, res) {
  var idEnfermedad = req.body.id;

  generalServices.EliminarRegistro('causas-internacion', parseInt(idEnfermedad), function (response) {
    res.send(response.estado);
  });
});
//Fin métodos AJAX

//Inicio métodos Router
router.get('/', mid.requiresLogin, function (req, res, next) {
  var result = swig.renderFile('views/CausasInternacion/index.html', {
    pageTitle: 'Listado de causas de internacion',
    userRol: req.session.rol, userName: req.session.email
  });

  res.send(result);
});

router.get('/causainternacion/:id?', mid.requiresLogin, function (req, res, next) {
  var model = null;
  var result = null;
  swig.invalidateCache();

  if (req.params.id != null && req.params.id != undefined) {
    var filtro = {};
    filtro.id = parseInt(req.params.id);
    generalServices.ObtenerRegistrosFiltrados('causas-internacion', filtro, function (response) {
      if (response.estado == true) {
        var value = response.respuesta[0];
        model = new causaInternacion(value.id, value.NombreCausa, value.Observaciones);
      } 
      var result = swig.renderFile('views/CausasInternacion/causainternacion.html', {
        model: model,
        pageTitle: 'Editar causa de internacion',
        userRol: req.session.rol, userName: req.session.email
      });

      res.send(result);
    });
  } else {
    var result = swig.renderFile('views/CausasInternacion/causainternacion.html', {
      model: model,
      pageTitle: 'Nueva causa de internacion',
    });

    res.send(result);
  }
});

router.post('/causainternacion', mid.requiresLogin, function (req, res, next) {
  var model = new causaInternacion(req.body.id, req.body.NombreCausa, req.body.Observaciones);

  if (req.body.id === "") {
    generalServices.InsertarRegistro('causas-internacion', model, function (response) {
      var insertEstado = response.estado;
      var insertRespuesta = response.respuesta;

      swig.invalidateCache();
      result = swig.renderFile('views/causasinternacion/causainternacion.html', {
        pageTitle: "Nueva causa de internación",
        model: model,
        resultado: new resultado(insertEstado, insertRespuesta),
        userRol: req.session.rol, userName: req.session.email
      });

      res.send(result);
    });
  }
  else {
    obtenerObjetoActual(req.body, function (response) {
      if (response != null) {
        generalServices.ActualizarRegistro('causas-internacion', response, model.id, function (response) {
          var insertEstado = response.estado;
          var insertRespuesta = response.respuesta;

          result = swig.renderFile('views/causasinternacion/causainternacion.html', {
            pageTitle: "Editar causa de internación",
            model: model,
            resultado: new resultado(insertEstado, insertRespuesta),
            userRol: req.session.rol, userName: req.session.email
          });

          res.send(result);
        });
      }
      else {
        result = swig.renderFile('views/causasinternacion/causainternacion.html', {
          model: model,
          resultado: new resultado(false, "No se pudo encontrar el registro a actualizar."),
          userRol: req.session.rol, userName: req.session.email
        });

        res.send(result);
      }
    });
  }
});
//Fin métodos Router

module.exports = router;