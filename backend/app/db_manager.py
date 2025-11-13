from datetime import date
import sqlite3
import os
from modelos import (
    Documento, EstadoAlquiler, EstadoAuto, 
    EstadoMantenimiento, Permiso, Usuario
)



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
    
    def create_full_user(self, persona_data, usuario_data, 
                         role_data, role_type):
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return None
            
            cursor = conn.cursor()
            
            cursor.execute("BEGIN")

            sql_persona = """
                INSERT INTO Persona (nombre, apellido, mail, telefono, 
                                     fecha_nacimiento, tipo_documento, nro_documento)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """
            cursor.execute(sql_persona, (
                persona_data['nombre'], persona_data['apellido'], 
                persona_data['mail'], persona_data['telefono'],
                persona_data['fecha_nacimiento'], persona_data['tipo_documento_id'], 
                persona_data['nro_documento']
            ))
            
            id_persona = cursor.lastrowid
            if not id_persona:
                raise sqlite3.Error("No se pudo obtener el ID de la persona.")

            sql_usuario = """
                INSERT INTO Usuario (id_persona, user_name, password, id_permiso)
                VALUES (?, ?, ?, ?)
            """
            cursor.execute(sql_usuario, (
                id_persona, usuario_data['user_name'], 
                usuario_data['password_hash'], usuario_data['id_permiso']
            ))

            if role_type == 'cliente':
                sql_role = "INSERT INTO Cliente (id_persona, fecha_alta) VALUES (?, ?)"
                cursor.execute(sql_role, (id_persona, role_data['fecha_alta']))
            
            elif role_type == 'empleado':
                sql_role = "INSERT INTO Empleado (id_persona, fecha_alta, sueldo) VALUES (?, ?, ?)"
                cursor.execute(sql_role, (id_persona, role_data['fecha_alta'], role_data['sueldo']))
            
            elif role_type == 'admin':
                sql_role = "INSERT INTO Administrador (id_persona, descripcion) VALUES (?, ?)"
                cursor.execute(sql_role, (id_persona, role_data['descripcion']))
            
            else:
                raise ValueError("Tipo de rol no válido.")

            conn.commit()
            return id_persona

        except (sqlite3.Error, ValueError) as e:
            print(f"Error durante el registro, revirtiendo cambios: {e}")
            if conn:
                conn.rollback()
            return None
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
                p.fecha_nacimiento, p.nro_documento,
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
                doc_obj = Documento(
                    id_tipo=row['id_tipo'], 
                    descripcion=row['doc_desc']
                )
                perm_obj = Permiso(
                    id_permiso=row['id_permiso'],
                    descripcion=row['permiso_desc']
                )
                
                usuario_obj = Usuario(
                    id_usuario=row['id_usuario'],
                    user_name=row['user_name'],
                    password=row['password'],
                    permiso=perm_obj,
                )
                return usuario_obj
        except sqlite3.Error as e:
            print(f"Error al buscar usuario completo: {e}")
        finally:
            if conn:
                conn.close()
        return None