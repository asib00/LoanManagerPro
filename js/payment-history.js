// ======================================
// Loan Manager Pro v2
// payment-history.js (Part 1/3)
// ======================================

let selectedCustomer = null;

document.addEventListener("DOMContentLoaded", function () {

    waitDatabase();

});

// ----------------------------
// Wait Database
// ----------------------------

function waitDatabase() {

    if (typeof db === "undefined" || !db) {

        setTimeout(waitDatabase, 100);

        return;

    }

    loadHistory();

}

// ----------------------------
// Load Payment History
// ----------------------------

function loadHistory() {

    const id = Number(
        sessionStorage.getItem("selectedCustomer")
    );

    if (!id) {

        alert("Customer Not Found");

        window.location.href = "dashboard.html";

        return;

    }

    getCustomers(function(customers){

        selectedCustomer =
            customers.find(c => c.id == id);

        if (!selectedCustomer) {

            alert("Customer Not Found");

            window.location.href = "dashboard.html";

            return;

        }

        showHistory();

    });

}

// ----------------------------
// Show Payment History
// ----------------------------

function showHistory() {

    const list =
        document.getElementById("historyList");

    list.innerHTML = "";

    const history =
        selectedCustomer.paymentHistory || [];

    if (history.length === 0) {

        list.innerHTML =

        `
        <div class="empty">

        No Payment History

        </div>
        `;

        document.getElementById("totalPayment")
        .innerText = "₹0";

        return;

    }

    let total = 0;

    history.forEach(item => {

        total += Number(item.amount);

        list.innerHTML += createHistoryCard(item);

    });

    document.getElementById("totalPayment")
    .innerText = "₹" + total.toFixed(2);

}
// ======================================
// payment-history.js (Part 2/3)
// ======================================

// ----------------------------
// Create History Card
// ----------------------------

function createHistoryCard(item) {

    const amount =
        Number(item.amount || 0).toFixed(2);

    const balance =
        Number(item.balance || 0).toFixed(2);

    const interest =
        Number(item.interestDue || 0).toFixed(2);

    const date =
        item.date || "-";

    return `

    <div class="history-card">

        <h3>₹${amount}</h3>

        <p>
            <strong>Date :</strong><br>
            ${date}
        </p>

        <p>
            <strong>Principal Balance :</strong>
            ₹${balance}
        </p>

        <p>
            <strong>Interest Due :</strong>
            ₹${interest}
        </p>

    </div>

    `;

}

// ----------------------------
// Refresh History
// ----------------------------

function refreshHistory() {

    loadHistory();

}

// ----------------------------
// Payment Count
// ----------------------------

function paymentCount() {

    if (!selectedCustomer) return 0;

    return (
        selectedCustomer.paymentHistory || []
    ).length;

}

// ----------------------------
// Total Collection
// ----------------------------

function totalCollection() {

    if (!selectedCustomer) return 0;

    let total = 0;

    (selectedCustomer.paymentHistory || []).forEach(item => {

        total += Number(item.amount);

    });

    return total;

}
// ======================================
// Loan Manager Pro v2
// payment-history.js (Part 3/3)
// ======================================

// ----------------------------
// Delete Payment
// ----------------------------

function deletePayment(index) {

    if (!selectedCustomer) return;

    const ok = confirm("Delete this payment?");

    if (!ok) return;

    selectedCustomer.paymentHistory.splice(index, 1);

    // Recalculate Total Paid
    let totalPaid = 0;

    selectedCustomer.paymentHistory.forEach(payment => {

        totalPaid += Number(payment.amount || 0);

    });

    selectedCustomer.paid = totalPaid;

    updateCustomer(selectedCustomer, function () {

        loadHistory();

        alert("Payment Deleted Successfully");

    });

}

// ----------------------------
// Print History (Future)
// ----------------------------

function printHistory() {

    window.print();

}

// ----------------------------
// Export History (Future)
// ----------------------------

function exportHistory() {

    alert("PDF Export will be added in next version.");

}

// ----------------------------
// Sort History (Latest First)
// ----------------------------

function sortHistory() {

    if (!selectedCustomer) return;

    selectedCustomer.paymentHistory.sort(function (a, b) {

        return new Date(b.date) - new Date(a.date);

    });

}

// ----------------------------
// Reload Screen
// ----------------------------

function reloadHistory() {

    sortHistory();

    showHistory();

}

// ----------------------------
// Total Interest Paid
// ----------------------------

function totalInterestPaid() {

    if (!selectedCustomer) return 0;

    let total = 0;

    (selectedCustomer.paymentHistory || []).forEach(payment => {

        if (payment.interestPaid) {

            total += Number(payment.interestPaid);

        }

    });

    return total;

}

// ----------------------------
// Total Principal Paid
// ----------------------------

function totalPrincipalPaid() {

    if (!selectedCustomer) return 0;

    let total = 0;

    (selectedCustomer.paymentHistory || []).forEach(payment => {

        if (payment.principalPaid) {

            total += Number(payment.principalPaid);

        }

    });

    return total;

}

// ======================================
// End payment-history.js
// ======================================