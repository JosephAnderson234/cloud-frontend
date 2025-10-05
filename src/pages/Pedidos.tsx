import { useState } from 'react';
import type { Pedido } from '@interfaces/pedidos';
import type { PedidoFormData } from '@interfaces/pedidosComponents';
import { usePedidos } from '@hooks/usePedidos';
import { useUsuarios } from '@hooks/useUsuarios';
import Notification from '@components/Notification';
import ConfirmModal from '@components/ConfirmModal';
import PedidoTable from '@components/pedidos/PedidoTable';
import PedidoForm from '@components/pedidos/PedidoForm';
import HistoryModal from '@components/pedidos/HistoryModal';

export default function Pedidos() {
    const { pedidos, loading, error, createPedido, updatePedido, cancelPedido, clearError } = usePedidos();
    const { usuarios } = useUsuarios();
    
    // Estados para controlar la UI
    const [showForm, setShowForm] = useState(false);
    const [editingPedido, setEditingPedido] = useState<Pedido | undefined>();
    const [historyModal, setHistoryModal] = useState<{ 
        show: boolean; 
        pedidoId: string; 
        pedidoInfo: string; 
    }>({
        show: false,
        pedidoId: '',
        pedidoInfo: ''
    });
    const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; pedido: Pedido | null }>({
        show: false,
        pedido: null
    });
    
    // Estados para notificaciones
    const [notification, setNotification] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error' | 'info';
    }>({ show: false, message: '', type: 'info' });

    const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
        setNotification({ show: true, message, type });
    };

    const hideNotification = () => {
        setNotification(prev => ({ ...prev, show: false }));
    };

    // Handlers para el formulario de pedido
    const handleCreatePedido = async (data: PedidoFormData | Partial<PedidoFormData>) => {
        try {
            await createPedido(data as PedidoFormData);
            setShowForm(false);
            showNotification('Pedido creado exitosamente', 'success');
        } catch (error) {
            console.error('Error creating order:', error);
            showNotification('Error al crear el pedido', 'error');
        }
    };

    const handleUpdatePedido = async (data: PedidoFormData | Partial<PedidoFormData>) => {
        if (editingPedido) {
            try {
                await updatePedido(editingPedido._id, data);
                setEditingPedido(undefined);
                setShowForm(false);
                showNotification('Pedido actualizado exitosamente', 'success');
            } catch (error) {
                console.error('Error updating order:', error);
                showNotification('Error al actualizar el pedido', 'error');
            }
        }
    };

    const handleDeletePedido = async () => {
        if (deleteConfirm.pedido) {
            try {
                await cancelPedido(deleteConfirm.pedido._id);
                setDeleteConfirm({ show: false, pedido: null });
                showNotification('Pedido eliminado exitosamente', 'success');
            } catch (error) {
                console.error('Error deleting order:', error);
                showNotification('Error al eliminar el pedido', 'error');
            }
        }
    };

    // Handlers para la tabla
    const startEdit = (pedido: Pedido) => {
        setEditingPedido(pedido);
        setShowForm(true);
    };

    const startDelete = (pedidoId: string) => {
        const pedido = pedidos.find(p => p._id === pedidoId);
        if (pedido) {
            setDeleteConfirm({ show: true, pedido });
        }
    };

    const viewHistory = (pedidoId: string) => {
        const pedido = pedidos.find(p => p._id === pedidoId);
        if (pedido) {
            const usuario = usuarios.find(u => u.id_usuario === pedido.id_usuario);
            const pedidoInfo = `Pedido #${pedidoId.slice(-8)} - ${usuario?.nombre || `Usuario #${pedido.id_usuario}`}`;
            setHistoryModal({ show: true, pedidoId, pedidoInfo });
        }
    };

    const cancelForm = () => {
        setShowForm(false);
        setEditingPedido(undefined);
    };

    // Limpiar errores cuando se monta el componente
    const handleErrorClear = () => {
        clearError();
        hideNotification();
    };

    return (
        <div className=" bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Gestión de Pedidos</h1>
                            <p className="mt-2 text-gray-600">
                                Administra los pedidos del sistema, su estado y historial de cambios.
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            {!showForm && (
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Nuevo Pedido
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Error General */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-red-600">{error}</p>
                            <button
                                onClick={handleErrorClear}
                                className="text-red-400 hover:text-red-600"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    {/* Formulario de Pedido */}
                    {showForm && (
                        <PedidoForm
                            pedido={editingPedido}
                            onSubmit={editingPedido ? handleUpdatePedido : handleCreatePedido}
                            onCancel={cancelForm}
                            loading={loading}
                        />
                    )}

                    {/* Tabla de Pedidos */}
                    <PedidoTable
                        pedidos={pedidos}
                        onEdit={startEdit}
                        onDelete={startDelete}
                        onViewHistory={viewHistory}
                        loading={loading}
                    />
                </div>
            </div>

            {/* Modal de Historial */}
            <HistoryModal
                isOpen={historyModal.show}
                onClose={() => setHistoryModal({ show: false, pedidoId: '', pedidoInfo: '' })}
                pedidoId={historyModal.pedidoId}
                pedidoInfo={historyModal.pedidoInfo}
            />

            {/* Modal de Confirmación de Eliminación */}
            <ConfirmModal
                isOpen={deleteConfirm.show}
                onClose={() => setDeleteConfirm({ show: false, pedido: null })}
                onConfirm={handleDeletePedido}
                title="Eliminar Pedido"
                message={`¿Estás seguro de que deseas eliminar el pedido #${deleteConfirm.pedido?._id.slice(-8)}? Esta acción eliminará también todo su historial asociado y no se puede deshacer.`}
                loading={loading}
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="danger"
            />

            {/* Notificaciones */}
            <Notification
                message={notification.message}
                visible={notification.show}
                onClose={hideNotification}
                status={notification.type}
            />
        </div>
    );
}