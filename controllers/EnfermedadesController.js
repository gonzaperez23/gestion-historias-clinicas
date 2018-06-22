var express = require('express');
var router = express.Router();
var swig = require('swig');

var enfermedad = require('../models/enfermedad');
var resultado = require('../models/resultado');
var generalServices = require('../services/GeneralServices');
var mid = require('../middlewares/login');

//Inicio métodos Generales
function obtenerFiltros(body) {
  var filtro = {};

  if (body["filtros[id]"] != undefined) {
    filtro.id = parseInt(body["filtros[id]"]);
  }

  if (body["filtros[NombreEnfermedad]"] != undefined && body["filtros[NombreEnfermedad]"] != "") {
    filtro.NombreEnfermedad = {'$regex': body["filtros[NombreEnfermedad]"].toUpperCase()};
  }

  return filtro;
}

function objetoActualizacion(propiedades) {
  var objectToResponse = {};
  objectToResponse.id = propiedades.id;
  objectToResponse.NombreEnfermedad = propiedades.NombreEnfermedad;
  objectToResponse.EsContagiosa = propiedades.EsContagiosa;
  objectToResponse.Observaciones = propiedades.Observaciones;

  return objectToResponse;
}

function obtenerObjetoActual(newValues, callback) {
  var filtro = {};
  filtro.id = parseInt(newValues.id);

  generalServices.ObtenerRegistrosFiltrados('enfermedades', filtro, function (response) {
    if (response.estado == true) {
      var oldValue = response.respuesta[0];
      oldValue.NombreCausa = newValues.NombreCausa;
      oldValue.EsContagiosa = newValues.EsContagiosa;
      oldValue.Observaciones = newValues.Observaciones;

      callback(objetoActualizacion(oldValue));

    } else {
      callback(null);
    }
  });
}
//Fin métodos Generales

//Inicio métodos AJAX
router.get('/ajaxGetEnfermedades/', function (req, res) {
  generalServices.ObtenerRegistros('enfermedades', function (response) {
    if (response.estado == true) { res.send(response.respuesta); } else { res.send(null); }
  });
});


router.post('/ajaxGetEnfermedadesFiltradas/', function (req, res) {
  var filtros = obtenerFiltros(req.body);

  generalServices.ObtenerRegistrosFiltrados('enfermedades', filtros, function (response) {
    if (response.estado == true) { res.send(response.respuesta); } else { res.send(null); }
  });
});

router.post('/ajaxPostEliminarEnfermedad', function (req, res) {
  var idEnfermedad = req.body.id;

  generalServices.EliminarRegistro('enfermedades', parseInt(idEnfermedad), function (response) {
    res.send(response.estado);
  });
});
//Fin métodos AJAX

//Inicio métodos Router
router.get('/', mid.requiresLogin, function (req, res, next) {
  var result = swig.renderFile('views/enfermedades/index.html', {
    pageTitle: 'Listado de enfermedades',
    userRol: req.session.rol, userName: req.session.email
  });

  res.send(result);
});

router.get('/enfermedad/:id?', mid.requiresLogin, function (req, res, next) {
  var model = null;
  var result = null;
  swig.invalidateCache();
  
  if (req.params.id != null && req.params.id != undefined) {
    var filtro = {};
    filtro.id = parseInt(req.params.id);
    generalServices.ObtenerRegistrosFiltrados('enfermedades', filtro, function (response) {
      if (response.estado == true) {
        var value = response.respuesta[0];
        model = new enfermedad(value.id, value.NombreEnfermedad, value.EsContagiosa, value.Observaciones);
      } 

      var result = swig.renderFile('views/enfermedades/enfermedad.html', {
        model: model,
        pageTitle: 'Editar enfermedad',
        userRol: req.session.rol, userName: req.session.email
      });

      res.send(result);
    });
  } else {
    var result = swig.renderFile('views/enfermedades/enfermedad.html', {
      model: model,
      pageTitle: 'Nueva enfermedad',
      userRol: req.session.rol, userName: req.session.email
    });
  
    res.send(result);
  }
});

router.post('/enfermedad', mid.requiresLogin, function (req, res, next) {
  var model = new enfermedad(req.body.id, req.body.NombreEnfermedad, req.body.EsContagiosa, req.body.Observaciones);

  if (req.body.id === "") {
    generalServices.InsertarRegistro('enfermedades', model, function (response) {
      var insertEstado = response.estado;
      var insertRespuesta = response.respuesta;

      result = swig.renderFile('views/enfermedades/enfermedad.html', {
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
        generalServices.ActualizarRegistro('enfermedades', response, model.id, function (response) {
          var insertEstado = response.estado;
          var insertRespuesta = response.respuesta;

          result = swig.renderFile('views/enfermedades/enfermedad.html', {
            model: model,
            resultado: new resultado(insertEstado, insertRespuesta),
            userRol: req.session.rol, userName: req.session.email
          });

          res.send(result);
        });
      }
      else {
        result = swig.renderFile('views/enfermedades/enfermedad.html', {
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