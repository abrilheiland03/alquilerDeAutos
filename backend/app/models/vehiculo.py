from .marca import Marca
from .estadoAuto import EstadoAuto
from .color import Color

class Vehiculo:
    def __init__(self, patente: str, modelo: str, marca: Marca, anio: int,
                 precio_flota: float, asientos: int, puertas: int,
                 caja_manual: bool, estado: EstadoAuto, color: Color):
        self.patente = patente
        self.modelo = modelo
        self.marca = marca
        self.anio = anio
        self.precio_flota = precio_flota
        self.asientos = asientos
        self.puertas = puertas
        self.caja_manual = caja_manual
        self.estado = estado
        self.color = color

    @property
    def patente(self):
        return self._patente

    @patente.setter
    def patente(self, value):
        patron_regex = r'^([A-Z]{3}\d{3}|[A-Z]{2}\d{3}[A-Z]{2})$'
        if not re.fullmatch(patron_regex, value, re.IGNORECASE):
            raise ValueError('Patente invalida')
        self._patente = value.upper()

    @property
    def modelo(self):
        return self._modelo

    @modelo.setter
    def modelo(self, value):
        if not value:
            raise ValueError("El modelo no puede estar vacío")
        self._modelo = value

    @property
    def marca(self):
        return self._marca

    @marca.setter
    def marca(self, value):
        if not isinstance(value, Marca):
            raise ValueError("marca debe ser una instancia de la clase Marca")
        self._marca = value

    @property
    def anio(self):
        return self._anio

    @anio.setter
    def anio(self, value):
        if not isinstance(value, int) or value < 2000 or value > datetime.now().year + 1:
            raise ValueError('El año debe ser un número válido (2000–año siguiente)')
        self._anio = value

    @property
    def precio_flota(self):
        return self._precio_flota

    @precio_flota.setter
    def precio_flota(self, value):
        if not isinstance(value, (int, float)) or value < 0:
            raise ValueError('El precio de flota no puede ser negativo')
        self._precio_flota = value

    @property
    def asientos(self):
        return self._asientos

    @asientos.setter
    def asientos(self, value):
        if not isinstance(value, int) or value <= 0:
            raise ValueError('El número de asientos debe ser un entero positivo')
        self._asientos = value

    @property
    def puertas(self):
        return self._puertas

    @puertas.setter
    def puertas(self, value):
        if not isinstance(value, int) or value <= 0:
            raise ValueError('El número de puertas debe ser un entero positivo')
        self._puertas = value

    @property
    def caja_manual(self):
        return self._caja_manual

    @caja_manual.setter
    def caja_manual(self, value):
        if not isinstance(value, bool):
            raise ValueError('caja_manual debe ser booleano')
        self._caja_manual = value

    @property
    def estado(self):
        return self._estado

    @estado.setter
    def estado(self, value):
        if not isinstance(value, EstadoAuto):
            raise ValueError('estado debe ser una instancia de EstadoAuto')
        self._estado = value

    @property
    def color(self):
        return self._color

    @color.setter
    def color(self, value):
        if not isinstance(value, Color):
            raise ValueError("color debe ser una instancia de la clase Color")
        self._color = value