from .persona import Persona
from datetime import date
from .documento import Documento
from .usuario import Usuario

class Empleado(Persona):
    def __init__(self, id_empleado: int, fecha_alta: date, sueldo: float,
                 id_persona: int, nombre: str, apellido: str, mail: str, 
                 telefono: str, fecha_nacimiento: date, tipo_documento: Documento, 
                 nro_documento: int, usuario: 'Usuario' = None):
        
        super().__init__(id_persona, nombre, apellido, mail, telefono, 
                         fecha_nacimiento, tipo_documento, nro_documento, usuario)
        
        self.id_empleado = id_empleado
        self.fecha_alta = fecha_alta
        self.sueldo = sueldo

    @property
    def id_empleado(self):
        return self._id_empleado

    @id_empleado.setter
    def id_empleado(self, value):
        if not isinstance(value, int) or value <= 0:
            raise ValueError('El ID de empleado (legajo) debe ser un entero positivo')
        self._id_empleado = value

    @property
    def fecha_alta(self):
        return self._fecha_alta

    @fecha_alta.setter
    def fecha_alta(self, value):
        if not isinstance(value, date):
            raise ValueError('La fecha de alta debe ser un objeto date')
        self._fecha_alta = value

    @property
    def sueldo(self):
        return self._sueldo

    @sueldo.setter
    def sueldo(self, value):
        if not isinstance(value, (int, float)) or value < 0:
            raise ValueError('El sueldo no puede ser negativo')
        self._sueldo = value
