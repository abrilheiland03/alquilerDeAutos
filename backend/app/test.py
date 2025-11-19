from datetime import date
import sqlite3
from sistema import SistemaAlquiler

sistema = SistemaAlquiler()

# Si tenés un usuario cargado en la tabla usuarios:
data_usuario = sistema.login('juan@email.com', '12345')
#print("Login:", data_usuario)


# ---------------------------------
# PRUEBA: CREAR VEHÍCULO
# ---------------------------------

data_vehiculo_prueba = {
    "patente": "ab456ab",
    "modelo": "Etios Hatch",
    "id_marca": 1,
    "anio": 2025,
    "precio_flota": 5000.0,
    "asientos": 4,
    "puertas": 5,
    "caja_manual": True,
    "aire_acondicionado": True,
    "id_estado": 1,
    "id_color": 1
}

# Crear
matricula = sistema.crear_vehiculo(data_vehiculo_prueba)
print("Vehículo creado con patente:", matricula)

# Buscar
vehiculo = sistema.buscar_vehiculo_por_matricula(matricula)
print(f"Vehículo encontrado: {vehiculo.modelo} ({vehiculo.patente})")

# Listar libres
print("\nVehículos libres:")
libres = sistema.listar_vehiculos_libres()
for v in libres:
    print(f"- {v.modelo} ({v.patente})")

# Eliminar
sistema.eliminar_vehiculo(matricula)
print("\nVehículo eliminado:", matricula)

