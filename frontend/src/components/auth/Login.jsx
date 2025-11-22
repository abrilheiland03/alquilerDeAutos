import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Car, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';

// Componente para mensajes de estado (éxito/error)
const FormMessage = ({ type, text }) => {
    if (!text) return null;
    const color = type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' : 
                  type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
                  'bg-blue-100 text-blue-800 border border-blue-200';
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
    
    // Estado para errores de validación en tiempo real
    const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });

    // Expresión regular para validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validar email en tiempo real
    const validateEmail = (email) => {
        if (!email) return 'El email es requerido';
        if (!emailRegex.test(email)) return 'Formato de email inválido. Ejemplo: usuario@correo.com';
        return '';
    };

    // Manejadores de cambios
    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
        
        // Limpiar mensajes globales
        setMessage({ type: '', text: '' });
        
        // Limpiar error específico del campo mientras escribe
        if (fieldErrors[name]) {
            setFieldErrors({ ...fieldErrors, [name]: '' });
        }
    };

    // Manejador para cuando el campo pierde el foco
    const handleBlur = (e) => {
        const { name, value } = e.target;
        
        if (name === 'email') {
            const error = validateEmail(value);
            setFieldErrors({ ...fieldErrors, email: error });
        }
    };

    // Manejador de submit
    const handleLoginSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        e.stopPropagation();

        
        // Validar todos los campos antes de enviar
        const emailError = validateEmail(loginData.email);
        
        if (emailError) {
            setFieldErrors({ email: emailError, password: '' });
            setMessage({ 
                type: 'error', 
                text: "Por favor, corrige los errores en el formulario antes de continuar." 
            });
            return; // IMPORTANTE: Salir de la función si hay errores
        }

        // Limpiar errores de campo si pasa la validación
        setFieldErrors({ email: '', password: '' });

        setLoading(true);

        try {
            const response = await authService.login(loginData.email, loginData.password);

            const { user_id, nombre, rol } = response;
            
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
            
            // Mantener los datos en el formulario para que el usuario pueda corregirlos
            setLoginData(prev => ({ ...prev }));
            
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
                <h1 className="text-xl font-semibold text-gray-800">Sistema de Gestión de Alquileres</h1>
            </div>

            {/* Contenedor del Formulario */}
            <div className="relative w-full max-w-md bg-white p-8 shadow-2xl rounded-xl border border-gray-200">
                <div className="login-section animate-fadeIn">
                    <h2 className="text-3xl font-extrabold text-gray-900 flex items-center justify-center mb-2">
                        <LogIn className="w-6 h-6 mr-2 text-orange-500" />
                        Iniciar Sesión
                    </h2>
                    <p className="text-gray-700 mb-6 text-center font-medium">Accede a tu cuenta de IngRide</p>
                    
                    <FormMessage type={message.type} text={message.text} />

                    <form onSubmit={handleLoginSubmit} noValidate className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2" htmlFor="email">
                                Email
                            </label>
                            <input 
                                type="email" 
                                id="email"
                                name="email" 
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-offset-1 focus:ring-orange-500 focus:border-orange-500 transition duration-150 bg-white text-gray-900 placeholder-gray-500 ${
                                    fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="ejemplo@correo.com" 
                                value={loginData.email}
                                onChange={handleLoginChange}
                                onBlur={handleBlur}
                                required
                                disabled={loading}
                            />
                            {fieldErrors.email && (
                                <div className="flex items-center mt-1 text-red-600 text-sm">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {fieldErrors.email}
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2" htmlFor="password">
                                Contraseña
                            </label>
                            <input 
                                type="password" 
                                id="password"
                                name="password" 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-1 focus:ring-orange-500 focus:border-orange-500 transition duration-150 bg-white text-gray-900 placeholder-gray-500"
                                placeholder="••••••••" 
                                value={loginData.password}
                                onChange={handleLoginChange}
                                required
                                disabled={loading}
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-lg font-bold rounded-lg shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={loading || fieldErrors.email}
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
                        <p className="text-sm text-gray-700 mb-3 font-medium">¿No tenés cuenta?</p>
                        <Link 
                            to="/register"
                            className="w-full block px-4 py-3 border-2 border-orange-500 text-sm font-semibold rounded-lg text-orange-600 bg-white hover:bg-orange-50 transition duration-150 text-center"
                        >
                            Crear una cuenta
                        </Link>
                    </div>

                    <div className="mt-4 text-center">
                        <Link 
                            to="/"
                            className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition"
                        >
                            ← Volver al inicio
                        </Link>
                    </div>
                </div>
            </div>
            
            {/* Pie de página simple */}
            <p className="mt-8 text-center text-sm text-gray-700 font-medium">
                Solo Empleados y Administradores pueden iniciar sesión en el panel de gestión.
            </p>
        </div>
    );
};

export default Login;