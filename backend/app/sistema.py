from datetime import date
from db_manager import DBManager
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

    def buscar_vehiculo_por_id(self, patente):
        return self.db_manager.get_vehiculo_by_patente(patente)

    def crear_vehiculo(self, data):
        if not self.check_permission("Admin"):
            return False
        try:
            exito = self.db_manager.create_vehiculo(data)
            if exito:
                print(f"Vehiculo {data['patente']} creado.")
                return data['patente']
            return False
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

    # --- FUNCIONES DE ALQUILER ---

    def crear_nuevo_alquiler(self, patente, id_cliente, fecha_inicio, fecha_fin, estado):
        if not self.usuario_actual:
            print("Debe estar logueado para crear un alquiler.")
            return False

        alquiler_data = {
            'patente': patente,
            'id_cliente': id_cliente,
            'id_empleado': self.usuario_actual.id_usuario, 
            'fecha_inicio': fecha_inicio, 
            'fecha_fin': fecha_fin,
            'estado': estado
        }
        
        if self.db_manager.create_alquiler_transactional(alquiler_data):
            print("Alquiler creado exitosamente.")
            return True
        return False

    def consultar_todos_alquileres(self):
        if not self.usuario_actual:
            return []

        es_admin = self.check_permission("Admin")
        es_empleado = self.check_permission("Empleado")

        if es_admin or es_empleado:
            return self.db_manager.get_all_alquileres()
        else:
            return self.db_manager.get_all_alquileres(id_persona_filtro=self.usuario_actual.id_persona)

    def consultar_alquiler_por_id(self, id_alquiler):
        if not self.usuario_actual:
            return None

        alquiler = self.db_manager.get_alquiler_by_id(id_alquiler)
        if not alquiler:
            print("Alquiler no encontrado.")
            return None

        es_admin = self.check_permission("Admin")
        es_empleado = self.check_permission("Empleado")

        if es_admin or es_empleado:
            return alquiler
        
        if alquiler['id_persona_cliente'] == self.usuario_actual.id_persona:
            return alquiler
        
        print("No tiene permisos para ver este alquiler.")
        return None

    def actualizar_estado_alquiler(self, id_alquiler, nuevo_id_estado):
        es_admin = self.check_permission("Admin")
        es_empleado = self.check_permission("Empleado")

        if not (es_admin or es_empleado):
            print("Se requiere permiso de Admin o Empleado.")
            return False
        
        if self.db_manager.update_alquiler_estado_only(id_alquiler, nuevo_id_estado):
            print(f"Estado del alquiler {id_alquiler} actualizado.")
            return True
        print("No se pudo actualizar el alquiler.")
        return False

    def eliminar_alquiler(self, id_alquiler):
        if not self.check_permission("Admin"):
            print("Se requiere permiso de Admin.")
            return False
        
        if self.db_manager.delete_alquiler(id_alquiler):
            print(f"Alquiler {id_alquiler} eliminado.")
            return True
        print("No se pudo eliminar el alquiler.")
        return False

    def marcar_alquiler_como_atrasado(self, id_alquiler):
        if not self.check_permission_admin_or_empleado():
            return False

        alquiler = self.db_manager.get_alquiler_by_id(id_alquiler)
        if not alquiler:
            print("Alquiler no encontrado.")
            return False

        ESTADOS_FINALES = [4, 5]
        if alquiler['id_estado'] in ESTADOS_FINALES:
            print("El alquiler ya está finalizado o cancelado.")
            return False

        fecha_fin = date.fromisoformat(alquiler['fecha_fin'])
        hoy = date.today()

        if hoy > fecha_fin:
            if self.db_manager.update_alquiler_estado_only(id_alquiler, 3):
                print(f"Alquiler {id_alquiler} marcado como ATRASADO.")
                return True
        else:
            print(f"No se puede marcar atrasado. La fecha de fin ({fecha_fin}) aún no ha pasado.")
        
        return False

    def finalizar_alquiler(self, id_alquiler):
        if not self.check_permission_admin_or_empleado():
            return False

        alquiler = self.db_manager.get_alquiler_by_id(id_alquiler)
        if not alquiler:
            print("Alquiler no encontrado.")
            return False

        if alquiler['id_estado'] not in [2, 3]:
            print(f"No se puede finalizar. El estado actual es: {alquiler['estado_desc']}")
            return False

        if self.db_manager.finalize_or_cancel_alquiler(id_alquiler, 4):
            print(f"Alquiler {id_alquiler} FINALIZADO. Vehículo liberado.")
            return True
        
        return False

    def cancelar_alquiler(self, id_alquiler):
        if not self.usuario_actual:
            print("Debe estar logueado para cancelar.")
            return False

        alquiler = self.db_manager.get_alquiler_by_id(id_alquiler)
        if not alquiler:
            print("Alquiler no encontrado.")
            return False

        es_admin = self.check_permission("Admin")
        es_empleado = self.check_permission("Empleado")
        
        if not (es_admin or es_empleado):
            if alquiler['id_persona_cliente'] != self.usuario_actual.id_persona:
                print("No tiene permiso para cancelar este alquiler (no le pertenece).")
                return False

        if alquiler['id_estado'] in [2,3, 4, 5]:
            print("El alquiler ya comenzó, no se puede cancelar.")
            return False

        if self.db_manager.finalize_or_cancel_alquiler(id_alquiler, 5):
            print(f"Alquiler {id_alquiler} CANCELADO. Vehículo liberado.")
            return True
        
        return False
    
    def comenzar_alquiler(self, id_alquiler):
        es_admin = self.check_permission("Admin")
        es_empleado = self.check_permission("Empleado")
        
        if not (es_admin or es_empleado):
            print("Se requiere permiso de Admin o Empleado.")
            return False

        if self.db_manager.start_reserved_rental(id_alquiler):
            print(f"Alquiler {id_alquiler} iniciado (Pasó de Reservado a Activo).")
            return True
        else:
            print(f"No se pudo iniciar el alquiler {id_alquiler}. Verifique que exista y esté en estado 'Reservado'.")
            return False
    
    # --- FUNCIONES DE DANIO ---

    def registrar_danio(self, id_alquiler, costo, detalle):
        es_admin = self.check_permission("Admin")
        es_empleado = self.check_permission("Empleado")
        
        if not (es_admin or es_empleado):
            print("Se requiere permiso de Admin o Empleado.")
            return False
        
        data = {
            'id_alquiler': id_alquiler,
            'costo': costo,
            'detalle': detalle
        }
        if self.db_manager.create_danio(data):
            print("Daño registrado exitosamente.")
            return True
        return False

    def consultar_danios_alquiler(self, id_alquiler):
        if not self.usuario_actual:
            return []

        alquiler = self.db_manager.get_alquiler_by_id(id_alquiler)
        if not alquiler:
            print("Alquiler no encontrado.")
            return []

        es_admin = self.check_permission("Admin")
        es_empleado = self.check_permission("Empleado")

        if not (es_admin or es_empleado):
            if alquiler['id_persona_cliente'] != self.usuario_actual.id_persona:
                print("No tiene permisos para ver daños de este alquiler.")
                return []

        return self.db_manager.get_danios_by_alquiler(id_alquiler)

    def modificar_danio(self, id_danio, costo, detalle):
        es_admin = self.check_permission("Admin")
        es_empleado = self.check_permission("Empleado")
        
        if not (es_admin or es_empleado):
            print("Se requiere permiso de Admin o Empleado.")
            return False
        
        data = {'costo': costo, 'detalle': detalle}
        if self.db_manager.update_danio(id_danio, data):
            print("Daño actualizado.")
            return True
        return False

    def eliminar_danio(self, id_danio):
        es_admin = self.check_permission("Admin")
        es_empleado = self.check_permission("Empleado")
        
        if not (es_admin or es_empleado):
            print("Se requiere permiso de Admin o Empleado.")
            return False
        
        if self.db_manager.delete_danio(id_danio):
            print("Daño eliminado.")
            return True
        return False

    # --- FUNCIONES DE MULTA ---

    def registrar_multa(self, id_alquiler, costo, detalle, fecha_multa):
        es_admin = self.check_permission("Admin")
        es_empleado = self.check_permission("Empleado")
        
        if not (es_admin or es_empleado):
            print("Se requiere permiso de Admin o Empleado.")
            return False
        
        data = {
            'alquiler_id': id_alquiler,
            'costo': costo,
            'detalle': detalle,
            'fecha_multa': fecha_multa
        }
        if self.db_manager.create_multa(data):
            print("Multa registrada exitosamente.")
            return True
        return False

    def consultar_multas_alquiler(self, id_alquiler):
        if not self.usuario_actual:
            return []

        alquiler = self.db_manager.get_alquiler_by_id(id_alquiler)
        if not alquiler:
            print("Alquiler no encontrado.")
            return []

        es_admin = self.check_permission("Admin")
        es_empleado = self.check_permission("Empleado")

        if not (es_admin or es_empleado):
            if alquiler['id_persona_cliente'] != self.usuario_actual.id_persona:
                print("No tiene permisos para ver multas de este alquiler.")
                return []

        return self.db_manager.get_multas_by_alquiler(id_alquiler)

    def modificar_multa(self, id_multa, costo, detalle, fecha_multa):
        es_admin = self.check_permission("Admin")
        es_empleado = self.check_permission("Empleado")
        
        if not (es_admin or es_empleado):
            print("Se requiere permiso de Admin o Empleado.")
            return False
        
        data = {
            'costo': costo, 
            'detalle': detalle, 
            'fecha_multa': fecha_multa
        }
        if self.db_manager.update_multa(id_multa, data):
            print("Multa actualizada.")
            return True
        return False

    def eliminar_multa(self, id_multa):
        es_admin = self.check_permission("Admin")
        es_empleado = self.check_permission("Empleado")
        
        if not (es_admin or es_empleado):
            print("Se requiere permiso de Admin o Empleado.")
            return False
        
        if self.db_manager.delete_multa(id_multa):
            print("Multa eliminada.")
            return True
        return False
    
    # --- FUNCIONES DE MANTENIMIENTO ---

    def programar_mantenimiento(self, patente, fecha_inicio, fecha_fin_estimada, detalle):
        es_admin = self.check_permission("Admin")
        es_empleado = self.check_permission("Empleado")
        
        if not (es_admin or es_empleado):
            print("Se requiere permiso de Admin o Empleado.")
            return False
        
        data = {
            'patente': patente,
            'id_empleado': self.usuario_actual.id_usuario,
            'fecha_inicio': fecha_inicio,
            'fecha_fin': fecha_fin_estimada,
            'detalle': detalle
        }

        if self.db_manager.schedule_mantenimiento(data):
            print("Mantenimiento programado exitosamente (Pendiente).")
            return True
        return False

    def iniciar_mantenimiento(self, id_mantenimiento):
        es_admin = self.check_permission("Admin")
        es_empleado = self.check_permission("Empleado")
        
        if not (es_admin or es_empleado):
            print("Se requiere permiso de Admin o Empleado.")
            return False

        if self.db_manager.start_mantenimiento(id_mantenimiento):
            print("Mantenimiento iniciado. Vehículo puesto 'En Mantenimiento'.")
            return True
        print("No se pudo iniciar el mantenimiento.")
        return False

    def finalizar_mantenimiento(self, id_mantenimiento):
        es_admin = self.check_permission("Admin")
        es_empleado = self.check_permission("Empleado")
        
        if not (es_admin or es_empleado):
            print("Se requiere permiso de Admin o Empleado.")
            return False

        if self.db_manager.finish_mantenimiento(id_mantenimiento):
            print("Mantenimiento finalizado. Vehículo liberado.")
            return True
        print("No se pudo finalizar el mantenimiento.")
        return False

    def cancelar_mantenimiento(self, id_mantenimiento):
        es_admin = self.check_permission("Admin")
        es_empleado = self.check_permission("Empleado")
        
        if not (es_admin or es_empleado):
            print("Se requiere permiso de Admin o Empleado.")
            return False

        if self.db_manager.cancel_pending_mantenimiento(id_mantenimiento):
            print("Mantenimiento cancelado.")
            return True
        print("No se pudo cancelar (Tal vez ya no está pendiente).")
        return False