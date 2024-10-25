document.getElementById('backButton').addEventListener('click', function() {
    goToHomepage();
});

function showForm(formType) {
    document.getElementById('homepage').classList.add('hidden');
    document.getElementById('moneySendForm').classList.add('hidden');
    document.getElementById('moneyTransferForm').classList.add('hidden');
    document.getElementById('mobileRechargeForm').classList.add('hidden');
    document.getElementById('confirmationPage').classList.add('hidden');
    document.getElementById(`${formType}Form`).classList.remove('hidden');
}

function goToHomepage() {
    document.getElementById('homepage').classList.remove('hidden');
    document.getElementById('moneyTransferForm').classList.add('hidden');
    document.getElementById('mobileRechargeForm').classList.add('hidden');
    document.getElementById('confirmationPage').classList.add('hidden');
}

function showConfirmation(details) {
    document.getElementById('homepage').classList.add('hidden');
    document.getElementById('moneySendForm').classList.add('hidden');
    document.getElementById('moneyTransferForm').classList.add('hidden');
    document.getElementById('mobileRechargeForm').classList.add('hidden');
    document.getElementById('confirmationPage').classList.remove('hidden');
    document.getElementById('confirmationDetails').innerHTML = details;
}

// Manejo del envío de dinero
document.getElementById('sendForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const data = {
        sender_name: formData.get('senderName'),  // Nombre del remitente
        sender_phone: formData.get('senderPhone'),  // Teléfono del remitente
        email: formData.get('email'),  // Correo electrónico del remitente
        nombre_destinatario: formData.get('receiverName'),  // Nombre del destinatario
        telefono_destinatario: formData.get('receiverPhone'),  // Teléfono del destinatario
        tipo_cuenta: formData.get('tipo_cuenta'),  // Tipo de cuenta
        numero_cuenta: formData.get('receiverBank'),  // Número de cuenta o banco del destinatario
        monto: parseFloat(formData.get('amount')),  // Monto de la transferencia
        pais_destino: formData.get('country'),  // País de destino
        ciudad_destino: formData.get('city'),  // Ciudad de destino
        estado_destino: formData.get('state')  // Estado o región de destino
    };

    const response = await fetch('https://api-transacciones.onrender.com/api/envios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    if (response.ok) {
        const details = `
            <p class="mb-2"><strong class="text-azul-oscuro">Tipo de Transaccion:</strong> Money Transfer</p>
            <p class="mb-2"><strong class="text-azul-oscuro">estado:</strong> <span class="text-yellow-600">Pending</span></p>
            <p class="mb-2"><strong class="text-azul-oscuro">Numero de Referencia:</strong> ${result.envio_id}</p>
            <p class="mb-2"><strong class="text-azul-oscuro">quien envia:</strong> ${formData.get('senderName')}</p>
            <p class="mb-2"><strong class="text-azul-oscuro">quien recibe:</strong> ${formData.get('receiverName')}</p>
            <p class="mb-2"><strong class="text-azul-oscuro">Cantidad:</strong> $${formData.get('amount')}</p>
        `;
        showConfirmation(details);
    } else {
        alert('Error: ' + JSON.stringify(result.detail));  // Mostrar todos los detalles del error
    }
});


// Manejo de recarga móvil
// Manejo de recarga móvil
document.getElementById('rechargeForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const data = {
        sender_name: formData.get('rechargeSenderName'),
        sender_phone: formData.get('rechargeSenderPhone'),
        telefono_receptor: formData.get('rechargeReceiverPhone'),
        monto: parseFloat(formData.get('rechargeAmount'))
    };

    try {
        const response = await fetch('https://api-transacciones.onrender.com/api/recargas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            mode: 'cors'  // Asegurar que CORS esté habilitado en la solicitud
        });

        const result = await response.json();
        
        if (response.ok) {
            const details = `
                <p class="mb-2"><strong class="text-azul-oscuro">Tipo de Transaccion:</strong> Mobile Recharge</p>
                <p class="mb-2"><strong class="text-azul-oscuro">Estado:</strong> <span class="text-yellow-600">Pending</span></p>
                <p class="mb-2"><strong class="text-azul-oscuro">Numero de Referencia:</strong> ${result.recarga_id}</p>
                <p class="mb-2"><strong class="text-azul-oscuro">Quien envia:</strong> ${formData.get('rechargeSenderName')}</p>
                <p class="mb-2"><strong class="text-azul-oscuro">Numero de Telefono quien recibe:</strong> ${formData.get('rechargeReceiverPhone')}</p>
                <p class="mb-2"><strong class="text-azul-oscuro">Cantidad:</strong> $${formData.get('rechargeAmount')}</p>
            `;
            showConfirmation(details);
        } else {
            alert('Error: ' + result.detail);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Ocurrió un error durante la solicitud.');
    }
});


function renderMoneyOrderInputs() {
    const container = document.getElementById('moneyOrderInputsContainer');
    const selectedQuantity = parseInt(document.getElementById('moneyOrder').value);
    
    // Limpiar el contenedor antes de agregar nuevos campos
    container.innerHTML = '';

    // Crear campos de entrada dinámicos según la cantidad seleccionada
    for (let i = 1; i <= selectedQuantity; i++) {
        const inputDiv = document.createElement('div');
        inputDiv.classList.add('mb-4');

        const label = document.createElement('label');
        label.setAttribute('for', `moneyOrderAmount${i}`);
        label.classList.add('block', 'mb-1', 'text-azul-oscuro');
        label.textContent = `Monto de Money Order ${i}`;

        const input = document.createElement('input');
        input.type = 'number';
        input.id = `moneyOrderAmount${i}`;
        input.name = `moneyOrderAmount${i}`;
        input.required = true;
        input.min = 0;
        input.step = 0.01;
        input.classList.add('w-full', 'p-2', 'border', 'border-azul-claro', 'rounded', 'focus:outline-none', 'focus:ring-2', 'focus:ring-azul-oscuro');

        inputDiv.appendChild(label);
        inputDiv.appendChild(input);
        container.appendChild(inputDiv);
    }
}


document.getElementById('transferForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Preparar los datos de money orders dinámicos
    const moneyOrders = [];
    const quantity = parseInt(formData.get('moneyOrder'));
    for (let i = 1; i <= quantity; i++) {
        const amount = parseFloat(formData.get(`moneyOrderAmount${i}`));
        if (!isNaN(amount)) {
            moneyOrders.push(amount);
        }
    }

    // Crear el objeto con los datos requeridos
    const data = {
        cantidad_ordenes: quantity,
        monto_total: parseFloat(formData.get('amount')),
        sender_name: formData.get('senderName'),
        sender_phone: formData.get('senderPhone')
    };

    // Imprimir `data` para verificar su estructura antes de enviar
    console.log("Datos enviados:", data);

    // Enviar la solicitud al backend con el `Content-Type` correcto
    const response = await fetch('http://127.0.0.1:8000/api/money-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    if (response.ok) {
        const details = `
            <p class="mb-2"><strong class="text-azul-oscuro">Tipo de Transacción:</strong> Money Order</p>
            <p class="mb-2"><strong class="text-azul-oscuro">Estado:</strong> <span class="text-yellow-600">Pending</span></p>
            <p class="mb-2"><strong class="text-azul-oscuro">Número de Referencia:</strong> ${result.orden_id}</p>
            <p class="mb-2"><strong class="text-azul-oscuro">Quien envía:</strong> ${formData.get('senderName')}</p>
            <p class="mb-2"><strong class="text-azul-oscuro">Monto Total:</strong> $${formData.get('amount')}</p>
        `;
        showConfirmation(details);
    } else {
        alert('Error: ' + JSON.stringify(result.detail));
    }
});
