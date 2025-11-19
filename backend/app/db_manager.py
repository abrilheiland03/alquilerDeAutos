from datetime import date
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




#Armar ruta de bd
APP_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(APP_DIR)
DB_PATH = os.path.join(BACKEND_DIR, 'db', 'alquileresNuevo.db')

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
                                     fecha_nac, tipo_documento, nro_documento)
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
    
    # --- ABMC de CLIENTE ---

    def create_client_only(self, persona_data, role_data):
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return None
            
            cursor = conn.cursor()
            cursor.execute("BEGIN")

            sql_persona = """
                INSERT INTO Persona (nombre, apellido, mail, telefono, 
                                     fecha_nac, tipo_documento, nro_documento)
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

            sql_role = "INSERT INTO Cliente (id_persona, fecha_alta) VALUES (?, ?)"
            cursor.execute(sql_role, (id_persona, role_data['fecha_alta']))
            
            id_cliente = cursor.lastrowid
            
            conn.commit()
            return id_cliente

        except (sqlite3.Error, ValueError) as e:
            print(f"Error durante la creación del cliente, revirtiendo cambios: {e}")
            if conn:
                conn.rollback()
            return None
        finally:
            if conn:
                conn.close()

    def get_client_by_id(self, id_cliente):
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
                    fecha_alta=date.fromisoformat(row['fecha_alta']),
                    id_persona=row['id_persona'],
                    nombre=row['nombre'],
                    apellido=row['apellido'],
                    mail=row['mail'],
                    telefono=row['telefono'],
                    fecha_nacimiento=date.fromisoformat(row['fecha_nacimiento']),
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
                    fecha_alta=date.fromisoformat(row['fecha_alta']),
                    id_persona=row['id_persona'],
                    nombre=row['nombre'],
                    apellido=row['apellido'],
                    mail=row['mail'],
                    telefono=row['telefono'],
                    fecha_nacimiento=date.fromisoformat(row['fecha_nacimiento']),
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
                    fecha_alta=date.fromisoformat(row['fecha_alta']),
                    id_persona=row['id_persona'],
                    nombre=row['nombre'],
                    apellido=row['apellido'],
                    mail=row['mail'],
                    telefono=row['telefono'],
                    fecha_nacimiento=date.fromisoformat(row['fecha_nacimiento']),
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
        sql_update_persona = """
            UPDATE Persona
            SET nombre = ?, apellido = ?, mail = ?, telefono = ?,
                fecha_nac = ?, tipo_documento = ?, nro_documento = ?
            WHERE id_persona = (SELECT id_persona FROM Cliente WHERE id_cliente = ?)
        """
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return False
            
            cursor = conn.cursor()
            cursor.execute(sql_update_persona, (
                persona_data['nombre'], persona_data['apellido'],
                persona_data['mail'], persona_data['telefono'],
                persona_data['fecha_nacimiento'], persona_data['tipo_documento_id'],
                persona_data['nro_documento'],
                id_cliente
            ))
            conn.commit()
            return cursor.rowcount > 0 
        except sqlite3.Error as e:
            print(f"Error al actualizar cliente: {e}")
            if conn:
                conn.rollback()
            return False
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
            row = conn.cursor().execute(sql, (patente,)).fetchone()
            if row:
                return self._rebuild_vehiculo_obj(row)
        except sqlite3.Error as e:
            print(f"Error al obtener vehiculo: {e}")
        finally:
            if conn: conn.close()
        return None

    def create_vehiculo(self, data):
        sql = """
            INSERT INTO Vehiculo (patente, modelo, id_marca, anio, precio_flota, 
                                  asientos, puertas, caja_manual, 
                                  id_estado, id_color)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return False
            cursor = conn.cursor()
            cursor.execute(sql, (
                data['patente'], 
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
        except sqlite3.Error as e:
            print(f"Error al crear vehiculo: {e}")
            if conn: conn.rollback()
            return False
        finally:
            if conn: conn.close()

    def update_vehiculo(self, patente, data):
        sql = """
            UPDATE Vehiculo SET
            modelo = ?, id_marca = ?, anio = ?, precio_flota = ?,
            asientos = ?, puertas = ?, caja_manual = ?,
            id_estado = ?, id_color = ?
            WHERE patente = ?
        """
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return False
            cursor = conn.cursor()
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
        except sqlite3.Error as e:
            print(f"Error al actualizar vehiculo: {e}")
            if conn: conn.rollback()
            return False
        finally:
            if conn: conn.close()
            
    def delete_vehiculo(self, patente):
        sql = "DELETE FROM Vehiculo WHERE patente = ?"
        conn = None
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
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return False
            
            cursor = conn.cursor()
            cursor.execute("BEGIN")

            cursor.execute("SELECT id_estado FROM Vehiculo WHERE patente = ?", (data['patente'],))
            row = cursor.fetchone()
            
            if not row:
                raise ValueError(f"El vehículo {data['patente']} no existe.")
            
            if row['id_estado'] != 1: 
                raise ValueError(f"El vehículo {data['patente']} no está libre (Estado ID: {row['id_estado']}).")

            fecha_inicio = date.fromisoformat(data['fecha_inicio'])
            fecha_fin = date.fromisoformat(data['fecha_fin'])
            hoy = date.today()

            if fecha_inicio < hoy:
                raise ValueError("La fecha de inicio debe ser futura o igual a hoy.")
            
            if fecha_fin <= fecha_inicio:
                raise ValueError("La fecha de fin debe ser posterior a la fecha de inicio.")

            sql_alquiler = """
                INSERT INTO Alquiler (patente, id_cliente, id_empleado, 
                                      fecha_inicio, fecha_fin, id_estado)
                VALUES (?, ?, ?, ?, ?, ?)
            """

            if data['estado'].upper() == 'RESERVADO':
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
        base_sql = """
            SELECT a.*, v.marca, v.modelo, ea.descripcion as estado_desc
            FROM Alquiler a
            JOIN Vehiculo v ON a.patente = v.patente
            JOIN EstadoAlquiler ea ON a.id_estado = ea.id_estado
        """
        
        if id_persona_filtro:
            base_sql += " JOIN Cliente c ON a.id_cliente = c.id_cliente WHERE c.id_persona = ?"
            params = (id_persona_filtro,)
        else:
            params = ()

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
            SELECT a.*, c.id_persona as id_persona_cliente
            FROM Alquiler a
            JOIN Cliente c ON a.id_cliente = c.id_cliente
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
        sql = "UPDATE Alquiler SET id_estado = ? WHERE id_alquiler = ?"
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return False
            cursor = conn.cursor()
            cursor.execute(sql, (nuevo_id_estado, id_alquiler))
            conn.commit()
            return cursor.rowcount > 0
        except sqlite3.Error as e:
            print(f"Error al actualizar estado alquiler: {e}")
            return False
        finally:
            if conn: conn.close()

    def delete_alquiler(self, id_alquiler):
        sql = "DELETE FROM Alquiler WHERE id_alquiler = ?"
        conn = None
        try:
            conn = self._get_connection()
            if conn is None: return False
            cursor = conn.cursor()
            cursor.execute(sql, (id_alquiler,))
            conn.commit()
            return cursor.rowcount > 0
        except sqlite3.Error as e:
            print(f"Error al eliminar alquiler: {e}")
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