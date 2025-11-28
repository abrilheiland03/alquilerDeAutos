import os
import sqlite3
import tempfile
from backend.app.db_manager import DBManager


def setup_test_db(path):
    conn = sqlite3.connect(path)
    c = conn.cursor()
    # Minimal schema required for the test
    c.executescript("""
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
    """)

    # Seed states
    c.executemany("INSERT OR IGNORE INTO EstadoAuto (id_estado, descripcion) VALUES (?, ?)", [
        (1, 'Libre'), (2, 'Ocupado'), (5, 'Reservado')
    ])
    c.executemany("INSERT OR IGNORE INTO EstadoAlquiler (id_estado, descripcion) VALUES (?, ?)", [
        (1, 'Reservado'), (2, 'Activo'), (4, 'Finalizado')
    ])

    # Seed marca/color
    c.executemany("INSERT OR IGNORE INTO Marca (id_marca, descripcion) VALUES (?, ?)", [(1, 'Toyota')])
    c.executemany("INSERT OR IGNORE INTO Color (id_color, descripcion) VALUES (?, ?)", [(1, 'Blanco')])

    # Vehicles
    c.execute("INSERT OR REPLACE INTO Vehiculo (patente, modelo, id_marca, anio, precio_flota, asientos, puertas, caja_manual, id_estado, id_color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
              ('V1', 'Model1', 1, 2020, 10000.0, 4, 4, 0, 1, 1))
    c.execute("INSERT OR REPLACE INTO Vehiculo (patente, modelo, id_marca, anio, precio_flota, asientos, puertas, caja_manual, id_estado, id_color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
              ('V2', 'Model2', 1, 2021, 11000.0, 4, 4, 0, 1, 1))

    # Add an existing reservation for V1 that ends on 2025-01-15
    c.execute("INSERT INTO Alquiler (patente, id_cliente, id_empleado, fecha_inicio, fecha_fin, id_estado) VALUES (?, ?, ?, ?, ?, ?)",
              ('V1', 1, 1, '2025-01-10T10:00:00', '2025-01-15T18:00:00', 1))

    conn.commit()
    conn.close()


def test_get_vehiculos_libres_respects_3_day_buffer(tmp_path):
    temp_db = tmp_path / "test_db.sqlite"
    setup_test_db(str(temp_db))

    # Reset singleton if any
    DBManager._instance = None
    dbm = DBManager(db_path=str(temp_db))

    # Request a rental that starts 2025-01-17 and ends 2025-01-20
    # Because V1 ends on 2025-01-15, 2025-01-17 is only 2 days later -> should be excluded
    fecha_inicio = '2025-01-17T10:00:00'
    fecha_fin = '2025-01-20T10:00:00'

    libres = dbm.get_vehiculos_libres(fecha_inicio=fecha_inicio, fecha_fin=fecha_fin)
    patentes = [v['patente'] for v in libres]

    assert 'V1' not in patentes
    assert 'V2' in patentes


def test_get_vehiculos_libres_allows_after_3_days(tmp_path):
    temp_db = tmp_path / "test_db.sqlite"
    setup_test_db(str(temp_db))

    DBManager._instance = None
    dbm = DBManager(db_path=str(temp_db))

    # Request starting 2025-01-19 (4 days after 15) -> should include V1
    fecha_inicio = '2025-01-19T10:00:00'
    fecha_fin = '2025-01-22T10:00:00'

    libres = dbm.get_vehiculos_libres(fecha_inicio=fecha_inicio, fecha_fin=fecha_fin)
    patentes = [v['patente'] for v in libres]

    assert 'V1' in patentes
    assert 'V2' in patentes
