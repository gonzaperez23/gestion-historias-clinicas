function paciente(id, dni, nombre, apellido, email, gruposanguineo, resumenmedico, fechanacimiento, obrasocial, planobrasocial, nroafiliado, provincia, ciudad, domicilio, sexo) {
        this.id = id;
        this.dni = dni;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.gruposanguineo = gruposanguineo;
        this.resumenmedico = resumenmedico;
        this.fechanacimiento = fechanacimiento;
        this.obrasocial = obrasocial;
        this.planobrasocial = planobrasocial;
        this.nroafiliado = nroafiliado;
        this.provincia = provincia;
        this.ciudad = ciudad;
        this.domicilio = domicilio;
        this.sexo = sexo;
}

module.exports = paciente;



