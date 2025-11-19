from .vehiculo import Vehiculo
from .cliente import Cliente
from .empleado import Empleado
from datetime import datetime
from .estadoAlquiler import EstadoAlquiler

class Alquiler:
    def __init__(self, id_alquiler: int, vehiculo: Vehiculo, cliente: Cliente, 
                 empleado: Empleado, fecha_inicio: datetime, fecha_fin: datetime, 
                 estado: EstadoAlquiler):
        self.id_alquiler = id_alquiler
        self.vehiculo = vehiculo
        self.cliente = cliente
        self.empleado = empleado
        self.fecha_inicio = fecha_inicio
        self.fecha_fin = fecha_fin
        self.estado = estado

    @property
    def id_alquiler(self):
        return self._id_alquiler

    @id_alquiler.setter
    def id_alquiler(self, value):
        if not isinstance(value, int) or value <= 0:
            raise ValueError('El ID de alquiler debe ser un entero positivo')
        self._id_alquiler = value

    @property
    def vehiculo(self):
        return self._vehiculo

    @vehiculo.setter
    def vehiculo(self, value):
        if not isinstance(value, Vehiculo):
            raise ValueError('vehiculo debe ser una instancia de la clase Vehiculo')
        self._vehiculo = value

    @property
    def cliente(self):
        return self._cliente

    @cliente.setter
    def cliente(self, value):
        if not isinstance(value, Cliente):
            raise ValueError('cliente debe ser una instancia de la clase Cliente')
        self._cliente = value

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
    def estado(self):
        return self._estado

    @estado.setter
    def estado(self, value):
        if not isinstance(value, EstadoAlquiler):
            raise ValueError('estado debe ser una instancia de la clase EstadoAlquiler')
        self._estado = value