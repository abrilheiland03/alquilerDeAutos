import sqlite3
import os
from modelos import (
    Documento, EstadoAlquiler, EstadoAuto, 
    EstadoMantenimiento, Permiso
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