$(document).ready(function () {
    // 1. Mostrar Saldo Actualizado
    function refreshBalanceUI() {
        if ($('#balanceDisplay').length) {
            $('#balanceDisplay').text(`$${Wallet.getBalance().toLocaleString('es-CL', { minimumFractionDigits: 2 })}`);
        }
    }
    refreshBalanceUI();

    // 2. Control de Login (login.html)
    $('#loginForm').on('submit', function (e) {
        e.preventDefault();
        const email = $('#email').val();
        const password = $('#password').val();

        if (email && password) {
            localStorage.setItem('wallet_user', email.split('@')[0]);
            window.location.href = 'menu.html';
        } else {
            $('#loginAlert').removeClass('d-none').text('Por favor, ingresa credenciales válidas.');
        }
    });

    // Logout
    $('#logoutBtn').on('click', function () {
        localStorage.removeItem('wallet_user');
        window.location.href = 'login.html';
    });

    // Saludo Dinámico
    const currentUser = localStorage.getItem('wallet_user') || 'Usuario';
    $('#userDisplay').text(`Hola, ${currentUser}`);

    // 3. Proceso de Depósito (deposit.html)
    $('#depositForm').on('submit', function (e) {
        e.preventDefault();
        const amount = parseFloat($('#depositAmount').val());

        if (amount > 0) {
            const newBalance = Wallet.getBalance() + amount;
            Wallet.updateBalance(newBalance);
            Wallet.addTransaction('Depósito', 'Abono de saldo', amount);

            $('#depositAlert')
                .removeClass('d-none alert-danger')
                .addClass('alert-success')
                .text(`¡Depósito exitoso! Se han abonado $${amount.toFixed(2)}.`);

            $('#depositAmount').val('');
            refreshBalanceUI();
        }
    });

    // 4. Gestión de Contactos y Envío de Dinero (sendmoney.html)
    function loadContactsUI() {
        const contacts = Wallet.getContacts();
        const $contactsList = $('#contactsUI');
        const $dataList = $('#contactListOptions');

        if ($contactsList.length) {
            $contactsList.empty();
            $dataList.empty();

            contacts.forEach(c => {
                $contactsList.append(`<li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <strong>${c.name}</strong><br>
                        <small class="text-muted">${c.email}</small>
                    </div>
                </li>`);

                $dataList.append(`<option value="${c.name}">`);
            });
        }
    }
    loadContactsUI();

    $('#addContactForm').on('submit', function (e) {
        e.preventDefault();
        const name = $('#newContactName').val();
        const email = $('#newContactEmail').val();

        if (name && email) {
            Wallet.addContact({ name, email });
            loadContactsUI();
            $('#newContactName').val('');
            $('#newContactEmail').val('');
        }
    });

    $('#sendMoneyForm').on('submit', function (e) {
        e.preventDefault();
        const contact = $('#contactSearch').val();
        const amount = parseFloat($('#sendAmount').val());
        const currentBalance = Wallet.getBalance();

        if (amount > currentBalance) {
            $('#sendAlert')
                .removeClass('d-none alert-success')
                .addClass('alert-danger')
                .text('Fondos insuficientes para esta transacción.');
            return;
        }

        if (amount > 0 && contact) {
            const newBalance = currentBalance - amount;
            Wallet.updateBalance(newBalance);
            Wallet.addTransaction('Transferencia', `Envío a ${contact}`, amount);

            $('#sendAlert')
                .removeClass('d-none alert-danger')
                .addClass('alert-success')
                .text(`Transferencia de $${amount.toFixed(2)} enviada a ${contact}.`);

            $('#sendAmount').val('');
            $('#contactSearch').val('');
            refreshBalanceUI();
        }
    });

    // 5. Historial de Transacciones (transactions.html)
    function loadTransactionsUI() {
        const $tableBody = $('#transactionHistoryTable');
        if ($tableBody.length) {
            const transactions = Wallet.getTransactions();
            $tableBody.empty();

            transactions.forEach(t => {
                const isDeposit = t.type === 'Depósito';
                const badgeClass = isDeposit ? 'bg-success' : 'bg-danger';
                const amountSign = isDeposit ? '+' : '-';

                $tableBody.append(`
                    <tr>
                        <td><span class="badge ${badgeClass}">${t.type}</span></td>
                        <td>${t.description}</td>
                        <td class="${isDeposit ? 'text-success' : 'text-danger'} fw-bold">${amountSign}$${parseFloat(t.amount).toFixed(2)}</td>
                        <td class="text-muted">${t.date}</td>
                    </tr>
                `);
            });
        }
    }
    loadTransactionsUI();
});