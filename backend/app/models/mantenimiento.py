from .vehiculo import Vehiculo
from .empleado import Empleado
from datetime import datetime
from .estadoMantenimiento import EstadoMantenimiento

class Mantenimiento:
    def __init__(self, id_mantenimiento: int, vehiculo: Vehiculo, empleado: Empleado, 
                 fecha_inicio: datetime, fecha_fin: datetime, detalle: str, 
                 estado: EstadoMantenimiento):
        self.id_mantenimiento = id_mantenimiento
        self.vehiculo = vehiculo
        self.empleado = empleado
        self.fecha_inicio = fecha_inicio
        self.fecha_fin = fecha_fin
        self.detalle = detalle
        self.estado = estado

    @property
    def id_mantenimiento(self):
        return self._id_mantenimiento

    @id_mantenimiento.setter
    def id_mantenimiento(self, value):
        if not isinstance(value, int) or value <= 0:
            raise ValueError('El ID de mantenimiento debe ser un entero positivo')
        self._id_mantenimiento = value

    @property
    def vehiculo(self):
        return self._vehiculo

    @vehiculo.setter
    def vehiculo(self, value):
        if not isinstance(value, Vehiculo):
            raise ValueError('vehiculo debe ser una instancia de la clase Vehiculo')
        self._vehiculo = value

    @property
    def empleado(self):
        return self._empleado

    @empleado.setter
    def empleado(self, value):
        if not isinstance(value, Empleado):
            raise ValueError('empleado debe ser una instancia de la clase Empleado')
        self._empleado = value

    @property
    def fecha_inicio(self):
        return self._fecha_inicio

    @fecha_inicio.setter
    def fecha_inicio(self, value):
        if not isinstance(value, datetime):
            raise ValueError('fecha_inicio debe ser un objeto datetime')
        self._fecha_inicio = value

    @property
    def fecha_fin(self):
        return self._fecha_fin

    @fecha_fin.setter
    def fecha_fin(self, value):
        if not isinstance(value, datetime):
            raise ValueError('fecha_fin debe ser un objeto datetime')
        if value < self.fecha_inicio:
            raise ValueError('La fecha de fin no puede ser anterior a la fecha de inicio')
        self._fecha_fin = value

    @property
    def detalle(self):
        return self._detalle

    @detalle.setter
    def detalle(self, value):
        self._detalle = value

    @property
    def estado(self):
        return self._estado

    @estado.setter
    def estado(self, value):
        if not isinstance(value, EstadoMantenimiento):
            raise ValueError('estado debe ser una instancia de la clase EstadoMantenimiento')
        self._estado = value

