var express = require('express');
var router = express.Router();
var swig = require('swig');


var internacion = require('../models/internacion');
var resultado = require('../models/resultado');
var historiasClinicasServices = require('../services/HistoriaClinicaServices');
var generalServices = require('../services/GeneralServices');
var mid = require('../middlewares/login');

var causasinternacion = undefined;
var tiposinternacion = undefined;

//Inicio métodos Generales
function getGeneralParameters(callback) {
  if (this.causasinternacion == undefined || this.tiposinternacion == undefined) {
    generalServices.ObtenerRegistros('causas-internacion', function (response) {
      if (response.estado == true) {
        this.causasinternacion = response.respuesta;
      }
      generalServices.ObtenerRegistros('tipos-internacion', function (response) {
        if (response.estado == true) {
          this.tiposinternacion = response.respuesta;
        }

        callback();
      });
    });
  }
  else {
    callback();
  }
}
//Fin métodos Generales

//Inicio métodos AJAX
router.get('/ajaxGetInternaciones/:dniPaciente', function (req, res) {
  var filtro = {};
  filtro.dniPaciente = parseInt(req.params.dniPaciente);

  generalServices.ObtenerRegistrosFiltrados('internaciones', filtro, function (response) {
    if (response.estado == true) { res.send(response.respuesta); } else { res.send(null); }
  });
});

//Fin métodos AJAX

//Inicio métodos Router
router.get('/', mid.requiresLogin, function (req, res, next) {
  var result = swig.renderFile('views/historiasclinicas/index.html', {
    userRol: req.session.rol,
    userName: req.session.email,
    pageTitle: 'Listado de historias clínicas',
  });

  res.send(result);
});

router.get('/nueva', mid.requiresLogin, function (req, res, next) {
  var result = swig.renderFile('views/historiasclinicas/nueva.html', {
    userRol: req.session.rol,
    userName: req.session.email,

    pageTitle: 'Nueva historia clínica',
  });

  res.send(result);
});

router.post('/nueva', mid.requiresLogin, function (req, res, next) {
  var histClinica = {
    id: 0,
    dniPaciente: parseInt(req.body.dni),
    codMedico: parseInt(req.session.userId),
    fechaCreacion: new Date().toLocaleDateString(),
    idInternacionActual: 0
  }

  historiasClinicasServices.InsertarRegistro('historias-clinicas', histClinica, function (response) {
    if (response.estado == true) {
      historiasClinicasServices.EliminarPacienteSinHc(histClinica.dniPaciente, function (response) {
        if (response.estado == true) {
          res.redirect('/historias-clinicas/historia-clinica/' + histClinica.dniPaciente);
        } else {
          result = swig.renderFile('views/historiasclinicas/nueva.html', {
            userRol: req.session.rol,
            userName: req.session.email,
            pageTitle: 'Nueva historia clínica',
            resultado: new resultado(false, "No se pudo guardar la historia clínica."),
          });

          res.send(result);
        }
      });
    } else {
      result = swig.renderFile('views/historiasclinicas/nueva.html', {
        userRol: req.session.rol,
        userName: req.session.email,
        pageTitle: 'Nueva historia clínica',
        resultado: new resultado(false, "No se pudo guardar la historia clínica."),
      });

      res.send(result);
    }
  });
});

router.get('/historia-clinica/:dniPaciente', mid.requiresLogin, function (req, res, next) {
  var dniPaciente = parseInt(req.params.dniPaciente);

  historiasClinicasServices.BuscarHistoriaClinica(dniPaciente, function (response) {
    var result = swig.renderFile('views/historiasclinicas/historiaclinica.html', {
      userRol: req.session.rol,
      userName: req.session.email,
      historiaClinica: response.respuesta,
      resultado: null,
      pageTitle: 'Historias clínicas',
    });

    res.send(result);
  });
});

router.get('/historia-clinica/detalle-internacion/:id', mid.requiresLogin, function (req, res, next) {
  var idInternacion = parseInt(req.params.id);
  swig.invalidateCache();

  historiasClinicasServices.BuscarDetalleInternacionCompleta(idInternacion, function (response) {
    var internacion = response.respuesta;

    var result = swig.renderFile('views/historiasclinicas/detalleinternacion.html', {
      userRol: req.session.rol,
      userName: req.session.email,
      model: internacion,
      pageTitle: 'Internación',
    });

    res.send(result);
  });
});

router.get('/historia-clinica/internacion/:dniPaciente', function (req, res, next) {
  //router.get('/historia-clinica/:dniPaciente', mid.requiresLogin, function (req, res, next) {
  var dniPaciente = parseInt(req.params.dniPaciente);
  swig.invalidateCache();

  getGeneralParameters(function () {
    historiasClinicasServices.BuscarHistoriaClinica(dniPaciente, function (response) {
      var histClinica = response.respuesta;
      var model = histClinica.internacionActual;

      var result = swig.renderFile('views/historiasclinicas/internacion.html', {
        userRol: req.session.rol,
        userName: req.session.email,
        causasinternacion: this.causasinternacion,
        resultado: null,
        model: model,
        historiaClinica: histClinica,
        pageTitle: 'Internación',
      });

      res.send(result);
    });
  });
});

router.get('/alta-internacion/:id/:dni', mid.requiresLogin, function (req, res, next) {
  var id = parseInt(req.params.id);
  var dniPaciente = parseInt(req.params.dni);
  historiasClinicasServices.AltaInternacion(id, function (response) {
    if (response.estado == true) {
      res.redirect("/historias-clinicas/historia-clinica/" + dniPaciente);
    } else {
      res.redirect("/historias-clinicas/historia-clinica/internacion/" + dniPaciente);
    }
  });
});

router.post('/historia-clinica/internacion/', mid.requiresLogin, function (req, res, next) {
  var modelInternacion = new internacion(req.body.id, req.body.dniPaciente, req.body.idHistoriaClinica, req.body.causainternacion, req.body.tipointernacion,
    req.body.descripcionInternacion, req.body.diagnosticoPrincipal, req.body.diagnosticoSecundario, req.body.intervencionRealizada,
    req.body.diasEstimativos, req.body.fechaIntervencion, req.body.nombreCirujano, req.body.nombreAyudante1, req.body.nombreAyudante2, req.body.nombreAnestesista,
    req.body.nombreHemoterapia, req.body.nombrePediatra, req.body.protocoloQuirurgico, req.body.prescripcionesMedicas)

  historiasClinicasServices.GuardarInternacion(modelInternacion, function (response) {
    if (response.estado == false) {
      getGeneralParameters(function () {
        historiasClinicasServices.BuscarHistoriaClinica(modelInternacion.dniPaciente, function (response) {
          var histClinica = response.respuesta;
          swig.invalidateCache();

          var result = swig.renderFile('views/historiasclinicas/internacion.html', {
            userRol: req.session.rol,
            userName: req.session.email,
            causasinternacion: this.causasinternacion,
            model: modelInternacion,
            resultado: new resultado(false, "No se pudo guardar la internación"),
            historiaClinica: histClinica,
            pageTitle: 'Internación',
          });

          res.send(result);
        });
      });
    } else {
      res.redirect("/historias-clinicas/historia-clinica/" + modelInternacion.dniPaciente);
    }
  });
});
//Fin métodos Router

module.exports = router;