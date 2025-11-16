from datetime import date
from sistema import SistemaAlquiler

sistema = SistemaAlquiler()

#print(sistema.obtener_estado_auto_por_id(1).descripcion)

data_usuario = sistema.login('juan@email.com', '12345')


#data_cliente_prueba = {
#    "nombre": "ClienteTemporal",
#    "apellido": "Borrame",
#    "mail": "borrar@temporal.com",
#    "telefono": "000-000000",
#    "fecha_nacimiento": date(1999, 1, 1),
#    "tipo_documento_id": 1,  # Asumiendo 1 = DNI
#    "nro_documento": 99999999, 
#    "fecha_alta": date.today()
#}

#sistema.listar_todos_los_clientes()

#id_cliente = sistema.crear_cliente_mostrador(data_cliente_prueba)
#print(sistema.buscar_cliente_por_documento(1, 99999999).nombre)
#print(sistema.buscar_cliente_por_id(id_cliente).nombre)
#sistema.listar_todos_los_clientes()
#sistema.eliminar_cliente(id_cliente)


data_vehiculo_prueba = {
    "patente": "ab456ab", # Patente única para la prueba
    "modelo": "TestModel",
    "marca": "TestBrand",
    "anio": 2025,
    "precio_flota": 5000.0,
    "asientos": 4,
    "puertas": 5,
    "caja_manual": True,
    "aire_acondicionado": True,
    "id_estado": 1 # Asumiendo que 1 es 'Libre'
}

matricula = sistema.crear_vehiculo(data_vehiculo_prueba)
print(matricula)
print(f"Vehículo creado con ID: {matricula}")
vehiculo = sistema.buscar_vehiculo_por_matricula(matricula)
print(f"Vehículo encontrado: {vehiculo.marca} {vehiculo.modelo} con patente {vehiculo.patente}")
libres = sistema.listar_vehiculos_libres()
for v in libres:
    print(f"Vehículo libre: {v.marca} {v.modelo} con patente {v.patente}")
sistema.eliminar_vehiculo(matricula)