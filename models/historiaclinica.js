function historiaClinica (id, dniPaciente, codMedico, fechaCreacion, idInternacionActual) {
    this.id = id;
    this.dniPaciente = dniPaciente;
    this.codMedico = codMedico;
    this.fechaCreacion = fechaCreacion;
    this.paciente = undefined;
    this.idInternacionActual = idInternacionActual;
    this.internacionActual = undefined;
}

module.exports = historiaClinica;



