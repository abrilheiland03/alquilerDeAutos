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

@api.route('/clientes', methods=['GET'])
def api_listar_clientes():
    try:
        usuario = obtener_usuario_actual()
        
        if not usuario:
            return jsonify({"error": "No autorizado. Falta header user-id"}), 401

        lista_clientes = sistema.listar_todos_los_clientes(usuario)
        
        respuesta = []
        for c in lista_clientes:
            respuesta.append({
                "id_cliente": c.id_cliente,
                "id_persona": c.id_persona,
                "nombre": c.nombre,
                "apellido": c.apellido,
                "nro_documento": c.nro_documento,
                "mail": c.mail,
                "telefono": c.telefono,
                "fecha_alta": str(c.fecha_alta),
                "tipo_documento": c.tipo_documento.descripcion if c.tipo_documento else None
            })
            
        return jsonify(respuesta), 200

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

# ---------------------------------------------------------
# EJECUCIÓN
# ---------------------------------------------------------
app.register_blueprint(api, url_prefix='/api')

if __name__ == '__main__':
    print("Iniciando servidor Flask en http://localhost:5000")
    app.run(debug=True, port=5000)