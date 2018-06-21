var express = require('express');
var router = express.Router();
var swig = require('swig');

var MongoClient = require('mongodb').MongoClient;

var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: "ddprxzo7m",
  api_key: "335129962194565",
  api_secret: "bbj5kA0ajYLpjf9cllCRcRE5XV8"
});

var dbConnectionString = 'mongodb://gperez23:23121992@ds117758.mlab.com:17758/actividad1'

function movie(movieTitle, year, movieDirector, userName, imageUrl) {
  this.movieTitle = movieTitle;
  this.year = year;
  this.movieDirector = movieDirector;
  this.userName = userName;
  this.imageUrl = imageUrl;
  this.id = 0;
}

function userMovie(documento, nombre, apellido) {
  this.documento = documento;
  this.nombre = nombre;
  this.apellido = apellido;
}

function searchNextId() {
  var result = 0;
  MongoClient.connect(dbConnectionString).then(function (db) { // <- db as first argument
    var collection = db.collection('peliculas').count().then(function (value) {
      result = value;
    });
  });

  return result;
}

//METODO GET
router.get('/', function (req, res, next) {
  MongoClient.connect(dbConnectionString,
    function (err, db) {
      var collection = db.collection('peliculas');

      collection.find({}).toArray(function (err, result) {
        if (err) throw err;
        var moviesArray = result;
        db.close();

        var result = swig.renderFile('plantillas/index.html', {
          pageTitle: 'Listado de peliculas',
          movies: moviesArray
        });

        res.send(result);
      });
    });
});

//METODO GET
router.get('/listadopeliculas', function (req, res, next) {
  MongoClient.connect(dbConnectionString,
    function (err, db) {
      var collection = db.collection('peliculas');

      collection.find({}).toArray(function (err, result) {
        if (err) throw err;
        var moviesArray = result;
        db.close();

        var result = swig.renderFile('plantillas/listadopeliculas.html', {
          pageTitle: 'Listado de peliculas',
          movies: moviesArray
        });

        res.send(result);
      });
    });
});

//METODO GET
router.get('/nuevapelicula', function (req, res, next) {
  var result = swig.renderFile('plantillas/pelicula.html', {
    pageTitle: 'Nueva Pelicula',
  });

  res.send(result);
});

//METODO POST
router.post('/nuevapelicula', function (req, res, next) {
  var user = new userMovie('36814249A', 'Gonzalo', 'Pérez');
  var newMovie = new movie(req.body.movieTitle, parseInt(req.body.year), req.body.movieDirector, "gperez23", "");

  cloudinary.uploader.upload(req.files[0].path,
    function (result) {
      newMovie.imageUrl = result.url;
      if (result != null || result != "") {
        MongoClient.connect(dbConnectionString,
          function (err, db) {

            var collection = db.collection('peliculas').count().then(function (value) {
              newMovie.id = value + 1;
              db.collection('peliculas').insert(newMovie, function (err, result) {
                if (err) {
                  var result = swig.renderFile('plantillas/error.html', {
                    pageTitle: 'Error',
                    message: 'Los datos no se han guardado correctamente'
                  });
                  res.send(result);
                }
                else {
                  var result = swig.renderFile('plantillas/exito.html', {
                    pageTitle: 'Exito',
                    message: 'Los datos se han guardado correctamente'
                  });

                  db.close();
                  res.send(result);
                }
              });
            });
          });
      }
      else {
        var result = swig.renderFile('plantillas/error.html', {
          pageTitle: 'Error',
          message: 'Los datos no se han guardado correctamente'
        });
        res.send(result);
      }
    })
});

//METODO GET
router.get('/editarpelicula/:id', function (req, res, next) {
  MongoClient.connect(dbConnectionString,
    function (err, db) {
      var collection = db.collection('peliculas');

      var objectId = require('mongodb').ObjectID(req.params.id);
      collection.findOne({ '_id': objectId }, function (err, result) {
        if (err) throw err;
        db.close();

        var resp = swig.renderFile('plantillas/editarpelicula.html', {
          pageTitle: 'Listado de peliculas',
          movie: result
        });

        res.send(resp);
      });
    });
});

//METODO POST
router.post('/editarpelicula', function (req, res, next) {
  var user = new userMovie('36814249A', 'Gonzalo', 'Pérez');
  var newMovie = new movie(req.body.movieTitle, parseInt(req.body.year), req.body.movieDirector, "gperez23", "");
  if (req.body.id != "" || req.body.id != 0) {
    newMovie.id = parseInt(req.body.id);
  }

  if (req.files.length > 0) {
    cloudinary.uploader.upload(req.files[0].path,
      function (result) {
        newMovie.imageUrl = result.url;

        MongoClient.connect(dbConnectionString,
          function (err, db) {
            var collection = db.collection('peliculas');

            collection.update(
              { 'id': newMovie.id },
              {
                $set: {
                  'movieTitle': newMovie.movieTitle,
                  'year': newMovie.year,
                  'userName': newMovie.userName,
                  'imageUrl': newMovie.imageUrl,
                  'movieDirector': newMovie.movieDirector
                }
              },
              function (err, result) {
                db.close();

                if (err) {
                  var result = swig.renderFile('plantillas/error.html', {
                    pageTitle: 'Error',
                    message: 'Los datos no se han guardado correctamente'
                  });

                  res.send(result);
                }

                var result = swig.renderFile('plantillas/exito.html', {
                  pageTitle: 'Exito',
                  message: 'Los datos se han guardado correctamente'
                });

                res.send(result);
              });
          });
      });
  }
  else {
    MongoClient.connect(dbConnectionString,
      function (err, db) {
        var collection = db.collection('peliculas');

        var objectId = require('mongodb').ObjectID(req.params.id);
        collection.findOne({ '_id': objectId }, function (err, result) {
          newMovie.imageUrl = result.imageUrl;

          collection.update(
            { 'id': newMovie.id },
            {
              $set: {
                'movieTitle': newMovie.movieTitle,
                'year': newMovie.year,
                'userName': newMovie.userName,
                'imageUrl': newMovie.imageUrl,
                'movieDirector': newMovie.movieDirector
              }
            },
            function (err, result) {
              if (err) {
                var result = swig.renderFile('plantillas/error.html', {
                  pageTitle: 'Error',
                  message: 'Los datos no se han guardado correctamente'
                });

                res.send(result);
              }
            });

          var result = swig.renderFile('plantillas/exito.html', {
            pageTitle: 'Exito',
            message: 'Los datos se han guardado correctamente'
          });

          res.send(result);
        });
      });
  }
});



router.get('/detallepelicula/:id', function (req, res, next) {
  MongoClient.connect(dbConnectionString,
    function (err, db) {
      var collection = db.collection('peliculas');

      var objectId = require('mongodb').ObjectID(req.params.id);
      collection.findOne({ '_id': objectId }, function (err, result) {
        if (err) throw err;
        db.close();

        var resp = swig.renderFile('plantillas/detallepelicula.html', {
          pageTitle: 'Listado de peliculas',
          movie: result
        });

        res.send(resp);
      });
    });
});

router.get('/eliminarpelicula/:id', function (req, res, next) {
  var result = swig.renderFile('plantillas/eliminarpelicula.html', {
    pageTitle: 'Eliminar Pelicula',
    message: '¿Desea eliminar la película ' + req.params.id + '?',
    movieId: req.params.id
  });

  res.send(result);
});

router.post('/eliminarpelicula', function (req, res, next) {
  MongoClient.connect(dbConnectionString, function (err, db) {
    if (err) throw err;
    var query = { id: parseInt(req.body.id) };
    db.collection("peliculas").remove(query, function (err, obj) {
      if (err) {
        var result = swig.renderFile('plantillas/error.html', {
          pageTitle: 'Error',
          message: 'Los datos no se han guardado correctamente'
        });

        db.close();
        res.send(result);
      };
      var result = swig.renderFile('plantillas/exito.html', {
        pageTitle: 'Exito',
        message: 'Los datos se han guardado correctamente'
      });

      db.close();
      res.send(result);
    });
  });
});

module.exports = router;
