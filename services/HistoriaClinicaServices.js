var MongoClient = require('mongodb').MongoClient;
var dbConnectionString = 'mongodb://gperez:2312carla1992@ds241019.mlab.com:41019/gestor-historias-clinicas';

var historiaClinica = require('../models/historiaClinica');

function resultadoConsulta(estado, respuesta) {
    this.estado = estado;
    this.respuesta = respuesta;
}

exports.BuscarHistoriaClinica = function BuscarHistoriaClinica(dniPaciente, callback) {
    MongoClient.connect(dbConnectionString,
        function (err, db) {
            if (err) throw err;

            var pacFiltrer = { dni: dniPaciente };
            db.collection('historias-clinicas').findOne(pacFiltrer, function (err, result) {
                if (err) {
                    db.close();
                    callback(new resultadoConsulta(false, "Ocurrio un error al buscar la historia clínica."));
                } else {
                    var histClinica = new historiaClinica(result.id, result.dniPaciente, result.codMedico, result.fechaCreacion);

                    db.collection('pacientes').findOne({dni :result.dniPaciente}, function (err, result) {
                        if (err) {
                            db.close();
                            callback(new resultadoConsulta(false, "Ocurrio un error al buscar la historia clínica."));
                        } else { 
                            histClinica.paciente = result;
                            callback(new resultadoConsulta(true, histClinica));
                        }
                    });
                }
            });
        });
};

exports.InsertarPacienteSinHc = function InsertarRegistro(objeto, callback) {
    MongoClient.connect(dbConnectionString,
        function (err, db) {
            if (err) throw err;

            var pacSinHc = { dni: objeto.dni };
            db.collection('pacientes-sin-hc').insert(pacSinHc, function (err, result) {
                if (err) {
                    db.close();
                    callback(new resultadoConsulta(false, "Se guardo el usuario pero no pudo actualizarse la base de pacientes sin historias clinicas."));
                } else {
                    callback(new resultadoConsulta(true, "Los datos se han guardado correctamente"));
                }
            });
        });
};

exports.EliminarPacienteSinHc = function EliminarPacienteSinHc(dniPaciente, callback) {
    MongoClient.connect(dbConnectionString,
        function (err, db) {
            if (err) throw err;

            var query = { dni: dniPaciente };
            db.collection('pacientes-sin-hc').remove(query, function (err, result) {
                if (err) {
                    db.close();
                    callback(new resultadoConsulta(false, "Se guardo el usuario pero no pudo actualizarse la base de pacientes sin historias clinicas."));
                } else {
                    callback(new resultadoConsulta(true, "Los datos se han guardado correctamente"));
                }
            });
        });
};