import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import type { NavigationItem } from '@interfaces/authComponents';

const navigation: NavigationItem[] = [
    {
        name: 'Usuarios',
        href: '/users',
        icon: ({ className }) => (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
        ),
        requiresAuth: true
    },
    {
        name: 'Productos',
        href: '/products',
        icon: ({ className }) => (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        ),
        requiresAuth: true
    },
    {
        name: 'Pedidos',
        href: '/orders',
        icon: ({ className }) => (
            <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        requiresAuth: true
    },
];

export default function NavBar() {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, session, logout } = useAuth();
    const location = useLocation();

    const filteredNavigation = navigation.filter(item => 
        !item.requiresAuth || isAuthenticated
    );

    const isCurrentPath = (href: string) => {
        return location.pathname === href;
    };

    return (
        <nav className="bg-white shadow-lg border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo y navegación principal */}
                    <div className="flex items-center">
                        {/* Logo */}
                        <Link to={isAuthenticated ? "/users" : "/auth/login"} className="flex items-center">
                            <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center mr-3">
                                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-gray-900">CloudApp</span>
                        </Link>

                        {/* Navigation Links - Desktop */}
                        {isAuthenticated && (
                            <div className="hidden md:flex ml-10 space-x-8">
                                {filteredNavigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`inline-flex items-center px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                                            isCurrentPath(item.href)
                                                ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                                                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* User menu */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated && session ? (
                            <>
                                {/* User info - Desktop */}
                                <div className="hidden md:flex items-center space-x-3">
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">{session.nombre}</p>
                                        <p className="text-xs text-gray-500">{session.correo}</p>
                                    </div>
                                    <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                                        {session.nombre.charAt(0).toUpperCase()}
                                    </div>
                                </div>

                                {/* Logout button */}
                                <button
                                    onClick={logout}
                                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Cerrar Sesión
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link
                                    to="/auth/login"
                                    className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    to="/auth/register"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                >
                                    Registrarse
                                </Link>
                            </div>
                        )}

                        {/* Mobile menu button */}
                        {isAuthenticated && (
                            <button
                                type="button"
                                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <span className="sr-only">Abrir menú principal</span>
                                <svg
                                    className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                                <svg
                                    className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isAuthenticated && (
                <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
                    <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 border-t border-gray-200">
                        {/* User info - Mobile */}
                        <div className="flex items-center px-3 py-3 border-b border-gray-200 mb-2">
                            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                                {session?.nombre.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">{session?.nombre}</p>
                                <p className="text-xs text-gray-500">{session?.correo}</p>
                            </div>
                        </div>

                        {/* Navigation - Mobile */}
                        {filteredNavigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors ${
                                    isCurrentPath(item.href)
                                        ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                                }`}
                                onClick={() => setIsOpen(false)}
                            >
                                {item.icon && <item.icon className="w-5 h-5 mr-3" />}
                                {item.name}
                            </Link>
                        ))}

                        {/* Logout - Mobile */}
                        <button
                            onClick={() => {
                                logout();
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
