var express = require('express');
var router = express.Router();
var swig = require('swig');
var mid = require('../middlewares/login');

//METODO GET
router.get('/', mid.requiresLogin, function (req, res, next) {
  var result = swig.renderFile('views/home/index.html', {
    pageTitle: 'Sistema de gestión de historias clínicas',
    userRol: req.session.rol, userName: req.session.email
  });

  res.send(result);
});

module.exports = router;
