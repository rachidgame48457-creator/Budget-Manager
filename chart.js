let budgetChart = null;
let categoryChart = null;

function updateCharts(income, expense, categoryTotals) {
  const budgetCanvas = document.getElementById("budgetChart");
  const categoryCanvas = document.getElementById("categoryChart");

  if (budgetChart) budgetChart.destroy();
  if (categoryChart) categoryChart.destroy();

  if (budgetCanvas) {
    budgetChart = new Chart(budgetCanvas, {
      type: "doughnut",
      data: {
        labels: ["Revenus", "Dépenses"],
        datasets: [{
          data: [income, expense],
          backgroundColor: ["#16a34a", "#dc2626"]
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "bottom" } }
      }
    });
  }

  if (categoryCanvas) {
    categoryChart = new Chart(categoryCanvas, {
      type: "bar",
      data: {
        labels: Object.keys(categoryTotals),
        datasets: [{
          label: "Dépenses DH",
          data: Object.values(categoryTotals),
          backgroundColor: "#2563eb"
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    });
  }
}
