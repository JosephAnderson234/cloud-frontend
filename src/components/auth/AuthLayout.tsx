import { Link } from 'react-router-dom';
import type { AuthLayoutProps } from '@interfaces/authComponents';

export default function AuthLayout({ children, title, subtitle, linkText, linkHref, linkLabel }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center mb-6">
                        <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
                    {subtitle && (
                        <p className="text-gray-600">{subtitle}</p>
                    )}
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6">
                    {children}
                </div>

                {/* Link */}
                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        {linkText}{' '}
                        <Link
                            to={linkHref}
                            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                        >
                            {linkLabel}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}