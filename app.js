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
        sender_name: formData.get('senderName'),
        sender_phone: formData.get('senderPhone'),
        email: formData.get('email'),
        receiver_name: formData.get('receiverName'),
        receiver_phone: formData.get('receiverPhone'),
        account_type: formData.get('typeAcount'),  // Nombre de campo ajustado
        receiver_bank: formData.get('receiverBank'),
        amount: parseFloat(formData.get('amount')),
        country: formData.get('country'),
        city: formData.get('city'),
        state: formData.get('state')
    };

    const response = await fetch('https://api-transacciones.onrender.com/envios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    if (response.ok) {
        const details = `
            <p class="mb-2"><strong class="text-azul-oscuro">Transaction Type:</strong> Money Transfer</p>
            <p class="mb-2"><strong class="text-azul-oscuro">Status:</strong> <span class="text-yellow-600">Pending</span></p>
            <p class="mb-2"><strong class="text-azul-oscuro">Reference Number:</strong> ${result.envio_id}</p>
            <p class="mb-2"><strong class="text-azul-oscuro">Sender:</strong> ${formData.get('senderName')}</p>
            <p class="mb-2"><strong class="text-azul-oscuro">Receiver:</strong> ${formData.get('receiverName')}</p>
            <p class="mb-2"><strong class="text-azul-oscuro">Amount:</strong> $${formData.get('amount')}</p>
        `;
        showConfirmation(details);
    } else {
        alert('Error: ' + result.detail);
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
                <p class="mb-2"><strong class="text-azul-oscuro">Transaction Type:</strong> Mobile Recharge</p>
                <p class="mb-2"><strong class="text-azul-oscuro">Status:</strong> <span class="text-yellow-600">Pending</span></p>
                <p class="mb-2"><strong class="text-azul-oscuro">Reference Number:</strong> ${result.recarga_id}</p>
                <p class="mb-2"><strong class="text-azul-oscuro">Sender:</strong> ${formData.get('rechargeSenderName')}</p>
                <p class="mb-2"><strong class="text-azul-oscuro">Receiver's Phone:</strong> ${formData.get('rechargeReceiverPhone')}</p>
                <p class="mb-2"><strong class="text-azul-oscuro">Amount:</strong> $${formData.get('rechargeAmount')}</p>
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


// Manejo de money orders
document.getElementById('transferForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
        sender_name: formData.get('transferSenderName'),
        sender_phone: formData.get('transferSenderPhone'),
        quantity: parseInt(formData.get('moneyOrder')),
        total_amount: parseFloat(formData.get('amount'))
    };

    const response = await fetch('https://api-transacciones.onrender.com/money-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    if (response.ok) {
        const details = `
            <p class="mb-2"><strong class="text-azul-oscuro">Transaction Type:</strong> Money Order</p>
            <p class="mb-2"><strong class="text-azul-oscuro">Status:</strong> <span class="text-yellow-600">Pending</span></p>
            <p class="mb-2"><strong class="text-azul-oscuro">Reference Number:</strong> ${result.orden_id}</p>
            <p class="mb-2"><strong class="text-azul-oscuro">Sender:</strong> ${formData.get('transferSenderName')}</p>
            <p class="mb-2"><strong class="text-azul-oscuro">Total Amount:</strong> $${formData.get('amount')}</p>
        `;
        showConfirmation(details);
    } else {
        alert('Error: ' + result.detail);
    }
});
