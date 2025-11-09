from datetime import datetime
import re

class Cliente:
    def __init__(self, tipo_documento: str, nro_documento: int, nombre: str, apellido: str, telefono: str):
        self.tipo_documento = tipo_documento
        self.nro_documento = nro_documento
        self.nombre = nombre
        self.apellido = apellido
        self.telefono = telefono

    @property
    def tipo_documento(self):
        return self._tipo_documento

    @tipo_documento.setter
    def tipo_documento(self, value):
        self._tipo_documento = value

    @property
    def nro_documento(self):
        return self._nro_documento

    @nro_documento.setter
    def nro_documento(self, value):
        if 1000000 > value or value > 99999999:
            raise ValueError('Número de documento inválido')
        self._nro_documento = value

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
    def telefono(self):
        return self._telefono

    @telefono.setter
    def telefono(self, value):
        self._telefono = value

class Vehiculo:
    def __init__(self, patente: str, modelo: str, marca: str, anio: int, precio_flota: float):
        self.patente = patente
        self.modelo = modelo
        self.marca = marca
        self.anio = anio
        self.precio_flota = precio_flota

    @property
    def patente(self):
        return self._patente

    @patente.setter
    def patente(self, value):
        patron_regex = r'^([A-Z]{3}-\d{3}|[A-Z]{2}-\d{2}-[A-Z]{2})$'
        if not re.fullmatch(patron_regex, value, re.IGNORECASE):
            raise ValueError('Patente invalida')
        self._patente = value

    @property
    def modelo(self):
        return self._modelo

    @modelo.setter
    def modelo(self, value):
        self._modelo = value

    @property
    def marca(self):
        return self._marca

    @marca.setter
    def marca(self, value):
        self._marca = value

    @property
    def anio(self):
        return self._anio

    @anio.setter
    def anio(self, value):
        if value <= 0 or value > datetime.now().year or value < 2000:
            raise ValueError('El año debe ser mayor a 2000 y menor o igual al año actual')
        self._anio = value

    @property
    def precio_flota(self):
        return self._precio_flota

    @precio_flota.setter
    def precio_flota(self, value):
        if value < 0:
            raise ValueError('El precio de flota no puede ser negativo')
        self._precio_flota = value

class Empleado:
    def __init__(self, legajo: int, nombre: str, apellido: str):
        self.legajo = legajo
        self.nombre = nombre
        self.apellido = apellido

    @property
    def legajo(self):
        return self._legajo

    @legajo.setter
    def legajo(self, value):
        self._legajo = value

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

class Alquiler:
    def __init__(self, id_alquiler: int, vehiculo: Vehiculo, cliente: Cliente, empleado: Empleado, fecha_inicio: datetime, fecha_fin: datetime, estado: str):
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
        if value <= 0:
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
        self._fecha_inicio = value

    @property
    def fecha_fin(self):
        return self._fecha_fin

    @fecha_fin.setter
    def fecha_fin(self, value):
        if value < self.fecha_inicio:
            raise ValueError('La fecha de fin no puede ser anterior a la fecha de inicio')
        self._fecha_fin = value

    @property
    def estado(self):
        return self._estado

    @estado.setter
    def estado(self, value):
        self._estado = value

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
        if value <= 0:
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
        if value < 0:
            raise ValueError('El costo no puede ser negativo')
        self._costo = value

    @property
    def detalle(self):
        return self._detalle

    @detalle.setter
    def detalle(self, value):
        self._detalle = value

class Multa:
    def __init__(self, id_multa: int, alquiler: Alquiler, costo: float, detalle: str, fecha_multa: datetime):
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
        if value <= 0:
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
        if value < 0:
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
        if value < self.alquiler.fecha_inicio or value > self.alquiler.fecha_fin:
            raise ValueError('La fecha de multa debe estar entre la fecha de inicio y fin del alquiler')
        self._fecha_multa = value