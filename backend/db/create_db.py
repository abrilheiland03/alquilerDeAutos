import hashlib
import os
import sqlite3
from datetime import datetime, timedelta, time

# ============================================================
# CREACIÓN DE BASE DE DATOS PARA EL SISTEMA DE ALQUILERES
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "alquileres.db")

# Conexión a la base de datos (se crea si no existe)
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# ==========================
# PERSONAS
# ==========================
cursor.execute("""
CREATE TABLE IF NOT EXISTS Persona (
    id_persona INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    telefono INTEGER NOT NULL,
    mail TEXT NOT NULL,
    fecha_nac DATE NOT NULL,
    tipo_documento INTEGER NOT NULL,
    nro_documento INTEGER NOT NULL UNIQUE,
    FOREIGN KEY (tipo_documento) REFERENCES Documento(id_tipo)

);
""")

# ==========================
# USUARIOS
# ==========================
cursor.execute("""
CREATE TABLE IF NOT EXISTS Usuario (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    id_persona INTEGER NOT NULL,
    user_name TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    id_permiso INTEGER NOT NULL,
    
    FOREIGN KEY (id_persona) REFERENCES Persona(id_persona),
    FOREIGN KEY (id_permiso) REFERENCES Permiso(id_permiso)
);
""")

# ==========================
# CLIENTES
# ==========================
cursor.execute("""
CREATE TABLE IF NOT EXISTS Cliente (
    id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,  
    id_persona INTEGER NOT NULL,                  
    fecha_alta DATE NOT NULL,                     

    FOREIGN KEY (id_persona) REFERENCES Persona(id_persona)
);
""")

# ==========================
# COLORES
# ==========================
cursor.execute("""
CREATE TABLE IF NOT EXISTS Color (
    id_color INTEGER PRIMARY KEY AUTOINCREMENT,
    descripcion TEXT NOT NULL
);
""")

# ==========================
# MARCAS
# ==========================
cursor.execute("""
CREATE TABLE IF NOT EXISTS Marca (
    id_marca INTEGER PRIMARY KEY AUTOINCREMENT,
    descripcion TEXT NOT NULL
);
""")


# ==========================
# ESTADO DE AUTO
# ==========================
cursor.execute("""
CREATE TABLE IF NOT EXISTS EstadoAuto (
    id_estado INTEGER PRIMARY KEY AUTOINCREMENT, 
    descripcion TEXT NOT NULL                   
);
""")
# Tabla EstadoAlquiler
cursor.execute("""
CREATE TABLE IF NOT EXISTS EstadoAlquiler (
    id_estado INTEGER PRIMARY KEY,   
    descripcion TEXT NOT NULL        
);
""")


# ==========================
# VEHÍCULOS
# ==========================
cursor.execute("""
CREATE TABLE IF NOT EXISTS Vehiculo (
    patente TEXT PRIMARY KEY,                   
    modelo TEXT NOT NULL,                        
    id_marca INTEGER NOT NULL,                   
    anio INTEGER NOT NULL,                       
    precio_flota REAL NOT NULL,                  
    asientos INTEGER NOT NULL,                  
    puertas INTEGER NOT NULL,                    
    caja_manual INTEGER NOT NULL,                
    id_estado INTEGER NOT NULL,                  
    id_color INTEGER NOT NULL,                  

    FOREIGN KEY (id_marca) REFERENCES Marca(id_marca),
    FOREIGN KEY (id_estado) REFERENCES EstadoAuto(id_estado),
    FOREIGN KEY (id_color) REFERENCES Color(id_color)
);
""")
#REAL refiere a float para la bd

# Tabla Multa
cursor.execute("""
CREATE TABLE IF NOT EXISTS Multa (
    id_multa INTEGER PRIMARY KEY,      
    alquiler_id INTEGER NOT NULL,      
    costo REAL NOT NULL,              
    detalle TEXT,                      
    fecha_multa TEXT NOT NULL,         
    FOREIGN KEY (alquiler_id) REFERENCES Alquiler(id_alquiler)
);
""")
cursor.execute("""
    CREATE TABLE IF NOT EXISTS Administrador (
        id_administrador INTEGER PRIMARY KEY,
        descripcion TEXT,
        id_persona INTEGER NOT NULL UNIQUE,
        FOREIGN KEY (id_persona) REFERENCES Persona(id_persona)
    );
""")
cursor.execute("""
    CREATE TABLE IF NOT EXISTS Empleado (
        id_empleado INTEGER PRIMARY KEY,
        fecha_alta DATE NOT NULL,
        sueldo REAL NOT NULL,
        id_persona INTEGER NOT NULL UNIQUE,
        FOREIGN KEY (id_persona) REFERENCES Persona(id_persona)
    );
""")

# ==========================
# ALQUILERES   desde aca no tengo base de datos asi que adivino los nombres
# ==========================
# Tabla Alquiler
cursor.execute("""
CREATE TABLE IF NOT EXISTS Alquiler (
    id_alquiler INTEGER PRIMARY KEY,              
    patente TEXT NOT NULL,                        
    id_cliente INTEGER NOT NULL,                  
    id_empleado INTEGER NOT NULL,                
    fecha_inicio TEXT NOT NULL,                   
    fecha_fin TEXT NOT NULL,                      
    id_estado INTEGER NOT NULL,                 

    FOREIGN KEY (patente) REFERENCES Vehiculo(patente),
    FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente),
    FOREIGN KEY (id_empleado) REFERENCES Empleado(id_empleado),
    FOREIGN KEY (id_estado) REFERENCES EstadoAlquiler(id_estado)
);
""")

# ==========================
# TIPOS DE MANTENIMIENTO
# ==========================
# Tabla EstadoMantenimiento
cursor.execute("""
CREATE TABLE IF NOT EXISTS EstadoMantenimiento (
    id_estado INTEGER PRIMARY KEY,   
    descripcion TEXT NOT NULL        
);
""")

# ==========================
# MANTENIMIENTO
# ==========================
# Tabla Mantenimiento
cursor.execute("""
CREATE TABLE IF NOT EXISTS Mantenimiento (
    id_mantenimiento INTEGER PRIMARY KEY,        
    patente TEXT NOT NULL,                       
    id_empleado INTEGER NOT NULL,                
    fecha_inicio TEXT NOT NULL,                  
    fecha_fin TEXT NOT NULL,                     
    detalle TEXT,                                
    id_estado INTEGER NOT NULL,                  

    FOREIGN KEY (patente) REFERENCES Vehiculo(patente),
    FOREIGN KEY (id_empleado) REFERENCES Empleado(id_empleado),
    FOREIGN KEY (id_estado) REFERENCES EstadoMantenimiento(id_estado)
);
""")
# Tabla Danio
cursor.execute("""
CREATE TABLE IF NOT EXISTS Danio (
    id_danio INTEGER PRIMARY KEY,      
    id_alquiler INTEGER NOT NULL,      
    costo REAL NOT NULL,               
    detalle TEXT,                      

    FOREIGN KEY (id_alquiler) REFERENCES Alquiler(id_alquiler)
);
""")

# Tabla Permiso
cursor.execute("""
CREATE TABLE IF NOT EXISTS Permiso (
    id_permiso INTEGER PRIMARY KEY,   
    descripcion TEXT NOT NULL         
);
""")
# Tabla Documento
cursor.execute("""
CREATE TABLE IF NOT EXISTS Documento (
    id_tipo INTEGER PRIMARY KEY,   
    descripcion TEXT NOT NULL      
);
""")

# ==========================
# POBLACION DE DATOS
# ==========================
cursor.executemany("INSERT OR IGNORE INTO Documento (id_tipo, descripcion) VALUES (?, ?)", [
    (1, 'DNI'), 
    (2, 'Pasaporte')
])

cursor.executemany("INSERT OR IGNORE INTO Permiso (id_permiso, descripcion) VALUES (?, ?)", [
    (1, 'Cliente'), 
    (2, 'Empleado'), 
    (3, 'Admin')
])

cursor.executemany("INSERT OR IGNORE INTO Color (id_color, descripcion) VALUES (?, ?)", [
    (1, 'Negro'), 
    (2, 'Blanco'), 
    (3, 'Rojo'), 
    (4, 'Azul'), 
    (5, 'Gris'), 
    (6, 'Plateado')
])

cursor.executemany("INSERT OR IGNORE INTO Marca (id_marca, descripcion) VALUES (?, ?)", [
    (1, 'Toyota'), 
    (2, 'Ford'), 
    (3, 'Chevrolet'), 
    (4, 'Renault'), 
    (5, 'Volkswagen'), 
    (6, 'Peugeot')
])

cursor.executemany("INSERT OR IGNORE INTO EstadoAuto (id_estado, descripcion) VALUES (?, ?)", [
    (1, 'Libre'), 
    (2, 'Ocupado'), 
    (3, 'En mantenimiento')
])

cursor.executemany("INSERT OR IGNORE INTO EstadoAlquiler (id_estado, descripcion) VALUES (?, ?)", [
    (1, 'Reservado'), 
    (2, 'Activo'), 
    (3, 'Atrasado'), 
    (4, 'Finalizado'), 
    (5, 'Cancelado')
])

cursor.executemany("INSERT OR IGNORE INTO EstadoMantenimiento (id_estado, descripcion) VALUES (?, ?)", [
    (1, 'Realizando'), 
    (2, 'Finalizado'), 
    (3, 'Pendiente'), 
    (4, 'Cancelado')
])

# ==========================
# CREACION ADMIN
# ==========================

try:
    cursor.execute("SELECT id_persona FROM Persona WHERE nro_documento = 20123456")
    if not cursor.fetchone():
        cursor.execute("""
            INSERT INTO Persona (nombre, apellido, mail, telefono, fecha_nac, tipo_documento, nro_documento)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, ('Carlos', 'Administrador', 'juan@email.com', '555-9988', '1980-05-20', 1, 20123456))
        
        id_persona_admin = cursor.lastrowid

        pass_hash = hashlib.sha256("12345".encode('utf-8')).hexdigest()

        cursor.execute("""
            INSERT INTO Usuario (id_persona, user_name, password, id_permiso)
            VALUES (?, ?, ?, ?)
        """, (id_persona_admin, 'admin_master', pass_hash, 3))

        cursor.execute("""
            INSERT INTO Administrador (id_persona, descripcion)
            VALUES (?, ?)
        """, (id_persona_admin, 'Administrador general con acceso total'))
        print("Admin creado.")
    else:
        print("El admin ya existe.")

except sqlite3.Error as e:
    print(f"Error creando admin: {e}")

# Guardar cambios
conn.commit()
conn.close()

print("Base de datos creada correctamente.")

