from datetime import date, datetime
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
        
    def registrar_usuario_empleado(self, data):
        try:
            # Datos de usuario, con hash de la contraseña
            usuario_data = {
                'user_name': data['usuario']['user_name'],
                'password_hash': self._hash_password(data['usuario']['password']),
                'id_permiso': data['usuario']['id_permiso']
            }

            persona_data = {
                'nombre': data['persona']['nombre'],
                'apellido': data['persona']['apellido'],
                'mail': data['persona']['mail'],
                'telefono': data['persona']['telefono'],
                'fecha_nac': data['persona']['fecha_nac'],
                'tipo_documento': data['persona']['tipo_documento'],
                'nro_documento': data['persona']['nro_documento']
            }

            role_data = {
                'sueldo': data['role']['sueldo'],
                'horario': data['role']['horario'],
                'fecha_alta': data['role']['fecha_alta']
            }

            # Crear el empleado en la BD
            id_empleado = self.db_manager.create_empleado(
                persona_data, usuario_data, role_data
            )

            return id_empleado  # API devolverá el ID

        except Exception as e:
            print("Error registrando empleado:", e)
            return None

    def login(self, mail, password):
        user_login_data = self.db_manager.get_user_data_for_login_by_mail(mail)

        if not user_login_data:
            print("Login fallido: Email no encontrado.")
            return None

        stored_hash = user_login_data['password']

        # Si la contraseña no está hasheada, la guardamos hasheada
        if not self._verify_password(password, stored_hash):
            if stored_hash == password:  # Detecta password no hasheado
                print("Login exitoso (contraseña no hasheada).")
                hashed = self._hash_password(password)
                success = self.db_manager.actualizar_usuario(user_login_data['id_usuario'], {'password_hash': hashed})
                if not success:
                    print("Error actualizando contraseña en la base de datos.")
            else:
                print("Login fallido: Contraseña incorrecta.")
                return None

        id_usuario = user_login_data['id_usuario']
        usuario_completo = self.db_manager.get_full_usuario_by_id(id_usuario)

        if not usuario_completo:
            print("Error: El usuario existe pero no se pudo cargar el perfil completo.")
            return None

        self.usuario_actual = usuario_completo
        print(f"Login exitoso. Bienvenido {self.usuario_actual.user_name}")
        return usuario_completo


    def logout(self):
        print(f"Cerrando sesión de {self.usuario_actual.user_name}.")
        self.usuario_actual = None

    def check_permission(self, required_permission_desc, usuario=None):
        if not usuario:
            print("Acción fallida: No hay usuario logueado.")
            return False
        
        if usuario.permiso.descripcion.upper() == required_permission_desc.upper():
            return True
        else:
            
            return False
    
    def eliminar_usuario(self, id_usuario_eliminar, usuario_solicitante):
        if not self.check_permission("Admin", usuario_solicitante):
            print("Se requiere permiso de Admin para eliminar usuarios.")
            return False
        
        if str(id_usuario_eliminar) == str(usuario_solicitante.id_usuario):
            print("No puedes eliminarte a ti mismo.")
            return False

        if self.db_manager.delete_user_full(id_usuario_eliminar):
            print(f"Usuario {id_usuario_eliminar} eliminado correctamente.")
            return True
        
        return False

    #--modificar usuario--
    # In sistema.py, add this method to the SistemaAlquiler class
    def actualizar_usuario(self, user_id, update_data, usuario_actual=None):
        """
        Actualiza la información de un usuario.
        
        Args:
            user_id: ID del usuario a actualizar
            update_data: Diccionario con los campos a actualizar (puede incluir 'user_name' y/o 'password')
            usuario_actual: Usuario que realiza la operación (opcional para verificación de permisos)
        
        Returns:
            bool: True si la actualización fue exitosa, False en caso contrario
        """
        try:
            # Verificar que el usuario existe
            usuario = self.db_manager.get_full_usuario_by_id(user_id)
            if not usuario:
                print(f"Usuario con ID {user_id} no encontrado")
                return False
            
            # Si se proporciona un usuario_actual, verificar permisos
            if usuario_actual:
                # El usuario solo puede actualizar su propio perfil o ser admin
                if usuario_actual.id_usuario != user_id and not self.check_permission("Admin", usuario_actual):
                    print("No tiene permisos para actualizar este usuario")
                    return False
            
            # Preparar los datos para actualizar
            update_fields = {}
            
            # Actualizar nombre de usuario si se proporciona
            if 'user_name' in update_data and update_data['user_name']:
                update_fields['user_name'] = update_data['user_name']
            
            # Actualizar contraseña si se proporciona la actual y la nueva
            if 'current_password' in update_data and 'new_password' in update_data:
                # Verificar que la contraseña actual sea correcta
                if not self._verify_password(update_data['current_password'], usuario.password):
                    print("La contraseña actual no es correcta")
                    return False
                
                # Actualizar la contraseña (usando 'password' en lugar de 'password_hash')
                update_fields['password'] = self._hash_password(update_data['new_password'])
            
            # Si no hay nada que actualizar, retornar True
            if not update_fields:
                return True
            
            # Actualizar en la base de datos
            return self.db_manager.actualizar_usuario(user_id, update_fields)
        
        except Exception as e:
            print(f"Error al actualizar usuario: {e}")
            return False
    def obtener_estado_auto_por_id(self, id_estado: int):
        return self.db_manager.get_estado_auto_by_id(id_estado)
    
    # --- ABMC de CLIENTE ---

    def crear_cliente_mostrador(self, data, usuario):
        if not self.check_permission('admin', usuario) and not self.check_permission('empleado', usuario):
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

    def buscar_cliente_por_id(self, id_cliente, usuario):
        if not self.check_permission('admin', usuario) and not self.check_permission('empleado', usuario):
            return None
            
        cliente = self.db_manager.get_client_by_id(id_cliente)
        
        if not cliente:
            print(f"No se encontró cliente con ID: {id_cliente}")
            return None
        
        return cliente

    def buscar_cliente_por_documento(self, tipo_documento_id, nro_documento, usuario):
        if not self.check_permission('admin', usuario) and not self.check_permission('empleado', usuario):
            return None
            
        cliente = self.db_manager.get_client_by_document(tipo_documento_id, nro_documento)
        
        if not cliente:
            print(f"No se encontró cliente con documento: {tipo_documento_id} / {nro_documento}")
            return None
        
        return cliente

    def listar_todos_los_clientes(self, usuario):
        if not self.check_permission('admin', usuario) and not self.check_permission('empleado', usuario):
            return []
        
        return self.db_manager.get_all_clients()

    def actualizar_datos_cliente(self, id_cliente, data, usuario):
        if not self.check_permission('admin', usuario) and not self.check_permission('empleado', usuario):
            return False
            
        try:
            persona_data = {
                'nombre': data['nombre'], 'apellido': data['apellido'],
                'mail': data['mail'], 'telefono': data['telefono'],
                'fecha_nacimiento': data['fecha_nacimiento'],
                'tipo_documento_id': data['tipo_documento_id'],
                'nro_documento': data['nro_documento']
            }
            client_data = {
            'fecha_alta': data['fecha_alta']
        }
            
            exito_persona = self.db_manager.update_client_persona_data(id_cliente, persona_data)
            exito_cliente = self.db_manager.update_client_data(id_cliente, client_data) #parte del cliente agregada

            
            if exito_persona and exito_cliente: #actualizo ahora si,la persona y el cliente para que cambie la fecha alta
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

    def eliminar_cliente(self, id_cliente, usuario):
        if not self.check_permission('admin', usuario) and not self.check_permission('empleado', usuario):
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

    def crear_vehiculo(self, data, usuario):
        if not self.check_permission("Admin", usuario):
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

    def actualizar_vehiculo(self, patente, data, usuario):
        if not (self.check_permission("Admin", usuario) or self.check_permission("Empleado", usuario)):
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

    def eliminar_vehiculo(self, patente, usuario):
        if not self.check_permission("Admin", usuario):
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

    def crear_nuevo_alquiler(self, patente, id_cliente, id_empleado, fecha_inicio, fecha_fin, estado, usuario):
        if not usuario:
            print("Debe estar logueado para crear un alquiler.")
            return False

        alquiler_data = {
            'patente': patente,
            'id_cliente': id_cliente,
            'id_empleado': id_empleado, 
            'fecha_inicio': fecha_inicio, 
            'fecha_fin': fecha_fin,
            'estado': estado
        }
        
        if self.db_manager.create_alquiler_transactional(alquiler_data):
            print("Alquiler creado exitosamente.")
            return True
        return False

    def consultar_todos_alquileres(self, usuario):
        if not usuario:
            return []

        es_admin = self.check_permission("Admin", usuario)
        es_empleado = self.check_permission("Empleado", usuario)

        if es_admin or es_empleado:
            return self.db_manager.get_all_alquileres()
        else:
            return self.db_manager.get_all_alquileres(id_persona_filtro=usuario.id_usuario)

    def consultar_alquiler_por_id(self, id_alquiler, usuario):
        if not usuario:
            return None

        alquiler = self.db_manager.get_alquiler_by_id(id_alquiler)
        if not alquiler:
            print("Alquiler no encontrado.")
            return None

        es_admin = self.check_permission("Admin", usuario)
        es_empleado = self.check_permission("Empleado", usuario)

        if es_admin or es_empleado:
            return alquiler
        
        if alquiler['id_persona_cliente'] == usuario.id_usuario:
            return alquiler
        
        print("No tiene permisos para ver este alquiler.")
        return None

    def actualizar_estado_alquiler(self, id_alquiler, nuevo_id_estado, usuario):
        es_admin = self.check_permission("Admin", usuario)
        es_empleado = self.check_permission("Empleado", usuario)

        if not (es_admin or es_empleado):
            print("Se requiere permiso de Admin o Empleado.")
            return False
        
        if self.db_manager.update_alquiler_estado_only(id_alquiler, nuevo_id_estado):
            print(f"Estado del alquiler {id_alquiler} actualizado.")
            return True
        print("No se pudo actualizar el alquiler.")
        return False

    def eliminar_alquiler(self, id_alquiler, usuario):
        if not self.check_permission("Admin", usuario):
            print("Se requiere permiso de Admin.")
            return False
        
        if self.db_manager.delete_alquiler(id_alquiler):
            print(f"Alquiler {id_alquiler} eliminado.")
            return True
        print("No se pudo eliminar el alquiler.")
        return False

    def marcar_alquiler_como_atrasado(self, id_alquiler, usuario):
        es_admin = self.check_permission("Admin", usuario)
        es_empleado = self.check_permission("Empleado", usuario)

        if not (es_admin or es_empleado):
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

    def finalizar_alquiler(self, id_alquiler, usuario):
        es_admin = self.check_permission("Admin", usuario)
        es_empleado = self.check_permission("Empleado", usuario)

        if not (es_admin or es_empleado):
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

    def cancelar_alquiler(self, id_alquiler, usuario):
        if not usuario:
            print("Debe estar logueado para cancelar.")
            return False

        alquiler = self.db_manager.get_alquiler_by_id(id_alquiler)
        if not alquiler:
            print("Alquiler no encontrado.")
            return False

        es_admin = self.check_permission("Admin", usuario)
        es_empleado = self.check_permission("Empleado", usuario)
        
        if not (es_admin or es_empleado):
            if alquiler['id_persona_cliente'] != usuario.id_persona:
                print("No tiene permiso para cancelar este alquiler (no le pertenece).")
                return False

        if alquiler['id_estado'] in [2, 3, 4, 5]:
            print("El alquiler ya comenzó, no se puede cancelar.")
            return False

        if self.db_manager.finalize_or_cancel_alquiler(id_alquiler, 5):
            print(f"Alquiler {id_alquiler} CANCELADO. Vehículo liberado.")
            return True
        
        return False
    
    def comenzar_alquiler(self, id_alquiler, usuario):
        es_admin = self.check_permission("Admin", usuario)
        es_empleado = self.check_permission("Empleado", usuario)
        
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

    def registrar_danio(self, id_alquiler, costo, detalle, usuario):
        es_admin = self.check_permission("Admin", usuario)
        es_empleado = self.check_permission("Empleado", usuario)
        
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

    def consultar_danios_alquiler(self, id_alquiler, usuario):
        if not usuario:
            return []

        alquiler = self.db_manager.get_alquiler_by_id(id_alquiler)
        if not alquiler:
            print("Alquiler no encontrado.")
            return []

        es_admin = self.check_permission("Admin", usuario)
        es_empleado = self.check_permission("Empleado", usuario)
        if not (es_admin or es_empleado):
            if alquiler['id_usuario'] != usuario.id_usuario:
                print("No tiene permisos para ver daños de este alquiler.")
                return []

        return self.db_manager.get_danios_by_alquiler(id_alquiler)

    def modificar_danio(self, id_danio, costo, detalle, usuario):
        es_admin = self.check_permission("Admin", usuario)
        es_empleado = self.check_permission("Empleado", usuario)
        
        if not (es_admin or es_empleado):
            print("Se requiere permiso de Admin o Empleado.")
            return False
        
        data = {'costo': costo, 'detalle': detalle}
        if self.db_manager.update_danio(id_danio, data):
            print("Daño actualizado.")
            return True
        return False

    def eliminar_danio(self, id_danio, usuario):
        es_admin = self.check_permission("Admin", usuario)
        es_empleado = self.check_permission("Empleado", usuario)
        
        if not (es_admin or es_empleado):
            print("Se requiere permiso de Admin o Empleado.")
            return False
        
        if self.db_manager.delete_danio(id_danio):
            print("Daño eliminado.")
            return True
        return False

    # --- FUNCIONES DE MULTA ---

    def registrar_multa(self, id_alquiler, costo, detalle, fecha_multa, usuario):
        es_admin = self.check_permission("Admin", usuario)
        es_empleado = self.check_permission("Empleado", usuario)
        
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

    def consultar_multas_alquiler(self, id_alquiler, usuario):
        if not usuario:
            return []

        alquiler = self.db_manager.get_alquiler_by_id(id_alquiler)
        if not alquiler:
            print("Alquiler no encontrado.")
            return []

        es_admin = self.check_permission("Admin", usuario)
        es_empleado = self.check_permission("Empleado", usuario)

        if not (es_admin or es_empleado):
            if alquiler['id_usuario'] != usuario.id_usuario:
                print("No tiene permisos para ver multas de este alquiler.")
                return []

        return self.db_manager.get_multas_by_alquiler(id_alquiler)

    def modificar_multa(self, id_multa, costo, detalle, fecha_multa, usuario):
        es_admin = self.check_permission("Admin", usuario)
        es_empleado = self.check_permission("Empleado", usuario)
        
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

    def eliminar_multa(self, id_multa, usuario):
        es_admin = self.check_permission("Admin", usuario)
        es_empleado = self.check_permission("Empleado", usuario)
        
        if not (es_admin or es_empleado):
            print("Se requiere permiso de Admin o Empleado.")
            return False
        
        if self.db_manager.delete_multa(id_multa):
            print("Multa eliminada.")
            return True
        return False
    
    # --- FUNCIONES DE MANTENIMIENTO ---

    def programar_mantenimiento(self, patente, fecha_inicio, fecha_fin_estimada, detalle, usuario):
        es_admin = self.check_permission("Admin", usuario)
        es_empleado = self.check_permission("Empleado", usuario)
        
        if not (es_admin or es_empleado):
            print("Se requiere permiso de Admin o Empleado.")
            return False
        
        data = {
            'patente': patente,
            'id_empleado': usuario.id_usuario,
            'fecha_inicio': fecha_inicio,
            'fecha_fin': fecha_fin_estimada,
            'detalle': detalle
        }

        if self.db_manager.schedule_mantenimiento(data):
            print("Mantenimiento programado exitosamente (Pendiente).")
            return True
        return False

    def iniciar_mantenimiento(self, id_mantenimiento, usuario):
        es_admin = self.check_permission("Admin", usuario)
        es_empleado = self.check_permission("Empleado", usuario)
        
        if not (es_admin or es_empleado):
            print("Se requiere permiso de Admin o Empleado.")
            return False

        if self.db_manager.start_mantenimiento(id_mantenimiento):
            print("Mantenimiento iniciado. Vehículo puesto 'En Mantenimiento'.")
            return True
        print("No se pudo iniciar el mantenimiento.")
        return False

    def finalizar_mantenimiento(self, id_mantenimiento, usuario):
        es_admin = self.check_permission("Admin", usuario)
        es_empleado = self.check_permission("Empleado", usuario)
        
        if not (es_admin or es_empleado):
            print("Se requiere permiso de Admin o Empleado.")
            return False

        if self.db_manager.finish_mantenimiento(id_mantenimiento):
            print("Mantenimiento finalizado. Vehículo liberado.")
            return True
        print("No se pudo finalizar el mantenimiento.")
        return False

    def cancelar_mantenimiento(self, id_mantenimiento, usuario):
        es_admin = self.check_permission("Admin", usuario)
        es_empleado = self.check_permission("Empleado", usuario)
        
        if not (es_admin or es_empleado):
            print("Se requiere permiso de Admin o Empleado.")
            return False

        if self.db_manager.cancel_pending_mantenimiento(id_mantenimiento):
            print("Mantenimiento cancelado.")
            return True
        print("No se pudo cancelar (Tal vez ya no está pendiente).")
        return False
    
    def listar_todos_mantenimientos(self, usuario):
        es_admin = self.check_permission("Admin", usuario)
        es_empleado = self.check_permission("Empleado", usuario)

        if not (es_admin or es_empleado):
            return []
        
        return self.db_manager.get_all_mantenimientos()

    def consultar_mantenimiento_por_id(self, id_mantenimiento, usuario):
        es_admin = self.check_permission("Admin", usuario)
        es_empleado = self.check_permission("Empleado", usuario)

        if not (es_admin or es_empleado):
            return None

        return self.db_manager.get_mantenimiento_by_id(id_mantenimiento)

    def eliminar_mantenimiento(self, id_mantenimiento, usuario):
        if not self.check_permission("Admin", usuario):
            print("Se requiere permiso de Admin para eliminar registros de mantenimiento.")
            return False

        if self.db_manager.delete_mantenimiento(id_mantenimiento):
            print(f"Mantenimiento {id_mantenimiento} eliminado.")
            return True
        return False
    
    # --- LISTADOS DE CATÁLOGOS (PÚBLICOS) ---

    def listar_tipos_documento(self):
        return self.db_manager.get_all_documentos()

    def listar_marcas(self):
        return self.db_manager.get_all_marcas()

    def listar_colores(self):
        return self.db_manager.get_all_colores()

    def listar_estados_auto(self):
        return self.db_manager.get_all_estados_auto()

    def listar_estados_alquiler(self):
        return self.db_manager.get_all_estados_alquiler()

    def listar_estados_mantenimiento(self):
        return self.db_manager.get_all_estados_mantenimiento()

    def listar_permisos(self):
        return self.db_manager.get_all_permisos()

# Ejemplo de uso del sistema# --- REPORTES ---

    def reporte_alquileres_cliente(self, id_cliente, usuario):
        if not usuario:
            return []

        es_admin = self.check_permission("Admin", usuario)
        es_empleado = self.check_permission("Empleado", usuario)

        if not (es_admin or es_empleado):
            if str(usuario.id_persona) != str(self.buscar_cliente_por_id(id_cliente, usuario).id_persona):
                return []
        
        return self.db_manager.get_report_alquileres_por_cliente(id_cliente)

    def reporte_ranking_vehiculos(self, fecha_desde, fecha_hasta):
        # Público
        return self.db_manager.get_report_ranking_vehiculos(fecha_desde, fecha_hasta)

    def reporte_evolucion_alquileres(self, fecha_desde, fecha_hasta, usuario):
        es_admin = self.check_permission("Admin", usuario)
        es_empleado = self.check_permission("Empleado", usuario)

        if not (es_admin or es_empleado):
            return None
        
        return self.db_manager.get_report_evolucion_temporal(fecha_desde, fecha_hasta)

    def reporte_facturacion_mensual(self, fecha_desde, fecha_hasta, usuario):
        es_admin = self.check_permission("Admin", usuario)
        es_empleado = self.check_permission("Empleado", usuario)

        if not (es_admin or es_empleado):
            return None
        
        return self.db_manager.get_report_facturacion_mensual(fecha_desde, fecha_hasta)

    def reporte_detalle_clientes_pdf(self, fecha_desde, fecha_hasta, usuario):
        """Reporte para PDF: Detalle de alquileres agrupado por cliente"""
        if not usuario:
            return []

        es_admin = self.check_permission("Admin", usuario)
        es_empleado = self.check_permission("Empleado", usuario)

        if not (es_admin or es_empleado):
            return []
        
        return self.db_manager.get_detailed_rentals_by_client_report(fecha_desde, fecha_hasta)

    def reporte_alquileres_periodo_pdf(self, periodo, fecha_desde, fecha_hasta, usuario):
        """Reporte para PDF: Alquileres por período específico"""
        if not usuario:
            return []

        es_admin = self.check_permission("Admin", usuario)
        es_empleado = self.check_permission("Empleado", usuario)

        if not (es_admin or es_empleado):
            return None
        
        return self.db_manager.get_rentals_by_period_report(periodo, fecha_desde, fecha_hasta)
    
    def reporte_detalle_clientes_completo_pdf(self, fecha_desde, fecha_hasta, usuario):
        if not usuario:
            return []

        es_admin = self.check_permission("Admin", usuario)
        es_empleado = self.check_permission("Empleado", usuario)

        if not (es_admin or es_empleado):
            return []
        
        return self.db_manager.get_detailed_client_rentals_report(fecha_desde, fecha_hasta)
    
    # --- NUEVOS MÉTODOS PARA DASHBOARD ---

    def obtener_estadisticas_dashboard(self, usuario):
        """Obtiene estadísticas personalizadas para el dashboard según el rol del usuario"""
        try:
            print(f"DEBUG: obtener_estadisticas_dashboard para usuario {usuario.user_name}, rol: {usuario.permiso.descripcion}")
            
            if self.check_permission("Admin", usuario) or self.check_permission("Empleado", usuario):
                stats = self._estadisticas_admin_empleado()
                print(f"DEBUG: Estadísticas para admin/empleado: {stats}")
                return stats
            elif self.check_permission("Cliente", usuario):
                stats = self._estadisticas_cliente(usuario)
                print(f"DEBUG: Estadísticas para cliente: {stats}")
                return stats
            else:
                print("DEBUG: Usuario sin permisos reconocidos")
                return {}
                
        except Exception as e:
            print(f"ERROR en obtener_estadisticas_dashboard: {e}")
            import traceback
            traceback.print_exc()
            return {}

    def _estadisticas_admin_empleado(self):
        """Estadísticas para admin y empleado - VERSIÓN CORREGIDA"""
        try:
            print("DEBUG: Obteniendo datos para estadísticas admin/empleado...")
            
            vehiculos = self.db_manager.get_all_vehiculos()
            alquileres = self.db_manager.get_all_alquileres()
            clientes = self.db_manager.get_all_clients()
            mantenimientos = self.db_manager.get_all_mantenimientos()
            
            print(f"DEBUG: {len(vehiculos)} vehículos, {len(alquileres)} alquileres, {len(clientes)} clientes, {len(mantenimientos)} mantenimientos")
            
            # CORRECCIÓN: Acceso seguro a propiedades
            vehiculos_libres = []
            for v in vehiculos:
                try:
                    # Verificar si el vehículo está libre
                    if hasattr(v.estado, 'descripcion') and v.estado.descripcion == 'Libre':
                        vehiculos_libres.append(v)
                    elif hasattr(v, 'estado') and isinstance(v.estado, str) and v.estado == 'Libre':
                        vehiculos_libres.append(v)
                except Exception as e:
                    print(f"DEBUG - Error procesando vehículo {v.patente}: {e}")
                    continue
            
            # CORRECCIÓN: Filtrar alquileres activos (id_estado 2 = Activo, 3 = Atrasado)
            alquileres_activos = []
            for a in alquileres:
                try:
                    if a.get('id_estado') in [2, 3]:
                        alquileres_activos.append(a)
                except Exception as e:
                    print(f"DEBUG - Error procesando alquiler {a.get('id_alquiler')}: {e}")
                    continue
            
            # CORRECCIÓN: Filtrar mantenimientos pendientes (id_estado 3 = Pendiente)
            mantenimientos_pendientes = []
            for m in mantenimientos:
                try:
                    if m.get('id_estado') == 3:
                        mantenimientos_pendientes.append(m)
                except Exception as e:
                    print(f"DEBUG - Error procesando mantenimiento {m.get('id_mantenimiento')}: {e}")
                    continue
            
            stats = {
                'total_vehiculos': len(vehiculos),
                'vehiculos_disponibles': len(vehiculos_libres),
                'alquileres_activos': len(alquileres_activos),
                'mantenimientos_pendientes': len(mantenimientos_pendientes),
                'total_clientes': len(clientes)
            }
            
            print(f"DEBUG: Estadísticas calculadas: {stats}")
            return stats
            
        except Exception as e:
            print(f"ERROR en _estadisticas_admin_empleado: {e}")
            import traceback
            traceback.print_exc()
            return {}

    def _estadisticas_cliente(self, usuario):
        try:
            # Obtener el ID de persona del usuario
            usuario_completo = self.db_manager.get_full_usuario_by_id(usuario.id_usuario)
            if not usuario_completo:
                return {}
            
            # Obtener todos los alquileres del cliente usando id_usuario
            alquileres_cliente = self.db_manager.get_alquileres_por_usuario(usuario.id_usuario)
            vehiculos = self.db_manager.get_all_vehiculos()
            
            vehiculos_libres = [v for v in vehiculos if hasattr(v.estado, 'descripcion') and v.estado.descripcion == 'Libre']
            alquileres_activos = [a for a in alquileres_cliente if a.get('id_estado') in [2, 3]]
            
            # Encontrar vehículo favorito (más alquilado)
            vehiculo_favorito = self._obtener_vehiculo_favorito_cliente(usuario.id_usuario, alquileres_cliente, vehiculos)
            
            return {
                'vehiculos_disponibles': len(vehiculos_libres),
                'alquileres_activos': len(alquileres_activos),
                'total_alquileres': len(alquileres_cliente),
                'vehiculo_favorito': vehiculo_favorito,
                'total_vehiculos': len(vehiculos)  # Agregado para mantener consistencia
            }
        except Exception as e:
            print(f"Error en estadísticas cliente: {e}")
            return {}

    def _obtener_vehiculo_favorito_cliente(self, id_usuario, alquileres_cliente, vehiculos):
        if not alquileres_cliente:
            return None
        
        try:
            # Contar frecuencia de alquiler por patente
            contador_vehiculos = {}
            for alquiler in alquileres_cliente:
                patente = alquiler.get('patente')
                if patente:
                    contador_vehiculos[patente] = contador_vehiculos.get(patente, 0) + 1
            
            if not contador_vehiculos:
                return None
            
            # Encontrar la patente más frecuente
            patente_favorita = max(contador_vehiculos, key=contador_vehiculos.get)
            
            # Buscar información del vehículo
            for vehiculo in vehiculos:
                if vehiculo.patente == patente_favorita:
                    return vehiculo.modelo
            
            return None
        except Exception as e:
            print(f"Error obteniendo vehículo favorito: {e}")
            return None

    def obtener_ultimo_alquiler_cliente(self, usuario):
        try:
            if not self.check_permission("Cliente", usuario):
                return None
                
            # Obtener alquileres del usuario
            alquileres_cliente = self.db_manager.get_alquileres_por_usuario(usuario.id_usuario)
            
            if not alquileres_cliente:
                return None
            
            # Ordenar por fecha de inicio (más reciente primero) y tomar el primero
            alquileres_ordenados = sorted(
                alquileres_cliente, 
                key=lambda x: x.get('fecha_inicio', ''), 
                reverse=True
            )
            
            return alquileres_ordenados[0] if alquileres_ordenados else None
            
        except Exception as e:
            print(f"Error obteniendo último alquiler: {e}")
            return None

    def verificar_disponibilidad_vehiculo(self, patente):
        """Verifica si un vehículo está disponible para alquiler"""
        try:
            vehiculo = self.db_manager.get_vehiculo_by_patente(patente)
            if vehiculo and vehiculo.estado.descripcion == 'Libre':
                return True
            return False
        except Exception as e:
            print(f"Error verificando disponibilidad: {e}")
            return False
    
    def consultar_alquileres_usuario(self, usuario):
        if not usuario:
            return []
        
        if self.check_permission("Admin", usuario) or self.check_permission("Empleado", usuario):
            alquileres = self.db_manager.get_all_alquileres()
            return alquileres
        
        elif self.check_permission("Cliente", usuario):
            # Cliente solo ve sus propios alquileres
            print(f"DEBUG: Usuario es Cliente (ID: {usuario.id_usuario}), devolviendo solo sus alquileres")
            return self.db_manager.get_alquileres_por_usuario(usuario.id_usuario)
        else:
            print("DEBUG: Usuario sin permisos reconocidos")
            return []
        
    def get_cliente_por_usuario(self, id_usuario):
    
        return self.db_manager.get_cliente_por_usuario(id_usuario)
    
    def obtener_alquileres_empleado_dashboard(self, id_usuario, limite=10):
        try:
            # Primero obtener el ID del empleado desde el usuario
            empleado = self.db_manager.get_empleado_por_usuario(id_usuario)
            if not empleado:
                print("Empleado no encontrado para el usuario")
                return []
            
            # Obtener los alquileres de ese empleado
            alquileres = self.db_manager.get_alquileres_por_empleado(empleado.id_empleado, limite)
            return alquileres
            
        except Exception as e:
            print(f"Error obteniendo alquileres del empleado: {e}")
            return []
    
    def obtener_persona_por_usuario(self, id_usuario):
        return self.db_manager.get_persona_por_usuario(id_usuario)

    def actualizar_persona_por_usuario(self, id_usuario, persona_data, usuario_solicitante):
        # Verificar que el usuario solo pueda editar su propio perfil
        if str(usuario_solicitante.id_usuario) != str(id_usuario):
            print("No puedes editar el perfil de otro usuario")
            return False
        
        # Obtener el id_persona del usuario
        persona_actual = self.db_manager.get_persona_por_usuario(id_usuario)
        if not persona_actual:
            print("No se encontró la persona asociada al usuario")
            return False
        
        # Actualizar los datos de la persona
        return self.db_manager.update_persona_por_id(persona_actual['id_persona'], persona_data)
    
    # --------------------------------------------------
    def crear_empleado_mostrador(self, data, usuario_actual):
        try:
            persona = data["persona"]
            usuario = data["usuario"]
            role = data["role"]

            # Datos para Persona
            persona_data = {
                "nombre": persona["nombre"],
                "apellido": persona["apellido"],
                "mail": persona["mail"],
                "telefono": persona["telefono"],
                "fecha_nac": persona["fecha_nac"],
                "tipo_documento": persona["tipo_documento"],
                "nro_documento": persona["nro_documento"]
            }

            # Usuario
            usuario_data = {
                "user_name": usuario["user_name"],
                "password": usuario["password"],
                "id_permiso": usuario["id_permiso"]
            }

            # Rol específico de empleado
            role_data = {
                "sueldo": role.get("sueldo"),
                "horario": role["horario"],
                "fecha_alta": role["fecha_alta"]
            }

            id_empleado = self.db_manager.create_empleado(persona_data, usuario_data, role_data)
            return id_empleado

        except Exception as e:
            print("Error en crear_empleado_mostrador:", e)
            return None
        
    def listar_todos_los_empleados(self, usuario):
        try:
            if not self.check_permission('Admin', usuario) and not self.check_permission('Empleado', usuario):
                return []

            # Retorna lista de diccionarios con todos los empleados
            return self.db_manager.get_all_empleados()
        
        except Exception as e:
            print(f"Error en listar_todos_los_empleados: {e}")
            return []

