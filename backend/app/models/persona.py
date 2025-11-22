import re
from .documento import Documento
from .usuario import Usuario
from datetime import date, datetime

class Persona:
    def __init__(self, id_persona: int, nombre: str, apellido: str, mail: str, 
                 telefono: str, fecha_nacimiento: date, tipo_documento: Documento, 
                 nro_documento: int, usuario: 'Usuario' = None):
        self.id_persona = id_persona
        self.nombre = nombre
        self.apellido = apellido
        self.mail = mail
        self.telefono = telefono
        self.fecha_nacimiento = fecha_nacimiento
        self.tipo_documento = tipo_documento
        self.nro_documento = nro_documento
        self.usuario = usuario

    @property
    def id_persona(self):
        return self._id_persona

    @id_persona.setter
    def id_persona(self, value):
        if not isinstance(value, int) or value <= 0:
            raise ValueError('El ID de persona debe ser un entero positivo')
        self._id_persona = value

    @property
    def nombre(self):
        return self._nombre

    @nombre.setter
    def nombre(self, value):
        self._nombre = value

    @property
    def apellido(self):
        return self._apellido

    @apellido.setter
    def apellido(self, value):
        self._apellido = value

    @property
    def mail(self):
        return self._mail

    @mail.setter
    def mail(self, value):
        patron_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.fullmatch(patron_regex, value):
            raise ValueError('Formato de mail inválido')
        self._mail = value

    @property
    def telefono(self):
        return self._telefono

    @telefono.setter
    def telefono(self, value):
        self._telefono = value

    @property
    def fecha_nacimiento(self):
        return self._fecha_nacimiento

    @property
    def fecha_nacimiento(self):
        return self._fecha_nacimiento

    @fecha_nacimiento.setter
    def fecha_nacimiento(self, value):
        # CORRECCIÓN: Convertir datetime a date si es necesario
        from datetime import datetime  # ← Agregar este import
        
        if isinstance(value, datetime):
            value = value.date()  # ← Convertir datetime a date
        elif isinstance(value, str):
            # Si es string, convertir primero a datetime y luego a date
            try:
                value = datetime.fromisoformat(value).date()
            except ValueError:
                raise ValueError('Formato de fecha inválido')
        
        if not isinstance(value, date):
            raise ValueError('La fecha de nacimiento debe ser un objeto date o datetime')
        
        hoy = date.today()
        
        if value >= hoy:
            raise ValueError('La fecha de nacimiento debe ser anterior al día de hoy')

        edad = hoy.year - value.year - ((hoy.month, hoy.day) < (value.month, value.day))

        if edad < 18:
            raise ValueError(f'La persona debe ser mayor de 18 años. (Edad calculada: {edad})')

        self._fecha_nacimiento = value

    @property
    def tipo_documento(self):
        return self._tipo_documento

    @tipo_documento.setter
    def tipo_documento(self, value):
        if not isinstance(value, Documento):
            raise ValueError('tipo_documento debe ser una instancia de la clase Documento')
        self._tipo_documento = value

    @property
    def nro_documento(self):
        return self._nro_documento

    @nro_documento.setter
    def nro_documento(self, value):
        if not isinstance(value, int) or 1000000 > value or value > 99999999:
            raise ValueError('Número de documento inválido (7 u 8 cifras)')
        self._nro_documento = value

    @property
    def usuario(self):
        return self._usuario

    @usuario.setter
    def usuario(self, value):
        if not isinstance(value, Usuario) and value is not None:
            raise ValueError('usuario debe ser una instancia de la clase Usuario o None')
        self._usuario = value
