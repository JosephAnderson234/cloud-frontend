import type { UserSelectorProps } from '@interfaces/pedidosComponents';

export default function UserSelector({ usuarios, selectedUserId, onUserChange, loading }: UserSelectorProps) {
    return (
        <div>
            <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 mb-2">
                Usuario <span className="text-red-500">*</span>
            </label>
            <select
                id="usuario"
                value={selectedUserId || ''}
                onChange={(e) => onUserChange(Number(e.target.value))}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
                <option value="">Selecciona un usuario</option>
                {usuarios.map((usuario) => (
                    <option key={usuario.id_usuario} value={usuario.id_usuario}>
                        {usuario.nombre} ({usuario.correo})
                    </option>
                ))}
            </select>
        </div>
    );
}