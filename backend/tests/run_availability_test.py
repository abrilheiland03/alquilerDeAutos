import sqlite3
import tempfile
import sys
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
    ''')

    c.executemany("INSERT OR IGNORE INTO EstadoAuto (id_estado, descripcion) VALUES (?, ?)", [
        (1, 'Libre'), (2, 'Ocupado'), (5, 'Reservado')
    ])
    c.executemany("INSERT OR IGNORE INTO EstadoAlquiler (id_estado, descripcion) VALUES (?, ?)", [
        (1, 'Reservado'), (2, 'Activo'), (4, 'Finalizado')
    ])
    c.executemany("INSERT OR IGNORE INTO Marca (id_marca, descripcion) VALUES (?, ?)", [(1, 'Toyota')])
    c.executemany("INSERT OR IGNORE INTO Color (id_color, descripcion) VALUES (?, ?)", [(1, 'Blanco')])

    c.execute("INSERT OR REPLACE INTO Vehiculo (patente, modelo, id_marca, anio, precio_flota, asientos, puertas, caja_manual, id_estado, id_color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
              ('V1', 'Model1', 1, 2020, 10000.0, 4, 4, 0, 1, 1))
    c.execute("INSERT OR REPLACE INTO Vehiculo (patente, modelo, id_marca, anio, precio_flota, asientos, puertas, caja_manual, id_estado, id_color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
              ('V2', 'Model2', 1, 2021, 11000.0, 4, 4, 0, 1, 1))

    c.execute("INSERT INTO Alquiler (patente, id_cliente, id_empleado, fecha_inicio, fecha_fin, id_estado) VALUES (?, ?, ?, ?, ?, ?)",
              ('V1', 1, 1, '2025-01-10T10:00:00', '2025-01-15T18:00:00', 1))

    conn.commit()
    conn.close()


if __name__ == '__main__':
    tmp = tempfile.NamedTemporaryFile(delete=False)
    tmp.close()
    db_path = tmp.name
    setup_test_db(db_path)

    DBManager._instance = None
    dbm = DBManager(db_path=db_path)

    # Case A: start 2025-01-17 -> V1 should be excluded
    libres = dbm.get_vehiculos_libres(fecha_inicio='2025-01-17T10:00:00', fecha_fin='2025-01-20T10:00:00')
    patentes = [v['patente'] for v in libres]
    print('Case A available:', patentes)

    ok = ('V1' not in patentes) and ('V2' in patentes)

    # Case B: start 2025-01-19 -> V1 should be included
    libres2 = dbm.get_vehiculos_libres(fecha_inicio='2025-01-19T10:00:00', fecha_fin='2025-01-22T10:00:00')
    patentes2 = [v['patente'] for v in libres2]
    print('Case B available:', patentes2)

    ok = ok and ('V1' in patentes2) and ('V2' in patentes2)

    print('All tests passed' if ok else 'Tests failed')
    sys.exit(0 if ok else 1)
