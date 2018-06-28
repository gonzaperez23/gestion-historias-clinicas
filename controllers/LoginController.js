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
    originalUrl: req.session.originUrl
  });

  res.send(result);
});

router.post('/login', function (req, res, next) {
  generalServices.IniciarSesion(req.body.email, req.body.clave, function (resultado) {
    req.session.userId = resultado.respuesta.id;
    req.session.email = resultado.respuesta.email;
    req.session.rol = resultado.respuesta.rol;
    req.session.userDni = resultado.respuesta.dni;

    if (resultado.estado == false) {
      var result = swig.renderFile('views/login/login.html', {
        pageTitle: 'Iniciar sesion',
        originalUrl: url,
        resultado: new resultado(resultado.estado, resultado.respuesta),
      });

      res.send(result);
    } else {
      res.redirect(req.body.url);
    }
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
