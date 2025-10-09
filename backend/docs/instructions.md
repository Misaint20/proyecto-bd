# Instrucciones

0. Crear un fork del repositorio en tu cuenta de GitHub.

Debes crear un fork del repositorio para poder realizar cambios en tu copia local. Para hacerlo, haz clic en el botón "Fork" en la parte superior derecha de la página del repositorio.


1. Clonar el repositorio en tu computadora local con el siguiente comando:

```bash
git clone https://github.com/tu-usuario/proyecto-bd.git
```

Nota: El nombre de tu usuario debe ser tu cuenta de GitHub.

Nota 2: Estos pasos anteriores ya no son necesario si ya lo hiciste anteriormente.

2. Entrar en el directorio del proyecto:

```bash
cd proyecto-bd/backend
```
**Nota**: El comando anterior es solo si no has accedido al directorio principal del proyecto, el siguiente es si has accedido al directorio principal y quieres entrar en el directorio del backend.

```bash
cd backend
```

3. Instalar las dependencias del proyecto:

```bash
npm install
```


4. Crear un archivo .env en el directorio del proyecto con las siguientes variables de entorno:

```bash
DATABASE_URL=mysql://root:root@localhost:3306/Bodega
```
Nota: El valor de la variable DATABASE_URL es el que debes usar para conectarte a la base de datos MariaDB. Debes reemplazar el valor por el que corresponda a tu computadora local.

5. Iniciar la base de datos MariaDB en tu computadora local:

- Para esto es necesario tener instalado MariaDB en tu computadora local.
- Una vez instalado, abre la terminal de comandos y ejecuta los siguientes comandos:

```bash
mysql -u root -p < init.sql
```

Nota: El archivo init.sql contiene las instrucciones necesarias para crear la base de datos y la tabla correspondientes. Si la base de datos ya existe, puedes omitir este paso.


6. Iniciar el cliente de Prisma:

```bash
npm run prisma:generate
```

7. Iniciar el servidor de Node.js:

```bash
npm run dev
```


## Notas adicionales

-Si despues de ejecutar los comandos anteriores aparece un error en vino.ts, puede ser porque despues de ejecutar el paso 6 necesitas reiniciar el entorni de desarrollo para detectar el cliente de Prisma. Es necesario aclarar que lo anterior no es necesario, solo es para que no aparezca el error ya que el cliente de Prisma ya se ha generado y funcionara correctamente.