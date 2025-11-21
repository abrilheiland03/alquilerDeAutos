import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogIn, Car, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// URL base de la API Flask
const API_BASE_URL = 'http://localhost:5000/api';

// Componente para mensajes de estado (éxito/error)
const FormMessage = ({ type, text }) => {
    if (!text) return null;
    const color = type === 'error' ? 'bg-red-100 text-red-700' : 
                  type === 'success' ? 'bg-green-100 text-green-700' :
                  'bg-blue-100 text-blue-700';
    return (
        <div className={`p-3 rounded-lg text-sm mb-4 ${color}`} role="alert">
            {text}
        </div>
    );
};

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    
    // Estados de datos
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    
    // Estado para mensajes de error o éxito
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    // Manejadores de cambios
    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
        setMessage({ type: '', text: '' }); 
    };

    // Manejador de submit
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setLoading(true);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(loginData.email)) {
            setMessage({ type: 'error', text: "Por favor, ingresa un email válido." });
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/login`, {
                email: loginData.email,
                password: loginData.password
            });

            const { user_id, nombre, rol } = response.data;
            
            // Usar el contexto de autenticación para hacer login
            await login({
                userId: user_id,
                userName: nombre,
                userRole: rol
            });
            
            setMessage({ type: 'success', text: `¡Bienvenido ${nombre}! Redireccionando...` });
            
            // Redirigir al dashboard después del login exitoso
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);

        } catch (error) {
            console.error("Error de login:", error);
            if (error.response && error.response.status === 401) {
                setMessage({ type: 'error', text: "Email o contraseña incorrectos." });
            } else {
                setMessage({ type: 'error', text: "Error de conexión o servidor no disponible." });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
            
            {/* Header del Formulario */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
                <div className="flex items-center justify-center mb-2">
                    <Car className="h-10 w-10 text-orange-500" />
                    <span className="ml-3 text-3xl font-extrabold text-gray-900">IngRide</span>
                </div>
                <h1 className="text-xl font-semibold text-gray-700">Sistema de Gestión de Alquileres</h1>
            </div>

            {/* Contenedor del Formulario */}
            <div className="relative w-full max-w-md bg-white p-8 shadow-2xl rounded-xl">
                <div className="login-section animate-fadeIn">
                    <h2 className="text-3xl font-extrabold text-gray-900 flex items-center justify-center mb-2">
                        <LogIn className="w-6 h-6 mr-2 text-gray-500" />
                        Iniciar Sesión
                    </h2>
                    <p className="text-gray-500 mb-6 text-center">Accede a tu cuenta de IngRide</p>
                    
                    <FormMessage type={message.type} text={message.text} />

                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
                            <input 
                                type="email" 
                                id="email"
                                name="email" 
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-1 focus:ring-orange-500 focus:border-orange-500 transition duration-150"
                                placeholder="ejemplo@correo.com" 
                                value={loginData.email}
                                onChange={handleLoginChange}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Contraseña</label>
                            <input 
                                type="password" 
                                id="password"
                                name="password" 
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-1 focus:ring-orange-500 focus:border-orange-500 transition duration-150"
                                placeholder="••••••••" 
                                value={loginData.password}
                                onChange={handleLoginChange}
                                required
                                disabled={loading}
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-lg font-bold rounded-lg shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out disabled:bg-gray-400"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                            ) : (
                                <LogIn className="w-5 h-5 mr-2" />
                            )}
                            {loading ? 'Cargando...' : 'Ingresar'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 mb-3">¿No tenés cuenta?</p>
                        <Link 
                            to="/register"
                            className="w-full block px-4 py-2 border-2 border-orange-500 text-sm font-medium rounded-lg text-orange-500 bg-white hover:bg-orange-50 transition duration-150 text-center"
                        >
                            Crear una cuenta
                        </Link>
                    </div>

                    <div className="mt-4 text-center">
                        <Link 
                            to="/"
                            className="text-sm font-medium text-gray-600 hover:text-gray-800 transition"
                        >
                            ← Volver al inicio
                        </Link>
                    </div>
                </div>
            </div>
            
            {/* Pie de página simple */}
            <p className="mt-8 text-center text-sm text-gray-500">
                Solo Empleados y Administradores pueden iniciar sesión en el panel de gestión.
            </p>
        </div>
    );
};

export default Login;