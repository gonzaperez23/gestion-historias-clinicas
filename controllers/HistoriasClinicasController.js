var express = require('express');
var router = express.Router();
var swig = require('swig');

var historiaClinica = require('../models/historiaClinica');
var resultado = require('../models/resultado');
var historiasClinicasServices = require('../services/HistoriaClinicaServices');
var mid = require('../middlewares/login');

var tiposMedicamentos = null;

//Inicio métodos Generales
//Fin métodos Generales

//Inicio métodos AJAX
router.get('/ajaxGetInternaciones/:dniPaciente', function (req, res) {
  var tempArray = [];
  tempArray.push({ id: 1, FechaInternacion: '12/03/2018', MotivoInternacion: "Prueba 1"});
  tempArray.push({ id: 2, FechaInternacion: '13/03/2018', MotivoInternacion: "Prueba 2"});
  tempArray.push({ id: 3, FechaInternacion: '14/03/2018', MotivoInternacion: "Prueba 3"});
  tempArray.push({ id: 4, FechaInternacion: '15/03/2018', MotivoInternacion: "Prueba 4"});
  tempArray.push({ id: 5, FechaInternacion: '16/03/2018', MotivoInternacion: "Prueba 5"});
  res.send(tempArray);

  // generalServices.ObtenerRegistros('internaciones', req.params.dniPaciente, function (response) {
  //   if (response.estado == true) { res.send(response.respuesta); } else { res.send(null); }
  // });
});

router.get("/detalle-internacion/:id", function (req, res) {
  var tempArray = req.params.id;

  // generalServices.ObtenerRegistros('internaciones', req.params.dniPaciente, function (response) {
  //   if (response.estado == true) { res.send(response.respuesta); } else { res.send(null); }
  // });
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
    fechaCreacion: new Date()
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

router.get('/historia-clinica/:dniPaciente', function (req, res, next) {
//router.get('/historia-clinica/:dniPaciente', mid.requiresLogin, function (req, res, next) {
  var dniPaciente = req.body.dniPaciente;

  historiasClinicasServices.BuscarHistoriaClinica(dniPaciente, function (response) {
    var result = swig.renderFile('views/historiasclinicas/historiaclinica.html', {
      userRol: req.session.rol,
      userName: req.session.email,
      historiaClinica: response.respuesta,
      pageTitle: 'Historias clínicas',
    });
  
    res.send(result);
  });
});
//Fin métodos Router

module.exports = router;