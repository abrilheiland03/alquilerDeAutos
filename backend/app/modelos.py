from datetime import datetime, date
import re


class Documento:
    def __init__(self, id_tipo: int, descripcion: str):
        self.id_tipo = id_tipo
        self.descripcion = descripcion

    @property
    def id_tipo(self):
        return self._id_tipo

    @id_tipo.setter
    def id_tipo(self, value):
        self._id_tipo = value

    @property
    def descripcion(self):
        return self._descripcion

    @descripcion.setter
    def descripcion(self, value):
        self._descripcion = value

class Permiso:
    def __init__(self, id_permiso: int, descripcion: str):
        self.id_permiso = id_permiso
        self.descripcion = descripcion
    
    @property
    def id_permiso(self):
        return self._id_permiso

    @id_permiso.setter
    def id_permiso(self, value):
        self._id_permiso = value

    @property
    def descripcion(self):
        return self._descripcion

    @descripcion.setter
    def descripcion(self, value):
        self._descripcion = value

class EstadoAuto:
    def __init__(self, id_estado: int, descripcion: str):
        self.id_estado = id_estado
        self.descripcion = descripcion

    @property
    def id_estado(self):
        return self._id_estado

    @id_estado.setter
    def id_estado(self, value):
        self._id_estado = value

    @property
    def descripcion(self):
        return self._descripcion

    @descripcion.setter
    def descripcion(self, value):
        self._descripcion = value

class EstadoMantenimiento:
    def __init__(self, id_estado: int, descripcion: str):
        self.id_estado = id_estado
        self.descripcion = descripcion

    @property
    def id_estado(self):
        return self._id_estado

    @id_estado.setter
    def id_estado(self, value):
        self._id_estado = value

    @property
    def descripcion(self):
        return self._descripcion

    @descripcion.setter
    def descripcion(self, value):
        self._descripcion = value
        
class EstadoAlquiler:
    def __init__(self, id_estado: int, descripcion: str):
        self.id_estado = id_estado
        self.descripcion = descripcion

    @property
    def id_estado(self):
        return self._id_estado

    @id_estado.setter
    def id_estado(self, value):
        self._id_estado = value

    @property
    def descripcion(self):
        return self._descripcion

    @descripcion.setter
    def descripcion(self, value):
        self._descripcion = value

# ####################################################################
# 2. MODELO DE HERENCIA DE PERSONA
# ####################################################################

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

    @fecha_nacimiento.setter
    def fecha_nacimiento(self, value):
        if not isinstance(value, date):
            raise ValueError('La fecha de nacimiento debe ser un objeto date')
        if value >= date.today():
            raise ValueError('La fecha de nacimiento debe ser anterior al día de hoy')
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

# --- Clases Derivadas de Persona ---

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

class Usuario:
    def __init__(self, id_usuario: int, user_name: str, password: str, permiso: Permiso):
        self.id_usuario = id_usuario
        self.user_name = user_name
        self.password = password
        self.permiso = permiso

    @property
    def id_usuario(self):
        return self._id_usuario

    @id_usuario.setter
    def id_usuario(self, value):
        if not isinstance(value, int) or value <= 0:
            raise ValueError('El ID de usuario debe ser un entero positivo')
        self._id_usuario = value

    @property
    def user_name(self):
        return self._user_name

    @user_name.setter
    def user_name(self, value):
        self._user_name = value

    @property
    def password(self):
        return self._password

    @password.setter
    def password(self, value):
        # En un sistema real, aquí se debería hashear la contraseña
        self._password = value

    @property
    def permiso(self):
        return self._permiso

    @permiso.setter
    def permiso(self, value):
        if not isinstance(value, Permiso):
            raise ValueError('permiso debe ser una instancia de la clase Permiso')
        self._permiso = value

# ####################################################################
# 3. CLASES DE ENTIDADES PRINCIPALES
# ####################################################################

class Vehiculo:
    def __init__(self, patente: str, modelo: str, marca: str, anio: int, 
                 precio_flota: float, asientos: int, puertas: int, 
                 caja_manual: bool, estado: EstadoAuto):
        self.patente = patente
        self.modelo = modelo
        self.marca = marca
        self.anio = anio
        self.precio_flota = precio_flota
        self.asientos = asientos
        self.puertas = puertas
        self.caja_manual = caja_manual
        self.estado = estado

    @property
    def patente(self):
        return self._patente

    @patente.setter
    def patente(self, value):
        # Asumo un patrón de patente Argentina (AAA-123 o AA-123-AA)
        patron_regex = r'^([A-Z]{3}\d{3}|[A-Z]{2}\d{3}[A-Z]{2})$'
        if not re.fullmatch(patron_regex, value, re.IGNORECASE):
            raise ValueError('Patente invalida')
        self._patente = value.upper()

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
        if not isinstance(value, int) or value < 2000 or value > datetime.now().year + 1:
            raise ValueError('El año debe ser un número válido (ej: 2000-2026)')
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
            raise ValueError('caja_manual debe ser un valor booleano (True/False)')
        self._caja_manual = value

    @property
    def estado(self):
        return self._estado

    @estado.setter
    def estado(self, value):
        if not isinstance(value, EstadoAuto):
            raise ValueError('estado debe ser una instancia de la clase EstadoAuto')
        self._estado = value

# ####################################################################
# 4. CLASES TRANSACCIONALES (Las que unen todo)
# ####################################################################

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