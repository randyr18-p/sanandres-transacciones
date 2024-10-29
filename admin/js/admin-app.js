
const mockTransactions = [
  { id: 1, client: 'John Doe', amount: 100, status: 'completed', type: 'transfer', date: '2023-03-15T10:30:00' },
  { id: 2, client: 'Jane Smith', amount: 50, status: 'pending', type: 'recharge', date: '2023-03-15T11:45:00' },
  { id: 3, client: 'Bob Johnson', amount: 200, status: 'completed', type: 'transfer', date: '2023-03-15T13:15:00' },
  { id: 4, client: 'Alice Brown', amount: 75, status: 'pending', type: 'recharge', date: '2023-03-15T14:30:00' },
  { id: 5, client: 'Charlie Davis', amount: 150, status: 'completed', type: 'transfer', date: '2023-03-16T09:00:00' },
  { id: 6, client: 'Eva Wilson', amount: 80, status: 'pending', type: 'recharge', date: '2023-03-16T10:30:00' },
  { id: 7, client: 'Frank Miller', amount: 120, status: 'completed', type: 'transfer', date: '2023-03-16T14:00:00' },
  { id: 8, client: 'Grace Taylor', amount: 90, status: 'completed', type: 'recharge', date: '2023-03-17T11:15:00' },
];

const searchInput = document.getElementById('search-input');
const statusFilter = document.getElementById('status-filter');
const typeFilter = document.getElementById('type-filter');
const transactionsTable = document.getElementById('transactions-table');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');

const totalTransactionsEl = document.getElementById('total-transactions');
const totalAmountEl = document.getElementById('total-amount');
const pendingTransactionsEl = document.getElementById('pending-transactions');
const completedTransactionsEl = document.getElementById('completed-transactions');

const recentActivityEl = document.getElementById('recent-activity');

function renderTransactions(transactions) {
  transactionsTable.innerHTML = '';
  transactions.forEach(transaction => {
    const row = document.createElement('tr');
    row.className = 'bg-white border-b hover:bg-gray-50';
    row.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${transaction.id}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${transaction.client}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$${transaction.amount.toFixed(2)}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
          transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }">
          ${transaction.status}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${transaction.type}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(transaction.date).toLocaleString()}</td>
    `;
    transactionsTable.appendChild(row);
  });
}

function filterTransactions() {
  const searchTerm = searchInput.value.toLowerCase();
  const status = statusFilter.value;
  const type = typeFilter.value;

  const filteredTransactions = mockTransactions
    .filter(transaction =>
      transaction.client.toLowerCase().includes(searchTerm) ||
      transaction.id.toString().includes(searchTerm)
    )
    .filter(transaction => status === 'all' || transaction.status === status)
    .filter(transaction => type === 'all' || transaction.type === type)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  renderTransactions(filteredTransactions);
  updateDashboard(filteredTransactions);
}

function toggleSidebar() {
  sidebar.classList.toggle('hidden');
}

function updateDashboard(transactions) {
  const totalTransactions = transactions.length;
  const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const pendingTransactions = transactions.filter(t => t.status === 'pending').length;
  const completedTransactions = transactions.filter(t => t.status === 'completed').length;

  totalTransactionsEl.textContent = totalTransactions;
  totalAmountEl.textContent = `$${totalAmount.toFixed(2)}`;
  pendingTransactionsEl.textContent = pendingTransactions;
  completedTransactionsEl.textContent = completedTransactions;

  updateTransactionChart(transactions);
  updateTransactionTypesChart(transactions);
  updateRecentActivity(transactions);
}

function updateTransactionChart(transactions) {
  const dates = [...new Set(transactions.map(t => new Date(t.date).toLocaleDateString()))];
  const data = dates.map(date => 
    transactions.filter(t => new Date(t.date).toLocaleDateString() === date)
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const options = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: false
      }
    },
    series: [{
      name: 'Transaction Amount',
      data: data
    }],
    xaxis: {
      categories: dates,
      labels: {
        rotateAlways: true,
        rotate: -45,
        style: {
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return "$" + value.toFixed(2);
        }
      }
    },
    colors: ['#4f46e5'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100]
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    }
  };

  const chart = new ApexCharts(document.querySelector("#transaction-chart"), options);
  chart.render();
}

function updateTransactionTypesChart(transactions) {
  const typeCount = transactions.reduce((acc, t) => {
    acc[t.type] = (acc[t.type] || 0) + 1;
    return acc;
  }, {});

  const options = {
    chart: {
      type: 'donut',
      height: 350
    },
    series: Object.values(typeCount),
    labels: Object.keys(typeCount),
    colors: ['#4f46e5', '#10b981'],
    legend: {
      position: 'bottom'
    }
  };

  const chart = new ApexCharts(document.querySelector("#transaction-types-chart"), options);
  chart.render();
}

function updateRecentActivity(transactions) {
  recentActivityEl.innerHTML = '';
  transactions.slice(0, 5).forEach(transaction => {
    const li = document.createElement('li');
    li.className = 'flex items-center space-x-3';
    li.innerHTML = `
      <div class="flex-shrink-0">
        <span class="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-100">
          <svg class="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </span>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-900 truncate">
          ${transaction.client}
        </p>
        <p class="text-sm text-gray-500 truncate">
          ${transaction.type === 'transfer' ? 'Transferred' : 'Recharged'} $${transaction.amount.toFixed(2)}
        </p>
      </div>
      <div class="flex-shrink-0 text-sm text-gray-500">
        ${new Date(transaction.date).toLocaleTimeString()}
      </div>
    `;
    recentActivityEl.appendChild(li);
  });
}

searchInput.addEventListener('input', filterTransactions);
statusFilter.addEventListener('change', filterTransactions);
typeFilter.addEventListener('change', filterTransactions);
sidebarToggle.addEventListener('click', toggleSidebar);

// Handle responsive sidebar
window.addEventListener('resize', () => {
  if (window.innerWidth >= 1024) {
    sidebar.classList.remove('hidden');
  } else {
    sidebar.classList.add('hidden');
  }
});

// Initial render
filterTransactions();