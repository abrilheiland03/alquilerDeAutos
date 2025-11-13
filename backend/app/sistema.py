from db_manager import DBManager
from modelos import Vehiculo, Usuario, EstadoAuto

class SistemaAlquiler:
    def __init__(self):
        self.db_manager = DBManager()

    def registrar_nuevo_vehiculo(self, datos_vehiculo: dict, usuario_actual: Usuario):
        
        if usuario_actual.permiso.id_permiso != 3:
            raise PermissionError("El usuario no tiene permisos para crear vehículos.")

        try:
            estado_libre = EstadoAuto(id_estado=1, descripcion='Libre') 
            
            nuevo_vehiculo = Vehiculo(
                patente=datos_vehiculo['patente'],
                marca=datos_vehiculo['marca'],
                modelo=datos_vehiculo['modelo'],
                # ... otros datos ...
                estado=estado_libre
            )
        except ValueError as e:
            raise ValueError(f"Datos del vehículo inválidos: {e}")

        self.db_manager.create_vehiculo(nuevo_vehiculo)
        
        print("Vehículo creado exitosamente.")
        return nuevo_vehiculo
    
    def obtener_estado_auto_por_id(self, id_estado: int):
        return self.db_manager.get_estado_auto_by_id(id_estado)