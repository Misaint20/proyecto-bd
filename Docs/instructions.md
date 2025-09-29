# Instrucciones de instalación y modificación

1. Crear un fork del repositorio en tu cuenta de GitHub.

Debes crear un fork del repositorio para poder realizar cambios en tu copia local. Para hacerlo, haz clic en el botón "Fork" en la parte superior derecha de la página del repositorio.

1. Clonar el repositorio en tu computadora local con el siguiente comando:

```bash
git clone https://github.com/tu-usuario/proyecto-bd.git
```

Nota: El nombre de tu usuario debe ser tu cuenta de GitHub.

2. Entrar en el directorio del proyecto:

- Backend:
```bash
cd proyecto-bd/backend
```

Fronend Web:
```bash
cd proyecto-bd/frontend/web
```

3. Instalar las dependencias del proyecto:

```bash
npm install
```

Nota: Esto es para todos los casos correspodientes.

4. Ejecucion

Para todos los casos correspondientes existen las instrucciones persoanlizadas en el archivo [docs/instructions.md](docs/instructions.md) dentro del proyecto ya sea en el backend o el frontend.

## Modificaciones

Para modificar el proyecto, debes seguir los siguientes pasos:

### Nota: Necesitas tener git instalado en tu computadora local, ademas de nodejs y haber probado el proyecto en local antes de comenzar a modificarlo.

1. Crear una nueva rama en tu repositorio local:

```bash
git checkout -b nombre-de-tu-rama
```
* Replace `nombre-de-tu-rama` con el nombre de tu rama. Esta debe de ser única y no estar ya en uso ademas de referirse a los cambios que quieres realizar.

Esto crea una nueva rama en la que se realizarán los cambios.

2. Modificar el código:

Creas los cambios en el código y confirmalos en tu rama:

```bash
git add .
git commit -m "mensaje de commit"
```

3. Enviar tus cambios a GitHub:

```bash
git push origin nombre-de-tu-rama
```

4. Crear un Pull Request (PR) en GitHub:

En GitHub, ve a tu repositorio y haz clic en el botón "New Pull Request". Rellena los campos solicitados y haz clic en "Create Pull Request".

5. Espera a que tu PR sea revisado y aprobado.