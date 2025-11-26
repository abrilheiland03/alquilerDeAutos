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

# ==========================
# SEEDING DE DATOS DE PRUEBA (Clientes, Empleados, Autos, Operaciones)
# ==========================
print("Insertando datos de prueba...")

try:
    # --- 1. CREAR EMPLEADO (Ana) ---
    cursor.execute("SELECT id_persona FROM Persona WHERE nro_documento = 30111222")
    if not cursor.fetchone():
        # Persona
        cursor.execute("""
            INSERT INTO Persona (nombre, apellido, mail, telefono, fecha_nac, tipo_documento, nro_documento)
            VALUES ('Ana', 'Lopez', 'ana.empleado@rentcar.com', '351-1111111', '1990-03-15', 1, 30111222)
        """)
        id_persona_emp = cursor.lastrowid
        
        # Usuario (Permiso 2 = Empleado)
        pass_hash = hashlib.sha256("12345".encode('utf-8')).hexdigest()
        cursor.execute("""
            INSERT INTO Usuario (id_persona, user_name, password, id_permiso)
            VALUES (?, 'ana_emp', ?, 2)
        """, (id_persona_emp, pass_hash))

        # Rol Empleado
        cursor.execute("""
            INSERT INTO Empleado (id_persona, fecha_alta, sueldo)
            VALUES (?, '2024-01-01', 850000.00)
        """, (id_persona_emp,))
        id_empleado_ana = cursor.lastrowid # Guardamos ID para usar en alquileres/mantenimientos

    # --- 2. CREAR CLIENTE 1 (Juan - El que va a tener historial) ---
    cursor.execute("SELECT id_persona FROM Persona WHERE nro_documento = 40111222")
    row_juan = cursor.fetchone()
    if not row_juan:
        # Persona
        cursor.execute("""
            INSERT INTO Persona (nombre, apellido, mail, telefono, fecha_nac, tipo_documento, nro_documento)
            VALUES ('Juan', 'Perez', 'juan.cliente@gmail.com', '351-2222222', '1995-08-20', 1, 40111222)
        """)
        id_persona_juan = cursor.lastrowid
        
        # Usuario (Permiso 1 = Cliente)
        pass_hash = hashlib.sha256("12345".encode('utf-8')).hexdigest()
        cursor.execute("""
            INSERT INTO Usuario (id_persona, user_name, password, id_permiso)
            VALUES (?, 'juan_cli', ?, 1)
        """, (id_persona_juan, pass_hash))

        # Rol Cliente
        cursor.execute("INSERT INTO Cliente (id_persona, fecha_alta) VALUES (?, '2025-01-10')", (id_persona_juan,))
        id_cliente_juan = cursor.lastrowid
    else:
        # Si ya existe, buscamos su ID de cliente para usarlo abajo
        cursor.execute("SELECT id_cliente FROM Cliente WHERE id_persona = (SELECT id_persona FROM Persona WHERE nro_documento = 40111222)")
        id_cliente_juan = cursor.fetchone()[0]

    # --- 3. CREAR CLIENTE 2 (Sofia - Sin historial aun) ---
    cursor.execute("SELECT id_persona FROM Persona WHERE nro_documento = 40333444")
    if not cursor.fetchone():
        # Persona
        cursor.execute("""
            INSERT INTO Persona (nombre, apellido, mail, telefono, fecha_nac, tipo_documento, nro_documento)
            VALUES ('Sofia', 'Garcia', 'sofia.g@gmail.com', '351-3333333', '1998-12-05', 1, 40333444)
        """)
        id_persona_sofia = cursor.lastrowid
        
        # Usuario
        pass_hash = hashlib.sha256("12345".encode('utf-8')).hexdigest()
        cursor.execute("""
            INSERT INTO Usuario (id_persona, user_name, password, id_permiso)
            VALUES (?, 'sofia_cli', ?, 1)
        """, (id_persona_sofia, pass_hash))

        # Rol Cliente
        cursor.execute("INSERT INTO Cliente (id_persona, fecha_alta) VALUES (?, '2025-02-01')", (id_persona_sofia,))

     # --- 4. CREAR VEHICULOS (Todos Libres) ---
    # Toyota Corolla (Usado para el alquiler finalizado)
    cursor.execute("INSERT OR IGNORE INTO Vehiculo (patente, modelo, id_marca, anio, precio_flota, asientos, puertas, caja_manual, id_estado, id_color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
                   ('AA111AA', 'Corolla', 1, 2017, 25000.0, 5, 4, 0, 1, 2)) # Estado 1 = Libre, Marca 1=Toyota, Color 2=Blanco

    # Ford Focus (Usado para el mantenimiento finalizado)
    cursor.execute("INSERT OR IGNORE INTO Vehiculo (patente, modelo, id_marca, anio, precio_flota, asientos, puertas, caja_manual, id_estado, id_color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
                   ('AF222BB', 'Focus', 2, 2022, 18000.0, 5, 5, 1, 1, 4)) # Estado 1 = Libre, Marca 2=Ford, Color 4=Azul

    # Chevrolet Cruze (Nuevo, sin uso)
    cursor.execute("INSERT OR IGNORE INTO Vehiculo (patente, modelo, id_marca, anio, precio_flota, asientos, puertas, caja_manual, id_estado, id_color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
                   ('AG333FV', 'Cruze', 3, 2024, 30000.0, 5, 4, 0, 1, 5)) # Estado 1 = Libre, Marca 3=Chevrolet, Color 5=Gris

    #vehiculo ocupado para ver si solo lo pueden ver empleados y admin
    # Toyota Yaris (Usado para el alquiler en curso)
    cursor.execute("INSERT OR IGNORE INTO Vehiculo (patente, modelo, id_marca, anio, precio_flota, asientos, puertas, caja_manual, id_estado, id_color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
                   ('AD343RF', 'Yaris', 1, 2019, 23000.0, 5, 4, 0, 2, 3)) # Estado 1 = Libre, Marca 1=Toyota, Color 2=Blanco

    #vehiculo ocupado para ver si solo lo pueden ver empleados y admin
    # Toyota Yaris (Usado para el alquiler en curso)
    cursor.execute("INSERT OR IGNORE INTO Vehiculo (patente, modelo, id_marca, anio, precio_flota, asientos, puertas, caja_manual, id_estado, id_color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
                   ('AD343RF', 'Yaris', 1, 2019, 23000.0, 5, 4, 0, 2, 3)) # Estado 1 = Libre, Marca 1=Toyota, Color 2=Blanco
    
     #vehiculo ocupado a futuro
    # Toyota Yaris (Usado para el alquiler futuro) quiero ver si se le muestra o no al cliente este auto
    cursor.execute("INSERT OR IGNORE INTO Vehiculo (patente, modelo, id_marca, anio, precio_flota, asientos, puertas, caja_manual, id_estado, id_color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
                   ('AG290LF', 'Hilux', 1, 2024, 35000.0, 5, 4, 1, 3, 1)) # Estado 1 = Libre, Marca 1=Toyota, Color 2=Blanco
    # Obtener IDs necesarios para operaciones (suponiendo que se acaban de insertar o ya existían)
    # Necesitamos el ID de empleado de Ana. Si no se creó recién, lo buscamos.
    if 'id_empleado_ana' not in locals():
        cursor.execute("SELECT id_empleado FROM Empleado e JOIN Persona p ON e.id_persona = p.id_persona WHERE p.nro_documento = 30111222")
        res = cursor.fetchone()
        id_empleado_ana = res[0] if res else 1 # Fallback a 1 si falla algo raro

    # --- 5. CREAR ALQUILER FINALIZADO (Para Juan con el Toyota) ---
    # Verificamos si ya existe para no duplicar
    cursor.execute("SELECT id_alquiler FROM Alquiler WHERE patente = 'AA111AA' AND fecha_inicio = '2025-01-15T10:00:00'")
    if not cursor.fetchone():
        cursor.execute("""
            INSERT INTO Alquiler (patente, id_cliente, id_empleado, fecha_inicio, fecha_fin, id_estado)
            VALUES (?, ?, ?, ?, ?, ?)
        """, ('AA111AA', id_cliente_juan, id_empleado_ana, '2025-01-15T10:00:00', '2025-01-20T18:00:00', 4)) # 4 = Finalizado
        
        id_alquiler_juan = cursor.lastrowid

    cursor.execute("SELECT id_alquiler FROM Alquiler WHERE patente = 'AF222BB' AND fecha_inicio = '2025-02-15T10:00:00'")
    if not cursor.fetchone():
        cursor.execute("""
            INSERT INTO Alquiler (patente, id_cliente, id_empleado, fecha_inicio, fecha_fin, id_estado)
            VALUES (?, ?, ?, ?, ?, ?)
        """, ('AF222BB', id_cliente_juan, id_empleado_ana, '2025-02-15T10:00:00', '2025-02-20T18:00:00', 4)) # 4 = Finalizado
        
        id_alquiler_juan = cursor.lastrowid

    #alquiler en transcurso
    cursor.execute("SELECT id_alquiler FROM Alquiler WHERE patente = 'AF222BB' AND fecha_inicio = '2025-11-15T10:00:00'")
    if not cursor.fetchone():
        cursor.execute("""
            INSERT INTO Alquiler (patente, id_cliente, id_empleado, fecha_inicio, fecha_fin, id_estado)
            VALUES (?, ?, ?, ?, ?, ?)
        """, ('AF222BB', id_cliente_juan, id_empleado_ana, '2025-11-15T10:00:00', '2025-11-30T18:00:00', 2)) # en alquiler 
        
        id_alquiler_juan = cursor.lastrowid

        # --- 6. AGREGAR MULTA Y DAÑO A ESE ALQUILER ---
        
        # Daño
        cursor.execute("""
            INSERT INTO Danio (id_alquiler, costo, detalle)
            VALUES (?, 15000.50, 'Rayón en paragolpes trasero')
        """, (id_alquiler_juan,))

        # Multa
        cursor.execute("""
            INSERT INTO Multa (alquiler_id, costo, detalle, fecha_multa)
            VALUES (?, 45000.00, 'Exceso de velocidad en Ruta 9', '2025-01-18T14:30:00')
        """, (id_alquiler_juan,))

    # --- 7. CREAR MANTENIMIENTO FINALIZADO (Para el Ford) ---
    cursor.execute("SELECT id_mantenimiento FROM Mantenimiento WHERE patente = 'BB222BB' AND fecha_inicio = '2024-12-01T08:00:00'")
    if not cursor.fetchone():
        cursor.execute("""
            INSERT INTO Mantenimiento (patente, id_empleado, fecha_inicio, fecha_fin, detalle, id_estado)
            VALUES (?, ?, ?, ?, ?, ?)
        """, ('BB222BB', id_empleado_ana, '2024-12-01T08:00:00', '2024-12-03T12:00:00', 'Cambio de aceite y filtros', 2)) # 2 = Finalizado

    print("Datos de prueba (Usuarios, Vehículos, Operaciones) insertados correctamente.")

except Exception as e:
    print(f"Ocurrió un error al insertar datos de prueba: {e}")

# Guardar cambios
conn.commit()
conn.close()

print("Base de datos creada correctamente.")

