var bcrypt = require('bcrypt-nodejs');
var MongoClient = require('mongodb').MongoClient;
var dbConnectionString = 'mongodb://gperez:2312carla1992@ds241019.mlab.com:41019/gestor-historias-clinicas'

function resultadoConsulta(estado, respuesta) {
  this.estado = estado;
  this.respuesta = respuesta;
}

exports.ObtenerRegistros = function ObtenerRegistros(entidad, callback) {

  MongoClient.connect(dbConnectionString, function (err, db) {
    if (err) {
      callback(new resultadoConsulta(false, "Ocurrio un error al comunicarse con la base de datos"));
    };

    var collection = db.collection(entidad);
    collection.find({}).toArray(function (err, result) {
      if (err) throw err;
      db.close();

      callback(new resultadoConsulta(true, result));
    });
  })
}

exports.ObtenerRegistrosFiltrados = function ObtenerRegistrosFiltrados(entidad, filtros, callback) {

  MongoClient.connect(dbConnectionString, function (err, db) {
    if (err) {
      callback(new resultadoConsulta(false, "Ocurrio un error al comunicarse con la base de datos"));
    };

    var collection = db.collection(entidad);
    collection.find(filtros).toArray(function (err, result) {
      if (err) throw err;
      db.close();

      callback(new resultadoConsulta(true, result));
    });
  })
}

exports.InsertarRegistro = function InsertarRegistro(entidad, objeto, callback) {
  MongoClient.connect(dbConnectionString,
    function (err, db) {
      if (err) throw err;
      var mysort = { id: -1 };
      db.collection(entidad).find().sort(mysort).toArray(function (err, value) {
        if (value.length > 0) {
          objeto.id = value[0].id + 1;
        } else {
          objeto.id = 1;
        }

        db.collection(entidad).insert(objeto, function (err, result) {
          if (err) {
            db.close();
            callback(new resultadoConsulta(false, "Los datos no han podido guardarse por un error interno del servidor"));
          }
          else {
            db.close();
            callback(new resultadoConsulta(true, "Los datos se han guardado correctamente"));
          }
        });
      });
    });
};

exports.ActualizarRegistro = function ActualizarRegistro(entidad, objeto, idObjeto, callback) {
  MongoClient.connect(dbConnectionString,
    function (err, db) {
      if (err) throw err;
      db.collection(entidad).update({ "id": parseInt(idObjeto) }, objeto, function (err, result) {
        if (err) {
          db.close();
          callback(new resultadoConsulta(false, "Los datos no han podido guardarse por un error interno del servidor"));
        }
        else {
          db.close();
          callback(new resultadoConsulta(true, "Los datos se han guardado correctamente"));
        }
      });
    });
};

exports.EliminarRegistro = function EliminarRegistro(entidad, registerId, callback) {
  MongoClient.connect(dbConnectionString,
    function (err, db) {
      if (err) throw err;
      var query = { id: registerId };
      db.collection(entidad).remove(query, function (err, result) {
        if (err) {
          db.close();
          callback(new resultadoConsulta(false, "No se ha podido eliminar el registro"));
        }
        else {
          db.close();
          callback(new resultadoConsulta(true, "Se ha eliminado el registro"));
        }
      });
    });
};

exports.IniciarSesion = function IniciarSesion(email, password, callback) {
  MongoClient.connect(dbConnectionString,
    function (err, db) {
      if (err) throw err;
      db.collection('usuarios').findOne({ email: email }, function (err, usuario) {
        if (err) {
          db.close();
          callback(new resultadoConsulta(false, "No se encontró ningun registro con este correo."));
        }
        else {
          db.close();
          bcrypt.compare(password, usuario.clave, function (err, result) {
            if (result === true) {
              callback(new resultadoConsulta(true, usuario));
            } else {
              return callback(new resultadoConsulta(false, "La clave proporcionada no es correcta."));
            }
          })

        }
      });
    });
}; 