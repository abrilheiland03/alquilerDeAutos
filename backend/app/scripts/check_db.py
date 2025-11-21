import sqlite3
import json
import os, sys
# Añadir el directorio padre (app) al path para poder importar db_manager
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from db_manager import DBManager

db = DBManager()
print('DB file:', db.db_path)

conn = sqlite3.connect(db.db_path)
conn.row_factory = sqlite3.Row
cur = conn.cursor()

print('\nÚltimos 10 usuarios (Usuario + Persona):')
try:
    rows = cur.execute("SELECT u.id_usuario, u.user_name, u.id_permiso, p.id_persona, p.mail, p.nombre, p.apellido FROM Usuario u JOIN Persona p ON u.id_persona = p.id_persona ORDER BY u.id_usuario DESC LIMIT 10").fetchall()
    for r in rows:
        print(dict(r))
except Exception as e:
    print('Error consultando Usuario:', e)

print('\nÚltimos 5 registros en Cliente:')
try:
    rows = cur.execute('SELECT * FROM Cliente ORDER BY id_cliente DESC LIMIT 5').fetchall()
    for r in rows:
        print(dict(r))
except Exception as e:
    print('Error consultando Cliente:', e)

print('\nÚltimos 5 registros en Empleado:')
try:
    rows = cur.execute('SELECT * FROM Empleado ORDER BY id_persona DESC LIMIT 5').fetchall()
    for r in rows:
        print(dict(r))
except Exception as e:
    print('Error consultando Empleado:', e)

print('\nÚltimos 5 registros en Administrador:')
try:
    rows = cur.execute('SELECT * FROM Administrador ORDER BY id_persona DESC LIMIT 5').fetchall()
    for r in rows:
        print(dict(r))
except Exception as e:
    print('Error consultando Administrador:', e)

conn.close()
