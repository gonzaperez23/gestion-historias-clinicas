function intervencionQuirurgica(intervencionRealizada, fechaIntervencion, nombreCirujano, nombreAyudante1,
    nombreAyudante2, nombreAnestesista, nombreHemoterapia, nombrePediatra, protocoloQuirurgico) {
    this.intervencionRealizada = intervencionRealizada;
    this.fechaIntervencion = fechaIntervencion;
    this.nombreCirujano = nombreCirujano;
    this.nombreAyudante1 = nombreAyudante1;
    this.nombreAyudante2 = nombreAyudante2;
    this.nombreAnestesista = nombreAnestesista;
    this.nombreHemoterapia = nombreHemoterapia;
    this.nombrePediatra = nombrePediatra;
    this.protocoloQuirurgico = protocoloQuirurgico;
}

function historiaClinica(id, dniPaciente, idHistoriaClinica, causainternacion, tipointernacion,
    descripcionInternacion, diagnosticoPrincipal, diagnosticoSecundario, intervencionRealizada,
    diasEstimativos, fechaIntervencion, nombreCirujano, nombreAyudante1, nombreAyudante2, nombreAnestesista,
    nombreHemoterapia, nombrePediatra, protocoloQuirurgico, prescripcionesMedicas) {
    this.id = parseInt(id);
    this.dniPaciente = parseInt(dniPaciente);
    this.idHistoriaClinica = parseInt(idHistoriaClinica);
    this.causainternacion = causainternacion;
    this.tipointernacion = tipointernacion;
    this.descripcionInternacion = descripcionInternacion;
    this.diagnosticoPrincipal = diagnosticoPrincipal;
    this.diagnosticoSecundario = diagnosticoSecundario;
    this.diasEstimativos = diasEstimativos;
    this.intervencionQuirurgica = new intervencionQuirurgica(intervencionRealizada, fechaIntervencion, nombreCirujano, nombreAyudante1,
        nombreAyudante2, nombreAnestesista, nombreHemoterapia, nombrePediatra, protocoloQuirurgico);
    this.prescripcionesMedicas = prescripcionesMedicas;
    this.fechaInternacion = undefined;
    this.paciente = undefined;
}

module.exports = historiaClinica;



