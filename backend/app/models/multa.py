from .alquiler import Alquiler
from datetime import datetime

class Multa:
    def __init__(self, id_multa: int, alquiler: Alquiler, costo: float, 
                 detalle: str, fecha_multa: datetime):
        self.id_multa = id_multa
        self.alquiler = alquiler
        self.costo = costo
        self.detalle = detalle
        self.fecha_multa = fecha_multa

    @property
    def id_multa(self):
        return self._id_multa

    @id_multa.setter
    def id_multa(self, value):
        if not isinstance(value, int) or value <= 0:
            raise ValueError('El ID de multa debe ser un entero positivo')
        self._id_multa = value

    @property
    def alquiler(self):
        return self._alquiler

    @alquiler.setter
    def alquiler(self, value):
        if not isinstance(value, Alquiler):
            raise ValueError('alquiler debe ser una instancia de la clase Alquiler')
        self._alquiler = value

    @property
    def costo(self):
        return self._costo

    @costo.setter
    def costo(self, value):
        if not isinstance(value, (int, float)) or value < 0:
            raise ValueError('El costo no puede ser negativo')
        self._costo = value

    @property
    def detalle(self):
        return self._detalle

    @detalle.setter
    def detalle(self, value):
        self._detalle = value

    @property
    def fecha_multa(self):
        return self._fecha_multa

    @fecha_multa.setter
    def fecha_multa(self, value):
        if not isinstance(value, datetime):
            raise ValueError('fecha_multa debe ser un objeto datetime')
        if not (self.alquiler.fecha_inicio <= value <= self.alquiler.fecha_fin):
           raise ValueError('La fecha de multa debe estar dentro del período del alquiler')
        self._fecha_multa = value