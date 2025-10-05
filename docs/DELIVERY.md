# 🚚 Documentación - Orquestador Delivery

## 📖 Descripción General

La página de **Orquestador Delivery** es una interfaz web que implementa las funcionalidades del microservicio MS4-Orquestador para gestionar cotizaciones de carrito y consultar detalles enriquecidos de pedidos mediante la orquestación de múltiples microservicios.

## 🎯 Funcionalidades Principales

### 1. 🛒 Cotización de Carrito

#### Descripción
Permite calcular el precio total de un carrito de compras validando usuarios, direcciones y consultando precios actuales de productos.

#### Endpoint Backend
```http
POST /orq/cart/price-quote
```

#### Request Body
```json
{
  "id_usuario": 1,
  "id_direccion": 1,
  "items": [
    {"id_producto": 1, "cantidad": 2}
  ]
}
```

#### Response
```json
{
  "generatedAt": "2025-09-30T23:03:07Z",
  "items": [
    {
      "id_producto": 1,
      "nombre": "producto_1",
      "precio_unitario": 473.58,
      "cantidad": 2,
      "line_total": 947.16,
      "categoria_id": null,
      "categoria_nombre": null,
      "price_changed": false
    }
  ],
  "issues": [],
  "totals": {
    "subtotal": 947.16,
    "taxes": 170.49,
    "total": 1117.65
  }
}
```

#### Proceso de Orquestación
1. **Validación de Usuario** (MS1)
   - Verifica que el usuario exista
   - Opcionalmente valida la dirección

2. **Consulta de Productos** (MS2)
   - Obtiene precios vigentes de cada producto
   - No confía en los precios del cliente
   - Detecta cambios de precio

3. **Cálculo de Totales**
   - Subtotal (suma de líneas)
   - Impuestos (usando TAX_RATE)
   - Total final

### 2. 📋 Detalles Enriquecidos de Pedido

#### Descripción
Consulta información completa de un pedido existente, enriqueciendo los datos con información actual de productos y usuarios.

#### Endpoint Backend
```http
GET /orq/orders/{order_id}/details?id_usuario={id_usuario}
```

#### Response
```json
{
  "orderId": "68dc67973081efedbf717c7d",
  "estado": "pendiente",
  "fecha_pedido": "2025-09-30T23:28:23.441Z",
  "user": {
    "id_usuario": 1,
    "nombre": "Juan",
    "correo": "juan@acme.com",
    "telefono": "999999999",
    "direcciones_count": 1
  },
  "lines": [
    {
      "id_producto": 1,
      "nombre": "producto_1",
      "cantidad": 1,
      "precio_unitario_ms3": 100,
      "line_total_ms3": 100,
      "current_price_ms2": 120,
      "price_changed_since_order": true,
      "categoria_id": 5,
      "categoria_nombre": "Electrónica"
    }
  ],
  "issues": [
    {"id_producto": 1, "reason": "PRICE_CHANGED_SINCE_ORDER"}
  ],
  "totals": {
    "total_ms3": 100,
    "recomputed_subtotal_ms3": 100,
    "taxes_estimated": 18,
    "total_estimated": 118
  }
}
```

#### Proceso de Orquestación
1. **Obtención del Pedido** (MS3)
   - Lee el pedido por ID
   - Verifica que pertenezca al usuario
   - Extrae líneas de productos

2. **Enriquecimiento con Productos** (MS2)
   - Consulta cada producto en paralelo
   - Compara precios históricos vs actuales
   - Mapea categorías

3. **Resumen de Usuario** (MS1)
   - Información básica del usuario
   - Conteo de direcciones

4. **Detección de Issues**
   - `PRICE_CHANGED_SINCE_ORDER`: Precio cambió
   - `PRODUCT_NOT_FOUND`: Producto no existe
   - `TOTAL_MISMATCH`: Discrepancia en totales

## 🧩 Componentes de la Interfaz

### Formularios

#### `CartQuoteForm.tsx`
- **Propósito**: Captura datos para cotización
- **Campos**:
  - ID Usuario (requerido)
  - ID Dirección (opcional)
  - Lista de productos con cantidades
- **Validaciones**:
  - IDs numéricos positivos
  - Al menos un producto
  - Cantidades válidas

#### `OrderDetailsForm.tsx`
- **Propósito**: Captura datos para consulta
- **Campos**:
  - ID del pedido (string)
  - ID Usuario (numérico)
- **Validaciones**:
  - Campos requeridos
  - Formato de datos

### Resultados

#### `QuoteResults.tsx`
Muestra los resultados de la cotización con:
- **Información de generación**: Timestamp
- **Lista de productos**: Con precios y totales
- **Alertas**: Issues detectados
- **Totales**: Subtotal, impuestos, total
- **Indicadores visuales**: Cambios de precio

#### `OrderDetailsResults.tsx`
Presenta los detalles enriquecidos con:
- **Header del pedido**: ID, estado, fecha
- **Información del usuario**: Datos de contacto
- **Alertas**: Issues críticos
- **Líneas del pedido**: Comparación de precios
- **Totales**: Históricos vs estimados

### Estadísticas

#### `DeliveryStats.tsx`
Dashboard con métricas de:
- **Cotización**: Items, productos únicos, cambios
- **Pedido**: Comparaciones, diferencias, alertas
- **Orquestación**: Indicadores de MS1, MS2, MS3

## 🔄 Flujos de Usuario

### Flujo de Cotización
```
1. Usuario selecciona tab "Cotización de Carrito"
2. Completa formulario con productos
3. Sistema valida datos localmente
4. Envía request a MS4-Orquestador
5. MS4 orquesta MS1 y MS2
6. Muestra resultados con alertas
7. Usuario puede limpiar y repetir
```

### Flujo de Detalles
```
1. Usuario selecciona tab "Detalles de Pedido"
2. Ingresa ID de pedido y usuario
3. Sistema valida formato
4. Envía request a MS4-Orquestador
5. MS4 orquesta MS1, MS2 y MS3
6. Presenta vista enriquecida
7. Usuario analiza cambios y alertas
```

## 🎨 Estados de la Interfaz

### Estados de Carga
- **Inicial**: Formulario vacío
- **Validando**: Verificación local
- **Cargando**: Request en proceso
- **Completado**: Resultados mostrados
- **Error**: Manejo de errores

### Indicadores Visuales
- **Verde**: Sin problemas detectados
- **Amarillo**: Advertencias menores
- **Rojo**: Problemas críticos
- **Azul**: Información neutral

## 🔧 Configuración Técnica

### Variables de Entorno
```env
VITE_API_URL=http://localhost          # Base URL
VITE_MS4_URL=http://localhost:8004     # Orquestador específico
```

### Tipos TypeScript

#### Interfaces Principales
```typescript
// Request types
interface CartQuoteRequest {
  id_usuario: number;
  id_direccion?: number;
  items: CartItem[];
}

interface OrderDetailsRequest {
  order_id: string;
  id_usuario: number;
}

// Response types
interface CartQuoteResponse {
  generatedAt: string;
  items: QuoteItem[];
  issues: string[];
  totals: QuoteTotals;
}

interface OrderDetailsResponse {
  orderId: string;
  estado: string;
  fecha_pedido: string;
  user: OrderUser;
  lines: OrderLine[];
  issues: OrderIssue[];
  totals: OrderTotals;
}
```

### Servicios API
```typescript
// Cotización de carrito
export const getCartQuote = async (request: CartQuoteRequest): Promise<CartQuoteResponse>

// Detalles de pedido
export const getOrderDetails = async (request: OrderDetailsRequest): Promise<OrderDetailsResponse>
```

### Hook Personalizado
```typescript
export const useDelivery = () => {
  // Estado unificado
  // Acciones para cotización
  // Acciones para detalles
  // Limpieza de estado
}
```

## 🚨 Manejo de Errores

### Errores de Validación
- **Frontend**: Validación inmediata en formularios
- **Feedback**: Mensajes específicos por campo

### Errores de API
- **404**: Pedido no encontrado
- **403**: Sin autorización para ver el pedido
- **500**: Error interno del servidor

### Recuperación
- **Retry automático**: Para errores de red
- **Fallback**: Estados de error amigables
- **Limpieza**: Botones para reset de estado

## 📊 Métricas y Monitoreo

### Indicadores de Rendimiento
- **Tiempo de respuesta**: De orquestación
- **Tasa de éxito**: Requests completados
- **Detección de issues**: Alertas generadas

### Analytics de Uso
- **Cotizaciones generadas**: Por período
- **Pedidos consultados**: Frecuencia
- **Tipos de alertas**: Más comunes

## 🔮 Futuras Mejoras

### Funcionalidades Planeadas
- **Cache de resultados**: Para consultas repetidas
- **Exportación**: PDF/Excel de cotizaciones
- **Notificaciones**: Push para cambios críticos
- **Filtros avanzados**: En listas de resultados

### Optimizaciones
- **Lazy loading**: Componentes pesados
- **Virtualización**: Listas largas de productos
- **Prefetch**: Datos relacionados

---

Esta documentación cubre todos los aspectos técnicos y funcionales de la página de Orquestador Delivery, facilitando su mantenimiento y evolución futura.