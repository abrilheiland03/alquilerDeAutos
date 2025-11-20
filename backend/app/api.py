from flask import Flask, jsonify, request
from flask_cors import CORS
from sistema import SistemaAlquiler

app = Flask(__name__)

CORS(app) 

sistema = SistemaAlquiler()

# ---------------------------------------------------------
# RUTAS (ENDPOINTS)
# ---------------------------------------------------------

@app.route('/', methods=['GET'])
def index():
    """Ruta de prueba para ver si el servidor vive."""
    return jsonify({"status": "API de Alquileres funcionando 🚀"})


#---------------------------------------------------------
# GET LISTAS DE CATÁLOGOS
#--------------------------------------------------------


@app.route('/tipos-documento', methods=['GET'])
def obtener_tipos_documento():
    try:
        lista = sistema.listar_tipos_documento()
        return jsonify([{"id_tipo": x.id_tipo, "descripcion": x.descripcion} for x in lista]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/marcas', methods=['GET'])
def obtener_marcas():
    try:
        lista = sistema.listar_marcas()
        return jsonify([{"id_marca": x.id_marca, "descripcion": x.descripcion} for x in lista]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/colores', methods=['GET'])
def obtener_colores():
    try:
        lista = sistema.listar_colores()
        return jsonify([{"id_color": x.id_color, "descripcion": x.descripcion} for x in lista]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/estados-auto', methods=['GET'])
def obtener_estados_auto():
    try:
        lista = sistema.listar_estados_auto()
        return jsonify([{"id_estado": x.id_estado, "descripcion": x.descripcion} for x in lista]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/estados-alquiler', methods=['GET'])
def obtener_estados_alquiler():
    try:
        lista = sistema.listar_estados_alquiler()
        return jsonify([{"id_estado": x.id_estado, "descripcion": x.descripcion} for x in lista]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/estados-mantenimiento', methods=['GET'])
def obtener_estados_mantenimiento():
    try:
        lista = sistema.listar_estados_mantenimiento()
        return jsonify([{"id_estado": x.id_estado, "descripcion": x.descripcion} for x in lista]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/permisos', methods=['GET'])
def obtener_permisos():
    try:
        lista = sistema.listar_permisos()
        return jsonify([{"id_permiso": x.id_permiso, "descripcion": x.descripcion} for x in lista]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------------------------------------------------------
# EJECUCIÓN
# ---------------------------------------------------------
if __name__ == '__main__':
    print("Iniciando servidor Flask en http://localhost:5000")
    app.run(debug=True, port=5000)