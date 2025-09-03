// App State
const correctPin = '1234';

// Initial inventory data
const initialInventory = {
    classic: { S: 0, M: 6, L: 6, XL: 6, '2XL': 2 },
    premium: { S: 0, M: 6, L: 6, XL: 6, '2XL': 2 }
};

// Current inventory
let currentInventory = JSON.parse(JSON.stringify(initialInventory));

// DOM Elements
const pinModal = document.getElementById('pinModal');
const pinInput = document.getElementById('pinInput');
const confirmReset = document.getElementById('confirmReset');
const cancelReset = document.getElementById('cancelReset');
const errorMessage = document.getElementById('errorMessage');

let resetTarget = null; // which design we're resetting

// Initialize
function init() {
    renderTable('classic', document.querySelector('#classicTable tbody'));
    renderTable('premium', document.querySelector('#premiumTable tbody'));
    setupEventListeners();
}

// Render inventory table
function renderTable(design, tbody) {
    tbody.innerHTML = '';

    Object.keys(currentInventory[design]).forEach(size => {
        const quantity = currentInventory[design][size];

        const tr = document.createElement('tr');

        // Size
        const tdSize = document.createElement('td');
        tdSize.textContent = size;
        tr.appendChild(tdSize);

        // Quantity with conditional formatting
        const tdQuantity = document.createElement('td');
        tdQuantity.textContent = quantity;
        tdQuantity.classList.add('quantity-cell');
        tdQuantity.classList.remove('high', 'medium', 'low');

        if (quantity >= 3) {
            tdQuantity.classList.add('high');
        } else if (quantity === 0) {
            tdQuantity.classList.add('low');
        } else {
            tdQuantity.classList.add('medium');
        }

        tr.appendChild(tdQuantity);

        // Adjust buttons
        const tdAdjust = document.createElement('td');
        const adjustButtonsDiv = document.createElement('div');
        adjustButtonsDiv.classList.add('adjust-buttons');

        const minusBtn = document.createElement('button');
        minusBtn.textContent = '−';
        minusBtn.classList.add('btn-minus');
        minusBtn.disabled = quantity === 0; // Disable if quantity is 0
        minusBtn.addEventListener('click', () => adjustQuantity(design, size, -1));

        const plusBtn = document.createElement('button');
        plusBtn.textContent = '+';
        plusBtn.classList.add('btn-plus');
        plusBtn.addEventListener('click', () => adjustQuantity(design, size, 1));

        adjustButtonsDiv.appendChild(minusBtn);
        adjustButtonsDiv.appendChild(plusBtn);
        tdAdjust.appendChild(adjustButtonsDiv);
        tr.appendChild(tdAdjust);

        tbody.appendChild(tr);
    });
}

// Adjust quantity
function adjustQuantity(design, size, change) {
    const newQuantity = currentInventory[design][size] + change;
    if (newQuantity < 0) return;
    currentInventory[design][size] = newQuantity;
    renderTable(design, document.querySelector(`#${design}Table tbody`));
}

// Reset modal
function openPinModal(design) {
    resetTarget = design;
    pinModal.style.display = 'block';
    pinInput.value = '';
    pinInput.focus();
    errorMessage.textContent = '';
}

function closePinModal() {
    pinModal.style.display = 'none';
    pinInput.value = '';
    errorMessage.textContent = '';
    resetTarget = null;
}

function handleReset() {
    const enteredPin = pinInput.value.trim();

    if (enteredPin === correctPin && resetTarget) {
        currentInventory[resetTarget] = { ...initialInventory[resetTarget] };
        renderTable(resetTarget, document.querySelector(`#${resetTarget}Table tbody`));
        closePinModal();

        // Success feedback
        const resetBtn = document.querySelector(`.reset-btn[data-design="${resetTarget}"]`);
        const originalText = resetBtn.textContent;
        resetBtn.textContent = 'Reset Successful!';
        resetBtn.style.background = '#28A745';
        setTimeout(() => {
            resetBtn.textContent = originalText;
            resetBtn.style.background = '#4A90E2';
        }, 2000);
    } else {
        errorMessage.textContent = 'Incorrect PIN. Please try again.';
        pinInput.value = '';
        pinInput.focus();
    }
}

// Event listeners
function setupEventListeners() {
    document.querySelectorAll('.reset-btn').forEach(btn => {
        btn.addEventListener('click', () => openPinModal(btn.dataset.design));
    });

    confirmReset.addEventListener('click', handleReset);
    cancelReset.addEventListener('click', closePinModal);

    pinInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') handleReset();
    });

    pinModal.addEventListener('click', e => {
        if (e.target === pinModal) closePinModal();
    });
}

// Init on DOM load
document.addEventListener('DOMContentLoaded', init);