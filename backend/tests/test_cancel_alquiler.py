import sqlite3
from backend.app.db_manager import DBManager
from backend.app.sistema import SistemaAlquiler


def setup_db(path):
    conn = sqlite3.connect(path)
    c = conn.cursor()
    # minimal schema
    c.executescript('''
    CREATE TABLE IF NOT EXISTS Permiso (id_permiso INTEGER PRIMARY KEY, descripcion TEXT);
    CREATE TABLE IF NOT EXISTS Persona (id_persona INTEGER PRIMARY KEY, nombre TEXT, apellido TEXT, mail TEXT, telefono TEXT, fecha_nac TEXT, tipo_documento INTEGER, nro_documento INTEGER);
    CREATE TABLE IF NOT EXISTS Usuario (id_usuario INTEGER PRIMARY KEY AUTOINCREMENT, id_persona INTEGER, user_name TEXT, password TEXT, id_permiso INTEGER);
    CREATE TABLE IF NOT EXISTS Cliente (id_cliente INTEGER PRIMARY KEY AUTOINCREMENT, id_persona INTEGER, fecha_alta TEXT);
    CREATE TABLE IF NOT EXISTS EstadoAuto (id_estado INTEGER PRIMARY KEY, descripcion TEXT);
    CREATE TABLE IF NOT EXISTS EstadoAlquiler (id_estado INTEGER PRIMARY KEY, descripcion TEXT);
    CREATE TABLE IF NOT EXISTS Vehiculo (patente TEXT PRIMARY KEY, modelo TEXT, id_marca INTEGER, anio INTEGER, precio_flota REAL, asientos INTEGER, puertas INTEGER, caja_manual INTEGER, id_estado INTEGER, id_color INTEGER);
    CREATE TABLE IF NOT EXISTS Alquiler (id_alquiler INTEGER PRIMARY KEY AUTOINCREMENT, patente TEXT, id_cliente INTEGER, id_empleado INTEGER, fecha_inicio TEXT, fecha_fin TEXT, id_estado INTEGER);
    ''')
    c.executemany("INSERT OR IGNORE INTO Permiso (id_permiso, descripcion) VALUES (?, ?)", [(1, 'Cliente'), (2, 'Empleado'), (3, 'Admin')])
    c.executemany("INSERT OR IGNORE INTO EstadoAuto (id_estado, descripcion) VALUES (?, ?)", [(1, 'Libre'), (5, 'Reservado')])
    c.executemany("INSERT OR IGNORE INTO EstadoAlquiler (id_estado, descripcion) VALUES (?, ?)", [(1, 'Reservado'), (2, 'Activo'), (4, 'Finalizado'), (5,'Cancelado')])
    conn.commit()
    conn.close()


def test_cancel_by_owner(tmp_path):
    dbpath = str(tmp_path / 'test.sqlite')
    setup_db(dbpath)
    DBManager._instance = None
    dbm = DBManager(db_path=dbpath)
    sistema = SistemaAlquiler()
    sistema.db_manager = dbm

    # create person and user (owner)
    conn = dbm._get_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO Persona (id_persona, nombre, apellido, mail, telefono, fecha_nac, tipo_documento, nro_documento) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                (10, 'Juan', 'Perez', 'juan@mail', '111', '1990-01-01', 1, 12345))
    cur.execute("INSERT INTO Usuario (id_persona, user_name, password, id_permiso) VALUES (?, ?, ?, ?)",
                (10, 'juan', 'pw', 1))
    cur.execute("INSERT INTO Cliente (id_persona, fecha_alta) VALUES (?, ?)", (10, '2025-01-01'))

    # vehicle and rental (reserved)
    cur.execute("INSERT INTO Vehiculo (patente, modelo, id_marca, anio, precio_flota, asientos, puertas, caja_manual, id_estado, id_color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                ('ABC123','Modelo',1,2020,100,4,4,0,1,1))
    cur.execute("INSERT INTO Alquiler (patente, id_cliente, id_empleado, fecha_inicio, fecha_fin, id_estado) VALUES (?, ?, ?, ?, ?, ?)",
                ('ABC123', 1, 1, '2025-12-01T10:00:00', '2025-12-05T10:00:00', 1))
    conn.commit()

    # get created user object
    usuario = dbm.get_full_usuario_by_id(1)
    # get alquiler id
    row = conn.cursor().execute("SELECT id_alquiler FROM Alquiler WHERE patente = ?", ('ABC123',)).fetchone()
    id_alquiler = row[0]

    # call cancelar_alquiler
    result = sistema.cancelar_alquiler(id_alquiler, usuario)
    assert result is True
    conn.close()


def test_cancel_by_other_user_forbidden(tmp_path):
    dbpath = str(tmp_path / 'test2.sqlite')
    setup_db(dbpath)
    DBManager._instance = None
    dbm = DBManager(db_path=dbpath)
    sistema = SistemaAlquiler()
    sistema.db_manager = dbm

    conn = dbm._get_connection()
    cur = conn.cursor()
    # owner
    cur.execute("INSERT INTO Persona (id_persona, nombre, apellido, mail, telefono, fecha_nac, tipo_documento, nro_documento) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                (20, 'Ana', 'Lopez', 'ana@mail', '222', '1995-01-01', 1, 54321))
    cur.execute("INSERT INTO Usuario (id_persona, user_name, password, id_permiso) VALUES (?, ?, ?, ?)",
                (20, 'ana', 'pw', 1))
    cur.execute("INSERT INTO Cliente (id_persona, fecha_alta) VALUES (?, ?)", (20, '2025-01-01'))

    # other user
    cur.execute("INSERT INTO Persona (id_persona, nombre, apellido, mail, telefono, fecha_nac, tipo_documento, nro_documento) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                (21, 'Carlos', 'Gomez', 'car@mail', '333', '1995-01-01', 1, 98765))
    cur.execute("INSERT INTO Usuario (id_persona, user_name, password, id_permiso) VALUES (?, ?, ?, ?)",
                (21, 'carlos', 'pw', 1))
    cur.execute("INSERT INTO Cliente (id_persona, fecha_alta) VALUES (?, ?)", (21, '2025-01-01'))

    # vehicle and rental
    cur.execute("INSERT INTO Vehiculo (patente, modelo, id_marca, anio, precio_flota, asientos, puertas, caja_manual, id_estado, id_color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                ('ZZZ999','ModeloX',1,2020,100,4,4,0,1,1))
    cur.execute("INSERT INTO Alquiler (patente, id_cliente, id_empleado, fecha_inicio, fecha_fin, id_estado) VALUES (?, ?, ?, ?, ?, ?)",
                ('ZZZ999', 1, 1, '2025-12-10T10:00:00', '2025-12-15T10:00:00', 1))
    conn.commit()

    # non-owner user object
    usuario_other = dbm.get_full_usuario_by_id(2)
    row = conn.cursor().execute("SELECT id_alquiler FROM Alquiler WHERE patente = ?", ('ZZZ999',)).fetchone()
    id_alquiler = row[0]

    try:
        sistema.cancelar_alquiler(id_alquiler, usuario_other)
        assert False, "Should have raised ValueError due to permission"
    except ValueError as e:
        assert 'No tiene permiso' in str(e)

    conn.close()


def test_cancel_after_started_not_allowed(tmp_path):
    dbpath = str(tmp_path / 'test3.sqlite')
    setup_db(dbpath)
    DBManager._instance = None
    dbm = DBManager(db_path=dbpath)
    sistema = SistemaAlquiler()
    sistema.db_manager = dbm

    conn = dbm._get_connection()
    cur = conn.cursor()
    # create user
    cur.execute("INSERT INTO Persona (id_persona, nombre, apellido, mail, telefono, fecha_nac, tipo_documento, nro_documento) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                (30, 'Luis', 'Perez', 'luis@mail', '444', '1988-01-01', 1, 11111))
    cur.execute("INSERT INTO Usuario (id_persona, user_name, password, id_permiso) VALUES (?, ?, ?, ?)",
                (30, 'luis', 'pw', 1))
    cur.execute("INSERT INTO Cliente (id_persona, fecha_alta) VALUES (?, ?)", (30, '2025-01-01'))

    cur.execute("INSERT INTO Vehiculo (patente, modelo, id_marca, anio, precio_flota, asientos, puertas, caja_manual, id_estado, id_color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                ('YYY111','ModelY',1,2020,100,4,4,0,1,1))
    # Create rental in state Active (2)
    cur.execute("INSERT INTO Alquiler (patente, id_cliente, id_empleado, fecha_inicio, fecha_fin, id_estado) VALUES (?, ?, ?, ?, ?, ?)",
                ('YYY111', 1, 1, '2025-11-01T10:00:00', '2025-11-10T10:00:00', 2))
    conn.commit()

    usuario = dbm.get_full_usuario_by_id(3)
    row = conn.cursor().execute("SELECT id_alquiler FROM Alquiler WHERE patente = ?", ('YYY111',)).fetchone()
    id_alquiler = row[0]

    try:
        sistema.cancelar_alquiler(id_alquiler, usuario)
        assert False, "Should have raised ValueError because rental already started"
    except ValueError as e:
        assert 'ya comenzó' in str(e) or 'no permite cancelación' in str(e)

    conn.close()
