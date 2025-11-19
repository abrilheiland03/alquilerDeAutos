from .persona import Persona
from datetime import date
from .documento import Documento
from .usuario import Usuario

class Cliente(Persona):
    def __init__(self, id_cliente: int, fecha_alta: date, 
                 id_persona: int, nombre: str, apellido: str, mail: str, 
                 telefono: str, fecha_nacimiento: date, tipo_documento: Documento, 
                 nro_documento: int, usuario: 'Usuario' = None):
        
        super().__init__(id_persona, nombre, apellido, mail, telefono, 
                         fecha_nacimiento, tipo_documento, nro_documento, usuario)
        
        self.id_cliente = id_cliente
        self.fecha_alta = fecha_alta

    @property
    def id_cliente(self):
        return self._id_cliente

    @id_cliente.setter
    def id_cliente(self, value):
        if not isinstance(value, int) or value <= 0:
            raise ValueError('El ID de cliente debe ser un entero positivo')
        self._id_cliente = value

    @property
    def fecha_alta(self):
        return self._fecha_alta

    @fecha_alta.setter
    def fecha_alta(self, value):
        if not isinstance(value, date):
            raise ValueError('La fecha de alta debe ser un objeto date')
        self._fecha_alta = value

