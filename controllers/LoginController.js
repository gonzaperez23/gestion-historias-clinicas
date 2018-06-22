var express = require('express');
var router = express.Router();
var swig = require('swig');
var session = require('express-session')

var resultado = require('../models/resultado');
var generalServices = require('../services/GeneralServices');

//METODO GET
router.get('/login', function (req, res, next) {
  var result = swig.renderFile('views/login/login.html', {
    pageTitle: 'Iniciar sesion',
  });

  res.send(result);
});

router.post('/login', function (req, res, next) {
  generalServices.IniciarSesion(req.body.email, req.body.clave, function (resultado) {
    req.session.userId = resultado.respuesta.id;
    req.session.email = resultado.respuesta.email;
    req.session.rol = resultado.respuesta.rol;

    var result = swig.renderFile('views/login/login.html', {
      pageTitle: 'Iniciar sesion',
    });
  
    res.redirect("/");
  });
});

router.get('/logout', function (req, res, next) {
  if (req.session) {
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

module.exports = router;
