import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Car, ArrowLeft, Loader2 } from 'lucide-react';
import { authService } from '../../services/authService';

// Componente para mensajes de estado
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

const fechaMayor = () => {
    const hoy = new Date();
    const año = hoy.getFullYear() - 18;
    hoy.setFullYear(año);
    hoy.setDate(hoy.getDate() - 1);
    return hoy.toISOString().split('T')[0];
}


const Register = () => {
    const navigate = useNavigate();
    
    // Estados de datos del registro
    const [registroData, setRegistroData] = useState({ 
        tipo: 'cliente', // Por defecto cliente
        datos: {
            nombre: '', 
            apellido: '', 
            mail: '', 
            telefono: '', 
            fecha_nacimiento: '', 
            tipo_documento_id: 1, 
            nro_documento: '', 
            user_name: '', 
            password: '',
            fecha_alta: new Date().toISOString().split('T')[0] // Fecha actual por defecto
        }
    });
    
    // Estado para mensajes y loading
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    // Manejadores de cambios
    const handleRegistroChange = (e) => {
        const { name, value } = e.target;
        
        if (name.startsWith('datos.')) {
            const fieldName = name.replace('datos.', '');
            setRegistroData(prev => ({
                ...prev,
                datos: {
                    ...prev.datos,
                    [fieldName]: value
                }
            }));
        } else {
            setRegistroData(prev => ({
                ...prev,
                [name]: value
            }));
        }
        
        setMessage({ type: '', text: '' });
    };

    // Manejador de submit del registro
    const handleRegistroSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setLoading(true);

        try {
            // Validaciones básicas
            if (registroData.datos.password.length < 6) {
                setMessage({ type: 'error', text: "La contraseña debe tener al menos 6 caracteres." });
                setLoading(false);
                return;
            }

            await authService.register(registroData);

            setMessage({ 
                type: 'success', 
                text: "¡Registro exitoso! Serás redirigido al login." 
            });
            
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            console.error("Error en registro:", error);
            if (error.response && error.response.data && error.response.data.error) {
                setMessage({ type: 'error', text: error.response.data.error });
            } else {
                setMessage({ type: 'error', text: "Error en el registro. Intente nuevamente." });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center pb-4 px-4 sm:px-6 lg:px-8 font-sans">
            
            {/* Header del Formulario */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
                <div className="flex items-center justify-center mb-2">
                    <Car className="h-10 w-10 text-orange-500" />
                    <span className="ml-3 text-3xl font-extrabold text-gray-900">IngRide</span>
                </div>
                <h1 className="text-xl font-semibold text-gray-700">Crear Cuenta</h1>
            </div>

            {/* Contenedor del Formulario */}
            <div className="relative w-full max-w-2xl bg-white p-8 shadow-2xl rounded-xl">
                <div className="registro-section">
                    <h2 className="text-3xl font-extrabold text-gray-900 flex items-center justify-center mb-2">
                        <UserPlus className="w-6 h-6 mr-2 text-gray-700" />
                        Crear Cuenta
                    </h2>
                    <p className="text-gray-700 mb-6 text-center">Registro de nuevo usuario</p>
                    
                    <FormMessage type={message.type} text={message.text} />

                    <form onSubmit={handleRegistroSubmit} className="space-y-6">
                        {/* Tipo de Usuario */}
                        {/*<div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Usuario</label>
                            <select 
                                name="tipo"
                                value={registroData.tipo}
                                onChange={handleRegistroChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                required
                            >
                                <option value="cliente">Cliente</option>
                                <option value="empleado">Empleado</option>
                                <option value="admin">Administrador</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-1">
                                {registroData.tipo === 'cliente' && "Los clientes pueden realizar alquileres y ver su historial."}
                                {registroData.tipo === 'empleado' && "Los empleados pueden gestionar alquileres y clientes."}
                                {registroData.tipo === 'admin' && "Los administradores tienen acceso completo al sistema."}
                            </p>
                        </div>*/}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Nombre */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                <input 
                                    type="text" 
                                    name="datos.nombre"
                                    className="placeholder:text-gray-800 text-gray-800 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    //placeholder="Tu nombre" 
                                    value={registroData.datos.nombre}
                                    onChange={handleRegistroChange}
                                    required
                                />
                            </div>

                            {/* Apellido */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                                <input 
                                    type="text" 
                                    name="datos.apellido"
                                    className="placeholder:text-gray-800 text-gray-800 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    //placeholder="Tu apellido" 
                                    value={registroData.datos.apellido}
                                    onChange={handleRegistroChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input 
                                type="email" 
                                name="datos.mail"
                                className="placeholder:text-gray-800 text-gray-800 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                //placeholder="tu.email@ejemplo.com" 
                                value={registroData.datos.mail}
                                onChange={handleRegistroChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Teléfono */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                <input 
                                    type="tel" 
                                    name="datos.telefono"
                                    className="placeholder:text-gray-800 text-gray-800 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    placeholder="ej: 351 123-4567" 
                                    value={registroData.datos.telefono}
                                    onChange={handleRegistroChange}
                                    required
                                />
                            </div>

                            {/* Fecha de Nacimiento */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                                <input 
                                    type="date" 
                                    name="datos.fecha_nacimiento"
                                    className="placeholder:text-gray-800 text-gray-800 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    value={registroData.datos.fecha_nacimiento}
                                    onChange={handleRegistroChange}
                                    max={fechaMayor()}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Tipo Documento */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Documento</label>
                                <select 
                                    name="datos.tipo_documento_id"
                                    value={registroData.datos.tipo_documento_id}
                                    onChange={handleRegistroChange}
                                    className="placeholder:text-gray-800 text-gray-800 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    required
                                >
                                    <option value={1}>DNI</option>
                                    <option value={2}>Pasaporte</option>
                                </select>
                            </div>

                            {/* Número de Documento */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Número de Documento</label>
                                <input 
                                    type="text" 
                                    name="datos.nro_documento"
                                    className="placeholder:text-gray-800 text-gray-800 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    //placeholder="12345678" 
                                    value={registroData.datos.nro_documento}
                                    onChange={handleRegistroChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Nombre de Usuario */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de Usuario</label>
                                <input 
                                    type="text" 
                                    name="datos.user_name"
                                    className="placeholder:text-gray-800 text-gray-800 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    //placeholder="usuario123" 
                                    value={registroData.datos.user_name}
                                    onChange={handleRegistroChange}
                                    required
                                />
                            </div>

                            {/* Contraseña */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                                <input 
                                    type="password" 
                                    name="datos.password"
                                    className="placeholder:text-gray-800 text-gray-800 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    placeholder="Mínimo 6 caracteres" 
                                    value={registroData.datos.password}
                                    onChange={handleRegistroChange}
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        {/* Campos adicionales según tipo de usuario */}
                        {registroData.tipo === 'empleado' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Alta</label>
                                    <input 
                                        type="date" 
                                        name="datos.fecha_alta"
                                        className="placeholder:text-black text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        value={registroData.datos.fecha_alta}
                                        onChange={handleRegistroChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sueldo</label>
                                    <input 
                                        type="number" 
                                        name="datos.sueldo"
                                        className="placeholder:text-black text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        placeholder="850000.00" 
                                        value={registroData.datos.sueldo || ''}
                                        onChange={handleRegistroChange}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {registroData.tipo === 'admin' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                <input 
                                    type="text" 
                                    name="datos.descripcion"
                                    className="placeholder:text-black text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    placeholder="Descripción del administrador" 
                                    value={registroData.datos.descripcion || ''}
                                    onChange={handleRegistroChange}
                                    required
                                />
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-lg font-bold rounded-lg shadow-sm text-white bg-orange-500 hover:bg-orange-600 transition duration-150 disabled:bg-gray-400"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                            ) : (
                                <UserPlus className="w-5 h-5 mr-2" />
                            )}
                            {loading ? 'Registrando...' : 'Registrarme'}
                        </button>
                    </form>
                    
                    <div className="mt-6 text-center space-y-3">
                        <Link 
                            to="/login"
                            className="flex items-center justify-center mx-auto text-sm font-medium text-gray-600 hover:text-gray-800 transition"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Volver a Iniciar Sesión
                        </Link>
                        <Link 
                            to="/"
                            className="block text-sm font-medium text-gray-600 hover:text-gray-800 transition"
                        >
                            ← Volver al inicio
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;