from .persona import Persona
from datetime import date
from .documento import Documento
from .usuario import Usuario

class Administrador(Persona):
    def __init__(self, id_administrador: int, descripcion: str,
                 id_persona: int, nombre: str, apellido: str, mail: str, 
                 telefono: str, fecha_nacimiento: date, tipo_documento: Documento, 
                 nro_documento: int, usuario: 'Usuario' = None):
        
        super().__init__(id_persona, nombre, apellido, mail, telefono, 
                         fecha_nacimiento, tipo_documento, nro_documento, usuario)
        
        self.id_administrador = id_administrador
        self.descripcion = descripcion

    @property
    def id_administrador(self):
        return self._id_administrador

    @id_administrador.setter
    def id_administrador(self, value):
        if not isinstance(value, int) or value <= 0:
            raise ValueError('El ID de administrador debe ser un entero positivo')
        self._id_administrador = value

    @property
    def descripcion(self):
        return self._descripcion

    @descripcion.setter
    def descripcion(self, value):
        self._descripcion = value