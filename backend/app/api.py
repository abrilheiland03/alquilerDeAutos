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

@app.route('/estados-auto', methods=['GET'])
def obtener_estados_auto():

    try:
        lista_estados = sistema.db_manager.get_all_estados_auto()
        respuesta = []
        for estado in lista_estados:
            respuesta.append({
                "id_estado": estado.id_estado,
                "descripcion": estado.descripcion
            })
            
        return jsonify(respuesta), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------------------------------------------------------
# EJECUCIÓN
# ---------------------------------------------------------
if __name__ == '__main__':
    print("Iniciando servidor Flask en http://localhost:5000")
    app.run(debug=True, port=5000)