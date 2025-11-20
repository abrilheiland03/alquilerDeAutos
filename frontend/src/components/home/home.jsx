import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './home.css';

export const Home = () => {
    const navigate = useNavigate();
    const [mostrarRegistro, setMostrarRegistro] = useState(false);
    
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    
    const [registroData, setRegistroData] = useState({ 
        nombre: '', apellido: '', email: '', telefono: '', 
        fecha_nacimiento: '', nro_documento: '', user_name: '', password: '' 
    });

    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        
        // --- VALIDACIÓN DE EMAIL (Nuevo) ---
        // Regex simple que busca texto + @ + texto + . + texto
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(loginData.email)) {
            alert("Por favor, ingresa un email válido (ejemplo: usuario@dominio.com)");
            return; // Detiene el envío si el email está mal
        }
        // -----------------------------------

        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                email: loginData.email,
                password: loginData.password
            });

            const { user_id, nombre, rol } = response.data;
            
            localStorage.setItem('userId', user_id);
            localStorage.setItem('userName', nombre);
            localStorage.setItem('userRole', rol);

            alert(`¡Bienvenido de nuevo, ${nombre}!`);
            
        } catch (error) {
            console.error("Error de login:", error);
            if (error.response && error.response.status === 401) {
                alert("Email o contraseña incorrectos.");
            } else {
                alert("Ocurrió un error al intentar iniciar sesión.");
            }
        }
    };

    const handleRegistroSubmit = (e) => {
        e.preventDefault();
        alert("Funcionalidad de registro pendiente de conectar");
    };

    return (
        <div className="page-wrapper">
            <header className="navbar">
                <div className="logo-container">
                    <img src="/logo-placeholder.png" alt="Logo Empresa" className="logo-img" />
                    <a href="/" className="brand-name">Alquileres Auto</a>
                </div>
            </header>

            <main className="main-content">
                <div className="form-card">
                    
                    {!mostrarRegistro ? (
                        <div className="login-section fade-in">
                            <h2>Iniciar Sesión</h2>
                            <p className="subtitle">Accede a tu cuenta para gestionar tus alquileres</p>
                            
                            <form onSubmit={handleLoginSubmit}>
                                <div className="input-group">
                                    <label>Email</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        placeholder="ejemplo@correo.com" 
                                        value={loginData.email}
                                        onChange={handleLoginChange}
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Contraseña</label>
                                    <input 
                                        type="password" 
                                        name="password" 
                                        placeholder="••••••••" 
                                        value={loginData.password}
                                        onChange={handleLoginChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn-primary">Ingresar</button>
                            </form>

                            <div className="divider">
                                <span>¿No tienes cuenta?</span>
                            </div>
                            
                            <button 
                                className="btn-secondary" 
                                onClick={() => setMostrarRegistro(true)}
                            >
                                Quiero Registrarme
                            </button>
                        </div>
                    ) : (
                        <div className="registro-section fade-in">
                            <h2>Crear Cuenta</h2>
                            <p className="subtitle">Únete a nosotros hoy mismo</p>
                            <form onSubmit={handleRegistroSubmit}>
                                <div className="input-group">
                                    <label>Usuario</label>
                                    <input type="text" placeholder="Usuario deseado" />
                                </div>
                                <button type="submit" className="btn-primary">Registrarme</button>
                            </form>
                            
                            <button 
                                className="btn-link" 
                                onClick={() => setMostrarRegistro(false)}
                            >
                                Volver al Login
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};