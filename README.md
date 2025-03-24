# API de administracion

# Tecnologias que hay que tener para levantar el proyecto

- **Node.js**
- **PostgreSQL**

## Instalación

1. Clonar este repositorio:

   ```bash
   git clone https://github.com/Alexter2003/Administration_and_Accounting_API.git
   ```

2. Navega al directorio

   ```bash
   cd Administration_and_Accounting_API
   ```

3. Instalar dependencias

   ```bash
   npm install
   ```

4. Crea un archivo .env en la raíz del proyecto con las siguientes variables de entorno:

   ```bash
    DB_HOST=localhost
    DB_PORT=5432
    DB_USER='usario'
    DB_PASSWORD='contraseña'
    DB_DATABASE=db_api_administracion
    NODE_ENV=development
   ```

# Uso

Para correr la aplicación en desarrollo, usa el siguiente comando:

```bash
 npm run dev
```

El servidor estará corriendo en http://localhost:3000 (puedes cambiar el puerto si es necesario).

# Migraciones

Para aplicar las migraciones de la base de datos, ejecuta:

```bash
 npm run migrations:run
```
