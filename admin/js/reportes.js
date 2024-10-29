

const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');

function toggleSidebar() {
  sidebar.classList.toggle('hidden');
}

sidebarToggle.addEventListener('click', toggleSidebar);

// Handle responsive sidebar
window.addEventListener('resize', () => {
  if (window.innerWidth >= 1024) {
    sidebar.classList.remove('hidden');
  } else {
    sidebar.classList.add('hidden');
  }
});

// Mock data for charts
const monthlyTransactionsData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [{
    label: 'Transactions',
    data: [65, 59, 80, 81, 56, 55],
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    borderColor: 'rgba(75, 192, 192, 1)',
    borderWidth: 1
  }]
};

const revenueByClientTypeData = {
  labels: ['Individual', 'Business', 'Enterprise'],
  datasets: [{
    label: 'Revenue',
    data: [300, 500, 200],
    backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(255, 206, 86, 0.2)'
    ],
    borderColor: [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)'
    ],borderWidth: 1
  }]
};

// Create charts
const monthlyTransactionsChart = new Chart(
  document.getElementById('monthly-transactions-chart'),
  {
    type: 'line',
    data: monthlyTransactionsData,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  }
);

const revenueByClientTypeChart = new Chart(
  document.getElementById('revenue-by-client-type-chart'),
  {
    type: 'pie',
    data: revenueByClientTypeData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Revenue by Client Type'
        }
      }
    }
  }
);