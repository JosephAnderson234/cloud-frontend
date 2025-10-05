// Test de verificación del sistema de notificaciones
// Este archivo puede ser eliminado una vez que se confirme que funciona

import { useNotification } from '@hooks/useNotification';

export default function NotificationTest() {
    const { showNotification } = useNotification();

    const testSuccess = () => {
        showNotification({
            message: '✅ ¡Notificación de éxito funcionando!',
            type: 'success',
            duration: 3000
        });
    };

    const testError = () => {
        showNotification({
            message: '❌ Notificación de error funcionando!',
            type: 'error',
            duration: 3000
        });
    };

    const testInfo = () => {
        showNotification({
            message: 'ℹ️ Notificación de info funcionando!',
            type: 'info',
            duration: 3000
        });
    };

    return (
        <div className="p-6 space-y-4">
            <h2 className="text-xl font-bold">Test de Sistema de Notificaciones</h2>
            <div className="space-x-4">
                <button 
                    onClick={testSuccess}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Test Success
                </button>
                <button 
                    onClick={testError}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Test Error
                </button>
                <button 
                    onClick={testInfo}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Test Info
                </button>
            </div>
            <p className="text-sm text-gray-600">
                Si ves notificaciones al hacer clic en los botones, el sistema está funcionando correctamente.
            </p>
        </div>
    );
}