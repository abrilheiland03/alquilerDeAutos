from datetime import date
from sistema import SistemaAlquiler

sistema = SistemaAlquiler()

#print(sistema.obtener_estado_auto_por_id(1).descripcion)

data_usuario = sistema.login('juan@email.com', '12345')
if data_usuario:
    print(f"Login con usuario: {sistema.usuario_actual.permiso.descripcion}")