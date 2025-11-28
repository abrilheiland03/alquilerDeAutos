import sqlite3
from backend.app.db_manager import DBManager


def setup_test_db(path):
    conn = sqlite3.connect(path)
    c = conn.cursor()
    c.executescript('''
    CREATE TABLE IF NOT EXISTS EstadoAuto (id_estado INTEGER PRIMARY KEY, descripcion TEXT);
    CREATE TABLE IF NOT EXISTS Marca (id_marca INTEGER PRIMARY KEY, descripcion TEXT);
    CREATE TABLE IF NOT EXISTS Color (id_color INTEGER PRIMARY KEY, descripcion TEXT);
    CREATE TABLE IF NOT EXISTS Vehiculo (
        patente TEXT PRIMARY KEY, modelo TEXT, id_marca INTEGER, anio INTEGER,
        precio_flota REAL, asientos INTEGER, puertas INTEGER, caja_manual INTEGER,
        id_estado INTEGER, id_color INTEGER
    );
    CREATE TABLE IF NOT EXISTS EstadoAlquiler (id_estado INTEGER PRIMARY KEY, descripcion TEXT);
    CREATE TABLE IF NOT EXISTS Alquiler (
        id_alquiler INTEGER PRIMARY KEY AUTOINCREMENT, patente TEXT, id_cliente INTEGER,
        id_empleado INTEGER, fecha_inicio TEXT, fecha_fin TEXT, id_estado INTEGER
    );
    CREATE TABLE IF NOT EXISTS Mantenimiento (id_mantenimiento INTEGER PRIMARY KEY, patente TEXT, id_empleado INTEGER, fecha_inicio TEXT, fecha_fin TEXT, detalle TEXT, id_estado INTEGER);
    ''')

    c.executemany("INSERT OR IGNORE INTO EstadoAuto (id_estado, descripcion) VALUES (?, ?)", [
        (1, 'Libre'), (2, 'Ocupado'), (3, 'En mantenimiento'), (5, 'Reservado')
    ])
    c.executemany("INSERT OR IGNORE INTO EstadoAlquiler (id_estado, descripcion) VALUES (?, ?)", [
        (1, 'Reservado'), (2, 'Activo'), (4, 'Finalizado')
    ])

    c.executemany("INSERT OR IGNORE INTO Marca (id_marca, descripcion) VALUES (?, ?)", [(1, 'Toyota')])
    c.executemany("INSERT OR IGNORE INTO Color (id_color, descripcion) VALUES (?, ?)", [(1, 'Blanco')])

    # Vehicle left as 'Reservado' to simulate state not updated
    c.execute("INSERT OR REPLACE INTO Vehiculo (patente, modelo, id_marca, anio, precio_flota, asientos, puertas, caja_manual, id_estado, id_color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
              ('V1', 'Model1', 1, 2020, 10000.0, 4, 4, 0, 5, 1))

    # Existing rental that ends 2026-01-01
    # We'll mark it as Finalizado (4) to simulate a past rental
    c.execute("INSERT INTO Alquiler (patente, id_cliente, id_empleado, fecha_inicio, fecha_fin, id_estado) VALUES (?, ?, ?, ?, ?, ?)",
              ('V1', 1, 1, '2025-12-31T10:00:00', '2026-01-01T18:00:00', 4))

    conn.commit()
    conn.close()


def test_create_allows_booking_after_exact_3_day_gap(tmp_path):
    db_path = str(tmp_path / 'test.sqlite')
    setup_test_db(db_path)

    DBManager._instance = None
    dbm = DBManager(db_path=db_path)

    data = {
        'patente': 'V1',
        'id_cliente': 2,
        'id_empleado': 1,
        'fecha_inicio': '2026-01-04T10:00:00',
        'fecha_fin': '2026-01-08T10:00:00',
        'estado': 'RESERVADO'
    }

    ok = dbm.create_alquiler_transactional(data)
    assert ok is True


def test_create_rejects_booking_within_buffer(tmp_path):
    db_path = str(tmp_path / 'test.sqlite')
    setup_test_db(db_path)

    DBManager._instance = None
    dbm = DBManager(db_path=db_path)

    data = {
        'patente': 'V1',
        'id_cliente': 2,
        'id_empleado': 1,
        'fecha_inicio': '2026-01-03T10:00:00',  # only 2 days after 2026-01-01
        'fecha_fin': '2026-01-07T10:00:00',
        'estado': 'RESERVADO'
    }

    ok = dbm.create_alquiler_transactional(data)
    assert ok is False


def test_create_rejects_overlap(tmp_path):
    db_path = str(tmp_path / 'test.sqlite')
    setup_test_db(db_path)

    DBManager._instance = None
    dbm = DBManager(db_path=db_path)

    # Overlapping (starts before previous ended)
    data = {
        'patente': 'V1',
        'id_cliente': 2,
        'id_empleado': 1,
        'fecha_inicio': '2025-12-31T12:00:00',
        'fecha_fin': '2026-01-02T10:00:00',
        'estado': 'RESERVADO'
    }

    ok = dbm.create_alquiler_transactional(data)
    assert ok is False
