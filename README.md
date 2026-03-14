# ⚙️ Tech Store - REST API

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

Una API RESTful robusta y escalable construida con NestJS y Prisma ORM para gestionar el backend de un e-commerce de tecnología. 

## ✨ Funcionalidades (Endpoints)

- **👤 Usuarios & Auth:** Autenticación con JWT (JSON Web Tokens) y encriptación de contraseñas.
- **📦 Gestión de Productos:** CRUD completo de productos y categorías. Subida y manejo de imágenes.
- **🛍️ Órdenes y Ventas:**
  - Creación de órdenes de compra vinculadas a los usuarios.
  - **Gestión inteligente de stock:** El stock se descuenta automáticamente al aprobar una orden y se reintegra si la orden es cancelada por un administrador.
- **🔒 Guards & Roles:** Rutas protegidas para usuarios autenticados y endpoints exclusivos para el rol ADMIN.

## 🗄️ Estructura de la Base de Datos

El proyecto utiliza PostgreSQL. Los modelos principales incluyen:
- `Usuario` (id, nombre, email, password, rol, etc.)
- `Producto` (id, nombre, precio, stockDisponible, categoriaId)
- `Categoria` (id, nombre)
- `Orden` (id, total, estado, fechaOrden, usuarioId)
- `DetalleOrden` (id, ordenId, productoId, cantidad, precio)

## 🚀 Instalación y Configuración Local

1. Clonar el repositorio:
git clone https://github.com/lauJofre04/ecommerce-proyecto-backend.git

2. Instalar las dependencias:
npm install

3. Configurar variables de entorno:
Renombrar el archivo .env.example a .env (asegurate de tener ambos) y configurar la variable DATABASE_URL con tu conexión a PostgreSQL y tu JWT_SECRET.

4. Sincronizar la base de datos con Prisma:
npx prisma db push

5. Iniciar la aplicación:
npm run start:dev

La API estará corriendo en https://ecommerce-proyecto-backend.onrender.com/

## 🚧 Notas de Desarrollo
- *Integración de Pagos:* El flujo actual simula el guardado directo de la orden. La integración de la pasarela de Mercado Pago está estructurada a la espera de credenciales de producción.

## 🧑‍💻 Autor
**Lautaro Jofré** - *Full-Stack Developer* - [www.linkedin.com/in/lautaro-jofre]