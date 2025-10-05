import type { AddressSelectorProps } from '@interfaces/deliveryComponents';

const AddressSelector = ({ 
  addresses, 
  selectedAddressId, 
  onAddressSelect, 
  isLoading = false 
}: AddressSelectorProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Dirección de Entrega *
      </label>
      
      {addresses.length === 0 ? (
        <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
          No hay direcciones disponibles
        </div>
      ) : (
        <select
          value={selectedAddressId}
          onChange={(e) => onAddressSelect(parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          <option value={0}>Selecciona una dirección</option>
          {addresses.map((address) => (
            <option key={address.id_direccion} value={address.id_direccion}>
              {address.direccion}, {address.ciudad} - {address.codigo_postal}
            </option>
          ))}
        </select>
      )}
      
      {addresses.length === 0 && (
        <p className="text-xs text-gray-500 mt-1">
          Debes agregar al menos una dirección en tu perfil para poder realizar cotizaciones
        </p>
      )}
    </div>
  );
};

export default AddressSelector;