![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white) ![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)

# 🛒 E-Commerce API - NestJS Backend

Este es el núcleo de una plataforma de comercio electrónico robusta, construida con **NestJS**. Proporciona una API RESTful completa con autenticación, gestión de productos, pedidos y carga de archivos.

## 🚀 Características Principales

* **Autenticación y Autorización:** Implementación de JWT (JSON Web Tokens) con protección de rutas por roles (`ADMIN` y `USER`).
* **Gestión de Productos:** CRUD completo utilizando **Prisma ORM** y **MySQL**.
* **Carga de Imágenes:** Sistema de almacenamiento local para fotos de productos con nombres de archivo únicos.
* **Seguridad:** Encriptación de contraseñas con `bcrypt` y manejo de CORS para integración con Frontend (Angular).
* **Arquitectura:** Diseño modular siguiendo las mejores prácticas de NestJS.

## 🛠️ Tecnologías utilizadas

* **Framework:** [NestJS](https://nestjs.com/)
* **ORM:** [Prisma](https://www.prisma.io/)
* **Base de Datos:** MySQL
* **Lenguaje:** TypeScript
* **Gestión de archivos:** Multer

## 📋 Endpoints Principales

### Autenticación
* `POST /auth/register` - Registro de nuevos usuarios.
* `POST /auth/login` - Inicio de sesión y obtención del Token.

### Productos
* `GET /products` - Listar todos los productos.
* `POST /products` - Crear un producto (**Admin**).
* `POST /products/:id/imagen` - Subir imagen del producto (**Admin**).

### Pedidos
* `POST /orders` - Crear una nueva orden de compra.

## 🔧 Instalación y Configuración

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/lauJofre04/ecommerce-proyecto.git](https://github.com/lauJofre04/ecommerce-proyecto.git)
    cd ecommerce-backend
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crea un archivo `.env` basado en el `.env.template` y configura tu `DATABASE_URL` y `JWT_SECRET`.

4.  **Sincronizar base de datos:**
    ```bash
    npx prisma migrate dev
    ```

5.  **Iniciar el servidor:**
    ```bash
    npm run start:dev
    ```

---
Desarrollado por [Lautaro Jofre]