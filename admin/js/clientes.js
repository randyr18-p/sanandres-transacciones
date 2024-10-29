

const mockClients = [
  { id: 1, name: 'John Doe', email: 'john@example.com', totalTransactions: 5 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', totalTransactions: 3 },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', totalTransactions: 7 },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', totalTransactions: 2 },
  { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', totalTransactions: 4 },
];

const searchInput = document.getElementById('search-input');
const clientsTable = document.getElementById('clients-table');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');

function renderClients(clients) {
  clientsTable.innerHTML = '';
  clients.forEach(client => {
    const row = document.createElement('tr');
    row.className = 'bg-white border-b hover:bg-gray-50';
    row.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${client.id}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${client.name}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${client.email}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${client.totalTransactions}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <a href="#" class="text-indigo-600 hover:text-indigo-900">Edit</a>
      </td>
    `;
    clientsTable.appendChild(row);
  });
}

function filterClients() {
  const searchTerm = searchInput.value.toLowerCase();

  const filteredClients = mockClients
    .filter(client =>
      client.name.toLowerCase().includes(searchTerm) ||
      client.email.toLowerCase().includes(searchTerm) ||
      client.id.toString().includes(searchTerm)
    )
    .sort((a, b) => b.totalTransactions - a.totalTransactions);

  renderClients(filteredClients);
}

function toggleSidebar() {
  sidebar.classList.toggle('hidden');
}

searchInput.addEventListener('input', filterClients);
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
filterClients();