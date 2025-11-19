from .alquiler import Alquiler

class Danio:
    def __init__(self, id_danio: int, alquiler: Alquiler, costo: float, detalle: str):
        self.id_danio = id_danio
        self.alquiler = alquiler
        self.costo = costo
        self.detalle = detalle

    @property
    def id_danio(self):
        return self._id_danio

    @id_danio.setter
    def id_danio(self, value):
        if not isinstance(value, int) or value <= 0:
            raise ValueError('El ID de daño debe ser un entero positivo')
        self._id_danio = value

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

