function registrointernacion (id, dniPaciente, idInternacion, medicamento, dosis, 
        fecharegistro, horaregistro, eliminado, observaciones) {
    this.id = id;
    this.dniPaciente = dniPaciente;
    this.idInternacion = idInternacion;
    this.medicamento = medicamento;
    this.dosis = dosis;
    this.fecharegistro = fecharegistro;
    this.horaregistro = horaregistro;
    this.eliminado = eliminado;
    this.observaciones = observaciones;
    this.motivoEliminacion = "";
}

module.exports = registrointernacion;



