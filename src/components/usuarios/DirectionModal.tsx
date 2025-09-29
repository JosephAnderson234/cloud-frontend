import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DirectionModalProps, DirectionFormData } from '@interfaces/usuariosComponents';
import type { Direccion } from '@interfaces/usuarios';
import { useDirecciones } from '@hooks/useUsuarios';
import DirectionForm from '@components/usuarios/DirectionForm';
import ConfirmModal from '@components/usuarios/ConfirmModal';

export default function DirectionModal({ isOpen, onClose, userId, userName }: DirectionModalProps) {
    const { direcciones, loading, error, fetchDirecciones, createDireccion, updateDireccion, deleteDireccion, clearError } = useDirecciones();
    const [showForm, setShowForm] = useState(false);
    const [editingDirection, setEditingDirection] = useState<Direccion | undefined>();
    const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; direction: Direccion | null }>({
        show: false,
        direction: null
    });

    useEffect(() => {
        if (isOpen) {
            fetchDirecciones(userId);
            setShowForm(false);
            setEditingDirection(undefined);
        }
    }, [isOpen, userId, fetchDirecciones]);

    const handleCreateDirection = async (data: DirectionFormData) => {
        try {
            await createDireccion({ ...data, id_usuario: userId });
            setShowForm(false);
        } catch (error) {
            console.error('Error creating direction:', error);
        }
    };

    const handleUpdateDirection = async (data: DirectionFormData) => {
        if (editingDirection) {
            try {
                await updateDireccion(editingDirection.id_direccion, data);
                setEditingDirection(undefined);
                setShowForm(false);
            } catch (error) {
                console.error('Error updating direction:', error);
            }
        }
    };

    const handleDeleteDirection = async () => {
        if (deleteConfirm.direction) {
            try {
                await deleteDireccion(deleteConfirm.direction.id_direccion);
                setDeleteConfirm({ show: false, direction: null });
            } catch (error) {
                console.error('Error deleting direction:', error);
            }
        }
    };

    const startEdit = (direction: Direccion) => {
        setEditingDirection(direction);
        setShowForm(true);
    };

    const startDelete = (direction: Direccion) => {
        setDeleteConfirm({ show: true, direction });
    };

    const handleClose = () => {
        setShowForm(false);
        setEditingDirection(undefined);
        clearError();
        onClose();
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                                onClick={handleClose}
                            />

                            {/* Modal */}
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                                &#8203;
                            </span>
                            
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
                            >
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 className="text-lg leading-6 font-semibold text-gray-900">
                                                Direcciones de {userName}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Gestiona las direcciones asociadas a este usuario
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {!showForm && (
                                                <button
                                                    onClick={() => setShowForm(true)}
                                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                                >
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                    Nueva Dirección
                                                </button>
                                            )}
                                            <button
                                                onClick={handleClose}
                                                className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Error message */}
                                    {error && (
                                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                                            <p className="text-sm text-red-600">{error}</p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Form Column */}
                                        <div>
                                            {showForm && (
                                                <DirectionForm
                                                    direction={editingDirection}
                                                    userId={userId}
                                                    onSubmit={editingDirection ? handleUpdateDirection : handleCreateDirection}
                                                    onCancel={() => {
                                                        setShowForm(false);
                                                        setEditingDirection(undefined);
                                                    }}
                                                    loading={loading}
                                                />
                                            )}
                                        </div>

                                        {/* Directions List */}
                                        <div>
                                            <h4 className="text-md font-medium text-gray-900 mb-4">
                                                Direcciones registradas ({direcciones.length})
                                            </h4>
                                            
                                            {loading && direcciones.length === 0 ? (
                                                <div className="space-y-3">
                                                    {[...Array(3)].map((_, i) => (
                                                        <div key={i} className="animate-pulse bg-gray-200 h-20 rounded-lg"></div>
                                                    ))}
                                                </div>
                                            ) : direcciones.length === 0 ? (
                                                <div className="text-center py-8">
                                                    <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <p className="text-sm text-gray-500">No hay direcciones registradas</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                                    {direcciones.map((direccion) => (
                                                        <div key={direccion.id_direccion} className="bg-gray-50 rounded-lg p-4">
                                                            <div className="flex justify-between items-start">
                                                                <div className="flex-1">
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        {direccion.direccion}
                                                                    </p>
                                                                    <p className="text-sm text-gray-600 mt-1">
                                                                        {direccion.ciudad}, {direccion.codigo_postal}
                                                                    </p>
                                                                </div>
                                                                <div className="flex space-x-2 ml-4">
                                                                    <button
                                                                        onClick={() => startEdit(direccion)}
                                                                        className="p-1 text-blue-600 hover:bg-blue-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                        </svg>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => startDelete(direccion)}
                                                                        className="p-1 text-red-600 hover:bg-red-100 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={deleteConfirm.show}
                onClose={() => setDeleteConfirm({ show: false, direction: null })}
                onConfirm={handleDeleteDirection}
                title="Eliminar Dirección"
                message={`¿Estás seguro de que deseas eliminar la dirección "${deleteConfirm.direction?.direccion}"? Esta acción no se puede deshacer.`}
                loading={loading}
            />
        </>
    );
}