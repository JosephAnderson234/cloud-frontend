# 🚀 Guía de Instalación y Desarrollo

## 📋 Prerrequisitos

### Software Requerido
- **Node.js** 18.0+ 
- **npm** 9.0+ o **yarn** 1.22+
- **Git** 2.30+
- **Docker** 20.0+ (para backend local)
- **Docker Compose** 2.0+

### Verificar Instalación
```bash
node --version    # v18.0.0+
npm --version     # 9.0.0+
git --version     # git version 2.30+
docker --version  # Docker version 20.0+
```

## 🔧 Configuración del Entorno de Desarrollo

### 1. Clonar el Repositorio
```bash
git clone https://github.com/JosephAnderson234/cloud-frontend.git
cd cloud-frontend
```

### 2. Instalar Dependencias
```bash
# Con npm
npm install

# Con yarn
yarn install
```

### 3. Configurar Variables de Entorno
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar configuración
nano .env  # o tu editor preferido
```

Configuración básica para desarrollo local:
```env
VITE_API_URL=http://localhost
```

### 4. Ejecutar el Frontend
```bash
# Modo desarrollo
npm run dev

# La aplicación estará disponible en:
# http://localhost:3000
```

## 🐳 Configuración del Backend (Docker)

### 1. Clonar Repositorio de Base de Datos
```bash
# En directorio paralelo
cd ..
git clone https://github.com/jcarlos-t/PCloud-BD.git
cd PCloud-BD
```

### 2. Levantar Bases de Datos
```bash
# Iniciar contenedores de BD
docker-compose up -d

# Verificar que estén corriendo
docker-compose ps
```

### 3. Configurar Compose de Microservicios
Crear `docker-compose.yml` en directorio del proyecto:

```yaml
version: '3.8'

services:
  ms1-usuarios:
    image: ms1-usuarios:latest
    ports:
      - "8001:8000"
    environment:
      - DB_HOST=host.docker.internal
    networks:
      - backend
    restart: unless-stopped

  ms2-productos:
    image: ms2-productos:latest
    ports:
      - "8002:8080"
    environment:
      - DB_HOST=host.docker.internal
    networks:
      - backend
    restart: unless-stopped

  ms3-pedidos:
    image: ms3-pedidos:latest
    ports:
      - "8003:3000"
    environment:
      - DB_HOST=host.docker.internal
    networks:
      - backend
    restart: unless-stopped

  ms4-orquestador:
    image: ms4-orquestador:latest
    ports:
      - "8004:8000"
    environment:
      - MS1_URL=http://ms1-usuarios:8000
      - MS2_URL=http://ms2-productos:8080
      - MS3_URL=http://ms3-pedidos:3000
      - TAX_RATE=0.18
    networks:
      - backend
    restart: unless-stopped

  ms5-analytics:
    image: ms5-analytics:latest
    ports:
      - "8005:8000"
    environment:
      - DB_HOST=host.docker.internal
    networks:
      - backend
    restart: unless-stopped

networks:
  backend:
    driver: bridge
```

### 4. Levantar Microservicios
```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Verificar estado
docker-compose ps
```

## 🧪 Ejecutar en Modo Desarrollo

### Terminal 1: Backend
```bash
# En directorio PCloud-BD
docker-compose up -d

# En directorio principal
docker-compose up -d
```

### Terminal 2: Frontend
```bash
# En directorio cloud-frontend
npm run dev
```

### Verificar Funcionamiento
1. **Frontend**: http://localhost:3000
2. **MS1**: http://localhost:8001/health
3. **MS2**: http://localhost:8002/health
4. **MS3**: http://localhost:8003/health
5. **MS4**: http://localhost:8004/health
6. **MS5**: http://localhost:8005/health

## 🔍 Testing y Debug

### Probar Endpoints Manualmente

#### MS1 - Usuarios
```bash
# Listar usuarios
curl http://localhost:8001/all

# Crear usuario
curl -X POST http://localhost:8001/usuarios \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test","correo":"test@example.com","contraseña":"123","telefono":"123456789"}'
```

#### MS2 - Productos  
```bash
# Listar productos
curl http://localhost:8002/productos

# Obtener producto específico
curl http://localhost:8002/productos/1
```

#### MS4 - Orquestador (Delivery)
```bash
# Cotización de carrito
curl -X POST http://localhost:8004/orq/cart/price-quote \
  -H "Content-Type: application/json" \
  -d '{"id_usuario":1,"id_direccion":1,"items":[{"id_producto":1,"cantidad":2}]}'

# Detalles de pedido (reemplazar con ID real)
curl "http://localhost:8004/orq/orders/PEDIDO_ID/details?id_usuario=1"
```

### Debug del Frontend
```bash
# Ejecutar con debug
npm run dev -- --debug

# Ver logs detallados en DevTools
# Abrir: F12 → Console → Network
```

## 📦 Build para Producción

### 1. Construcción Optimizada
```bash
# Crear build de producción
npm run build

# Previsualizar build
npm run preview
```

### 2. Verificar Build
```bash
# El build se genera en dist/
ls -la dist/

# Tamaño de archivos
du -sh dist/*
```

### 3. Servir con Servidor Web
```bash
# Con serve (instalar globalmente)
npm install -g serve
serve -s dist -l 3000

# Con nginx (ejemplo de configuración)
# Ver docs/DEPLOYMENT.md
```

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción  
npm run preview      # Previsualizar build

# Calidad de código
npm run lint         # Ejecutar ESLint
npm run lint:fix     # Corregir errores automáticamente
npm run type-check   # Verificar tipos TypeScript

# Utilidades
npm run clean        # Limpiar cache y dist
npm run format       # Formatear código con Prettier
```

## 🚨 Solución de Problemas Comunes

### Error: Puerto ya en uso
```bash
# Encontrar proceso usando puerto
lsof -i :3000  # o el puerto específico

# Terminar proceso
kill -9 PID_NUMBER

# Cambiar puerto del frontend
npm run dev -- --port 3001
```

### Error: Módulos no encontrados
```bash
# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm install

# Con yarn
rm -rf node_modules yarn.lock  
yarn install
```

### Error: Cannot connect to backend
```bash
# Verificar que backend esté corriendo
docker-compose ps

# Verificar conectividad
curl http://localhost:8001/health

# Revisar configuración .env
cat .env
```

### Error: CORS
```bash
# Verificar configuración de microservicios
# GLOBAL_CORS debe incluir frontend URL
GLOBAL_CORS=http://localhost:3000
```

### Error: Base de datos no conecta
```bash
# Verificar contenedores de BD
cd ../PCloud-BD
docker-compose ps

# Revisar logs
docker-compose logs mysql
docker-compose logs postgres  
docker-compose logs mongodb
```

## 📝 Desarrollo de Features

### Estructura de Carpetas para Nueva Feature
```
src/
├── components/nueva-feature/
│   ├── Component1.tsx
│   ├── Component2.tsx
│   └── index.ts
├── hooks/
│   └── useNuevaFeature.tsx
├── interfaces/
│   ├── nuevaFeature.ts
│   └── nuevaFeatureComponents.ts
├── pages/
│   └── NuevaFeature.tsx
└── services/
    └── nuevaFeature.ts
```

### Checklist para Nueva Feature
- [ ] Interfaces TypeScript definidas
- [ ] Servicios API implementados
- [ ] Hook personalizado creado
- [ ] Componentes desarrollados
- [ ] Página principal creada
- [ ] Ruta agregada al router
- [ ] Navegación actualizada
- [ ] Tests básicos (opcional)
- [ ] Documentación actualizada

## 🔄 Workflow de Git

### Ramas Recomendadas
```bash
# Crear rama para feature
git checkout -b feature/nueva-funcionalidad

# Desarrollar y commitear
git add .
git commit -m "feat: agregar nueva funcionalidad"

# Push y PR
git push origin feature/nueva-funcionalidad
# Crear Pull Request en GitHub
```

### Convención de Commits
```bash
feat: nueva funcionalidad
fix: corrección de bug
docs: actualización de documentación
style: cambios de formato
refactor: refactorización de código
test: agregar tests
chore: tareas de mantenimiento
```

---

¡Con esta guía tienes todo lo necesario para desarrollar y contribuir al proyecto! 🚀