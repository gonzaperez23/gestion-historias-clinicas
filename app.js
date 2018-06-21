var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var multer = require('multer');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'swig');

// uncomment after placing your favicon in /public
app.use(multer({ dest: './public/images/' }).any())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'content')));
app.use(express.static(path.join(__dirname, 'content', 'css')));
app.use(express.static(path.join(__dirname, 'content', 'js')));
app.use(express.static(path.join(__dirname, 'content', 'assets')));
app.use(express.static(path.join(__dirname, 'javascript')));

// routes register
var index = require('./controllers/HomeController');
var enfermedades = require('./controllers/EnfermedadesController');
var medicamentos = require('./controllers/MedicamentosController');
var causasinternacion = require('./controllers/CausasInternacionController');
var usuarios = require('./controllers/UsuariosController');
var pacientes = require('./controllers/PacientesController');

app.use('/', index);
app.use('/enfermedades', enfermedades);
app.use('/medicamentos', medicamentos);
app.use('/causas-internacion', causasinternacion);
app.use('/usuarios', usuarios);
app.use('/pacientes', pacientes);

app.listen(3535);

module.exports = app;
