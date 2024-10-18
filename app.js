

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
            document.getElementById('moneySendForm').classList.add('hidden')
            document.getElementById('moneyTransferForm').classList.add('hidden');
            document.getElementById('mobileRechargeForm').classList.add('hidden');
            document.getElementById('confirmationPage').classList.remove('hidden');
            document.getElementById('confirmationDetails').innerHTML = details;
        }

        document.getElementById('sendForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const details = `
                <p class="mb-2"><strong class="text-azul-oscuro">Transaction Type:</strong> Money Transfer</p>
                <p class="mb-2"><strong class="text-azul-oscuro">Status:</strong> <span class="text-yellow-600">Pending</span></p>
                <p class="mb-2"><strong class="text-azul-oscuro">Reference Number:</strong> ${Math.random().toString(36).substring(2, 11).toUpperCase()}</p>
                <p class="mb-2"><strong class="text-azul-oscuro">Sender:</strong> ${formData.get('senderName')}</p>
                <p class="mb-2"><strong class="text-azul-oscuro">Receiver:</strong> ${formData.get('receiverName')}</p>
                <p class="mb-2"><strong class="text-azul-oscuro">Amount:</strong> $${formData.get('amount')}</p>
                <p class="mb-2"><strong class="text-azul-oscuro">Destination:</strong> ${formData.get('city')}, ${formData.get('state')}, ${formData.get('country')}</p>
            `;
            showConfirmation(details);
        });

        document.getElementById('transferForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const senderName = formData.get('transferSenderName');
            const senderPhone = formData.get('transferSenderPhone');
            const transfers = [];
            let totalAmount = 0;

            for (let pair of formData.entries()) {
                if (pair[0].startsWith('transferAmount')) {
                    const amount = parseFloat(pair[1]);
                    transfers.push(amount);
                    totalAmount += amount;
                }
            }

            const details = `
                <p class="mb-2"><strong class="text-azul-oscuro">Transaction Type:</strong> Money Transfer</p>
                <p class="mb-2"><strong class="text-azul-oscuro">Status:</strong> <span class="text-yellow-600">Pending</span></p>
                <p class="mb-2"><strong class="text-azul-oscuro">Reference Number:</strong> ${Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                <p class="mb-2"><strong class="text-azul-oscuro">Sender:</strong> ${senderName}</p>
                <p class="mb-2"><strong class="text-azul-oscuro">Sender's Phone:</strong> ${senderPhone}</p>
                <p class="mb-2"><strong class="text-azul-oscuro">Transfers:</strong> ${transfers.join(', ')}</p>
                <p class="mb-2"><strong class="text-azul-oscuro">Total Amount:</strong> $${totalAmount.toFixed(2)}</p>
            `;
            showConfirmation(details);
        });

        document.getElementById('rechargeForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const details = `
                <p class="mb-2"><strong class="text-azul-oscuro">Transaction Type:</strong> Mobile Recharge</p>
                <p class="mb-2"><strong class="text-azul-oscuro">Status:</strong> <span class="text-yellow-600">Pending</span></p>
                <p class="mb-2"><strong class="text-azul-oscuro">Reference Number:</strong> ${Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                <p class="mb-2"><strong class="text-azul-oscuro">Sender:</strong> ${formData.get('rechargeSenderName')}</p>
                <p class="mb-2"><strong class="text-azul-oscuro">Receiver's Phone:</strong> ${formData.get('rechargeReceiverPhone')}</p>
                <p class="mb-2"><strong class="text-azul-oscuro">Amount:</strong> $${formData.get('rechargeAmount')}</p>
            `;
            showConfirmation(details);
        });

        // Simple form validation
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                if (!form.checkValidity()) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                form.classList.add('was-validated');
            });
        });
 
        function renderMoneyOrderInputs() {
            const container = document.getElementById('moneyOrderInputsContainer');
            const selectedAmount = parseInt(document.getElementById('moneyOrder').value, 10);
            container.innerHTML = '';

            for (let i = 1; i <= selectedAmount; i++) {
                const inputDiv = document.createElement('div');
                inputDiv.classList.add('mb-2');

                const label = document.createElement('label');
                label.setAttribute('for', `moneyOrder${i}`);
                label.classList.add('block', 'mb-1', 'text-azul-oscuro');
                label.textContent = `Money Order ${i}`;

                const input = document.createElement('input');
                input.setAttribute('type', 'text');
                input.setAttribute('id', `moneyOrder${i}`);
                input.setAttribute('name', `moneyOrder${i}`);
                input.required = true;
                input.classList.add('w-full', 'p-2', 'border', 'border-azul-claro', 'rounded', 'focus:outline-none', 'focus:ring-2', 'focus:ring-azul-oscuro');

                inputDiv.appendChild(label);
                inputDiv.appendChild(input);
                container.appendChild(inputDiv);
            }
        }