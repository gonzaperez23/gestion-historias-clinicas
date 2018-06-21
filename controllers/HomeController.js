var express = require('express');
var router = express.Router();
var swig = require('swig');

//METODO GET
router.get('/', function (req, res, next) {
  var result = swig.renderFile('views/home/index.html', {
    pageTitle: 'Sistema de gestión de historias clínicas',
  });

  res.send(result);
});

module.exports = router;
