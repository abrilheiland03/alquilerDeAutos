import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Wrench, BarChart3, Users, LogIn, UserPlus, MapPin } from 'lucide-react';

// Color principal - ahora usando clases de Tailwind directamente
const PRIMARY_COLOR = 'text-orange-500';
const PRIMARY_BG = 'bg-orange-500';
const PRIMARY_BORDER = 'border-orange-500';

// Componente Navbar simple para la página de inicio
const Navbar = () => (
    <nav className="fixed top-0 left-0 right-0 bg-white bg-opacity-95 shadow-md backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                {/* Logo y Marca */}
                <div className="flex-shrink-0 flex items-center">
                    <Car className={`h-8 w-8 ${PRIMARY_COLOR}`} />
                    <span className="ml-2 text-2xl font-bold tracking-tight text-gray-900">IngRide</span>
                </div>
                
                {/* Botones de Autenticación */}
                <div className="flex items-center space-x-4">
                    <Link
                        to="/login"
                        className={`flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white ${PRIMARY_BG} hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out`}
                    >
                        <LogIn className="h-4 w-4 mr-2" />
                        Iniciar Sesión
                    </Link>
                    <Link
                        to="/register"
                        className={`flex items-center px-4 py-2 border ${PRIMARY_BORDER} text-sm font-medium rounded-lg ${PRIMARY_COLOR} bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out`}
                    >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Registrarse
                    </Link>
                </div>
            </div>
        </div>
    </nav>
);

// Sección de características clave
const FeatureCard = ({ Icon, title, description }) => (
    <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-[1.02] border-t-2 border-transparent hover:border-orange-500">
        <div className={`flex justify-center items-center w-12 h-12 rounded-full bg-orange-100 ${PRIMARY_COLOR} mb-4`}>
            <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

// Componente Principal de la Página de Inicio
const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />

            <main className="pt-20">
                
                {/* Hero Section - Bienvenida */}
                <header className="py-24 bg-gradient-to-r from-orange-500 to-orange-600 shadow-xl">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl mb-6">
                            Bienvenido a IngRide
                        </h1>
                        <p className="mt-4 text-xl text-orange-50 max-w-3xl mx-auto font-medium">
                            Excelencia, innovación y enfoque centrado en las personas. <br/>
                            Más de 15 años liderando el alquiler y gestión de vehículos.
                        </p>
                        <div className="mt-10 flex justify-center space-x-4">
                            <Link
                                to="/login"
                                className="px-8 py-3 border border-transparent text-base font-bold rounded-lg shadow-lg text-orange-500 bg-white hover:bg-gray-50 transition duration-150 ease-in-out"
                            >
                                Empezar Ahora
                            </Link>
                            <Link
                                to="/vehicles"
                                className="px-8 py-3 border-2 border-white text-base font-bold rounded-lg text-white hover:bg-white hover:text-orange-500 transition duration-150 ease-in-out"
                            >
                                Ver Flota
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Sección 1: Historia/Acerca de */}
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="lg:text-center">
                            <h2 className={`text-base ${PRIMARY_COLOR} font-bold tracking-wide uppercase`}>Nuestra Trayectoria</h2>
                            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                                Experiencia Automotriz en Córdoba
                            </p>
                        </div>
                        <div className="mt-10 max-w-4xl mx-auto text-lg leading-7 text-gray-700 space-y-6">
                            <p>
                                En <strong>IngRide</strong>, con sede en Córdoba, Argentina, somos una empresa con 
                                más de <strong>15 años de experiencia</strong> en el sector automotriz. 
                            </p>
                            <p>
                                Desde nuestros inicios, impulsamos soluciones tecnológicas que permitan a empresas 
                                y particulares movilizarse de forma eficiente, segura y sostenible. 
                                Para nosotros, cada cliente es parte de nuestra historia.
                                <span className="block mt-2 font-semibold flex items-center text-gray-900">
                                    <MapPin className={`h-5 w-5 ${PRIMARY_COLOR} mr-2`}/>
                                    Sede Central: Córdoba, Argentina
                                </span>
                            </p>
                        </div>
                    </div>
                </section>

                {/* Sección 2: Características del Sistema (Dominio) */}
                <section className="py-16 bg-orange-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
                            Soluciones Integrales de Gestión
                        </h2>
                        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                            <FeatureCard 
                                Icon={Car}
                                title="Gestión de Flota"
                                description="Control total de vehículos, marcas, modelos y estados (Libre, Alquilado)."
                            />
                            <FeatureCard 
                                Icon={Users}
                                title="Perfiles de Usuario"
                                description="Acceso diferenciado para Clientes, Empleados y Administradores."
                            />
                            <FeatureCard 
                                Icon={Wrench}
                                title="Mantenimiento"
                                description="Seguimiento de mantenimientos preventivos y correctivos."
                            />
                            <FeatureCard 
                                Icon={BarChart3}
                                title="Estadísticas"
                                description="Reportes de facturación mensual y vehículos más solicitados."
                            />
                        </div>
                    </div>
                </section>

                {/* Sección 3: Opiniones de Clientes */}
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10">
                            La Voz de Nuestros Clientes
                        </h2>
                        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Tarjeta de Opinión 1 */}
                            <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-orange-500 rounded-t-xl"></div>
                                <p className="text-gray-600 italic mb-4">"Servicio excelente, vehículos en perfecto estado. Siempre alquilo con ellos."</p>
                                <div className="flex items-center">
                                    <div className="h-8 w-8 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 font-bold text-xs mr-3">MR</div>
                                    <p className="text-sm font-bold text-gray-900">Mariana R.</p>
                                </div>
                            </div>
                            {/* Tarjeta de Opinión 2 */}
                            <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-orange-500 rounded-t-xl"></div>
                                <p className="text-gray-600 italic mb-4">"Atención rápida y personalizada. Muy recomendable para empresas."</p>
                                <div className="flex items-center">
                                    <div className="h-8 w-8 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 font-bold text-xs mr-3">LE</div>
                                    <p className="text-sm font-bold text-gray-900">Lucas E.</p>
                                </div>
                            </div>
                            {/* Tarjeta de Opinión 3 */}
                            <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-orange-500 rounded-t-xl"></div>
                                <p className="text-gray-600 italic mb-4">"La mejor empresa de alquiler de Córdoba. Confianza total y transparencia."</p>
                                <div className="flex items-center">
                                    <div className="h-8 w-8 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 font-bold text-xs mr-3">AP</div>
                                    <p className="text-sm font-bold text-gray-900">Ana P.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Footer */}
                <footer className="bg-gray-900 py-8 border-t-4 border-orange-500">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center mb-4 md:mb-0">
                            <Car className={`h-6 w-6 ${PRIMARY_COLOR} mr-2`} />
                            <span className="text-xl font-bold text-white">IngRide</span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            &copy; {new Date().getFullYear()} IngRide - Trabajo Práctico Integrador.
                        </p>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Home;