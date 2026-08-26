/**
 * Modulo Wallet - Encargado de la persistencia de datos (localStorage)
 */

// Inicializar base de datos simulación
if (!localStorage.getItem('wallet_balance')) {
    localStorage.setItem('wallet_balance', '15000.00');
}

if (!localStorage.getItem('wallet_contacts')) {
    const defaultContacts = [
        { name: "Juan Pérez", email: "juan@example.com" },
        { name: "María Gómez", email: "maria@example.com" }
    ];
    localStorage.setItem('wallet_contacts', JSON.stringify(defaultContacts));
}

if (!localStorage.getItem('wallet_transactions')) {
    const defaultTransactions = [
        { type: "Depósito", description: "Depósito Inicial", amount: 15000.00, date: new Date().toLocaleString() }
    ];
    localStorage.setItem('wallet_transactions', JSON.stringify(defaultTransactions));
}

const Wallet = {
    getBalance: () => parseFloat(localStorage.getItem('wallet_balance')),
    
    updateBalance: (newBalance) => {
        localStorage.setItem('wallet_balance', newBalance.toFixed(2));
    },

    getContacts: () => JSON.parse(localStorage.getItem('wallet_contacts')),

    addContact: (contact) => {
        const contacts = Wallet.getContacts();
        contacts.push(contact);
        localStorage.setItem('wallet_contacts', JSON.stringify(contacts));
    },

    getTransactions: () => JSON.parse(localStorage.getItem('wallet_transactions')),

    addTransaction: (type, description, amount) => {
        const transactions = Wallet.getTransactions();
        transactions.unshift({
            type,
            description,
            amount,
            date: new Date().toLocaleString()
        });
        localStorage.setItem('wallet_transactions', JSON.stringify(transactions));
    }
};