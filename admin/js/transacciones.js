// URL base de la API
const API_BASE_URL = "http://127.0.0.1:8000/api/admin/transacciones";

// Elementos HTML
const transactionsTable = document.getElementById("transactions-table");
const transactionModal = document.getElementById("transactionModal");
const transactionDetails = document.getElementById("transactionDetails");
const searchInput = document.getElementById("search-input");
const statusFilter = document.getElementById("status-filter");
const typeFilter = document.getElementById("type-filter");

// Administrador (ID de prueba)
const admin = 1;

let selectedTransaction = null;

// Cargar transacciones, filtradas por estado y tipo
async function loadTransactions() {
    try {
        // Obtener valores de filtros activos
        const status = statusFilter.value !== "all" ? `status=${statusFilter.value}` : "";
        const type = typeFilter.value !== "all" ? `&type=${typeFilter.value}` : "";
        const search = searchInput.value ? `&search=${searchInput.value}` : "";

        // Construir la consulta completa
        let query = `?${status}${type}${search}`.replace("?&", "?");

        // Llamar al endpoint con los filtros activos
        const response = await fetch(`${API_BASE_URL}/pendientes${query}`);
        if (!response.ok) throw new Error(`Error al cargar transacciones: ${response.statusText}`);

        const transactions = await response.json();
        renderTransactions(transactions);

    } catch (error) {
        console.error("Error al cargar transacciones:", error);
        alert("Error al cargar las transacciones.");
    }
}

// Renderizar transacciones en la tabla
function renderTransactions(transactions) {
    transactionsTable.innerHTML = "";  // Limpiar contenido de la tabla

    transactions.forEach((transaction) => {
        const row = document.createElement("tr");
        row.classList.add("border-b", "hover:bg-gray-100");
        row.innerHTML = `
            <td class="px-6 py-4">${transaction.transaccion_id}</td>
            <td class="px-6 py-4">${transaction.cliente_nombre}</td>
            <td class="px-6 py-4">$${transaction.monto}</td>
            <td class="px-6 py-4">${transaction.estado}</td>
            <td class="px-6 py-4">${transaction.tipo}</td>
            <td class="px-6 py-4">${new Date(transaction.fecha).toLocaleDateString()}</td>
            <td class="px-6 py-4">
                <button onclick="selectTransaction(${transaction.transaccion_id}, '${transaction.tipo}', '${transaction.estado}')" class="bg-blue-500 text-white px-4 py-2 rounded">Ver</button>
            </td>
        `;
        transactionsTable.appendChild(row);
    });
}

// Seleccionar una transacción
function selectTransaction(transaccion_id, tipo, estado) {
    selectedTransaction = { transaccion_id, tipo, estado };

    if (estado === "pendiente") {
        lockTransaction(transaccion_id, tipo);  // Bloquea la transacción si está pendiente
    }
    openModal();
}

// Abrir el modal con detalles de la transacción seleccionada
async function openModal() {
    try {
        const response = await fetch(`${API_BASE_URL}/${selectedTransaction.tipo}/${selectedTransaction.transaccion_id}`);
        if (!response.ok) throw new Error(`Error al cargar detalles: ${response.statusText}`);

        const details = await response.json();
        transactionDetails.innerHTML = `
            <p><strong>ID:</strong> ${details.transaccion_id}</p>
            <p><strong>Cliente:</strong> ${details.cliente_nombre}</p>
            <p><strong>Monto:</strong> $${details.monto}</p>
            <p><strong>Fecha:</strong> ${new Date(details.fecha).toLocaleDateString()}</p>
            <p><strong>Estado:</strong> ${details.estado}</p>
        `;
        transactionModal.classList.remove("hidden");
    } catch (error) {
        console.error("Error al cargar detalles de la transacción:", error);
        alert("No se pudo cargar el detalle de la transacción.");
    }
}

// Bloquear una transacción
async function lockTransaction(transaccion_id, tipo) {
    const url = `${API_BASE_URL}/${tipo}/${transaccion_id}/bloquear?admin_id=${admin}`;
    try {
        const response = await fetch(url, { method: "PUT", headers: { "Content-Type": "application/json" } });
        if (!response.ok) throw new Error(`Error al bloquear transacción: ${response.statusText}`);
    } catch (error) {
        console.error("Error al bloquear la transacción:", error);
    }
}

// Completar una transacción
async function completeTransaction() {
    try {
        const response = await fetch(`${API_BASE_URL}/${selectedTransaction.tipo}/${selectedTransaction.transaccion_id}/completar`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" }
        });
        if (response.ok) {
            alert("Transacción marcada como completada.");
            closeModal();
            loadTransactions();
        } else {
            throw new Error("No se pudo completar la transacción.");
        }
    } catch (error) {
        console.error("Error al completar la transacción:", error);
        alert("No se pudo completar la transacción.");
    }
}

// Liberar una transacción (volver a "pendiente")
async function releaseTransaction() {
    try {
        const response = await fetch(`${API_BASE_URL}/${selectedTransaction.tipo}/${selectedTransaction.transaccion_id}/liberar`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" }
        });
        if (response.ok) {
            alert("Transacción liberada y marcada como pendiente.");
            closeModal();
            loadTransactions();
        } else {
            throw new Error("No se pudo liberar la transacción.");
        }
    } catch (error) {
        console.error("Error al liberar la transacción:", error);
        alert("No se pudo liberar la transacción.");
    }
}

// Cerrar el modal
function closeModal() {
    transactionModal.classList.add("hidden");
    selectedTransaction = null;
}

// Listeners de filtros y búsqueda
statusFilter.addEventListener("change", loadTransactions);
typeFilter.addEventListener("change", loadTransactions);
searchInput.addEventListener("input", debounce(loadTransactions, 300));

// Función debounce para optimizar la búsqueda
function debounce(func, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
}

// Intervalo de actualización automática
const REFRESH_INTERVAL = 10000; // 10 segundos
setInterval(() => {
    if (!transactionModal.classList.contains("hidden")) return;  // No recargar si el modal está abierto
    loadTransactions();
}, REFRESH_INTERVAL);

// Inicializar la carga de transacciones
loadTransactions();

// Exponer funciones globales
window.selectTransaction = selectTransaction;
window.closeModal = closeModal;
window.completeTransaction = completeTransaction;
window.releaseTransaction = releaseTransaction;
