const updatedValue = document.getElementById("valor-actualizado");
const input = document.getElementById("montoclp");
const select = document.getElementById("selector-moneda");
const button = document.getElementById("buscar-btn");
const ctx = document.getElementById("myChart");
const mensaje = document.getElementById("mensaje");
let chart;

input.addEventListener("input", checkInputs);
select.addEventListener("change", checkInputs);
button.addEventListener("click", getValue);

function checkInputs() {
  const inputValue = input.value.trim();
  const selectedValue = select.value;

  button.disabled = !(inputValue && selectedValue !== "Seleccione Moneda");
}

let inputValueClp;
let selectedValueSelect;

function getValue() {
  inputValueClp = parseFloat(input.value);
  selectedValueSelect = select.value;

  if (inputValueClp && selectedValueSelect !== "Seleccione Moneda") {
    getData();
  } else {
    alert("Por favor, ingrese un monto válido y seleccione una moneda.");
  }
}

// Fetch para obtener respuesta de la API
const getData = async () => {
  const url = `https://mindicador.cl/api/${selectedValueSelect}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    mensaje.style.display = "none";

    if (data && data.serie && data.serie.length > 0) {
      const currentValue = data.serie[0];
      const convertedValue = (inputValueClp / currentValue.valor).toFixed(2);
      updatedValue.innerHTML = `Resultado: $${convertedValue}`;

      if (data.serie.length >= 10) {
        const listValue = data.serie.slice(0, 10);
        const labels = listValue.map((item) => item.fecha.substring(0, 10));
        const chartData = listValue.map((item) => item.valor);

        if (chart) {
          chart.destroy();
        }

        // grafico
        chart = new Chart(ctx, {
          type: "line",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Historial últimos 10 días",
                data: chartData,
                borderWidth: 1,
                fill: false,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }
    } else {
      mensaje.style.display = "none";
      mensaje.innerHTML = "Ingresa datos para ver el gráfico";
    }
  } catch (error) {
    console.log(error);
    alert("Hay un error de conexión");
  }
};
