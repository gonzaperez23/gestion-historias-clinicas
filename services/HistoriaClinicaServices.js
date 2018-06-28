var MongoClient = require('mongodb').MongoClient;
var dbConnectionString = 'mongodb://gperez:2312carla1992@ds241019.mlab.com:41019/gestor-historias-clinicas';

var historiaClinica = require('../models/historiaClinica');
var internacion = require('../models/internacion');

function resultadoConsulta(estado, respuesta) {
    this.estado = estado;
    this.respuesta = respuesta;
}

exports.BuscarHistoriasClinicasFiltradas = function BuscarHistoriasClinicasFiltradas(filtros, callback) {
    MongoClient.connect(dbConnectionString, function (err, db) {
        if (err) {
            callback(new resultadoConsulta(false, "Ocurrio un error al comunicarse con la base de datos"));
        };

        db.collection('pacientes').find({}).toArray(function (err, result) {
            if (err) { throw err; db.close() };

            var pacientesList = result;
            db.collection('historias-clinicas').find(filtros).sort({ id: -1 }).toArray(function (err, result) {
                if (err) throw err;
                db.close();

                var resultFinal = [];
                result.forEach(element => {
                    var histClinica = new historiaClinica(element.id, element.dniPaciente, element.codMedico, element.fechaCreacion.toLocaleDateString(), element.idInternacionActual);
                    pacientesList.forEach(paciente => {
                        if (histClinica.dniPaciente == paciente.dni) {
                            histClinica.paciente = paciente;
                        }
                    });

                    resultFinal.push(histClinica);
                });

                callback(new resultadoConsulta(true, resultFinal));
            });
        });
    })
}

exports.BuscarHistoriaClinica = function BuscarHistoriaClinica(dniPaciente, callback) {
    MongoClient.connect(dbConnectionString,
        function (err, db) {
            if (err) throw err;

            var pacFiltrer = { dniPaciente: dniPaciente };
            db.collection('historias-clinicas').findOne(pacFiltrer, function (err, result) {
                if (err) {
                    db.close();
                    callback(new resultadoConsulta(false, "Ocurrio un error al buscar la historia clínica."));
                } else {
                    var histClinica = new historiaClinica(result.id, result.dniPaciente, result.codMedico, result.fechaCreacion, result.idInternacionActual);

                    db.collection('pacientes').findOne({ dni: dniPaciente }, function (err, result) {
                        if (err) {
                            db.close();
                            callback(new resultadoConsulta(false, "Ocurrio un error al buscar la historia clínica."));
                        } else {
                            histClinica.paciente = result;

                            if (histClinica.idInternacionActual != 0) {
                                db.collection('internaciones').findOne({ id: histClinica.idInternacionActual }, function (err, result) {
                                    histClinica.internacionActual = result;
                                    callback(new resultadoConsulta(true, histClinica));
                                });
                            } else {
                                histClinica.internacionActual = null;
                                callback(new resultadoConsulta(true, histClinica));
                            }
                        }
                    });
                }
            });
        });
};

exports.BuscarDetalleInternacionCompleta = function BuscarDetalleInternacionCompleta(id, callback) {
    MongoClient.connect(dbConnectionString,
        function (err, db) {
            if (err) throw err;

            db.collection('internaciones').findOne({ id: id }, function (err, result) {
                if (err) {
                    db.close();
                    callback(new resultadoConsulta(false, "Ocurrio un error al buscar la historia clínica."));
                } else {
                    var intern = new internacion(result.id, result.dniPaciente, result.idHistoriaClinica, result.causainternacion, result.tipointernacion,
                        result.descripcionInternacion, result.diagnosticoPrincipal, result.diagnosticoSecundario, result.intervencionRealizada,
                        result.diasEstimativos, result.fechaIntervencion, result.nombreCirujano, result.nombreAyudante1, result.nombreAyudante2, result.nombreAnestesista,
                        result.nombreHemoterapia, result.nombrePediatra, result.protocoloQuirurgico, result.prescripcionesMedicas)
                    intern.fechaInternacion = result.fechaInternacion;
                    intern.fechaAltaInternacion = result.fechaAltaInternacion;

                    db.collection('pacientes').findOne({ dni: intern.dniPaciente }, function (err, result) {
                        if (err) {
                            db.close();
                            callback(new resultadoConsulta(false, "Ocurrio un error al buscar la historia clínica."));
                        } else {
                            intern.paciente = result;

                            callback(new resultadoConsulta(true, intern));
                        }
                    });
                }
            });
        });
}

exports.BajaRegistroEnfermeria = function BajaRegistroEnfermeria(id, motivoBaja, callback) {
    MongoClient.connect(dbConnectionString, function (err, db) {
        if (err) throw err;
        db.collection('registros-enfermeria').update({ "id": id },
            { $set: { "eliminado": "SI", "motivoEliminacion": motivoBaja } }, function (err, result) {
                if (err) {
                    db.close();
                    callback(new resultadoConsulta(false, "No se pudo dar de baja el registro de enfermería"));
                }
                else {
                    if (err) {
                        db.close();
                        callback(new resultadoConsulta(false, "No se pudo dar de alta al paciente"));
                    }
                    else {
                        db.close();
                        callback(new resultadoConsulta(true, "Los datos se han guardado correctamente"));
                    }
                }
            });
    });
}


exports.AltaInternacion = function AltaInternacion(id, callback) {
    MongoClient.connect(dbConnectionString, function (err, db) {
        if (err) throw err;
        db.collection('internaciones').update({ "id": id },
            { $set: { "fechaAltaInternacion": new Date().toLocaleDateString() } }, function (err, result) {
                if (err) {
                    db.close();
                    callback(new resultadoConsulta(false, "No se pudo dar de alta al paciente"));
                }
                else {
                    db.collection('internaciones').findOne({ id: id }, function (err, value) {
                        db.collection('historias-clinicas').update({ "id": value.idHistoriaClinica },
                            { $set: { "idInternacionActual": 0 } }, function (err, result) {
                                if (err) {
                                    db.close();
                                    callback(new resultadoConsulta(false, "No se pudo dar de alta al paciente"));
                                }
                                else {
                                    db.close();
                                    callback(new resultadoConsulta(true, "Los datos se han guardado correctamente"));
                                }
                            });
                    });
                }
            });
    });
}

exports.GuardarInternacion = function GuardarInternacion(objeto, callback) {
    MongoClient.connect(dbConnectionString,
        function (err, db) {
            if (err) throw err;

            var mysort = { id: -1 };
            db.collection('internaciones').find().sort(mysort).toArray(function (err, value) {
                if (value.length > 0) {
                    objeto.id = value[0].id + 1;
                } else {
                    objeto.id = 1;
                }

                objeto.fechaInternacion = new Date().toLocaleDateString();
                objeto.fechaAltaInternacion = "";
                db.collection('internaciones').insert(objeto, function (err, result) {
                    if (err) {
                        db.close();
                        callback(new resultadoConsulta(false, "Los datos no han podido guardarse por un error interno del servidor"));
                    }
                    else {
                        db.collection('historias-clinicas').update({ "id": objeto.idHistoriaClinica },
                            { $set: { "idInternacionActual": objeto.id } }, function (err, result) {
                                if (err) {
                                    db.close();
                                    callback(new resultadoConsulta(false, "Los datos no han podido guardarse por un error interno del servidor"));
                                }
                                else {
                                    db.close();
                                    callback(new resultadoConsulta(true, "Los datos se han guardado correctamente"));
                                }
                            });
                    }
                });
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