import sqlite3
from datetime import datetime, timedelta, time

# ============================================================
# CREACIÓN DE BASE DE DATOS PARA EL SISTEMA DE ALQUILERES
# ============================================================

# Conexión a la base de datos (se crea si no existe)
conn = sqlite3.connect("./alquileres.db")
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
    nro_documento INTEGER NOT NULL UNIQUE
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


# Guardar cambios
conn.commit()
conn.close()

print("Base de datos creada correctamente.")
