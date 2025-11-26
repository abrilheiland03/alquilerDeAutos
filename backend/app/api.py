from flask import Blueprint, Flask, jsonify, request
from flask_cors import CORS
from sistema import SistemaAlquiler

app = Flask(__name__)

CORS(app) 

sistema = SistemaAlquiler()

api = Blueprint('api', __name__)

# ---------------------------------------------------------
# RUTAS (ENDPOINTS)
# ---------------------------------------------------------

@api.route('/', methods=['GET'])
def index():
    """Ruta de prueba para ver si el servidor vive."""
    return jsonify({"status": "API de Alquileres funcionando 🚀"})


#---------------------------------------------------------
# GET LISTAS DE CATÁLOGOS
#--------------------------------------------------------


@api.route('/tipos-documento', methods=['GET'])
def obtener_tipos_documento():
    try:
        lista = sistema.listar_tipos_documento()
        return jsonify([{"id_tipo": x.id_tipo, "descripcion": x.descripcion} for x in lista]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/marcas', methods=['GET'])
def obtener_marcas():
    try:
        lista = sistema.listar_marcas()
        return jsonify([{"id_marca": x.id_marca, "descripcion": x.descripcion} for x in lista]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/colores', methods=['GET'])
def obtener_colores():
    try:
        lista = sistema.listar_colores()
        return jsonify([{"id_color": x.id_color, "descripcion": x.descripcion} for x in lista]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/estados-auto', methods=['GET'])
def obtener_estados_auto():
    try:
        lista = sistema.listar_estados_auto()
        return jsonify([{"id_estado": x.id_estado, "descripcion": x.descripcion} for x in lista]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/estados-alquiler', methods=['GET'])
def obtener_estados_alquiler():
    try:
        lista = sistema.listar_estados_alquiler()
        return jsonify([{"id_estado": x.id_estado, "descripcion": x.descripcion} for x in lista]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/estados-mantenimiento', methods=['GET'])
def obtener_estados_mantenimiento():
    try:
        lista = sistema.listar_estados_mantenimiento()
        return jsonify([{"id_estado": x.id_estado, "descripcion": x.descripcion} for x in lista]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/permisos', methods=['GET'])
def obtener_permisos():
    try:
        lista = sistema.listar_permisos()
        return jsonify([{"id_permiso": x.id_permiso, "descripcion": x.descripcion} for x in lista]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

#---------------------------------------------------------
# GESTION USUARIOS
#--------------------------------------------------------

def obtener_usuario_actual():
    user_id = request.headers.get('user-id')
    
    if not user_id:
        return None
    
    return sistema.db_manager.get_full_usuario_by_id(user_id)

@api.route('/usuarios/<id_usuario>', methods=['DELETE'])
def eliminar_usuario_sistema(id_usuario):
    try:
        usuario_solicitante = obtener_usuario_actual()
        if not usuario_solicitante:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        exito = sistema.eliminar_usuario(id_usuario, usuario_solicitante)
        
        if exito:
            return jsonify({"mensaje": f"Usuario {id_usuario} eliminado exitosamente"}), 200
        return jsonify({"error": "No se pudo eliminar (Permisos insuficientes, usuario no encontrado o tiene datos asociados)"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Endpoint LOGIN ---
@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    usuario = sistema.login(data['email'], data['password'])
    
    if usuario:
        return jsonify({
            "mensaje": "Exito", 
            "user_id": usuario.id_usuario,
            "nombre": usuario.user_name,
            "rol": usuario.permiso.descripcion
        }), 200
    return jsonify({"error": "Credenciales invalidas"}), 401

    
@api.route('/registro', methods=['POST'])
def registrar_usuario_unificado():
    try:
        body = request.get_json()
        
        tipo_usuario = body.get('tipo', '').lower()
        datos_usuario = body.get('datos')

        if not tipo_usuario or not datos_usuario:
            return jsonify({"error": "Faltan campos 'tipo' o 'datos'"}), 400

        if tipo_usuario == 'cliente':
            exito = sistema.registrar_usuario_cliente(datos_usuario)
            if exito:
                return jsonify({"mensaje": "Cliente registrado exitosamente"}), 201
            return jsonify({"error": "Error al registrar cliente"}), 400

        usuario_solicitante = obtener_usuario_actual()
        
        if not usuario_solicitante:
            return jsonify({"error": "No autorizado. Se requiere login"}), 401
            
        es_admin = sistema.check_permission("Admin", usuario_solicitante)
        if not es_admin:
            return jsonify({"error": "Solo un Administrador puede crear empleados o administradores"}), 403

        if tipo_usuario == 'empleado':
            exito = sistema.registrar_usuario_empleado(datos_usuario)
            if exito:
                return jsonify({"mensaje": "Empleado registrado exitosamente"}), 201
            
        elif tipo_usuario == 'admin':
            exito = sistema.registrar_usuario_admin(datos_usuario)
            if exito:
                return jsonify({"mensaje": "Administrador registrado exitosamente"}), 201
        
        else:
             return jsonify({"error": "Tipo de usuario no válido (cliente, empleado, admin)"}), 400

        return jsonify({"error": "Error al registrar usuario staff (Datos duplicados o inválidos)"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Endpoints ABMC Vehículos ---

@api.route('/vehiculos', methods=['POST'])
def crear_vehiculo():
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        data = request.get_json()
        patente_creada = sistema.crear_vehiculo(data, usuario)
        
        if patente_creada:
            return jsonify({"mensaje": f"Vehículo {patente_creada.upper()} creado exitosamente"}), 201
        return jsonify({"error": "No se pudo crear el vehículo (Permisos o Datos duplicados)"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/vehiculos/<patente>', methods=['PUT'])
def actualizar_vehiculo(patente):
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        data = request.get_json()
        exito = sistema.actualizar_vehiculo(patente, data, usuario)
        
        if exito:
            return jsonify({"mensaje": f"Vehículo {patente} actualizado exitosamente"}), 200
        return jsonify({"error": "No se pudo actualizar (Permisos o Vehículo no encontrado)"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/vehiculos/<patente>', methods=['DELETE'])
def eliminar_vehiculo(patente):
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        exito = sistema.eliminar_vehiculo(patente, usuario)
        
        if exito:
            return jsonify({"mensaje": f"Vehículo {patente} eliminado exitosamente"}), 200
        return jsonify({"error": "No se pudo eliminar (Permisos o Dependencias activas)"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/vehiculos/<patente>', methods=['GET'])
def buscar_vehiculo_por_patente(patente):
    try:
        vehiculo = sistema.buscar_vehiculo_por_matricula(patente)
        if vehiculo:
            respuesta = {
                "patente": vehiculo.patente,
                "modelo": vehiculo.modelo,
                "marca": vehiculo.marca.descripcion if vehiculo.marca else None,
                "color": vehiculo.color.descripcion if vehiculo.color else None,
                "anio": vehiculo.anio,
                "precio_flota": vehiculo.precio_flota,
                "estado": vehiculo.estado.descripcion if vehiculo.estado else None,
                "asientos": vehiculo.asientos,
                "puertas": vehiculo.puertas,
                "caja_manual": vehiculo.caja_manual
            }
            return jsonify(respuesta), 200

        return jsonify({"error": "Vehículo no encontrado"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/vehiculos/libres', methods=['GET'])
def listar_vehiculos_libres():
    try:
        lista = sistema.listar_vehiculos_libres()
        # Serialización manual si vars() no es suficiente por objetos anidados
        respuesta = []
        for v in lista:
            respuesta.append({
                "patente": v.patente,
                "modelo": v.modelo,
                "marca": v.marca.descripcion if v.marca else None,
                "color": v.color.descripcion if v.color else None,
                "anio": v.anio,
                "precio_flota": v.precio_flota,
                "estado": v.estado.descripcion if v.estado else None,
                "asientos": v.asientos,
                "puertas": v.puertas,
                "caja_manual": v.caja_manual
            })
        return jsonify(respuesta), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@api.route('/vehiculos', methods=['GET'])
def listar_vehiculos():
    try:
        lista = sistema.listar_vehiculos()
        respuesta = []
        for v in lista:
            respuesta.append({
                "patente": v.patente,
                "modelo": v.modelo,
                "marca": v.marca.descripcion if v.marca else None,
                "color": v.color.descripcion if v.color else None,
                "anio": v.anio,
                "precio_flota": v.precio_flota,
                "estado": v.estado.descripcion if v.estado else None,
                "asientos": v.asientos,
                "puertas": v.puertas,
                "caja_manual": v.caja_manual
            })
        return jsonify(respuesta), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# --- Endpoints ABMC Clientes ---

@api.route('/clientes', methods=['POST'])
def crear_cliente():
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        data = request.get_json()
        id_creado = sistema.crear_cliente_mostrador(data, usuario)
        
        if id_creado:
            return jsonify({"mensaje": "Cliente creado exitosamente", "id_cliente": id_creado}), 201
        return jsonify({"error": "No se pudo crear el cliente (Permisos insuficientes o error de datos)"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/clientes', methods=['GET'])
def listar_clientes():
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        lista = sistema.listar_todos_los_clientes(usuario)
        respuesta = []
        
        for c in lista:
            respuesta.append({
                "id_cliente": c.id_cliente,
                "id_persona": c.id_persona,
                "nombre": c.nombre,
                "apellido": c.apellido,
                "mail": c.mail,
                "telefono": c.telefono,
                "nro_documento": c.nro_documento,
                "fecha_nacimiento": str(c.fecha_nacimiento),
                "fecha_alta": str(c.fecha_alta),
                "tipo_documento": c.tipo_documento.descripcion if c.tipo_documento else None,
                "id_tipo_documento": c.tipo_documento.id_tipo if c.tipo_documento else None
            })
            
        return jsonify(respuesta), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/clientes/<id_cliente>', methods=['GET'])
def obtener_cliente_por_id(id_cliente):
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        c = sistema.buscar_cliente_por_id(id_cliente, usuario)
        
        if c:
            respuesta = {
                "id_cliente": c.id_cliente,
                "id_persona": c.id_persona,
                "nombre": c.nombre,
                "apellido": c.apellido,
                "mail": c.mail,
                "telefono": c.telefono,
                "nro_documento": c.nro_documento,
                "fecha_nacimiento": str(c.fecha_nacimiento),
                "fecha_alta": str(c.fecha_alta),
                "tipo_documento": c.tipo_documento.descripcion if c.tipo_documento else None,
                "id_tipo_documento": c.tipo_documento.id_tipo if c.tipo_documento else None
            }
            return jsonify(respuesta), 200
            
        return jsonify({"error": "Cliente no encontrado"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/clientes/buscar', methods=['GET'])
def buscar_cliente_por_documento():
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        tipo = request.args.get('tipo')
        nro = request.args.get('nro')

        if not tipo or not nro:
            return jsonify({"error": "Faltan parámetros 'tipo' y 'nro'"}), 400

        c = sistema.buscar_cliente_por_documento(tipo, nro, usuario)
        
        if c:
            respuesta = {
                "id_cliente": c.id_cliente,
                "id_persona": c.id_persona,
                "nombre": c.nombre,
                "apellido": c.apellido,
                "mail": c.mail,
                "telefono": c.telefono,
                "nro_documento": c.nro_documento,
                "fecha_nacimiento": str(c.fecha_nacimiento),
                "fecha_alta": str(c.fecha_alta),
                "tipo_documento": c.tipo_documento.descripcion if c.tipo_documento else None
            }
            return jsonify(respuesta), 200
            
        return jsonify({"error": "Cliente no encontrado"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/clientes/<id_cliente>', methods=['PUT'])
def actualizar_cliente(id_cliente):
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        data = request.get_json()
        exito = sistema.actualizar_datos_cliente(id_cliente, data, usuario)
        
        if exito:
            return jsonify({"mensaje": "Datos del cliente actualizados"}), 200
        return jsonify({"error": "No se pudo actualizar (Permisos o Cliente no encontrado)"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/clientes/<id_cliente>', methods=['DELETE'])
def eliminar_cliente(id_cliente):
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        exito = sistema.eliminar_cliente(id_cliente, usuario)
        
        if exito:
            return jsonify({"mensaje": "Cliente eliminado exitosamente"}), 200
        return jsonify({"error": "No se pudo eliminar (Permisos o tiene alquileres asociados)"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ============================
#   EMPLEADOS - CRUD
# ============================

@api.route('/empleados', methods=['POST'])
def crear_empleado():
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        data = request.get_json()
        id_creado = sistema.crear_empleado(data, usuario)

        if id_creado:
            return jsonify({
                "mensaje": "Empleado creado exitosamente",
                "id_empleado": id_creado
            }), 201

        return jsonify({"error": "No se pudo crear el empleado"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/empleados', methods=['GET'])
def listar_empleados():
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        lista = sistema.listar_todos_los_empleados(usuario)
        respuesta = []

        for e in lista:
            respuesta.append({
                "id_empleado": e.id_empleado,
                "id_persona": e.id_persona,
                "nombre": e.nombre,
                "apellido": e.apellido,
                "mail": e.mail,
                "telefono": e.telefono,
                "nro_documento": e.nro_documento,
                "fecha_nacimiento": str(e.fecha_nacimiento),
                "fecha_alta": str(e.fecha_alta),
                "sueldo": e.sueldo,
                "tipo_documento": e.tipo_documento.descripcion if e.tipo_documento else None,
                "id_tipo_documento": e.tipo_documento.id_tipo if e.tipo_documento else None
            })

        return jsonify(respuesta), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/empleados/<id_empleado>', methods=['GET'])
def obtener_empleado_por_id(id_empleado):
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        e = sistema.buscar_empleado_por_id(id_empleado, usuario)

        if e:
            respuesta = {
                "id_empleado": e.id_empleado,
                "id_persona": e.id_persona,
                "nombre": e.nombre,
                "apellido": e.apellido,
                "mail": e.mail,
                "telefono": e.telefono,
                "nro_documento": e.nro_documento,
                "fecha_nacimiento": str(e.fecha_nacimiento),
                "fecha_alta": str(e.fecha_alta),
                "sueldo": e.sueldo,
                "tipo_documento": e.tipo_documento.descripcion if e.tipo_documento else None,
                "id_tipo_documento": e.tipo_documento.id_tipo if e.tipo_documento else None
            }
            return jsonify(respuesta), 200

        return jsonify({"error": "Empleado no encontrado"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/empleados/buscar', methods=['GET'])
def buscar_empleado_por_documento():
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        tipo = request.args.get('tipo')
        nro = request.args.get('nro')

        if not tipo or not nro:
            return jsonify({"error": "Faltan parámetros 'tipo' y 'nro'"}), 400

        e = sistema.buscar_empleado_por_documento(tipo, nro, usuario)

        if e:
            respuesta = {
                "id_empleado": e.id_empleado,
                "id_persona": e.id_persona,
                "nombre": e.nombre,
                "apellido": e.apellido,
                "mail": e.mail,
                "telefono": e.telefono,
                "nro_documento": e.nro_documento,
                "fecha_nacimiento": str(e.fecha_nacimiento),
                "fecha_alta": str(e.fecha_alta),
                "sueldo": e.sueldo,
                "tipo_documento": e.tipo_documento.descripcion if e.tipo_documento else None
            }
            return jsonify(respuesta), 200

        return jsonify({"error": "Empleado no encontrado"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/empleados/<id_empleado>', methods=['PUT'])
def actualizar_empleado(id_empleado):
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        data = request.get_json()
        exito = sistema.actualizar_datos_empleado(id_empleado, data, usuario)

        if exito:
            return jsonify({"mensaje": "Datos del empleado actualizados"}), 200

        return jsonify({"error": "No se pudo actualizar (Permisos o empleado no encontrado)"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/empleados/<id_empleado>', methods=['DELETE'])
def eliminar_empleado(id_empleado):
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        exito = sistema.eliminar_empleado(id_empleado, usuario)

        if exito:
            return jsonify({"mensaje": "Empleado eliminado exitosamente"}), 200

        return jsonify({"error": "No se pudo eliminar (Permisos o tiene alquileres asociados)"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Endpoints Gestión Alquileres ---

@api.route('/alquileres', methods=['POST'])
def crear_alquiler():
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        data = request.get_json()
        print(data)
        # Si viene userId, buscar el id_cliente correspondiente
        id_cliente = data.get('id_cliente')
        if not id_cliente and data.get('userId'):
            print("Hola")
            id_cliente = sistema.get_cliente_por_usuario(data.get('userId'))
            if not id_cliente:
                return jsonify({"error": "No se encontró el cliente asociado al usuario"}), 400
        
        # Validar que tenemos un id_cliente
        if not id_cliente:
            return jsonify({"error": "Se requiere id_cliente o userId"}), 400
        
        exito = sistema.crear_nuevo_alquiler(
            data.get('patente'),
            id_cliente,  # Usar el id_cliente obtenido
            data.get('id_empleado'),
            data.get('fecha_inicio'),
            data.get('fecha_fin'),
            data.get('estado', 'RESERVADO'),
            usuario
        )
        
        if exito:
            return jsonify({"mensaje": "Alquiler creado exitosamente"}), 201
        return jsonify({"error": "No se pudo crear (Validación de fechas, auto ocupado o permisos)"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/alquileres/<id_alquiler>/comenzar', methods=['POST'])
def comenzar_alquiler(id_alquiler):
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        exito = sistema.comenzar_alquiler(id_alquiler, usuario)
        
        if exito:
            return jsonify({"mensaje": "Alquiler iniciado (Estado Activo)"}), 200
        return jsonify({"error": "No se pudo iniciar (No es reservado o permisos insuficientes)"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/alquileres/<id_alquiler>/cancelar', methods=['POST'])
def cancelar_alquiler(id_alquiler):
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        exito = sistema.cancelar_alquiler(id_alquiler, usuario)
        
        if exito:
            return jsonify({"mensaje": "Alquiler cancelado"}), 200
        return jsonify({"error": "No se pudo cancelar (Ya iniciado o permisos insuficientes)"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/alquileres/<id_alquiler>/finalizar', methods=['POST'])
def finalizar_alquiler(id_alquiler):
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        exito = sistema.finalizar_alquiler(id_alquiler, usuario)
        
        if exito:
            return jsonify({"mensaje": "Alquiler finalizado. Vehículo liberado"}), 200
        return jsonify({"error": "No se pudo finalizar (Estado incorrecto o permisos insuficientes)"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/alquileres/<id_alquiler>/atrasado', methods=['POST'])
def marcar_alquiler_atrasado(id_alquiler):
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        exito = sistema.marcar_alquiler_como_atrasado(id_alquiler, usuario)
        
        if exito:
            return jsonify({"mensaje": "Alquiler marcado como atrasado"}), 200
        return jsonify({"error": "No se pudo marcar (Fecha fin no superada o permisos insuficientes)"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@api.route('/alquileres', methods=['GET'])
def listar_alquileres():
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        # Usar el nuevo método que filtra según el rol
        lista = sistema.consultar_alquileres_usuario(usuario)
        return jsonify(lista), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/alquileres/<id_alquiler>', methods=['GET'])
def obtener_alquiler_por_id(id_alquiler):
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        alquiler = sistema.consultar_alquiler_por_id(id_alquiler, usuario)
        
        if alquiler:
            return jsonify(alquiler), 200
        
        return jsonify({"error": "Alquiler no encontrado o acceso denegado"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@api.route('/alquileres/<id_alquiler>', methods=['DELETE'])
def eliminar_alquiler(id_alquiler):
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        exito = sistema.eliminar_alquiler(id_alquiler, usuario)
        
        if exito:
            return jsonify({"mensaje": "Alquiler eliminado exitosamente"}), 200
        return jsonify({"error": "No se pudo eliminar (Permisos insuficientes o no encontrado)"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# --- Endpoints Gestión de Daños ---

@api.route('/alquileres/<id_alquiler>/danios', methods=['POST'])
def crear_danio(id_alquiler):
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        data = request.get_json()
        print(data)
        costo = data.get('costo')
        detalle = data.get('detalle')

        if not costo or not detalle:
             return jsonify({"error": "Faltan datos (costo, detalle)"}), 400

        exito = sistema.registrar_danio(id_alquiler, costo, detalle, usuario)
        
        if exito:
            return jsonify({"mensaje": "Daño registrado exitosamente"}), 201
        return jsonify({"error": "No se pudo registrar (Permisos insuficientes o alquiler no encontrado)"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/danios/<id_danio>', methods=['DELETE'])
def eliminar_danio(id_danio):
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        exito = sistema.eliminar_danio(id_danio, usuario)
        
        if exito:
            return jsonify({"mensaje": "Daño eliminado exitosamente"}), 200
        return jsonify({"error": "No se pudo eliminar (Permisos insuficientes o daño no encontrado)"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@api.route('/alquileres/<id_alquiler>/danios', methods=['GET'])
def listar_danios_alquiler(id_alquiler):
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        lista = sistema.consultar_danios_alquiler(id_alquiler, usuario)
        return jsonify(lista), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Endpoints Gestión de Multas ---

@api.route('/alquileres/<id_alquiler>/multas', methods=['POST'])
def crear_multa(id_alquiler):
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        data = request.get_json()
        costo = data.get('costo')
        detalle = data.get('detalle')
        fecha_multa = data.get('fecha_multa') # Debe ser string ISO (YYYY-MM-DDTHH:MM:SS)

        if not costo or not detalle or not fecha_multa:
             return jsonify({"error": "Faltan datos (costo, detalle, fecha_multa)"}), 400

        exito = sistema.registrar_multa(id_alquiler, costo, detalle, fecha_multa, usuario)
        
        if exito:
            return jsonify({"mensaje": "Multa registrada exitosamente"}), 201
        return jsonify({"error": "No se pudo registrar (Permisos insuficientes o alquiler no encontrado)"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/multas/<id_multa>', methods=['DELETE'])
def eliminar_multa(id_multa):
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        exito = sistema.eliminar_multa(id_multa, usuario)
        
        if exito:
            return jsonify({"mensaje": "Multa eliminada exitosamente"}), 200
        return jsonify({"error": "No se pudo eliminar (Permisos insuficientes o multa no encontrada)"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@api.route('/alquileres/<id_alquiler>/multas', methods=['GET'])
def listar_multas_alquiler(id_alquiler):
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        lista = sistema.consultar_multas_alquiler(id_alquiler, usuario)
        return jsonify(lista), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@api.route('/mantenimientos', methods=['GET'])
def listar_mantenimientos():
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        lista = sistema.listar_todos_mantenimientos(usuario)
        return jsonify(lista), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/mantenimientos/<id_mantenimiento>', methods=['GET'])
def obtener_mantenimiento(id_mantenimiento):
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        mant = sistema.consultar_mantenimiento_por_id(id_mantenimiento, usuario)
        if mant:
            return jsonify(mant), 200
        return jsonify({"error": "Mantenimiento no encontrado o acceso denegado"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/mantenimientos', methods=['POST'])
def programar_mantenimiento():
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        data = request.get_json()
        patente = data.get('patente')
        fecha_inicio = data.get('fecha_inicio')
        fecha_fin = data.get('fecha_fin')
        detalle = data.get('detalle')

        exito = sistema.programar_mantenimiento(patente, fecha_inicio, fecha_fin, detalle, usuario)
        
        if exito:
            return jsonify({"mensaje": "Mantenimiento programado (Pendiente)"}), 201
        return jsonify({"error": "No se pudo programar (Fechas ocupadas o permisos insuficientes)"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/mantenimientos/<id_mantenimiento>/iniciar', methods=['POST'])
def iniciar_mantenimiento(id_mantenimiento):
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        if sistema.iniciar_mantenimiento(id_mantenimiento, usuario):
            return jsonify({"mensaje": "Mantenimiento iniciado"}), 200
        return jsonify({"error": "No se pudo iniciar"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/mantenimientos/<id_mantenimiento>/finalizar', methods=['POST'])
def finalizar_mantenimiento(id_mantenimiento):
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        if sistema.finalizar_mantenimiento(id_mantenimiento, usuario):
            return jsonify({"mensaje": "Mantenimiento finalizado"}), 200
        return jsonify({"error": "No se pudo finalizar"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/mantenimientos/<id_mantenimiento>/cancelar', methods=['POST'])
def cancelar_mantenimiento(id_mantenimiento):
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        if sistema.cancelar_mantenimiento(id_mantenimiento, usuario):
            return jsonify({"mensaje": "Mantenimiento cancelado"}), 200
        return jsonify({"error": "No se pudo cancelar"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/mantenimientos/<id_mantenimiento>', methods=['DELETE'])
def eliminar_mantenimiento(id_mantenimiento):
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        if sistema.eliminar_mantenimiento(id_mantenimiento, usuario):
            return jsonify({"mensaje": "Mantenimiento eliminado"}), 200
        return jsonify({"error": "No se pudo eliminar (Tal vez está en curso o falta permiso Admin)"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# --- Endpoints Reportes y Estadísticas ---

@api.route('/reportes/cliente/<id_cliente>', methods=['GET'])
def reporte_cliente(id_cliente):
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado"}), 401

        data = sistema.reporte_alquileres_cliente(id_cliente, usuario)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/reportes/ranking-vehiculos', methods=['GET'])
def reporte_ranking():
    try:
        f_desde = request.args.get('fecha_desde', '2000-01-01')
        f_hasta = request.args.get('fecha_hasta', '2100-01-01')
        
        data = sistema.reporte_ranking_vehiculos(f_desde, f_hasta)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/reportes/evolucion-alquileres', methods=['GET'])
def reporte_evolucion():
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado"}), 401

        f_desde = request.args.get('fecha_desde', '2000-01-01')
        f_hasta = request.args.get('fecha_hasta', '2100-01-01')

        data = sistema.reporte_evolucion_alquileres(f_desde, f_hasta, usuario)
        
        if data is None:
            return jsonify({"error": "Permisos insuficientes"}), 403
            
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/reportes/facturacion', methods=['GET'])
def reporte_facturacion():
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado"}), 401

        f_desde = request.args.get('fecha_desde', '2000-01-01')
        f_hasta = request.args.get('fecha_hasta', '2100-01-01')

        data = sistema.reporte_facturacion_mensual(f_desde, f_hasta, usuario)
        
        if data is None:
            return jsonify({"error": "Permisos insuficientes"}), 403
            
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    # En api.py - agregar estos endpoints específicos para PDF

@api.route('/reportes/pdf/detalle-clientes', methods=['GET'])
def generar_pdf_detalle_clientes():
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado"}), 401

        fecha_desde = request.args.get('fecha_desde', '2000-01-01')
        fecha_hasta = request.args.get('fecha_hasta', '2100-01-01')

        data = sistema.reporte_detalle_clientes_pdf(fecha_desde, fecha_hasta, usuario)
        return jsonify(data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/reportes/pdf/alquileres-periodo', methods=['GET'])
def generar_pdf_alquileres_periodo():
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado"}), 401

        fecha_desde = request.args.get('fecha_desde', '2000-01-01')
        fecha_hasta = request.args.get('fecha_hasta', '2100-01-01')
        periodo = request.args.get('periodo', 'mensual')  # mensual, trimestral, anual, semanal

        data = sistema.reporte_alquileres_periodo_pdf(periodo, fecha_desde, fecha_hasta, usuario)
        return jsonify(data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# REUTILIZAMOS los endpoints existentes para los otros reportes
@api.route('/reportes/pdf/ranking-vehiculos', methods=['GET'])
def generar_pdf_ranking_vehiculos():
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado"}), 401

        fecha_desde = request.args.get('fecha_desde', '2000-01-01')
        fecha_hasta = request.args.get('fecha_hasta', '2100-01-01')

        # Reutilizamos la función existente
        data = sistema.reporte_ranking_vehiculos(fecha_desde, fecha_hasta)
        return jsonify(data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/reportes/pdf/facturacion-mensual', methods=['GET'])
def generar_pdf_facturacion_mensual():
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado"}), 401

        fecha_desde = request.args.get('fecha_desde', '2000-01-01')
        fecha_hasta = request.args.get('fecha_hasta', '2100-01-01')

        # Reutilizamos la función existente
        data = sistema.reporte_facturacion_mensual(fecha_desde, fecha_hasta, usuario)
        
        if data is None:
            return jsonify({"error": "Permisos insuficientes"}), 403
            
        return jsonify(data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# En api.py - agregar nuevo endpoint
@api.route('/reportes/pdf/detalle-clientes-completo', methods=['GET'])
def generar_pdf_detalle_clientes_completo():
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado"}), 401

        fecha_desde = request.args.get('fecha_desde', '2000-01-01')
        fecha_hasta = request.args.get('fecha_hasta', '2100-01-01')

        # Esta función debería devolver los datos estructurados con alquileres individuales
        data = sistema.reporte_detalle_clientes_completo_pdf(fecha_desde, fecha_hasta, usuario)
        return jsonify(data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- NUEVOS ENDPOINTS PARA DASHBOARD ---

@api.route('/dashboard/estadisticas', methods=['GET'])
def obtener_estadisticas_dashboard():
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        estadisticas = sistema.obtener_estadisticas_dashboard(usuario)
        return jsonify(estadisticas), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/dashboard/ultimo-alquiler', methods=['GET'])
def obtener_ultimo_alquiler():
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        # Solo disponible para clientes
        if not sistema.check_permission("Cliente", usuario):
            return jsonify({"error": "Solo disponible para clientes"}), 403

        ultimo_alquiler = sistema.obtener_ultimo_alquiler_cliente(usuario)
        
        if ultimo_alquiler:
            return jsonify(ultimo_alquiler), 200
        return jsonify({"mensaje": "No se encontraron alquileres"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/vehiculos/<patente>/disponible', methods=['GET'])
def verificar_vehiculo_disponible(patente):
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        disponible = sistema.verificar_disponibilidad_vehiculo(patente)
        return jsonify({"disponible": disponible}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/usuarios/<id_usuario>', methods=['GET'])
def obtener_usuario_por_id(id_usuario):
    try:
        usuario = sistema.db_manager.get_full_usuario_by_id(id_usuario)
        if usuario:
            return jsonify({
                "id_usuario": usuario.id_usuario,
                "user_name": usuario.user_name,
                "permiso": usuario.permiso.descripcion
            }), 200
        return jsonify({"error": "Usuario no encontrado"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/dashboard/alquileres/empleado', methods=['GET'])
def obtener_alquileres_empleado_dashboard():
    try:
        usuario = obtener_usuario_actual()
        if not usuario or not sistema.check_permission("Empleado", usuario):
            return jsonify({"error": "No autorizado"}), 401

        # Obtener los últimos 10 alquileres gestionados por este empleado
        alquileres = sistema.obtener_alquileres_empleado_dashboard(usuario.id_usuario, limite=10)
        return jsonify(alquileres), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/mi-perfil', methods=['GET'])
def obtener_mi_perfil():
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        # Obtener los datos de la persona asociada al usuario
        persona_data = sistema.obtener_persona_por_usuario(usuario.id_usuario)
        
        if not persona_data:
            return jsonify({"error": "No se encontró el perfil asociado a este usuario"}), 404

        return jsonify(persona_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/mi-perfil', methods=['PUT'])
def actualizar_mi_perfil():
    try:
        usuario = obtener_usuario_actual()
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        data = request.get_json()
        
        # Validar datos requeridos
        campos_requeridos = ['nombre', 'apellido', 'mail', 'telefono', 'fecha_nacimiento', 'tipo_documento_id', 'nro_documento']
        for campo in campos_requeridos:
            if campo not in data:
                return jsonify({"error": f"Falta el campo requerido: {campo}"}), 400

        exito = sistema.actualizar_persona_por_usuario(usuario.id_usuario, data, usuario)
        
        if exito:
            return jsonify({"mensaje": "Perfil actualizado exitosamente"}), 200
        return jsonify({"error": "No se pudo actualizar el perfil"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------------------------------------------------
# EJECUCIÓN
# ---------------------------------------------------------
app.register_blueprint(api, url_prefix='/api')

if __name__ == '__main__':
    print("Iniciando servidor Flask en http://localhost:5000")
    app.run(debug=True, port=5000)