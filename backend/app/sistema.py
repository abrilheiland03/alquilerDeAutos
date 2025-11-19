from db_manager import DBManager
from .models.vehiculo import Vehiculo
from .models.usuario import Usuario
from .models.estadoAuto import EstadoAuto
import hashlib

class SistemaAlquiler:
    def __init__(self):
        self.db_manager = DBManager()

    @staticmethod
    def _hash_password(password):
        return hashlib.sha256(password.encode('utf-8')).hexdigest()

    @staticmethod
    def _verify_password(input_password, stored_hash):
        return SistemaAlquiler._hash_password(input_password) == stored_hash

    def registrar_usuario_cliente(self, data):
        try:
            persona_data = {
                'nombre': data['nombre'], 'apellido': data['apellido'],
                'mail': data['mail'], 'telefono': data['telefono'],
                'fecha_nacimiento': data['fecha_nacimiento'],
                'tipo_documento_id': data['tipo_documento_id'],
                'nro_documento': data['nro_documento']
            }
            
            permiso_id_cliente = 1 
            usuario_data = {
                'user_name': data['user_name'],
                'password_hash': self._hash_password(data['password']),
                'id_permiso': permiso_id_cliente
            }

            role_data = {
                'fecha_alta': data.get('fecha_alta')
            }

            id_persona_creada = self.db_manager.create_full_user(
                persona_data, usuario_data, role_data, 'cliente'
            )

            if id_persona_creada:
                print(f"Usuario cliente creado con ID de persona: {id_persona_creada}")
                return True
            else:
                print("El registro falló.")
                return False
                
        except KeyError as e:
            print(f"Error en los datos de registro: falta la clave {e}")
            return False
        except Exception as e:
            print(f"Error inesperado durante el registro: {e}")
            return False
        
    def registrar_usuario_admin(self, data):
        try:
            persona_data = {
                'nombre': data['nombre'], 'apellido': data['apellido'],
                'mail': data['mail'], 'telefono': data['telefono'],
                'fecha_nacimiento': data['fecha_nacimiento'],
                'tipo_documento_id': data['tipo_documento_id'],
                'nro_documento': data['nro_documento']
            }
            
            permiso_id_admin = 3 
            usuario_data = {
                'user_name': data['user_name'],
                'password_hash': self._hash_password(data['password']),
                'id_permiso': permiso_id_admin
            }

            role_data = {
                'descripcion': data.get('descripcion', 'Admin del sistema')
            }

            id_persona_creada = self.db_manager.create_full_user(
                persona_data, usuario_data, role_data, 'admin'
            )

            if id_persona_creada:
                print(f"Usuario admin creado con ID de persona: {id_persona_creada}")
                return True
            else:
                print("El registro falló.")
                return False
                
        except KeyError as e:
            print(f"Error en los datos de registro: falta la clave {e}")
            return False
        except Exception as e:
            print(f"Error inesperado durante el registro: {e}")
            return False

    def login(self, mail, password):
        user_login_data = self.db_manager.get_user_data_for_login_by_mail(mail)

        if not user_login_data:
            print("Login fallido: Email no encontrado.")
            return False

        stored_hash = user_login_data['password']
        if not self._verify_password(password, stored_hash):
            print("Login fallido: Contraseña incorrecta.")
            return False

        id_usuario = user_login_data['id_usuario']
        usuario_completo = self.db_manager.get_full_usuario_by_id(id_usuario)

        if not usuario_completo:
            print("Error: El usuario existe pero no se pudo cargar el perfil completo.")
            return False

        self.usuario_actual = usuario_completo
        print(f"Login exitoso. Bienvenido {self.usuario_actual.user_name}")
        return True

    def logout(self):
        print(f"Cerrando sesión de {self.usuario_actual.user_name}.")
        self.usuario_actual = None

    def check_permission(self, required_permission_desc):
        if not self.usuario_actual:
            print("Acción fallida: No hay usuario logueado.")
            return False
        
        if self.usuario_actual.permiso.descripcion.upper() == required_permission_desc.upper():
            return True
        else:
            print(f"Acción fallida: Se requiere permiso de '{required_permission_desc}'.")
            return False
    
    def obtener_estado_auto_por_id(self, id_estado: int):
        return self.db_manager.get_estado_auto_by_id(id_estado)
    
    # --- ABMC de CLIENTE ---

    def crear_cliente_mostrador(self, data):
        if not self.check_permission('admin') and not self.check_permission('empleado'):
            return None
        
        try:
            persona_data = {
                'nombre': data['nombre'], 'apellido': data['apellido'],
                'mail': data['mail'], 'telefono': data['telefono'],
                'fecha_nacimiento': data['fecha_nacimiento'],
                'tipo_documento_id': data['tipo_documento_id'],
                'nro_documento': data['nro_documento']
            }
            role_data = {
                'fecha_alta': data.get('fecha_alta')
            }

            id_cliente_creado = self.db_manager.create_client_only(
                persona_data, role_data
            )

            if id_cliente_creado:
                print(f"Cliente (mostrador) creado con ID: {id_cliente_creado}")
                return id_cliente_creado
            else:
                print("La creación del cliente falló.")
                return None
                
        except KeyError as e:
            print(f"Error en los datos de creación: falta la clave {e}")
            return None
        except Exception as e:
            print(f"Error inesperado durante la creación: {e}")
            return None

    def buscar_cliente_por_id(self, id_cliente):
        if not self.check_permission('admin') and not self.check_permission('empleado'):
            return None
            
        cliente = self.db_manager.get_client_by_id(id_cliente)
        
        if not cliente:
            print(f"No se encontró cliente con ID: {id_cliente}")
            return None
        
        return cliente

    def buscar_cliente_por_documento(self, tipo_documento_id, nro_documento):
        if not self.check_permission('admin') and not self.check_permission('empleado'):
            return None
            
        cliente = self.db_manager.get_client_by_document(tipo_documento_id, nro_documento)
        
        if not cliente:
            print(f"No se encontró cliente con documento: {tipo_documento_id} / {nro_documento}")
            return None
        
        return cliente

    def listar_todos_los_clientes(self):
        if not self.check_permission('admin') and not self.check_permission('empleado'):
            return []
        
        return self.db_manager.get_all_clients()

    def actualizar_datos_cliente(self, id_cliente, data):
        if not self.check_permission('admin') and not self.check_permission('empleado'):
            return False
            
        try:
            persona_data = {
                'nombre': data['nombre'], 'apellido': data['apellido'],
                'mail': data['mail'], 'telefono': data['telefono'],
                'fecha_nacimiento': data['fecha_nacimiento'],
                'tipo_documento_id': data['tipo_documento_id'],
                'nro_documento': data['nro_documento']
            }
            
            exito = self.db_manager.update_client_persona_data(id_cliente, persona_data)
            
            if exito:
                print(f"Datos del cliente {id_cliente} actualizados.")
                return True
            else:
                print(f"No se pudo actualizar al cliente {id_cliente} (o no hubo cambios).")
                return False

        except KeyError as e:
            print(f"Error en los datos de actualización: falta la clave {e}")
            return False
        except Exception as e:
            print(f"Error inesperado durante la actualización: {e}")
            return False

    def eliminar_cliente(self, id_cliente):
        if not self.check_permission('admin') and not self.check_permission('empleado'):
            return False
            
        exito = self.db_manager.delete_client_full(id_cliente)
        
        if exito:
            print(f"Cliente {id_cliente} eliminado exitosamente.")
            return True
        else:
            print(f"No se pudo eliminar al cliente {id_cliente}.")
            return False
        
    # --- ABMC de VEHICULOS ---

    def listar_vehiculos(self):
        return self.db_manager.get_all_vehiculos()

    def buscar_vehiculo_por_matricula(self, patente):
        return self.db_manager.get_vehiculo_by_patente(patente)

    def crear_vehiculo(self, data):
        if not self.check_permission("Admin"):
            return False
        try:
            exito = self.db_manager.create_vehiculo(data)
            if exito:
                print(f"Vehiculo {data['patente']} creado.")
            return data['patente']
        except KeyError as e:
            print(f"Error en datos de vehiculo: falta la clave {e}")
            return False
        except Exception as e:
            print(f"Error inesperado al crear vehiculo: {e}")
            return False

    def actualizar_vehiculo(self, patente, data):
        if not (self.check_permission("Admin") or self.check_permission("Empleado")):
            return False
        try:
            exito = self.db_manager.update_vehiculo(patente, data)
            if exito:
                print(f"Vehiculo {patente} actualizado.")
            else:
                print(f"No se actualizó vehiculo {patente} (no se encontró o no hubo cambios).")
            return exito
        except KeyError as e:
            print(f"Error en datos de vehiculo: falta la clave {e}")
            return False
        except Exception as e:
            print(f"Error inesperado al actualizar vehiculo: {e}")
            return False

    def eliminar_vehiculo(self, patente):
        if not self.check_permission("Admin"):
            return False
        try:
            exito = self.db_manager.delete_vehiculo(patente)
            if exito:
                print(f"Vehiculo {patente} eliminado.")
            else:
                print(f"No se pudo eliminar vehiculo {patente} (no encontrado o con dependencias).")
            return exito
        except Exception as e:
            print(f"Error inesperado al eliminar vehiculo: {e}")
            return False
        
    # --- BUSCAR VEHICULOS LIBRES ---

    def listar_vehiculos_libres(self):
        return self.db_manager.get_vehiculos_libres()