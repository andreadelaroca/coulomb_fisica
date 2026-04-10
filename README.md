# Calculadora de Fuerza Neta

Aplicacion web sencilla para calcular la fuerza electrica neta sobre una carga objetivo `q0` usando la ley de Coulomb. El proyecto esta construido con FastAPI en el backend, una plantilla HTML renderizada con Jinja2 y logica de interfaz en JavaScript puro.

## Descripcion

La aplicacion permite:

- Ingresar una carga objetivo `q0` y su posicion `(x0, y0)`.
- Agregar una o varias cargas adicionales con sus coordenadas `(x, y)`.
- Enviar los datos al backend para calcular `Fx`, `Fy` y la `Magnitud` de la fuerza neta.
- `Fx`: componente de fuerza neta en el eje x.
- `Fy`: componente de fuerza neta en el eje y.
- `Magnitud`: magnitud de la fuerza neta resultante.

## Tecnologias y componentes utilizados

- `FastAPI`: framework principal del backend.
- `Uvicorn`: servidor ASGI para correr la aplicacion.
- `Jinja2`: renderizado de la vista HTML principal.
- `Pydantic`: validacion de datos de entrada del endpoint.
- `HTML + Tailwind CSS (CDN)`: estructura y estilos de la interfaz.
- `JavaScript Vanilla`: manejo dinamico de cargas, validaciones y consumo del endpoint.

## Estructura del proyecto

```text
coulomb_fisica/
|-- main.py
|-- requirements.txt
|-- static/
|   `-- app.js
`-- templates/
    `-- index.html
```

## Que hace cada archivo

### `main.py`

Contiene la logica principal del backend:

- Crea la aplicacion FastAPI.
- Expone la ruta `GET /` para mostrar la interfaz principal.
- Expone la ruta `POST /calcular` para recibir los datos del formulario.
- Ejecuta la funcion `calcular_fuerza_neta(...)`, donde se aplica la ley de Coulomb y se calcula el vector de fuerza neta.

### `templates/index.html`

Define la interfaz principal:

- Campos para `q0`, `x0` y `y0`.
- Contenedor para las cargas adicionales.
- Boton para calcular.
- Area para mensajes.
- Area para mostrar resultados.

### `static/app.js`

Contiene la logica del frontend:

- Crea dinamicamente nuevas filas de cargas.
- Valida los datos ingresados antes de enviarlos.
- Envia la informacion al backend usando `fetch("/calcular")`.
- Muestra el resultado en pantalla o alertas si ocurre un error.

### `requirements.txt`

Lista las dependencias necesarias para ejecutar el proyecto.

## Requisitos previos

Antes de iniciar, asegurate de tener instalado:

- `Python 3.10+`
- `pip`

Puedes verificarlo con:

```bash
python --version
pip --version
```

Si en Windows `python` no funciona, prueba con:

```bash
py --version
```

## Como inicializar el proyecto

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd coulomb_fisica
```

### 2. Crear un entorno virtual

En Windows:

```bash
py -m venv .venv
```

### 3. Activar el entorno virtual

```cmd
.venv\Scripts\activate
```

### 4. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 5. Ejecutar la aplicacion

```bash
uvicorn main:app --reload
```

o en Windows:

```bash
py -m uvicorn main:app --reload
```

### 6. Abrir en el navegador

Abre esta URL:

```text
http://127.0.0.1:8000
```

## Flujo de uso

1. Ingresa la carga objetivo `q0` y sus coordenadas `x0`, `y0`.
2. Completa al menos una carga adicional.
3. Presiona `Calcular`.
4. Revisa los valores de `Fx`, `Fy` y `Magnitud`.

## Validaciones actuales

El frontend incluye validaciones para evitar fallos comunes:

- Verifica que los elementos base del DOM existan.
- Evita enviar el formulario si faltan valores numericos.
- Evita procesar filas de carga incompletas.
- Muestra alertas cuando hay datos invalidos.
- Impide que exista una carga en la misma posicion que `q0`.
- Valida que la respuesta del backend tenga un formato correcto.

## Endpoints disponibles

### `GET /`

Devuelve la pagina principal de la calculadora.

### `POST /calcular`

Recibe un JSON con este formato:

```json
{
  "q0": 1,
  "x0": 0,
  "y0": 0,
  "cargas": [
    { "q": 2, "x": 1, "y": 0 },
    { "q": -3, "x": 0, "y": 2 }
  ]
}
```

Y responde con:

```json
{
  "ok": true,
  "resultado": {
    "fx": 0.0,
    "fy": 0.0,
    "magnitud": 0.0
  }
}
```

## Logica matematica aplicada

Para cada carga adicional:

- Se calcula el vector desde la carga `i` hacia la carga objetivo.
- Se obtiene la distancia `r`.
- Se calcula el vector unitario.
- Se aplica la ley de Coulomb para obtener `Fx` y `Fy`.
- Finalmente se suman todas las contribuciones para obtener la fuerza neta.

La constante usada actualmente es:

```text
k = 9e9
```
