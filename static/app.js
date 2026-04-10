//Variables globales
//Para correr la app 'uvicorn main:app --reload'
const chargesContainer = document.getElementById("chargesContainer");
const addChargeBtn = document.getElementById("addChargeBtn");
const calculateBtn = document.getElementById("calculateBtn");
const messageDiv = document.getElementById("message");
const resultDiv = document.getElementById("result");
const fxSpan = document.getElementById("fx");
const fySpan = document.getElementById("fy");
const magnitudSpan = document.getElementById("magnitud");

class App {
  constructor() {
    if (!this._validarElementosBase()) {
      return;
    }

    this._loadEventListeners();
    this._crearCargaVacia();
    addChargeBtn.classList.add("hidden");
  }

  _validarElementosBase() {
    return (
      chargesContainer &&
      addChargeBtn &&
      calculateBtn &&
      messageDiv &&
      resultDiv &&
      fxSpan &&
      fySpan &&
      magnitudSpan
    );
  }

  _loadEventListeners() {
    if (!addChargeBtn || !calculateBtn) {
      return;
    }

    addChargeBtn.addEventListener("click", () => this._crearCargaVacia());
    calculateBtn.addEventListener("click", () => this.calculate());
  }

  //Crear una carga vacia con inputs para q, x, y y un boton de eliminar, y agregarla al contenedor de cargas
  _crearCargaVacia() {
    if (!chargesContainer) {
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.className =
      "grid md:grid-cols-4 gap-4 items-end border rounded-2xl p-4";
    wrapper.id = "cargaRow";
    wrapper.innerHTML = `
    <div>
      <label class="block font-medium mb-1">q</label>
      <input type="number" step="any" class="charge-q w-full border rounded-xl p-3" />
    </div>
    <div>
      <label class="block font-medium mb-1">x</label>
      <input type="number" step="any" class="charge-x w-full border rounded-xl p-3" />
    </div>
    <div>
      <label class="block font-medium mb-1">y</label>
      <input type="number" step="any" class="charge-y w-full border rounded-xl p-3" />
    </div>
    <div>
      <button type="button" class="remove-btn bg-red-600 text-white px-4 py-3 rounded-xl w-full hover:bg-red-700">
        Eliminar
      </button>
    </div>
        `;

    const removeBtn = wrapper.querySelector(".remove-btn");
    if (removeBtn) {
      removeBtn.addEventListener("click", () => {
        wrapper.remove();
      });
    }

    chargesContainer.appendChild(wrapper);
  }

  //------Funciones publicas-----------
  showMessage(text, isError = false) {
    if (!messageDiv) {
      return;
    }

    messageDiv.innerHTML = `
    <div class="${isError ? "bg-red-100 text-red-700 border-red-300" : "bg-green-100 text-green-700 border-green-300"} border rounded-xl p-3">
     ${text}
     </div>
  `;
  }
  clearMessage() {
    if (!messageDiv) {
      return;
    }

    messageDiv.innerHTML = "";
  }

  //Obtener valor de un input por su id
  getNumberValue(id) {
    const input = document.getElementById(id);

    if (!input) {
      return NaN;
    }

    return parseFloat(input.value);
  }

  convertirNumeroE(input) {
    const value = Number(input.value);
    if (Number.isNaN(value)) {
      return;
    }

    input.value = value.toLocaleString("fullwide", {
      useGrouping: false,
      maximumSignificantDigits: 15,
    });
  }

  //Funcion para regresar las cargas del formulario en un formato [{q, x, y}, ...]
  cargarCargas() {
    const filaCargas = document.querySelectorAll("#cargaRow");
    const cargas = [];

    for (const fila of filaCargas) {
      const qInput = fila.querySelector(".charge-q");
      const xInput = fila.querySelector(".charge-x");
      const yInput = fila.querySelector(".charge-y");

      if (!qInput || !xInput || !yInput) {
        alert("No se pudieron leer todas las cargas.");
        return null;
      }

      const q = parseFloat(qInput.value);
      const x = parseFloat(xInput.value);
      const y = parseFloat(yInput.value);

      if (Number.isNaN(q) || Number.isNaN(x) || Number.isNaN(y)) {
        alert("Todas las cargas deben tener valores validos.");
        return null;
      }

      cargas.push({ q, x, y });
    }

    return cargas;
  }

  //Fetch a "/calcular" con los datos del formulario y mostrar resultado
  async calculate() {
    if (!this._validarElementosBase()) {
      alert("No se pudo iniciar correctamente la aplicacion.");
      return;
    }

    this.clearMessage();
    resultDiv.classList.add("hidden");
    addChargeBtn.classList.remove("hidden");

    try {
      const q0 = this.getNumberValue("q0");
      const x0 = this.getNumberValue("x0");
      const y0 = this.getNumberValue("y0");

      if (Number.isNaN(q0) || Number.isNaN(x0) || Number.isNaN(y0)) {
        alert("Debes completar q0, x0 y y0.");
        return;
      }

      const cargas = this.cargarCargas();

      if (cargas === null) {
        return;
      }

      if (cargas.length === 0) {
        alert("Debes agregar al menos una carga.");
        return;
      }

      const hayCargaEnMismaPosicion = cargas.some(
        (carga) => carga.x === x0 && carga.y === y0,
      );

      if (hayCargaEnMismaPosicion) {
        alert("No puede haber una carga en la misma posicion que q0.");
        return;
      }

      const res = await fetch("/calcular", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q0,
          x0,
          y0,
          cargas,
        }),
      });

      let data = null;

      try {
        data = await res.json();
      } catch {
        throw new Error("La respuesta del servidor no es valida.");
      }

      if (!res.ok) {
        throw new Error(data?.error || "No se pudo realizar el calculo.");
      }

      if (!data.ok) {
        throw new Error(data.error || "No se pudo realizar el calculo.");
      }

      if (
        !data.resultado ||
        !Number.isFinite(Number(data.resultado.fx)) ||
        !Number.isFinite(Number(data.resultado.fy)) ||
        !Number.isFinite(Number(data.resultado.magnitud))
      ) {
        throw new Error("El resultado recibido no es valido.");
      }

      fxSpan.textContent = Number(data.resultado.fx).toExponential(4);
      fySpan.textContent = Number(data.resultado.fy).toExponential(4);
      magnitudSpan.textContent = Number(data.resultado.magnitud).toExponential(
        4,
      );

      resultDiv.classList.remove("hidden");
      this.showMessage("Calculo realizado correctamente.");
    } catch (error) {
      const errorMessage =
        error instanceof Error && error.message
          ? error.message
          : "Ocurrio un error inesperado.";
      alert(errorMessage);
    }
  }
}
const app = new App();
