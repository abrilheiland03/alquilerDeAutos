from db_manager import DBManager
from modelos import Vehiculo, Usuario, EstadoAuto
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
        
        if self.usuario_actual.permiso.descripcion == required_permission_desc:
            return True
        else:
            print(f"Acción fallida: Se requiere permiso de '{required_permission_desc}'.")
            return False
    
    def obtener_estado_auto_por_id(self, id_estado: int):
        return self.db_manager.get_estado_auto_by_id(id_estado)