function usuario (id, dni, nombre, apellido, email, clave, rolId, rol, matricula, especialidadId, especialidad, provincia, ciudad) {
    this.id = id;
    this.dni = dni;
    this.nombre = nombre;
    this.apellido = apellido;
    this.email = email;
    this.clave = clave;
    this.rolId = rolId;
    this.rol = rol;
    this.matricula = matricula;
    this.especialidadId = especialidadId;
    this.especialidad = especialidad;
    this.provincia = provincia;
    this.ciudad = ciudad;
}

module.exports = usuario;



