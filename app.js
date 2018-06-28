var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var multer = require('multer');
var app = express();
//var session = require('express-session');

//use sessions for tracking logins
// app.use(session({
//     secret: 'work hard',
//     resave: true,
//     saveUninitialized: false,
//     cookie: { 
//         userId: 0,
//         email: null,
//         rol: null,
//         userDni: 0,
//         originUrl: ''
//     }
// }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'swig');

app.use(multer({ dest: './public/images/' }).any())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'content')));
app.use(express.static(path.join(__dirname, 'content', 'css')));
app.use(express.static(path.join(__dirname, 'content', 'js')));
app.use(express.static(path.join(__dirname, 'content', 'assets')));
app.use(express.static(path.join(__dirname, 'javascript')));

// routes register
var index = require('./controllers/HomeController');
var login = require('./controllers/LoginController');
var enfermedades = require('./controllers/EnfermedadesController');
var medicamentos = require('./controllers/MedicamentosController');
var causasinternacion = require('./controllers/CausasInternacionController');
var usuarios = require('./controllers/UsuariosController');
var pacientes = require('./controllers/PacientesController');
var historiasClinicas = require('./controllers/HistoriasClinicasController');

app.use('/', index);
app.use('/login', login);
app.use('/enfermedades', enfermedades);
app.use('/medicamentos', medicamentos);
app.use('/causas-internacion', causasinternacion);
app.use('/usuarios', usuarios);
app.use('/pacientes', pacientes);
app.use('/historias-clinicas', historiasClinicas);

var port = process.env.PORT || 8000
app.listen(port);

module.exports = app;
