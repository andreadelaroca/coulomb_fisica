//Variables globales
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
    this._loadEventListeners();
    this._crearCargaVacia();
  }

  _loadEventListeners() {
    addChargeBtn.addEventListener("click", () => this._crearCargaVacia());
    calculateBtn.addEventListener("click", () => this.calculate());
  }

  _crearCargaVacia() {
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

    wrapper.querySelector(".remove-btn").addEventListener("click", () => {
      wrapper.remove();
    });
    chargesContainer.appendChild(wrapper);
  }

  //------Funciones publicas-----------
  showMessage(text, isError = false) {
    messageDiv.innerHTML = `
    <div class="${isError ? "bg-red-100 text-red-700 border-red-300" : "bg-green-100 text-green-700 border-green-300"} border rounded-xl p-3">
     ${text}
     </div>
  `;
  }
  clearMessage() {
    messageDiv.innerHTML = "";
  }

  //Obtener valor de un input por su id
  getNumberValue(id) {
    return parseFloat(document.getElementById(id).value);
  }

  cargarCargas() {
    const filaCargas = document.querySelectorAll("#cargaRow");
    const cargas = [];

    for (const fila of filaCargas) {
      const q = parseFloat(fila.querySelector(".charge-q").value);
      const x = parseFloat(fila.querySelector(".charge-x").value);
      const y = parseFloat(fila.querySelector(".charge-y").value);

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
    this.clearMessage();
    resultDiv.classList.add("hidden");

    try {
      const q0 = this.getNumberValue("q0");
      const x0 = this.getNumberValue("x0");
      const y0 = this.getNumberValue("y0");

      if (Number.isNaN(q0) || Number.isNaN(x0) || Number.isNaN(y0)) {
        alert("Debes completar q0, x0 y y0.");
        return;
      }

      const cargas = this.cargarCargas();

      if (cargas.length === 0 || cargas === null) {
        alert("Debes agregar al menos una carga.");
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

      const data = await res.json();
      if (!data.ok) {
        throw new Error(data.error);
      }

      fxSpan.textContent = Number(data.resultado.fx).toExponential(4);
      fySpan.textContent = Number(data.resultado.fy).toExponential(4);
      magnitudSpan.textContent = Number(data.resultado.magnitud).toExponential(
        4,
      );

      resultDiv.classList.remove("hidden");
      this.showMessage("Calculo realizado correctamente.");
    } catch (error) {
      this.showMessage(error.message, true);
    }
  }
}
const app = new App();
