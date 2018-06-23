function historiaClinica (id, dniPaciente, codMedico, fechaCreacion) {
    this.id = id;
    this.dniPaciente = dniPaciente;
    this.codMedico = codMedico;
    this.fechaCreacion = fechaCreacion;
    this.paciente = undefined;
}

module.exports = historiaClinica;



