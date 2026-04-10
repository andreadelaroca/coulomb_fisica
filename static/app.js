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
const chartSection = document.getElementById("chartSection");
const forceChartCanvas = document.getElementById("forceChart");
const documentationModal = document.getElementById("documentationModal");
const openDocsBtn = document.getElementById("openDocsBtn");
const sideDocsBtn = document.getElementById("sideDocsBtn");
const documentationTrigger = document.getElementById("documentationTrigger");
const closeDocsBtn = document.getElementById("closeDocsBtn");

class App {
  constructor() {
    this.forceChart = null;

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
      magnitudSpan &&
      chartSection &&
      forceChartCanvas &&
      documentationModal &&
      openDocsBtn &&
      sideDocsBtn &&
      documentationTrigger &&
      closeDocsBtn
    );
  }

  _loadEventListeners() {
    if (
      !addChargeBtn ||
      !calculateBtn ||
      !openDocsBtn ||
      !sideDocsBtn ||
      !documentationTrigger ||
      !closeDocsBtn ||
      !documentationModal
    ) {
      return;
    }

    addChargeBtn.addEventListener("click", () => this._crearCargaVacia());
    calculateBtn.addEventListener("click", () => this.calculate());
    openDocsBtn.addEventListener("click", () => this.openDocumentationModal());
    sideDocsBtn.addEventListener("click", () => this.openDocumentationModal());
    documentationTrigger.addEventListener("click", () =>
      this.openDocumentationModal(),
    );
    closeDocsBtn.addEventListener("click", () => this.closeDocumentationModal());
    documentationModal.addEventListener("click", (event) => {
      if (event.target === documentationModal) {
        this.closeDocumentationModal();
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.closeDocumentationModal();
      }
    });
    this._loadInputNormalization();
  }

  _loadInputNormalization() {
    document.addEventListener("input", (event) => {
      const target = event.target;

      if (!(target instanceof HTMLInputElement) || target.type !== "number") {
        return;
      }

      if (target.value.startsWith("--")) {
        target.value = `-${target.value.slice(2)}`;
      }
    });
  }

  openDocumentationModal() {
    if (!documentationModal) {
      return;
    }

    documentationModal.classList.remove("pointer-events-none", "opacity-0");
    documentationModal.setAttribute("aria-hidden", "false");
  }

  closeDocumentationModal() {
    if (!documentationModal) {
      return;
    }

    documentationModal.classList.add("pointer-events-none", "opacity-0");
    documentationModal.setAttribute("aria-hidden", "true");
  }

  //Crear una carga vacia con inputs para q, x, y y un boton de eliminar, y agregarla al contenedor de cargas
  _crearCargaVacia() {
    if (!chargesContainer) {
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.className =
      "grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm lg:grid-cols-[1.35fr_1.1fr_1.1fr_auto] lg:items-end";
    wrapper.id = "cargaRow";
    wrapper.innerHTML = `
    <div>
      <label class="mb-1 block font-medium text-slate-700">q</label>
      <input type="number" step="any" class="charge-q w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
    </div>
    <div>
      <label class="mb-1 block font-medium text-slate-700">x</label>
      <input type="number" step="any" class="charge-x w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
    </div>
    <div>
      <label class="mb-1 block font-medium text-slate-700">y</label>
      <input type="number" step="any" class="charge-y w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
    </div>
    <div class="lg:min-w-[132px]">
      <button type="button" class="remove-btn flex w-full items-center justify-center rounded-2xl bg-red-600 px-4 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-red-700">
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

  formatearResultado(valor) {
    const numero = Number(valor);

    if (!Number.isFinite(numero)) {
      return "";
    }

    const resultado = new Intl.NumberFormat("en-US", {
      useGrouping: false,
      notation: "standard",
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }).format(numero);

    return resultado === "-0.0000" ? "0.0000" : resultado;
  }

  getChartScale(q0, x0, y0, cargas, resultado) {
    const puntos = [{ x: x0, y: y0 }, ...cargas.map(({ x, y }) => ({ x, y }))];
    const coordenadas = puntos.flatMap((punto) => [
      Math.abs(punto.x),
      Math.abs(punto.y),
    ]);
    const maxCoord = Math.max(...coordenadas, 1);
    const magnitudFuerza = Number(resultado.magnitud);

    if (!Number.isFinite(magnitudFuerza) || magnitudFuerza === 0) {
      return { endX: x0, endY: y0 };
    }

    const vectorLength = maxCoord * 0.35;
    const endX = x0 + (Number(resultado.fx) / magnitudFuerza) * vectorLength;
    const endY = y0 + (Number(resultado.fy) / magnitudFuerza) * vectorLength;

    return { endX, endY };
  }

  renderChart(q0, x0, y0, cargas, resultado) {
    if (
      typeof Chart === "undefined" ||
      !(forceChartCanvas instanceof HTMLCanvasElement)
    ) {
      return;
    }

    const { endX, endY } = this.getChartScale(q0, x0, y0, cargas, resultado);
    const chartData = {
      datasets: [
        {
          label: "Carga objetivo q0",
          data: [{ x: x0, y: y0 }],
          pointRadius: 7,
          pointHoverRadius: 8,
          pointBackgroundColor: "#0f172a",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
        },
        {
          label: "Cargas del sistema",
          data: cargas.map((carga, index) => ({
            x: carga.x,
            y: carga.y,
            label: `Carga ${index + 1}`,
            q: carga.q,
          })),
          pointRadius: 6,
          pointHoverRadius: 7,
          pointBackgroundColor: "#2563eb",
          pointBorderColor: "#bfdbfe",
          pointBorderWidth: 2,
        },
        {
          label: "Dirección de fuerza neta",
          type: "line",
          data: [
            { x: x0, y: y0 },
            { x: endX, y: endY },
          ],
          borderColor: "#dc2626",
          borderWidth: 3,
          pointRadius: 0,
          tension: 0,
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#0f172a",
          },
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const point = context.raw;

              if (context.dataset.label === "Cargas del sistema") {
                return `${point.label}: q=${point.q}, x=${point.x}, y=${point.y}`;
              }

              return `${context.dataset.label}: x=${point.x}, y=${point.y}`;
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Eje X",
            color: "#334155",
          },
          ticks: {
            color: "#475569",
          },
          grid: {
            color: "rgba(148, 163, 184, 0.25)",
          },
        },
        y: {
          title: {
            display: true,
            text: "Eje Y",
            color: "#334155",
          },
          ticks: {
            color: "#475569",
          },
          grid: {
            color: "rgba(148, 163, 184, 0.25)",
          },
        },
      },
    };

    if (this.forceChart) {
      this.forceChart.data = chartData;
      this.forceChart.options = chartOptions;
      this.forceChart.update();
      return;
    }

    this.forceChart = new Chart(forceChartCanvas, {
      type: "scatter",
      data: chartData,
      options: chartOptions,
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
    chartSection.classList.add("hidden");
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

      fxSpan.textContent = this.formatearResultado(data.resultado.fx);
      fySpan.textContent = this.formatearResultado(data.resultado.fy);
      magnitudSpan.textContent = this.formatearResultado(
        data.resultado.magnitud,
      );

      this.renderChart(q0, x0, y0, cargas, data.resultado);
      resultDiv.classList.remove("hidden");
      chartSection.classList.remove("hidden");
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
