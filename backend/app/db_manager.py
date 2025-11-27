from datetime import date, datetime
import sqlite3
import os
from models.cliente import Cliente
from models.vehiculo import Vehiculo
from models.documento import Documento
from models.estadoAlquiler import EstadoAlquiler
from models.estadoAuto import EstadoAuto
from models.estadoMantenimiento import EstadoMantenimiento
from models.permiso import Permiso
from models.usuario import Usuario
from models.color import Color
from models.marca import Marca
from models.persona import Persona
from models.empleado import Empleado
from models.administrador import Administrador
from models.alquiler import Alquiler
from models.mantenimiento import Mantenimiento
from models.multa import Multa
from models.danio import Danio




#Armar ruta de bd
APP_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(APP_DIR)
DB_PATH = os.path.join(BACKEND_DIR, 'db', 'alquileres.db')

class DBManager:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super(DBManager, cls).__new__(cls)
        return cls._instance

    def __init__(self, db_path=DB_PATH):
        if not hasattr(self, 'initialized'):
            self.db_path = db_path
            self.initialized = True

    def _get_connection(self):
        try:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row 
            conn.execute("PRAGMA foreign_keys = ON;")
            return conn
        except sqlite3.Error as e:
            print(f"Error al conectar con la base de datos: {e}")
            return None

    # --- LECTURA DOCUMENTO ---

    def get_documento_by_id(self, id_tipo: int):
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return None
            row = conn.cursor().execute(
                "SELECT * FROM Documento WHERE id_tipo = ?", (id_tipo,)
            ).fetchone()
            if row:
                return Documento(id_tipo=row['id_tipo'], descripcion=row['descripcion'])
        except sqlite3.Error as e:
            print(f"Error al obtener Documento: {e}")
        finally:
            if conn:
                conn.close()
        return None

    def get_all_documentos(self):
        conn = None
        lista = []
        try:
            conn = self._get_connection()
            if conn is None: return lista
            rows = conn.cursor().execute("SELECT * FROM Documento").fetchall()
            for row in rows:
                lista.append(
                    Documento(id_tipo=row['id_tipo'], descripcion=row['descripcion'])
                )
        except sqlite3.Error as e:
            print(f"Error al obtener Documentos: {e}")
        finally:
            if conn:
                conn.close()
        return lista

    # --- LECTURA ESTADO ALQUILER ---

    def get_estado_alquiler_by_id(self, id_estado: int):
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return None
            row = conn.cursor().execute(
                "SELECT * FROM EstadoAlquiler WHERE id_estado = ?", (id_estado,)
            ).fetchone()
            if row:
                return EstadoAlquiler(id_estado=row['id_estado'], descripcion=row['descripcion'])
        except sqlite3.Error as e:
            print(f"Error al obtener EstadoAlquiler: {e}")
        finally:
            if conn:
                conn.close()
        return None
    
    def get_all_estados_alquiler(self):
        conn = None
        lista = []
        try:
            conn = self._get_connection()
            if conn is None: return lista
            rows = conn.cursor().execute("SELECT * FROM EstadoAlquiler").fetchall()
            for row in rows:
                lista.append(
                    EstadoAlquiler(id_estado=row['id_estado'], descripcion=row['descripcion'])
                )
        except sqlite3.Error as e:
            print(f"Error al obtener Estados de Alquiler: {e}")
        finally:
            if conn:
                conn.close()
        return lista

    # --- LECTURA ESTADO AUTO ---

    def get_estado_auto_by_id(self, id_estado: int):
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return None
            row = conn.cursor().execute(
                "SELECT * FROM EstadoAuto WHERE id_estado = ?", (id_estado,)
            ).fetchone()
            if row:
                return EstadoAuto(id_estado=row['id_estado'], descripcion=row['descripcion'])
        except sqlite3.Error as e:
            print(f"Error al obtener EstadoAuto: {e}")
        finally:
            if conn:
                conn.close()
        return None

    def get_all_estados_auto(self):
        conn = None
        lista = []
        try:
            conn = self._get_connection()
            if conn is None: return lista
            rows = conn.cursor().execute("SELECT * FROM EstadoAuto").fetchall()
            for row in rows:
                lista.append(
                    EstadoAuto(id_estado=row['id_estado'], descripcion=row['descripcion'])
                )
        except sqlite3.Error as e:
            print(f"Error al obtener Estados de Auto: {e}")
        finally:
            if conn:
                conn.close()
        return lista

    # --- LECTURA ESTADO MANTENIMIENTO ---

    def get_estado_mantenimiento_by_id(self, id_estado: int):
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return None
            row = conn.cursor().execute(
                "SELECT * FROM EstadoMantenimiento WHERE id_estado = ?", (id_estado,)
            ).fetchone()
            if row:
                return EstadoMantenimiento(id_estado=row['id_estado'], descripcion=row['descripcion'])
        except sqlite3.Error as e:
            print(f"Error al obtener EstadoMantenimiento: {e}")
        finally:
            if conn:
                conn.close()
        return None
    
    def get_all_estados_mantenimiento(self):
        conn = None
        lista = []
        try:
            conn = self._get_connection()
            if conn is None: return lista
            rows = conn.cursor().execute("SELECT * FROM EstadoMantenimiento").fetchall()
            for row in rows:
                lista.append(
                    EstadoMantenimiento(id_estado=row['id_estado'], descripcion=row['descripcion'])
                )
        except sqlite3.Error as e:
            print(f"Error al obtener Estados de Mantenimiento: {e}")
        finally:
            if conn:
                conn.close()
        return lista

    # --- LECTURA PERMISO ---

    def get_permiso_by_id(self, id_permiso: int):
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return None
            row = conn.cursor().execute(
                "SELECT * FROM Permiso WHERE id_permiso = ?", (id_permiso,)
            ).fetchone()
            if row:
                return Permiso(id_permiso=row['id_permiso'], descripcion=row['descripcion'])
        except sqlite3.Error as e:
            print(f"Error al obtener Permiso: {e}")
        finally:
            if conn:
                conn.close()
        return None
    
    def get_all_permisos(self):
        conn = None
        lista = []
        try:
            conn = self._get_connection()
            if conn is None: return lista
            rows = conn.cursor().execute("SELECT * FROM Permiso").fetchall()
            for row in rows:
                lista.append(
                    Permiso(id_permiso=row['id_permiso'], descripcion=row['descripcion'])
                )
        except sqlite3.Error as e:
            print(f"Error al obtener Permisos: {e}")
        finally:
            if conn:
                conn.close()
        return lista
    
    # --- LECTURA COLOR ---

    def get_color_by_id(self, id_color: int):
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return None
            row = conn.cursor().execute(
                "SELECT * FROM Color WHERE id_color = ?", (id_color,)
            ).fetchone()
            if row:
                return Color(id_color=row['id_color'], descripcion=row['descripcion'])
        except sqlite3.Error as e:
            print(f"Error al obtener Color: {e}")
        finally:
            if conn:
                conn.close()
        return None

    def get_all_colores(self):
        conn = None
        lista = []
        try:
            conn = self._get_connection()
            if conn is None: return lista
            rows = conn.cursor().execute("SELECT * FROM Color").fetchall()
            for row in rows:
                lista.append(
                    Color(id_color=row['id_color'], descripcion=row['descripcion'])
                )
        except sqlite3.Error as e:
            print(f"Error al obtener Colores: {e}")
        finally:
            if conn:
                conn.close()
        return lista

    # --- LECTURA MARCA ---

    def get_marca_by_id(self, id_marca: int):
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return None
            row = conn.cursor().execute(
                "SELECT * FROM Marca WHERE id_marca = ?", (id_marca,)
            ).fetchone()
            if row:
                return Marca(id_marca=row['id_marca'], descripcion=row['descripcion'])
        except sqlite3.Error as e:
            print(f"Error al obtener Marca: {e}")
        finally:
            if conn:
                conn.close()
        return None

    def get_all_marcas(self):
        conn = None
        lista = []
        try:
            conn = self._get_connection()
            if conn is None: return lista
            rows = conn.cursor().execute("SELECT * FROM Marca").fetchall()
            for row in rows:
                lista.append(
                    Marca(id_marca=row['id_marca'], descripcion=row['descripcion'])
                )
        except sqlite3.Error as e:
            print(f"Error al obtener Marcas: {e}")
        finally:
            if conn:
                conn.close()
        return lista
    
    # --- ABMC DE USUARIO ---
    
    def create_full_user(self, persona_data, usuario_data, role_data, role_type):
        """Crea un usuario completo validando mediante creación de objetos"""
        conn = None
        try:
            # Validar creando objetos
            persona_obj = self._crear_y_validar_persona(persona_data)
            
            # Verificar si el mail ya existe
            if self.get_user_data_for_login_by_mail(persona_data['mail']):
                raise ValueError(f"El mail {persona_data['mail']} ya está registrado.")

            conn = self._get_connection()
            if conn is None: 
                raise sqlite3.Error("No se pudo conectar a la base de datos")
            
            cursor = conn.cursor()
            cursor.execute("BEGIN")

            # Insertar Persona
            sql_persona = """
                INSERT INTO Persona (nombre, apellido, mail, telefono, 
                                    fecha_nac, tipo_documento, nro_documento)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """
            cursor.execute(sql_persona, (
                persona_data['nombre'], persona_data['apellido'], 
                persona_data['mail'], persona_data['telefono'],
                persona_data['fecha_nacimiento'], 
                persona_data['tipo_documento_id'], 
                persona_data['nro_documento']
            ))
            
            id_persona = cursor.lastrowid
            if not id_persona:
                raise sqlite3.Error("No se pudo obtener el ID de la persona")

            # Insertar Usuario
            sql_usuario = """
                INSERT INTO Usuario (id_persona, user_name, password, id_permiso)
                VALUES (?, ?, ?, ?)
            """
            cursor.execute(sql_usuario, (
                id_persona, usuario_data['user_name'], 
                usuario_data['password_hash'], usuario_data['id_permiso']
            ))

            # Insertar Rol específico
            if role_type == 'cliente':
                cliente_obj = Cliente(
                    id_persona=id_persona,
                    fecha_alta=datetime.fromisoformat(role_data['fecha_alta'])
                )
                sql_role = "INSERT INTO Cliente (id_persona, fecha_alta) VALUES (?, ?)"
                cursor.execute(sql_role, (id_persona, role_data['fecha_alta']))
            
            elif role_type == 'empleado':
                empleado_obj = Empleado(
                    id_persona=id_persona,
                    fecha_alta=datetime.fromisoformat(role_data['fecha_alta']),
                    sueldo=role_data['sueldo']
                )
                sql_role = "INSERT INTO Empleado (id_persona, fecha_alta, sueldo) VALUES (?, ?, ?)"
                cursor.execute(sql_role, (id_persona, role_data['fecha_alta'], role_data['sueldo']))
            
            elif role_type == 'admin':
                admin_obj = Administrador(
                    id_persona=id_persona,
                    descripcion=role_data['descripcion']
                )
                sql_role = "INSERT INTO Administrador (id_persona, descripcion) VALUES (?, ?)"
                cursor.execute(sql_role, (id_persona, role_data['descripcion']))
            
            else:
                raise ValueError("Tipo de rol no válido")

            conn.commit()
            return id_persona

        except (sqlite3.Error, ValueError) as e:
            print(f"Error durante el registro: {e}")
            if conn:
                conn.rollback()
            raise e
        finally:
            if conn:
                conn.close()

    def get_user_data_for_login_by_mail(self, mail):
        sql = """
            SELECT u.id_usuario, u.password, u.id_permiso, p.id_persona
            FROM Usuario u
            JOIN Persona p ON u.id_persona = p.id_persona
            WHERE p.mail = ?
        """
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return None
            
            row = conn.cursor().execute(sql, (mail,)).fetchone()
            
            if row:
                return dict(row)
        except sqlite3.Error as e:
            print(f"Error al buscar datos de login: {e}")
        finally:
            if conn:
                conn.close()
        return None

    def get_full_usuario_by_id(self, id_usuario):
        sql = """
            SELECT 
                u.id_usuario, u.user_name, u.password,
                p.id_persona, p.nombre, p.apellido, p.mail, p.telefono, 
                p.fecha_nac, p.nro_documento,
                perm.id_permiso, perm.descripcion as permiso_desc,
                doc.id_tipo, doc.descripcion as doc_desc
            FROM Usuario u
            JOIN Persona p ON u.id_persona = p.id_persona
            JOIN Permiso perm ON u.id_permiso = perm.id_permiso
            JOIN Documento doc ON p.tipo_documento = doc.id_tipo
            WHERE u.id_usuario = ?
        """
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return None
            
            row = conn.cursor().execute(sql, (id_usuario,)).fetchone()
            
            if row:
                perm_obj = Permiso(
                    id_permiso=row['id_permiso'],
                    descripcion=row['permiso_desc']
                )
                
                usuario_obj = Usuario(
                    id_usuario=row['id_usuario'],
                    user_name=row['user_name'],
                    password=row['password'],
                    permiso=perm_obj)
                
                return usuario_obj
        except sqlite3.Error as e:
            print(f"Error al buscar usuario completo: {e}")
        finally:
            if conn:
                conn.close()
        return None
    
    def delete_user_full(self, id_usuario):
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return False
            
            cursor = conn.cursor()
            
            row = cursor.execute("SELECT id_persona FROM Usuario WHERE id_usuario = ?", (id_usuario,)).fetchone()
            if not row:
                return False 
            
            id_persona = row['id_persona']

            cursor.execute("BEGIN")

            cursor.execute("DELETE FROM Usuario WHERE id_usuario = ?", (id_usuario,))
            
            cursor.execute("DELETE FROM Cliente WHERE id_persona = ?", (id_persona,))
            cursor.execute("DELETE FROM Empleado WHERE id_persona = ?", (id_persona,))
            cursor.execute("DELETE FROM Administrador WHERE id_persona = ?", (id_persona,))
            
            cursor.execute("DELETE FROM Persona WHERE id_persona = ?", (id_persona,))
            
            conn.commit()
            return True

        except sqlite3.IntegrityError:
            print(f"Error: No se puede eliminar el usuario {id_usuario}. Tiene registros asociados (Alquileres, Mantenimientos, etc).")
            if conn: conn.rollback()
            return False
        except sqlite3.Error as e:
            print(f"Error al eliminar usuario: {e}")
            if conn: conn.rollback()
            return False
        finally:
            if conn: conn.close()

    #--modificar usuario--
    def actualizar_usuario(self, user_id, update_fields):
        """Actualiza un usuario validando con objetos"""
        conn = None
        try:
            # Verificar que el usuario existe
            usuario_existente = self.get_full_usuario_by_id(user_id)
            if not usuario_existente:
                raise ValueError(f"Usuario con ID {user_id} no existe")

            # Validar campos a actualizar
            if 'password_hash' in update_fields:
                # Validar que la contraseña no esté vacía
                if not update_fields['password_hash']:
                    raise ValueError("La contraseña no puede estar vacía")
                update_fields['password'] = update_fields.pop('password_hash')

            if 'id_permiso' in update_fields:
                permiso_obj = self.get_permiso_by_id(update_fields['id_permiso'])
                if not permiso_obj:
                    raise ValueError(f"Permiso con ID {update_fields['id_permiso']} no existe")

            conn = self._get_connection()
            if not conn:
                raise sqlite3.Error("No se pudo conectar a la base de datos")
            
            cursor = conn.cursor()
            
            # Construir la consulta dinámicamente
            set_clause = ", ".join([f"{field} = ?" for field in update_fields.keys()])
            values = list(update_fields.values())
            values.append(user_id)
            
            query = f"UPDATE Usuario SET {set_clause} WHERE id_usuario = ?"
            
            cursor.execute(query, values)
            conn.commit()
            
            return cursor.rowcount > 0
            
        except (sqlite3.Error, ValueError) as e:
            print(f"Error al actualizar usuario: {e}")
            if conn:
                conn.rollback()
            raise e
        finally:
            if conn:
                conn.close()

    
    # --- ABMC de CLIENTE ---

    #para cuando el admin o empleado crea un cliente nuevo, tambien le cree el usuario
    def create_client_with_user(self, persona_data, usuario_data, role_data):
        """Crea solo un cliente (sin usuario) validando con objetos"""
            # Validar creando objetos
            persona_obj = self._crear_y_validar_persona(persona_data)
            cliente_obj = Cliente(
                fecha_alta=datetime.fromisoformat(role_data['fecha_alta'])
            )

            # Verificar si el mail ya existe
            if self.get_user_data_for_login_by_mail(persona_data['mail']):
                raise ValueError(f"El mail {persona_data['mail']} ya está registrado")

        conn = self._get_connection()
        if conn is None:
            print("Error: no se pudo abrir conexión a la BD.")
           
                raise sqlite3.Error("No se pudo conectar a la base de datos")
        
        try:
            cursor = conn.cursor()

            # Insert Persona
            cursor.execute("""
                INSERT INTO Persona(nombre, apellido, mail, telefono, fecha_nac, tipo_documento, nro_documento)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                persona_data["nombre"], persona_data["apellido"], persona_data["mail"],
                persona_data["telefono"], persona_data["fecha_nac"],
                persona_data["tipo_documento"], persona_data["nro_documento"]
            ))
            id_persona = cursor.lastrowid

            # Insert Usuario
            cursor.execute("""
                INSERT INTO Usuario(id_persona, user_name, password, id_permiso)
                VALUES (?, ?, ?, ?)
            """, (
                id_persona,
                usuario_data["user_name"],
                usuario_data["password"],  # CORREGIDO
                usuario_data["id_permiso"]
            ))

            # Insert Cliente
            cursor.execute("""
                INSERT INTO Cliente(id_persona, fecha_alta)
                VALUES (?, ?)
            """, (
                id_persona,
                role_data["fecha_alta"]
            ))

            conn.commit()
            return cursor.lastrowid

        except Exception as e:
            print("Error insertando cliente:", e)
            conn.rollback()
            return None

        finally:
            conn.close()


    def get_client_by_id(self, id_cliente):
        # AJUSTE: Se selecciona 'p.fecha_nac' en lugar de 'p.fecha_nacimiento'
        sql = """
            SELECT 
                c.id_cliente, c.fecha_alta,
                p.id_persona, p.nombre, p.apellido, p.mail, p.telefono, 
                p.fecha_nac, p.nro_documento,
                doc.id_tipo, doc.descripcion as doc_desc
            FROM Cliente c
            JOIN Persona p ON c.id_persona = p.id_persona
            JOIN Documento doc ON p.tipo_documento = doc.id_tipo
            WHERE c.id_cliente = ?
        """
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return None
            
            row = conn.cursor().execute(sql, (id_cliente,)).fetchone()
            
            if row:
                doc_obj = Documento(
                    id_tipo=row['id_tipo'], 
                    descripcion=row['doc_desc']
                )
                
                cliente_obj = Cliente(
                    id_cliente=row['id_cliente'],
                    fecha_alta=datetime.fromisoformat(row['fecha_alta']),
                    id_persona=row['id_persona'],
                    nombre=row['nombre'],
                    apellido=row['apellido'],
                    mail=row['mail'],
                    telefono=str(row['telefono']), # Convertimos a str porque en BD es INTEGER pero Persona suele usar str
                    # AJUSTE: Se lee row['fecha_nac']
                    fecha_nacimiento=datetime.fromisoformat(row['fecha_nac']),
                    tipo_documento=doc_obj,
                    nro_documento=row['nro_documento']
                )
                return cliente_obj
        except sqlite3.Error as e:
            print(f"Error al buscar cliente por ID: {e}")
        finally:
            if conn:
                conn.close()
        return None

    def get_client_by_document(self, tipo_documento_id, nro_documento):
        # AJUSTE: Se selecciona 'p.fecha_nac'
        sql = """
            SELECT 
                c.id_cliente, c.fecha_alta,
                p.id_persona, p.nombre, p.apellido, p.mail, p.telefono, 
                p.fecha_nac, p.nro_documento,
                doc.id_tipo, doc.descripcion as doc_desc
            FROM Cliente c
            JOIN Persona p ON c.id_persona = p.id_persona
            JOIN Documento doc ON p.tipo_documento = doc.id_tipo
            WHERE p.tipo_documento = ? AND p.nro_documento = ?
        """
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return None
            
            row = conn.cursor().execute(sql, (tipo_documento_id, nro_documento)).fetchone()
            
            if row:
                doc_obj = Documento(
                    id_tipo=row['id_tipo'], 
                    descripcion=row['doc_desc']
                )
                
                cliente_obj = Cliente(
                    id_cliente=row['id_cliente'],
                    fecha_alta=datetime.fromisoformat(row['fecha_alta']),
                    id_persona=row['id_persona'],
                    nombre=row['nombre'],
                    apellido=row['apellido'],
                    mail=row['mail'],
                    telefono=str(row['telefono']),
                    # AJUSTE: Se lee row['fecha_nac']
                    fecha_nacimiento=datetime.fromisoformat(row['fecha_nac']),
                    tipo_documento=doc_obj,
                    nro_documento=row['nro_documento']
                )
                return cliente_obj
        except sqlite3.Error as e:
            print(f"Error al buscar cliente por documento: {e}")
        finally:
            if conn:
                conn.close()
        return None

    def get_all_clients(self):
        # AJUSTE: Se selecciona 'p.fecha_nac'
        sql = """
            SELECT 
                c.id_cliente, c.fecha_alta,
                p.id_persona, p.nombre, p.apellido, p.mail, p.telefono, 
                p.fecha_nac, p.nro_documento,
                doc.id_tipo, doc.descripcion as doc_desc
            FROM Cliente c
            JOIN Persona p ON c.id_persona = p.id_persona
            JOIN Documento doc ON p.tipo_documento = doc.id_tipo
            ORDER BY p.apellido, p.nombre
        """
        conn = None
        lista_clientes = []
        try:
            conn = self._get_connection()
            if conn is None: return lista_clientes
            
            rows = conn.cursor().execute(sql).fetchall()
            
            for row in rows:
                doc_obj = Documento(
                    id_tipo=row['id_tipo'], 
                    descripcion=row['doc_desc']
                )
                cliente_obj = Cliente(
                    id_cliente=row['id_cliente'],
                    fecha_alta=datetime.fromisoformat(row['fecha_alta']),
                    id_persona=row['id_persona'],
                    nombre=row['nombre'],
                    apellido=row['apellido'],
                    mail=row['mail'],
                    telefono=str(row['telefono']),
                    # AJUSTE: Se lee row['fecha_nac']
                    fecha_nacimiento=datetime.fromisoformat(row['fecha_nac']),
                    tipo_documento=doc_obj,
                    nro_documento=row['nro_documento']
                )
                lista_clientes.append(cliente_obj)
            return lista_clientes
        except sqlite3.Error as e:
            print(f"Error al obtener todos los clientes: {e}")
        finally:
            if conn:
                conn.close()
        return lista_clientes
    
    def update_client_persona_data(self, id_cliente, persona_data):
        """Actualiza datos de persona de un cliente validando con objetos"""
        conn = None
        try:
            # Validar creando objeto Persona
            persona_obj = self._crear_y_validar_persona(persona_data)
            
            # Verificar que el cliente existe
            cliente_existente = self.get_client_by_id(id_cliente)
            if not cliente_existente:
                raise ValueError(f"Cliente con ID {id_cliente} no existe")

            conn = self._get_connection()
            if conn is None: 
                raise sqlite3.Error("No se pudo conectar a la base de datos")
            
            cursor = conn.cursor()
            
            sql_update_persona = """
                UPDATE Persona
                SET nombre = ?, apellido = ?, mail = ?, telefono = ?,
                    fecha_nac = ?, tipo_documento = ?, nro_documento = ?
                WHERE id_persona = (SELECT id_persona FROM Cliente WHERE id_cliente = ?)
            """
            cursor.execute(sql_update_persona, (
                persona_data['nombre'], persona_data['apellido'],
                persona_data['mail'], persona_data['telefono'],
                persona_data['fecha_nacimiento'],
                persona_data['tipo_documento_id'],
                persona_data['nro_documento'],
                id_cliente
            ))
            conn.commit()
            return cursor.rowcount > 0 
            
        except (sqlite3.Error, ValueError) as e:
            print(f"Error al actualizar cliente: {e}")
            if conn:
                conn.rollback()
            raise e
        finally:
            if conn:
                conn.close()

    def update_client_data(self, id_cliente, client_data):
        """Actualiza datos específicos del cliente validando con objetos"""
        conn = None
        try:
            # Validar creando objeto Cliente
            cliente_obj = Cliente(
                fecha_alta=datetime.fromisoformat(client_data['fecha_alta'])
            )

            # Verificar que el cliente existe
            cliente_existente = self.get_client_by_id(id_cliente)
            if not cliente_existente:
                raise ValueError(f"Cliente con ID {id_cliente} no existe")

            conn = self._get_connection()
            if conn is None:
                raise sqlite3.Error("No se pudo conectar a la base de datos")

            cursor = conn.cursor()
            sql_update_cliente = """
                UPDATE Cliente
                SET fecha_alta = ?
                WHERE id_cliente = ?
            """
            cursor.execute(sql_update_cliente, (
                client_data['fecha_alta'],
                id_cliente
            ))
            conn.commit()
            return cursor.rowcount > 0
            
        except (sqlite3.Error, ValueError) as e:
            print(f"Error al actualizar fecha_alta: {e}")
            if conn:
                conn.rollback()
            raise e
        finally:
            if conn:
                conn.close()

    def delete_client_full(self, id_cliente):
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return False
            
            cursor = conn.cursor()
            
            row = cursor.execute(
                "SELECT id_persona FROM Cliente WHERE id_cliente = ?", (id_cliente,)
            ).fetchone()
            
            if not row:
                print("Error: Cliente no encontrado.")
                return False
                
            id_persona = row['id_persona']

            cursor.execute("BEGIN")
            
            cursor.execute("DELETE FROM Usuario WHERE id_persona = ?", (id_persona,))
            cursor.execute("DELETE FROM Cliente WHERE id_cliente = ?", (id_cliente,))
            cursor.execute("DELETE FROM Persona WHERE id_persona = ?", (id_persona,))
            
            conn.commit()
            return True

        except sqlite3.IntegrityError:
            print(f"Error de integridad: No se puede eliminar. El cliente (ID: {id_cliente}) probablemente tiene alquileres asociados.")
            if conn:
                conn.rollback()
            return False
        except (sqlite3.Error, ValueError) as e:
            print(f"Error al eliminar cliente: {e}")
            if conn:
                conn.rollback()
            return False
        finally:
            if conn:
                conn.close()


    # --- ABMC de VEHICULOS ---

    def _rebuild_vehiculo_obj(self, row):
        # Construimos el objeto EstadoAuto
        estado_obj = EstadoAuto(
            id_estado=row['id_estado'],
            descripcion=row['estado_desc']
        )
        # Construimos el objeto Marca
        marca_obj = Marca(
            id_marca=row['id_marca'],
            descripcion=row['marca_desc']
        )
        # Construimos el objeto Color
        color_obj = Color(
            id_color=row['id_color'],
            descripcion=row['color_desc']
        )
        
        # Construimos el Vehículo con todos sus objetos relacionados
        vehiculo_obj = Vehiculo(
            patente=row['patente'],
            modelo=row['modelo'],
            marca=marca_obj, 
            anio=row['anio'],
            precio_flota=row['precio_flota'],
            asientos=row['asientos'],
            puertas=row['puertas'],
            caja_manual=bool(row['caja_manual']),
            estado=estado_obj,
            color=color_obj
        )
        return vehiculo_obj

    def get_all_vehiculos(self):
        sql = """
            SELECT v.*, 
                   ea.descripcion as estado_desc,
                   m.descripcion as marca_desc,
                   c.descripcion as color_desc
            FROM Vehiculo v
            JOIN EstadoAuto ea ON v.id_estado = ea.id_estado
            JOIN Marca m ON v.id_marca = m.id_marca
            JOIN Color c ON v.id_color = c.id_color
            ORDER BY m.descripcion, v.modelo
        """
        conn = None
        lista = []
        try:
            conn = self._get_connection()
            if conn is None: return lista
            rows = conn.cursor().execute(sql).fetchall()
            for row in rows:
                lista.append(self._rebuild_vehiculo_obj(row))
        except sqlite3.Error as e:
            print(f"Error al obtener vehiculos: {e}")
        finally:
            if conn: conn.close()
        return lista

    def get_vehiculo_by_patente(self, patente):
        sql = """
            SELECT v.*, 
                   ea.descripcion as estado_desc,
                   m.descripcion as marca_desc,
                   c.descripcion as color_desc
            FROM Vehiculo v
            JOIN EstadoAuto ea ON v.id_estado = ea.id_estado
            JOIN Marca m ON v.id_marca = m.id_marca
            JOIN Color c ON v.id_color = c.id_color
            WHERE v.patente = ?
        """
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return None
            row = conn.cursor().execute(sql, (patente.upper(),)).fetchone()
            if row:
                return self._rebuild_vehiculo_obj(row)
        except sqlite3.Error as e:
            print(f"Error al obtener vehiculo: {e}")
        finally:
            if conn: conn.close()
        return None

    def create_vehiculo(self, data):
        """Crea un vehículo validando con objetos"""
        conn = None
        try:
            # Validar creando objetos
            marca_obj = self.get_marca_by_id(data['id_marca'])
            color_obj = self.get_color_by_id(data['id_color'])
            estado_obj = self.get_estado_auto_by_id(data['id_estado'])
            
            if not marca_obj:
                raise ValueError(f"Marca con ID {data['id_marca']} no existe")
            if not color_obj:
                raise ValueError(f"Color con ID {data['id_color']} no existe")
            if not estado_obj:
                raise ValueError(f"Estado auto con ID {data['id_estado']} no existe")

            vehiculo_obj = Vehiculo(
                patente=data['patente'],
                modelo=data['modelo'],
                marca=marca_obj,
                anio=data['anio'],
                precio_flota=data['precio_flota'],
                asientos=data['asientos'],
                puertas=data['puertas'],
                caja_manual=bool(data['caja_manual']),
                estado=estado_obj,
                color=color_obj
            )

            # Verificar si la patente ya existe
            if self.get_vehiculo_by_patente(data['patente']):
                raise ValueError(f"La patente {data['patente']} ya existe")

            conn = self._get_connection()
            if conn is None: 
                raise sqlite3.Error("No se pudo conectar a la base de datos")
            
            cursor = conn.cursor()
            
            sql = """
                INSERT INTO Vehiculo (patente, modelo, id_marca, anio, precio_flota, 
                                    asientos, puertas, caja_manual, 
                                    id_estado, id_color)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """
            cursor.execute(sql, (
                data['patente'].upper(), 
                data['modelo'], 
                data['id_marca'], 
                data['anio'], 
                data['precio_flota'], 
                data['asientos'],
                data['puertas'], 
                int(data['caja_manual']), 
                data['id_estado'], 
                data['id_color']
            ))
            conn.commit()
            return True
            
        except (sqlite3.Error, ValueError) as e:
            print(f"Error al crear vehículo: {e}")
            if conn: 
                conn.rollback()
            raise e
        finally:
            if conn: 
                conn.close()

    def update_vehiculo(self, patente, data):
        """Actualiza un vehículo validando con objetos"""
        conn = None
        patente = patente.upper()
        
        try:
            # Validar creando objetos
            marca_obj = self.get_marca_by_id(data['id_marca'])
            color_obj = self.get_color_by_id(data['id_color'])
            estado_obj = self.get_estado_auto_by_id(data['id_estado'])
            
            if not marca_obj:
                raise ValueError(f"Marca con ID {data['id_marca']} no existe")
            if not color_obj:
                raise ValueError(f"Color con ID {data['id_color']} no existe")
            if not estado_obj:
                raise ValueError(f"Estado auto con ID {data['id_estado']} no existe")

            vehiculo_obj = Vehiculo(
                patente=patente,
                modelo=data['modelo'],
                marca=marca_obj,
                anio=data['anio'],
                precio_flota=data['precio_flota'],
                asientos=data['asientos'],
                puertas=data['puertas'],
                caja_manual=bool(data['caja_manual']),
                estado=estado_obj,
                color=color_obj
            )

            # Verificar que el vehículo existe
            vehiculo_existente = self.get_vehiculo_by_patente(patente)
            if not vehiculo_existente:
                raise ValueError(f"Vehículo con patente {patente} no existe")

            conn = self._get_connection()
            if conn is None: 
                raise sqlite3.Error("No se pudo conectar a la base de datos")
            
            cursor = conn.cursor()
            
            sql = """
                UPDATE Vehiculo SET
                modelo = ?, id_marca = ?, anio = ?, precio_flota = ?,
                asientos = ?, puertas = ?, caja_manual = ?,
                id_estado = ?, id_color = ?
                WHERE patente = ?
            """
            cursor.execute(sql, (
                data['modelo'], 
                data['id_marca'], 
                data['anio'], 
                data['precio_flota'], 
                data['asientos'], 
                data['puertas'], 
                int(data['caja_manual']), 
                data['id_estado'], 
                data['id_color'], 
                patente
            ))
            conn.commit()
            return cursor.rowcount > 0
            
        except (sqlite3.Error, ValueError) as e:
            print(f"Error al actualizar vehiculo: {e}")
            if conn: 
                conn.rollback()
            raise e
        finally:
            if conn: 
                conn.close()
            
    def delete_vehiculo(self, patente):
        sql = "DELETE FROM Vehiculo WHERE patente = ?"
        conn = None
        patente = patente.upper()
        try:
            conn = self._get_connection()
            if conn is None: return False
            cursor = conn.cursor()
            cursor.execute(sql, (patente,))
            conn.commit()
            return cursor.rowcount > 0
        except sqlite3.IntegrityError:
            print(f"Error de integridad: No se puede eliminar vehiculo {patente}. Tiene alquileres asociados.")
            if conn: conn.rollback()
            return False
        except sqlite3.Error as e:
            print(f"Error al eliminar vehiculo: {e}")
            if conn: conn.rollback()
            return False
        finally:
            if conn: conn.close()

    def get_vehiculos_libres(self):
        sql = """
            SELECT v.*, 
                   ea.descripcion as estado_desc,
                   m.descripcion as marca_desc,
                   c.descripcion as color_desc
            FROM Vehiculo v
            JOIN EstadoAuto ea ON v.id_estado = ea.id_estado
            JOIN Marca m ON v.id_marca = m.id_marca
            JOIN Color c ON v.id_color = c.id_color
            WHERE ea.descripcion = 'Libre'
            ORDER BY m.descripcion, v.modelo
        """
        conn = None
        lista = []
        try:
            conn = self._get_connection()
            if conn is None: return lista
            rows = conn.cursor().execute(sql).fetchall()
            for row in rows:
                lista.append(self._rebuild_vehiculo_obj(row))
        except sqlite3.Error as e:
            print(f"Error al obtener vehiculos libres: {e}")
        finally:
            if conn: conn.close()
        return lista

    
    
    # --- FUNCIONES DE ALQUILER ---

    def create_alquiler_transactional(self, data):
        """Crea un alquiler validando con objetos"""
        conn = None
        try:
            # Validar creando objetos
            vehiculo_obj = self.get_vehiculo_by_patente(data['patente'])
            if not vehiculo_obj:
                raise ValueError(f"El vehículo {data['patente']} no existe")
            
            cliente_obj = self.get_client_by_id(data['id_cliente'])
            if not cliente_obj:
                raise ValueError(f"El cliente con ID {data['id_cliente']} no existe")
            
            estado_alquiler_obj = self.get_estado_alquiler_by_id(1)  # Estado inicial
            
            fecha_inicio = datetime.fromisoformat(data['fecha_inicio'])
            fecha_fin = datetime.fromisoformat(data['fecha_fin'])
            
            alquiler_obj = Alquiler(
                patente=data['patente'],
                id_cliente=data['id_cliente'],
                id_empleado=data['id_empleado'],
                fecha_inicio=fecha_inicio,
                fecha_fin=fecha_fin,
                estado=estado_alquiler_obj,
                vehiculo=vehiculo_obj,
                cliente=cliente_obj
            )

            # Resto de validaciones...
            if vehiculo_obj.estado.id_estado != 1: 
                raise ValueError(f"El vehículo {data['patente']} no está libre (Estado: {vehiculo_obj.estado.descripcion})")

            hoy = datetime.now()
            if fecha_inicio.date() < hoy.date():
                raise ValueError("La fecha de inicio debe ser futura o igual a hoy.")
            
            if fecha_fin <= fecha_inicio:
                raise ValueError("La fecha de fin debe ser posterior a la fecha de inicio.")

            # Validar conflictos con mantenimiento
            sql_check_mantenimiento = """
                SELECT id_mantenimiento 
                FROM Mantenimiento 
                WHERE patente = ? 
                AND id_estado IN (1, 3) 
                AND (fecha_inicio <= ? AND fecha_fin >= ?)
            """
            
            conn = self._get_connection()
            if conn is None: 
                raise sqlite3.Error("No se pudo conectar a la base de datos")
                
            cursor = conn.cursor()
            cursor.execute("BEGIN")
            
            cursor.execute(sql_check_mantenimiento, (
                data['patente'], 
                data['fecha_fin'],    
                data['fecha_inicio']  
            ))
            
            if cursor.fetchone():
                raise ValueError(f"El vehículo {data['patente']} tiene un mantenimiento programado que coincide con las fechas solicitadas.")

            # Insertar alquiler
            sql_alquiler = """
                INSERT INTO Alquiler (patente, id_cliente, id_empleado, 
                                    fecha_inicio, fecha_fin, id_estado)
                VALUES (?, ?, ?, ?, ?, ?)
            """

            if data.get('estado', '').upper() == 'RESERVADO':
                id_estado = 1
            else:
                id_estado = 2

            cursor.execute(sql_alquiler, (
                data['patente'],
                data['id_cliente'],
                data['id_empleado'],
                data['fecha_inicio'],
                data['fecha_fin'],
                id_estado
            ))

            # Actualizar estado del vehículo
            sql_update_auto = "UPDATE Vehiculo SET id_estado = 2 WHERE patente = ?"
            cursor.execute(sql_update_auto, (data['patente'],))

            conn.commit()
            return True

        except (sqlite3.Error, ValueError) as e:
            print(f"Error al crear alquiler: {e}")
            if conn:
                conn.rollback()
            return False
        finally:
            if conn:
                conn.close()

    def get_all_alquileres(self, id_persona_filtro=None):
        # CORRECCIÓN: Incluir todos los datos del cliente
        base_sql = """
            SELECT 
                a.*, 
                v.modelo, 
                m.descripcion as marca, 
                v.patente,
                v.precio_flota,
                ea.descripcion as estado_desc,
                -- Datos del cliente
                c.id_cliente,
                p.nombre as nombre_cliente,
                p.apellido as apellido_cliente,
                p.telefono as telefono_cliente,
                p.mail as mail_cliente,
                p.nro_documento as nro_documento,
                doc.descripcion as tipo_documento,
                -- ID de persona del cliente para permisos
                c.id_persona as id_persona_cliente
            FROM Alquiler a
            JOIN Vehiculo v ON a.patente = v.patente
            JOIN Marca m ON v.id_marca = m.id_marca
            JOIN EstadoAlquiler ea ON a.id_estado = ea.id_estado
            JOIN Cliente c ON a.id_cliente = c.id_cliente
            JOIN Persona p ON c.id_persona = p.id_persona
            JOIN Documento doc ON p.tipo_documento = doc.id_tipo
        """
        
        if id_persona_filtro:
            base_sql += """ 
                JOIN Usuario u ON c.id_persona = u.id_persona 
                WHERE u.id_usuario = ?
            """
            params = (id_persona_filtro,)
        else:
            params = ()

        base_sql += " ORDER BY a.fecha_inicio DESC"

        conn = None
        lista = []
        try:
            conn = self._get_connection()
            if conn is None: return lista
            
            cursor = conn.cursor()
            rows = cursor.execute(base_sql, params).fetchall()
            
            for row in rows:
                lista.append(dict(row))
            return lista
        except sqlite3.Error as e:
            print(f"Error al listar alquileres: {e}")
            return []
        finally:
            if conn: conn.close()

    def get_alquiler_by_id(self, id_alquiler):
        sql = """
            SELECT a.*, u.id_usuario
            FROM Alquiler a
            JOIN Cliente c ON a.id_cliente = c.id_cliente
            JOIN Usuario u ON c.id_persona = u.id_persona
            WHERE a.id_alquiler = ?
        """
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return None
            row = conn.cursor().execute(sql, (id_alquiler,)).fetchone()
            if row:
                return dict(row)
        except sqlite3.Error as e:
            print(f"Error al obtener alquiler: {e}")
        finally:
            if conn: conn.close()
        return None

    def update_alquiler_estado_only(self, id_alquiler, nuevo_id_estado):
        """Actualiza solo el estado de un alquiler validando con objetos"""
        conn = None
        try:
            # Validar creando objetos
            estado_alquiler_obj = self.get_estado_alquiler_by_id(nuevo_id_estado)
            if not estado_alquiler_obj:
                raise ValueError(f"Estado de alquiler con ID {nuevo_id_estado} no existe")

            # Verificar que el alquiler existe
            alquiler_existente = self.get_alquiler_by_id(id_alquiler)
            if not alquiler_existente:
                raise ValueError(f"Alquiler con ID {id_alquiler} no existe")

            conn = self._get_connection()
            if conn is None: 
                raise sqlite3.Error("No se pudo conectar a la base de datos")
            
            cursor = conn.cursor()
            
            sql = "UPDATE Alquiler SET id_estado = ? WHERE id_alquiler = ?"
            cursor.execute(sql, (nuevo_id_estado, id_alquiler))
            conn.commit()
            return cursor.rowcount > 0
            
        except (sqlite3.Error, ValueError) as e:
            print(f"Error al actualizar estado alquiler: {e}")
            if conn:
                conn.rollback()
            raise e
        finally:
            if conn: 
                conn.close()

    def delete_alquiler(self, id_alquiler):
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return False
            
            cursor = conn.cursor()
            cursor.execute("BEGIN")

            cursor.execute("SELECT patente FROM Alquiler WHERE id_alquiler = ?", (id_alquiler,))
            row = cursor.fetchone()
            
            if not row:
                return False 
            
            patente = row['patente']

            cursor.execute("DELETE FROM Alquiler WHERE id_alquiler = ?", (id_alquiler,))

            cursor.execute("UPDATE Vehiculo SET id_estado = 1 WHERE patente = ?", (patente,))

            conn.commit()
            return True

        except sqlite3.IntegrityError:
            print(f"No se puede eliminar el alquiler {id_alquiler} (Probablemente tiene multas o daños asociados).")
            if conn: conn.rollback()
            return False
        except sqlite3.Error as e:
            print(f"Error al eliminar alquiler: {e}")
            if conn: conn.rollback()
            return False
        finally:
            if conn: conn.close()

    def finalize_or_cancel_alquiler(self, id_alquiler, nuevo_id_estado):
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return False
            
            cursor = conn.cursor()
            cursor.execute("BEGIN")

            cursor.execute("SELECT patente FROM Alquiler WHERE id_alquiler = ?", (id_alquiler,))
            row = cursor.fetchone()
            if not row:
                raise ValueError("Alquiler no encontrado.")
            
            patente = row['patente']

            sql_alquiler = "UPDATE Alquiler SET id_estado = ? WHERE id_alquiler = ?"
            cursor.execute(sql_alquiler, (nuevo_id_estado, id_alquiler))

            sql_vehiculo = "UPDATE Vehiculo SET id_estado = 1 WHERE patente = ?"
            cursor.execute(sql_vehiculo, (patente,))

            conn.commit()
            return True

        except (sqlite3.Error, ValueError) as e:
            print(f"Error al finalizar/cancelar alquiler: {e}")
            if conn:
                conn.rollback()
            return False
        finally:
            if conn: conn.close()

    def start_reserved_rental(self, id_alquiler):
        sql = "UPDATE Alquiler SET id_estado = 2 WHERE id_alquiler = ? AND id_estado = 1"
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return False
            cursor = conn.cursor()
            cursor.execute(sql, (id_alquiler,))
            conn.commit()
            return cursor.rowcount > 0
        except sqlite3.Error as e:
            print(f"Error al comenzar alquiler: {e}")
            return False
        finally:
            if conn: conn.close()

    # --- FUNCIONES DE DANIO ---

    def create_danio(self, data):
        """Crea un daño validando con objetos"""
        conn = None
        try:
            # Validar creando objeto
            danio_obj = Danio(
                id_alquiler=data['id_alquiler'],
                costo=data['costo'],
                detalle=data['detalle']
            )

            conn = self._get_connection()
            if conn is None: 
                raise sqlite3.Error("No se pudo conectar a la base de datos")
            
            cursor = conn.cursor()
            
            # Validar que el alquiler existe y no está reservado
            cursor.execute("SELECT id_estado FROM Alquiler WHERE id_alquiler = ?", (data['id_alquiler'],))
            alquiler = cursor.fetchone()
            
            if not alquiler:
                raise ValueError(f"No se encontró el alquiler con ID {data['id_alquiler']}")
                
            if alquiler[0] == 1:
                raise ValueError("No se pueden registrar daños para alquileres en estado 'Reservado'")
            
            sql = "INSERT INTO Danio (id_alquiler, costo, detalle) VALUES (?, ?, ?)"
            cursor.execute(sql, (data['id_alquiler'], data['costo'], data['detalle']))
            conn.commit()
            return True
            
        except (sqlite3.Error, ValueError) as e:
            print(f"Error al crear daño: {e}")
            if conn: 
                conn.rollback()
            raise e
        finally:
            if conn: 
                conn.close()

    def get_danios_by_alquiler(self, id_alquiler):
        sql = "SELECT * FROM Danio WHERE id_alquiler = ?"
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return []
            rows = conn.cursor().execute(sql, (id_alquiler,)).fetchall()
            return [dict(row) for row in rows]
        except sqlite3.Error as e:
            print(f"Error al obtener daños: {e}")
            return []
        finally:
            if conn: conn.close()

    def update_danio(self, id_danio, data):
        """Actualiza un daño validando con objetos"""
        conn = None
        try:
            # Validar creando objeto
            danio_obj = Danio(
                id_danio=id_danio,
                costo=data['costo'],
                detalle=data['detalle']
            )

            # Verificar que el daño existe
            danio_existente = self.get_danio_by_id(id_danio)
            if not danio_existente:
                raise ValueError(f"Daño con ID {id_danio} no existe")

            conn = self._get_connection()
            if conn is None: 
                raise sqlite3.Error("No se pudo conectar a la base de datos")
            
            cursor = conn.cursor()
            
            sql = "UPDATE Danio SET costo = ?, detalle = ? WHERE id_danio = ?"
            cursor.execute(sql, (data['costo'], data['detalle'], id_danio))
            conn.commit()
            return cursor.rowcount > 0
            
        except (sqlite3.Error, ValueError) as e:
            print(f"Error al actualizar daño: {e}")
            if conn: 
                conn.rollback()
            raise e
        finally:
            if conn: 
                conn.close()

    def delete_danio(self, id_danio):
        sql = "DELETE FROM Danio WHERE id_danio = ?"
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return False
            cursor = conn.cursor()
            cursor.execute(sql, (id_danio,))
            conn.commit()
            return cursor.rowcount > 0
        except sqlite3.Error as e:
            print(f"Error al eliminar daño: {e}")
            return False
        finally:
            if conn: conn.close()

    # --- FUNCIONES DE MULTA ---

    def create_multa(self, data):
        """Crea una multa validando con objetos"""
        conn = None
        try:
            # Validar creando objeto
            multa_obj = Multa(
                alquiler_id=data['alquiler_id'],
                costo=data['costo'],
                detalle=data['detalle'],
                fecha_multa=datetime.fromisoformat(data['fecha_multa'])
            )

            conn = self._get_connection()
            if conn is None: 
                raise sqlite3.Error("No se pudo conectar a la base de datos")
            
            cursor = conn.cursor()
            
            # Validar que el alquiler existe y no está reservado
            cursor.execute("SELECT id_estado FROM Alquiler WHERE id_alquiler = ?", (data['alquiler_id'],))
            alquiler = cursor.fetchone()
            
            if not alquiler:
                raise ValueError(f"No se encontró el alquiler con ID {data['alquiler_id']}")
                
            if alquiler[0] == 1:
                raise ValueError("No se pueden registrar multas para alquileres en estado 'Reservado'")

            sql = "INSERT INTO Multa (alquiler_id, costo, detalle, fecha_multa) VALUES (?, ?, ?, ?)"
            cursor.execute(sql, (
                data['alquiler_id'], 
                data['costo'], 
                data['detalle'], 
                data['fecha_multa']
            ))
            conn.commit()
            return True
            
        except (sqlite3.Error, ValueError) as e:
            print(f"Error al crear multa: {e}")
            if conn: 
                conn.rollback()
            raise e
        finally:
            if conn: 
                conn.close()


    def get_multas_by_alquiler(self, alquiler_id):
        sql = "SELECT * FROM Multa WHERE alquiler_id = ?"
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return []
            rows = conn.cursor().execute(sql, (alquiler_id,)).fetchall()
            return [dict(row) for row in rows]
        except sqlite3.Error as e:
            print(f"Error al obtener multas: {e}")
            return []
        finally:
            if conn: conn.close()

    def update_multa(self, id_multa, data):
        """Actualiza una multa validando con objetos"""
        conn = None
        try:
            # Validar creando objeto
            multa_obj = Multa(
                id_multa=id_multa,
                costo=data['costo'],
                detalle=data['detalle'],
                fecha_multa=datetime.fromisoformat(data['fecha_multa'])
            )

            # Verificar que la multa existe
            multa_existente = self.get_multa_by_id(id_multa)
            if not multa_existente:
                raise ValueError(f"Multa con ID {id_multa} no existe")

            conn = self._get_connection()
            if conn is None: 
                raise sqlite3.Error("No se pudo conectar a la base de datos")
            
            cursor = conn.cursor()
            
            sql = "UPDATE Multa SET costo = ?, detalle = ?, fecha_multa = ? WHERE id_multa = ?"
            cursor.execute(sql, (
                data['costo'], 
                data['detalle'], 
                data['fecha_multa'], 
                id_multa
            ))
            conn.commit()
            return cursor.rowcount > 0
            
        except (sqlite3.Error, ValueError) as e:
            print(f"Error al actualizar multa: {e}")
            if conn: 
                conn.rollback()
            raise e
        finally:
            if conn: 
                conn.close()

    def delete_multa(self, id_multa):
        sql = "DELETE FROM Multa WHERE id_multa = ?"
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return False
            cursor = conn.cursor()
            cursor.execute(sql, (id_multa,))
            conn.commit()
            return cursor.rowcount > 0
        except sqlite3.Error as e:
            print(f"Error al eliminar multa: {e}")
            return False
        finally:
            if conn: conn.close()

    # --- FUNCIONES DE MANTENIMIENTO ---

    def schedule_mantenimiento(self, data):
        """Programa un mantenimiento validando con objetos"""
        conn = None
        try:
            # Validar creando objetos
            vehiculo_obj = self.get_vehiculo_by_patente(data['patente'])
            if not vehiculo_obj:
                raise ValueError(f"Vehículo con patente {data['patente']} no existe")
            
            estado_mantenimiento_obj = self.get_estado_mantenimiento_by_id(3)  # Pendiente
            
            mantenimiento_obj = Mantenimiento(
                patente=data['patente'],
                id_empleado=data['id_empleado'],
                fecha_inicio=datetime.fromisoformat(data['fecha_inicio']),
                fecha_fin=datetime.fromisoformat(data['fecha_fin']),
                detalle=data['detalle'],
                estado=estado_mantenimiento_obj
            )

            conn = self._get_connection()
            if conn is None: 
                raise sqlite3.Error("No se pudo conectar a la base de datos")
            
            cursor = conn.cursor()
            cursor.execute("BEGIN")

            # Validar conflictos con alquileres
            sql_check_alquiler = """
                SELECT id_alquiler FROM Alquiler 
                WHERE patente = ? 
                AND id_estado IN (1, 2, 3)
                AND (
                    (fecha_inicio <= ? AND fecha_fin >= ?) 
                )
            """
            cursor.execute(sql_check_alquiler, (
                data['patente'], 
                data['fecha_fin'], 
                data['fecha_inicio']
            ))
            
            if cursor.fetchone():
                raise ValueError("El vehículo tiene alquileres programados en esas fechas.")

            # Insertar mantenimiento
            sql_insert = """
                INSERT INTO Mantenimiento (patente, id_empleado, fecha_inicio, fecha_fin, detalle, id_estado)
                VALUES (?, ?, ?, ?, ?, ?)
            """
            cursor.execute(sql_insert, (
                data['patente'],
                data['id_empleado'],
                data['fecha_inicio'],
                data['fecha_fin'],
                data['detalle'],
                3  # Pendiente
            ))

            conn.commit()
            return True

        except (sqlite3.Error, ValueError) as e:
            print(f"Error al programar mantenimiento: {e}")
            if conn: 
                conn.rollback()
            raise e
        finally:
            if conn: 
                conn.close()

    def start_mantenimiento(self, id_mantenimiento):
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return False
            
            cursor = conn.cursor()
            cursor.execute("BEGIN")

            cursor.execute("SELECT patente FROM Mantenimiento WHERE id_mantenimiento = ?", (id_mantenimiento,))
            row = cursor.fetchone()
            if not row: raise ValueError("Mantenimiento no encontrado.")
            patente = row['patente']

            sql_maint = "UPDATE Mantenimiento SET id_estado = 1 WHERE id_mantenimiento = ? AND id_estado = 3"
            cursor.execute(sql_maint, (id_mantenimiento,))
            
            if cursor.rowcount == 0:
                raise ValueError("El mantenimiento no está en estado Pendiente.")

            sql_vehiculo = "UPDATE Vehiculo SET id_estado = 3 WHERE patente = ?"
            cursor.execute(sql_vehiculo, (patente,))

            conn.commit()
            return True
        except (sqlite3.Error, ValueError) as e:
            print(f"Error al iniciar mantenimiento: {e}")
            if conn: conn.rollback()
            return False
        finally:
            if conn: conn.close()

    def finish_mantenimiento(self, id_mantenimiento):
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return False
            
            cursor = conn.cursor()
            cursor.execute("BEGIN")

            cursor.execute("SELECT patente FROM Mantenimiento WHERE id_mantenimiento = ?", (id_mantenimiento,))
            row = cursor.fetchone()
            if not row: raise ValueError("Mantenimiento no encontrado.")
            patente = row['patente']

            fecha_real_fin = datetime.now()

            sql_maint = "UPDATE Mantenimiento SET id_estado = 2, fecha_fin = ? WHERE id_mantenimiento = ? AND id_estado = 1"
            cursor.execute(sql_maint, (fecha_real_fin, id_mantenimiento))

            if cursor.rowcount == 0:
                raise ValueError("El mantenimiento no está en curso (Realizando).")

            sql_vehiculo = "UPDATE Vehiculo SET id_estado = 1 WHERE patente = ?"
            cursor.execute(sql_vehiculo, (patente,))

            conn.commit()
            return True
        except (sqlite3.Error, ValueError) as e:
            print(f"Error al finalizar mantenimiento: {e}")
            if conn: conn.rollback()
            return False
        finally:
            if conn: conn.close()

    def cancel_pending_mantenimiento(self, id_mantenimiento):
        sql = "UPDATE Mantenimiento SET id_estado = 4 WHERE id_mantenimiento = ? AND id_estado = 3"
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return False
            cursor = conn.cursor()
            cursor.execute(sql, (id_mantenimiento,))
            conn.commit()
            return cursor.rowcount > 0
        except sqlite3.Error as e:
            print(f"Error al cancelar mantenimiento: {e}")
            return False
        finally:
            if conn: conn.close()

    def get_all_mantenimientos(self):
        sql = """
            SELECT m.*, v.modelo, m.id_estado, em.descripcion as estado_desc
            FROM Mantenimiento m
            JOIN Vehiculo v ON m.patente = v.patente
            JOIN EstadoMantenimiento em ON m.id_estado = em.id_estado
            ORDER BY m.fecha_inicio DESC
        """
        conn = None
        lista = []
        try:
            conn = self._get_connection()
            if conn is None: return lista
            rows = conn.cursor().execute(sql).fetchall()
            for row in rows:
                lista.append(dict(row))
            return lista
        except sqlite3.Error as e:
            print(f"Error al listar mantenimientos: {e}")
            return []
        finally:
            if conn: conn.close()

    def get_mantenimiento_by_id(self, id_mantenimiento):
        sql = """
            SELECT m.*, v.modelo, em.descripcion as estado_desc
            FROM Mantenimiento m
            JOIN Vehiculo v ON m.patente = v.patente
            JOIN EstadoMantenimiento em ON m.id_estado = em.id_estado
            WHERE m.id_mantenimiento = ?
        """
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return None
            row = conn.cursor().execute(sql, (id_mantenimiento,)).fetchone()
            if row:
                return dict(row)
            return None
        except sqlite3.Error as e:
            print(f"Error al obtener mantenimiento: {e}")
            return None
        finally:
            if conn: conn.close()

    def delete_mantenimiento(self, id_mantenimiento):
        sql_check = "SELECT id_estado FROM Mantenimiento WHERE id_mantenimiento = ?"
        sql_delete = "DELETE FROM Mantenimiento WHERE id_mantenimiento = ?"
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return False
            cursor = conn.cursor()
            
            cursor.execute(sql_check, (id_mantenimiento,))
            row = cursor.fetchone()
            if not row: return False
            
            if row['id_estado'] == 1: 
                raise ValueError("No se puede eliminar un mantenimiento en curso. Finalícelo o cancálelo primero.")

            cursor.execute(sql_delete, (id_mantenimiento,))
            conn.commit()
            return cursor.rowcount > 0
        except (sqlite3.Error, ValueError) as e:
            print(f"Error al eliminar mantenimiento: {e}")
            return False
        finally:
            if conn: conn.close()

    # --- REPORTES Y ESTADISTICAS ---

    def get_report_alquileres_por_cliente(self, id_cliente):
        sql = """
            SELECT 
                a.id_alquiler, a.fecha_inicio, a.fecha_fin, 
                v.modelo, m.descripcion as marca, v.patente, v.precio_flota,
                COALESCE((SELECT SUM(costo) FROM Multa WHERE alquiler_id = a.id_alquiler), 0) as total_multas,
                COALESCE((SELECT SUM(costo) FROM Danio WHERE id_alquiler = a.id_alquiler), 0) as total_danios
            FROM Alquiler a
            JOIN Vehiculo v ON a.patente = v.patente
            JOIN Marca m ON v.id_marca = m.id_marca
            WHERE a.id_cliente = ?
            ORDER BY a.fecha_inicio DESC
        """
        conn = None
        lista = []
        try:
            conn = self._get_connection()
            if conn is None: return lista
            rows = conn.cursor().execute(sql, (id_cliente,)).fetchall()
            
            for row in rows:
                fmt = '%Y-%m-%dT%H:%M:%S'
                try:
                    inicio = datetime.strptime(row['fecha_inicio'], fmt)
                    fin = datetime.strptime(row['fecha_fin'], fmt)
                except ValueError:
                    # Fallback por si la fecha no tiene hora
                    fmt_short = '%Y-%m-%d'
                    inicio = datetime.strptime(row['fecha_inicio'][:10], fmt_short)
                    fin = datetime.strptime(row['fecha_fin'][:10], fmt_short)

                dias = (fin - inicio).days
                if dias < 1: dias = 1
                
                costo_alquiler = dias * row['precio_flota']
                costo_total = costo_alquiler + row['total_multas'] + row['total_danios']

                item = dict(row)
                item['dias_alquilado'] = dias
                item['costo_alquiler_base'] = costo_alquiler
                item['costo_final_total'] = costo_total
                lista.append(item)
            return lista
        except Exception as e:
            print(f"Error reporte cliente: {e}")
            return []
        finally:
            if conn: conn.close()

    def get_report_ranking_vehiculos(self, fecha_desde, fecha_hasta):
        sql = """
            SELECT v.patente, v.modelo, m.descripcion as marca, COUNT(a.id_alquiler) as cantidad_alquileres
            FROM Alquiler a
            JOIN Vehiculo v ON a.patente = v.patente
            JOIN Marca m ON v.id_marca = m.id_marca
            WHERE a.fecha_inicio >= ? AND a.fecha_inicio <= ?
            GROUP BY v.patente
            ORDER BY cantidad_alquileres DESC
        """
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return []
            rows = conn.cursor().execute(sql, (fecha_desde, fecha_hasta)).fetchall()
            return [dict(row) for row in rows]
        except Exception as e:
            print(f"Error reporte ranking: {e}")
            return []
        finally:
            if conn: conn.close()

    def get_report_evolucion_temporal(self, fecha_desde, fecha_hasta):
        sql = """
            SELECT strftime('%Y-%m', fecha_inicio) as periodo, COUNT(id_alquiler) as total_alquileres
            FROM Alquiler
            WHERE fecha_inicio >= ? AND fecha_inicio <= ?
            GROUP BY periodo
            ORDER BY periodo ASC
        """
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return []
            rows = conn.cursor().execute(sql, (fecha_desde, fecha_hasta)).fetchall()
            return [dict(row) for row in rows]
        except Exception as e:
            print(f"Error reporte evolución: {e}")
            return []
        finally:
            if conn: conn.close()

    def get_report_facturacion_mensual(self, fecha_desde, fecha_hasta):
        # Solo alquileres FINALIZADOS (id_estado = 4)
        sql = """
            SELECT 
                strftime('%Y-%m', a.fecha_fin) as periodo,
                a.fecha_inicio, a.fecha_fin, v.precio_flota
            FROM Alquiler a
            JOIN Vehiculo v ON a.patente = v.patente
            WHERE a.id_estado = 4 
            AND a.fecha_fin >= ? AND a.fecha_fin <= ?
            ORDER BY periodo ASC
        """
        conn = None
        facturacion_por_mes = {}
        
        try:
            conn = self._get_connection()
            if conn is None: return []
            rows = conn.cursor().execute(sql, (fecha_desde, fecha_hasta)).fetchall()
            
            for row in rows:
                periodo = row['periodo']
                
                fmt = '%Y-%m-%dT%H:%M:%S'
                try:
                    inicio = datetime.strptime(row['fecha_inicio'], fmt)
                    fin = datetime.strptime(row['fecha_fin'], fmt)
                except ValueError:
                    fmt_short = '%Y-%m-%d'
                    inicio = datetime.strptime(row['fecha_inicio'][:10], fmt_short)
                    fin = datetime.strptime(row['fecha_fin'][:10], fmt_short)

                dias = (fin - inicio).days
                if dias < 1: dias = 1
                
                total_row = (dias * row['precio_flota'])
                
                if periodo in facturacion_por_mes:
                    facturacion_por_mes[periodo] += total_row
                else:
                    facturacion_por_mes[periodo] = total_row
            
            resultado = [{"periodo": k, "total_facturado": v} for k, v in facturacion_por_mes.items()]
            resultado.sort(key=lambda x: x['periodo'])
            return resultado

        except Exception as e:
            print(f"Error reporte facturación: {e}")
            return []
        finally:
            if conn: conn.close()

    # Funciones específicas para PDF

    def get_detailed_client_rentals_report(self, fecha_desde, fecha_hasta):
        sql = """
            SELECT 
                -- Datos del cliente
                c.id_cliente,
                p.nombre || ' ' || p.apellido as cliente,
                p.nro_documento,
                
                -- Datos de cada alquiler individual
                a.id_alquiler,
                a.fecha_inicio,
                a.fecha_fin,
                -- CÁLCULO CORREGIDO: días enteros (mínimo 1 día)
                CASE 
                    WHEN (JULIANDAY(a.fecha_fin) - JULIANDAY(a.fecha_inicio)) < 1 THEN 1
                    ELSE CAST((JULIANDAY(a.fecha_fin) - JULIANDAY(a.fecha_inicio)) AS INTEGER)
                END as dias,
                v.modelo,
                m.descripcion as marca,
                v.patente,
                v.precio_flota,
                
                -- Total por alquiler individual CORREGIDO
                (v.precio_flota * 
                    CASE 
                        WHEN (JULIANDAY(a.fecha_fin) - JULIANDAY(a.fecha_inicio)) < 1 THEN 1
                        ELSE CAST((JULIANDAY(a.fecha_fin) - JULIANDAY(a.fecha_inicio)) AS INTEGER)
                    END
                ) as total_alquiler,
                
                -- Multas asociadas al alquiler
                COALESCE((
                    SELECT SUM(multa.costo) 
                    FROM Multa multa 
                    WHERE multa.alquiler_id = a.id_alquiler
                ), 0) as total_multas,
                
                -- Daños asociados al alquiler  
                COALESCE((
                    SELECT SUM(danio.costo) 
                    FROM Danio danio 
                    WHERE danio.id_alquiler = a.id_alquiler
                ), 0) as total_danios,
                
                -- Total por cliente (para la fila principal) CORREGIDO
                SUM(v.precio_flota * 
                    CASE 
                        WHEN (JULIANDAY(a.fecha_fin) - JULIANDAY(a.fecha_inicio)) < 1 THEN 1
                        ELSE CAST((JULIANDAY(a.fecha_fin) - JULIANDAY(a.fecha_inicio)) AS INTEGER)
                    END
                ) OVER (PARTITION BY c.id_cliente) as total_cliente
                
            FROM Alquiler a
            JOIN Cliente c ON a.id_cliente = c.id_cliente
            JOIN Persona p ON c.id_persona = p.id_persona
            JOIN Vehiculo v ON a.patente = v.patente
            JOIN Marca m ON v.id_marca = m.id_marca
            WHERE a.id_estado = 4  -- Solo alquileres finalizados
            AND a.fecha_inicio BETWEEN ? AND ?
            ORDER BY cliente, a.fecha_inicio DESC
        """
        
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return []
            rows = conn.cursor().execute(sql, [fecha_desde, fecha_hasta]).fetchall()
            
            # Agrupar por cliente
            clientes_dict = {}
            for row in rows:
                cliente_id = row['id_cliente']
                
                if cliente_id not in clientes_dict:
                    clientes_dict[cliente_id] = {
                        'cliente': row['cliente'],
                        'nro_documento': row['nro_documento'],
                        'total_facturado': row['total_cliente'],
                        'alquileres': []
                    }
                
                # Agregar alquiler individual
                clientes_dict[cliente_id]['alquileres'].append({
                    'fecha_inicio': row['fecha_inicio'],
                    'fecha_fin': row['fecha_fin'],
                    'dias': row['dias'],
                    'modelo': row['modelo'],
                    'marca': row['marca'],
                    'patente': row['patente'],
                    'precio_flota': row['precio_flota'],
                    'total_alquiler': row['total_alquiler'],
                    'total_multas': row['total_multas'],
                    'total_danios': row['total_danios'],
                    'total_general': row['total_alquiler'] + row['total_multas'] + row['total_danios']
                })
            
            return list(clientes_dict.values())
            
        except Exception as e:
            print(f"Error en reporte detallado por cliente: {e}")
            return []
        finally:
            if conn: conn.close()

    def get_rentals_by_period_report(self, periodo_tipo='mensual', fecha_desde=None, fecha_hasta=None):
        # Definir formato según el tipo de período
        format_map = {
            'mensual': "strftime('%Y-%m', fecha_inicio)", 
            'trimestral': "strftime('%Y-') || ((strftime('%m', fecha_inicio) - 1) / 3 + 1)",
            'anual': "strftime('%Y', fecha_inicio)"
        }
        
        periodo_format = format_map.get(periodo_tipo.lower(), format_map['mensual'])
        
        sql = f"""
            SELECT 
                {periodo_format} as periodo,
                COUNT(id_alquiler) as total_alquileres,
                SUM(
                    v.precio_flota * 
                    CASE 
                        -- CÁLCULO CORREGIDO: días enteros (mínimo 1 día)
                        WHEN (JULIANDAY(a.fecha_fin) - JULIANDAY(a.fecha_inicio)) < 1 THEN 1
                        ELSE CAST((JULIANDAY(a.fecha_fin) - JULIANDAY(a.fecha_inicio)) AS INTEGER)
                    END
                ) as ingresos_totales,
                AVG(
                    CASE 
                        -- CÁLCULO CORREGIDO: días enteros para el promedio también
                        WHEN (JULIANDAY(a.fecha_fin) - JULIANDAY(a.fecha_inicio)) < 1 THEN 1
                        ELSE CAST((JULIANDAY(a.fecha_fin) - JULIANDAY(a.fecha_inicio)) AS INTEGER)
                    END
                ) as duracion_promedio
            FROM Alquiler a
            JOIN Vehiculo v ON a.patente = v.patente
            WHERE a.id_estado = 4
        """
        
        params = []
        if fecha_desde and fecha_hasta:
            sql += " AND fecha_inicio BETWEEN ? AND ?"
            params.extend([fecha_desde, fecha_hasta])
        
        sql += f" GROUP BY {periodo_format} ORDER BY periodo"
        
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return []
            rows = conn.cursor().execute(sql, params).fetchall()
            return [dict(row) for row in rows]
        except Exception as e:
            print(f"Error en reporte por período: {e}")
            return []
        finally:
            if conn: conn.close()

    # --- NUEVOS MÉTODOS PARA DASHBOARD ---

    def get_alquileres_por_usuario(self, id_usuario):
        sql = """
            SELECT 
                a.*, 
                v.modelo, 
                m.descripcion as marca, 
                v.patente,
                ea.descripcion as estado_desc,
                p.nombre || ' ' || p.apellido as nombre_cliente,
                v.precio_flota,
                c.id_persona as id_persona_cliente
            FROM Alquiler a
            JOIN Vehiculo v ON a.patente = v.patente
            JOIN Marca m ON v.id_marca = m.id_marca
            JOIN EstadoAlquiler ea ON a.id_estado = ea.id_estado
            JOIN Cliente c ON a.id_cliente = c.id_cliente
            JOIN Persona p ON c.id_persona = p.id_persona
            JOIN Usuario u ON p.id_persona = u.id_persona
            WHERE u.id_usuario = ?
            ORDER BY a.fecha_inicio DESC
        """
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return []
            rows = conn.cursor().execute(sql, (id_usuario,)).fetchall()
            return [dict(row) for row in rows]
        except sqlite3.Error as e:
            print(f"Error al obtener alquileres por usuario: {e}")
            return []
        finally:
            if conn: conn.close()

    def get_vehiculos_disponibles_count(self):
        """Obtiene el conteo de vehículos disponibles (estado Libre)"""
        sql = "SELECT COUNT(*) as count FROM Vehiculo WHERE id_estado = 1"
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return 0
            row = conn.cursor().execute(sql).fetchone()
            return row['count'] if row else 0
        except sqlite3.Error as e:
            print(f"Error al contar vehículos disponibles: {e}")
            return 0
        finally:
            if conn: conn.close()


    def get_cliente_por_usuario(self, id_usuario):
        sql = """
            SELECT c.id_cliente 
            FROM Cliente c
            JOIN Usuario u ON c.id_persona = u.id_persona
            WHERE u.id_usuario = ?
        """
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return None
            
            cursor = conn.cursor()
            cursor.execute(sql, (id_usuario,))
            row = cursor.fetchone()
            
            return row[0] if row else None
            
        except sqlite3.Error as e:
            print(f"Error al obtener cliente por usuario: {e}")
            return None
        finally:
            if conn: conn.close()
    
    def get_empleado_por_usuario(self, id_usuario):
        sql = """
            SELECT e.id_empleado, e.id_persona
            FROM Empleado e
            JOIN Usuario u ON e.id_persona = u.id_persona
            WHERE u.id_usuario = ?
        """
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return None
            row = conn.cursor().execute(sql, (id_usuario,)).fetchone()
            if row:
                return {"id_empleado": row['id_empleado'], "id_persona": row['id_persona']}
            return None
        except sqlite3.Error as e:
            print(f"Error obteniendo empleado por usuario: {e}")
            return None
        finally:
            if conn: conn.close()

    def get_alquileres_por_empleado(self, id_empleado, limite=10):
        sql = """
            SELECT a.*, v.modelo, m.descripcion as marca, ea.descripcion as estado_desc
            FROM Alquiler a
            JOIN Vehiculo v ON a.patente = v.patente
            JOIN Marca m ON v.id_marca = m.id_marca
            JOIN EstadoAlquiler ea ON a.id_estado = ea.id_estado
            WHERE a.id_empleado = ?
            ORDER BY a.fecha_inicio DESC
            LIMIT ?
        """
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return []
            rows = conn.cursor().execute(sql, (id_empleado, limite)).fetchall()
            return [dict(row) for row in rows]
        except sqlite3.Error as e:
            print(f"Error obteniendo alquileres por empleado: {e}")
            return []
        finally:
            if conn: conn.close()
    
    def get_persona_por_usuario(self, id_usuario):
        sql = """
            SELECT 
                p.id_persona, p.nombre, p.apellido, p.mail, p.telefono, 
                p.fecha_nac, p.nro_documento, p.tipo_documento,
                doc.descripcion as doc_desc
            FROM Persona p
            JOIN Usuario u ON p.id_persona = u.id_persona
            JOIN Documento doc ON p.tipo_documento = doc.id_tipo
            WHERE u.id_usuario = ?
        """
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return None
            
            row = conn.cursor().execute(sql, (id_usuario,)).fetchone()
            
            if row:
                return {
                    "id_persona": row['id_persona'],
                    "nombre": row['nombre'],
                    "apellido": row['apellido'],
                    "mail": row['mail'],
                    "telefono": row['telefono'],
                    "fecha_nacimiento": row['fecha_nac'],
                    "nro_documento": row['nro_documento'],
                    "tipo_documento": row['doc_desc'],
                    "id_tipo_documento": row['tipo_documento']
                }
        except sqlite3.Error as e:
            print(f"Error al obtener persona por usuario: {e}")
        finally:
            if conn:
                conn.close()
        return None

    def update_persona_por_id(self, id_persona, persona_data):
        """Actualiza una persona validando con objetos"""
        conn = None
        try:
            # Validar creando objeto Persona
            persona_obj = self._crear_y_validar_persona(persona_data)
            
            # Verificar que la persona existe
            persona_existente = self.get_persona_por_id(id_persona)
            if not persona_existente:
                raise ValueError(f"Persona con ID {id_persona} no existe")

            conn = self._get_connection()
            if conn is None: 
                raise sqlite3.Error("No se pudo conectar a la base de datos")
            
            cursor = conn.cursor()
            
            sql = """
                UPDATE Persona
                SET nombre = ?, apellido = ?, mail = ?, telefono = ?,
                    fecha_nac = ?, tipo_documento = ?, nro_documento = ?
                WHERE id_persona = ?
            """
            cursor.execute(sql, (
                persona_data['nombre'], 
                persona_data['apellido'],
                persona_data['mail'], 
                persona_data['telefono'],
                persona_data['fecha_nacimiento'],
                persona_data['tipo_documento_id'],
                persona_data['nro_documento'],
                id_persona
            ))
            conn.commit()
            return cursor.rowcount > 0
            
        except (sqlite3.Error, ValueError) as e:
            print(f"Error al actualizar persona: {e}")
            if conn:
                conn.rollback()
            raise e
        finally:
            if conn:
                conn.close()

    def create_empleado(self, persona_data, usuario_data, role_data):
        """Crea un empleado validando con objetos"""
        conn = None
        try:
            # Validar creando objetos
            persona_obj = self._crear_y_validar_persona(persona_data)
            
            permiso_obj = self.get_permiso_by_id(usuario_data['id_permiso'])
            if not permiso_obj:
                raise ValueError(f"Permiso con ID {usuario_data['id_permiso']} no existe")

            usuario_obj = Usuario(
                user_name=usuario_data['user_name'],
                password=usuario_data['password_hash'],
                permiso=permiso_obj
            )

            empleado_obj = Empleado(
                fecha_alta=datetime.fromisoformat(role_data['fecha_alta']),
                horario=role_data['horario'],
                sueldo=role_data['sueldo']
            )

            # Verificar si el mail ya existe
            if self.get_user_data_for_login_by_mail(persona_data['mail']):
                raise ValueError(f"El mail {persona_data['mail']} ya está registrado")

            conn = self._get_connection()
            if conn is None:
                raise sqlite3.Error("No se pudo conectar a la base de datos")

            cursor = conn.cursor()
            cursor.execute("BEGIN")

            # Insertar Persona
            cursor.execute("""
                INSERT INTO Persona(nombre, apellido, mail, telefono, fecha_nac, tipo_documento, nro_documento)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                persona_data["nombre"], persona_data["apellido"], persona_data["mail"],
                persona_data["telefono"], persona_data["fecha_nacimiento"],
                persona_data["tipo_documento"], persona_data["nro_documento"]
            ))
            id_persona = cursor.lastrowid

            # Insertar Usuario
            cursor.execute("""
                INSERT INTO Usuario(id_persona, user_name, password, id_permiso)
                VALUES (?, ?, ?, ?)
            """, (
                id_persona,
                usuario_data["user_name"],
                usuario_data["password_hash"],
                usuario_data["id_permiso"]
            ))

            # Insertar Empleado
            cursor.execute("""
                INSERT INTO Empleado(id_persona, fecha_alta, horario, sueldo)
                VALUES (?, ?, ?, ?)
            """, (
                id_persona,
                role_data["fecha_alta"],
                role_data["horario"],
                role_data["sueldo"]
            ))

            conn.commit()
            return cursor.lastrowid

        except (sqlite3.Error, ValueError) as e:
            print(f"Error insertando empleado: {e}")
            if conn:
                conn.rollback()
            raise e
        finally:
            if conn:
                conn.close()

    def get_all_empleados(self):
        sql = """
            SELECT e.id_empleado, e.id_persona, p.nombre, p.apellido, p.mail, p.telefono,
                p.nro_documento, p.fecha_nac, e.fecha_alta, e.sueldo, p.tipo_documento, e.horario
            FROM Empleado e
            JOIN Persona p ON e.id_persona = p.id_persona
        """
        conn = None
        try:
            conn = self._get_connection()
            if conn is None:
                return []

            cursor = conn.cursor()
            cursor.execute(sql)
            rows = cursor.fetchall()

            empleados = []
            for row in rows:
                empleados.append({
                    "id_empleado": row["id_empleado"],
                    "id_persona": row["id_persona"],
                    "nombre": row["nombre"],
                    "apellido": row["apellido"],
                    "mail": row["mail"],
                    "telefono": row["telefono"],
                    "nro_documento": row["nro_documento"],
                    "fecha_nacimiento": str(row["fecha_nac"]),
                    "fecha_alta": str(row["fecha_alta"]),
                    "sueldo": row["sueldo"],
                    "tipo_documento": row["tipo_documento"],
                    "horario": row["horario"]
                })

            return empleados

        except Exception as e:
            print(f"Error obteniendo empleados: {e}")
            return []

        finally:
            if conn:
                conn.close()

    def update_employee_full(self, id_empleado, persona_data, role_data):
        """
        Actualiza los datos de la persona y del empleado.
        
        Args:
            id_empleado: ID del empleado a actualizar.
            persona_data: dict con los campos de Persona (nombre, apellido, mail, telefono, fecha_nac, tipo_documento, nro_documento)
            role_data: dict con los campos de Empleado (sueldo, horario, fecha_alta)
            
        Retorna:
            True si se actualizó al menos un registro, False en caso contrario.
        """
        conn = None
        try:
            conn = self._get_connection()
            cursor = conn.cursor()
            
            # Primero obtener el id_persona asociado al empleado
            cursor.execute("SELECT id_persona FROM Empleado WHERE id_empleado = ?", (id_empleado,))
            row = cursor.fetchone()
            if not row:
                print(f"No se encontró empleado con id {id_empleado}")
                return False
            id_persona = row[0]
            
            # --- Actualizar Persona ---
            sql_persona = """
                UPDATE Persona
                SET nombre = ?, apellido = ?, mail = ?, telefono = ?, fecha_nac = ?, tipo_documento = ?, nro_documento = ?
                WHERE id_persona = ?
            """
            cursor.execute(sql_persona, (
                persona_data["nombre"],
                persona_data["apellido"],
                persona_data["mail"],
                persona_data["telefono"],
                persona_data.get("fecha_nac", None),
                persona_data["tipo_documento"],
                persona_data["nro_documento"],
                id_persona
            ))
            
            # --- Actualizar Empleado ---
            sql_empleado = """
                UPDATE Empleado
                SET sueldo = ?, horario = ?, fecha_alta = ?
                WHERE id_empleado = ?
            """
            cursor.execute(sql_empleado, (
                role_data["sueldo"],
                role_data["horario"],
                role_data["fecha_alta"],
                id_empleado
            ))
            
            conn.commit()
            return cursor.rowcount > 0
        except sqlite3.Error as e:
            print(f"Error actualizando empleado completo: {e}")
            if conn:
                conn.rollback()
            return False
        finally:
            if conn:
                conn.close()

    # Método auxiliar para crear y validar persona
    def _crear_y_validar_persona(self, persona_data):
        """Crea y valida un objeto Persona"""
        documento_obj = self.get_documento_by_id(persona_data['tipo_documento_id'])
        if not documento_obj:
            raise ValueError(f"Tipo de documento con ID {persona_data['tipo_documento_id']} no existe")
        
        persona_obj = Persona(
            nombre=persona_data['nombre'],
            apellido=persona_data['apellido'],
            mail=persona_data['mail'],
            telefono=persona_data['telefono'],
            fecha_nacimiento=datetime.fromisoformat(persona_data['fecha_nacimiento']),
            tipo_documento=documento_obj,
            nro_documento=persona_data['nro_documento']
        )
        
        if not persona_obj.es_valida():
            raise ValueError("Datos de persona inválidos")
        
        return persona_obj
    
    def get_persona_por_id(self, id_persona):
        """Obtiene una persona por ID"""
        sql = """
            SELECT p.*, doc.descripcion as doc_desc
            FROM Persona p
            JOIN Documento doc ON p.tipo_documento = doc.id_tipo
            WHERE p.id_persona = ?
        """
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return None
            
            row = conn.cursor().execute(sql, (id_persona,)).fetchone()
            
            if row:
                doc_obj = Documento(
                    id_tipo=row['tipo_documento'],
                    descripcion=row['doc_desc']
                )
                
                return Persona(
                    id_persona=row['id_persona'],
                    nombre=row['nombre'],
                    apellido=row['apellido'],
                    mail=row['mail'],
                    telefono=row['telefono'],
                    fecha_nacimiento=datetime.fromisoformat(row['fecha_nac']),
                    tipo_documento=doc_obj,
                    nro_documento=row['nro_documento']
                )
        except sqlite3.Error as e:
            print(f"Error al obtener persona por ID: {e}")
        finally:
            if conn:
                conn.close()
        return None

    def get_danio_by_id(self, id_danio):
        """Obtiene un daño por ID"""
        sql = "SELECT * FROM Danio WHERE id_danio = ?"
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return None
            
            row = conn.cursor().execute(sql, (id_danio,)).fetchone()
            
            if row:
                return Danio(
                    id_danio=row['id_danio'],
                    id_alquiler=row['id_alquiler'],
                    costo=row['costo'],
                    detalle=row['detalle']
                )
        except sqlite3.Error as e:
            print(f"Error al obtener daño por ID: {e}")
        finally:
            if conn: 
                conn.close()
        return None

    def get_multa_by_id(self, id_multa):
        """Obtiene una multa por ID"""
        sql = "SELECT * FROM Multa WHERE id_multa = ?"
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return None
            
            row = conn.cursor().execute(sql, (id_multa,)).fetchone()
            
            if row:
                return Multa(
                    id_multa=row['id_multa'],
                    alquiler_id=row['alquiler_id'],
                    costo=row['costo'],
                    detalle=row['detalle'],
                    fecha_multa=datetime.fromisoformat(row['fecha_multa'])
                )
        except sqlite3.Error as e:
            print(f"Error al obtener multa por ID: {e}")
        finally:
            if conn: 
                conn.close()
        return None
