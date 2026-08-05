// ======================================
// Loan Manager Pro v2 (2026 Stable)
// customer-details.js (Part 1/3)
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

    loadCustomer();

    initializeButtons();

}

// ----------------------------
// Load Customer
// ----------------------------

function loadCustomer() {

    const id = Number(
        sessionStorage.getItem("selectedCustomer")
    );

    if (!id) {

        alert("Customer Not Found");

        window.location.href = "dashboard.html";

        return;

    }

    getCustomers(function (customers) {

        selectedCustomer =
            customers.find(c => c.id == id);

        if (!selectedCustomer) {

            alert("Customer Not Found");

            window.location.href =
                "dashboard.html";

            return;

        }

        // Interest Update
        if (typeof calculateOutstanding === "function") {

            calculateOutstanding(selectedCustomer);

        }

        showCustomer();

    });

}

// ----------------------------
// Show Customer
// ----------------------------

function showCustomer() {

    const c = selectedCustomer;

    if (!c) return;

    document.getElementById("customerName").innerText =
        c.name || "";

    document.getElementById("customerPhone").innerText =
        c.phone || "";

    document.getElementById("customerAddress").innerText =
        c.address || "";

    document.getElementById("customerIdType").innerText =
        c.idType || "-";

    // ₹ Symbol HTML में पहले से है
    document.getElementById("loanAmount").innerText =
        Number(c.loan || 0).toFixed(2);

    document.getElementById("interestRate").innerText =
        Number(c.interest || 0);

    document.getElementById("paymentType").innerText =
        c.paymentType || "-";

    document.getElementById("loanDuration").innerText =
        (c.duration || 0) + " " +
        (c.durationType || "");

    document.getElementById("totalPaid").innerText =
        Number(c.paid || 0).toFixed(2);

    // Profile Photo Fix
    const profile =
        document.getElementById("customerPhoto");

    if (c.profilePhoto &&
        c.profilePhoto.trim() !== "") {

        profile.src = c.profilePhoto;

    } else {

        profile.src = "images/user.png";

    }

    // ID Photo
    const idPhoto =
        document.getElementById("customerIdPhoto");

    if (idPhoto) {

        if (c.idPhoto &&
            c.idPhoto.trim() !== "") {

            idPhoto.src = c.idPhoto;
            idPhoto.style.display = "block";

        } else {

            idPhoto.style.display = "none";

        }

    }

    updateOutstanding();

}

// ----------------------------
// Outstanding
// ----------------------------

function updateOutstanding() {

    if (!selectedCustomer) return;

    let outstanding = 0;

    if (typeof getOutstanding === "function") {

        outstanding =
            getOutstanding(selectedCustomer);

    } else {

        outstanding =
            Number(selectedCustomer.currentBalance || 0) +
            Number(selectedCustomer.interestDue || 0);

    }

    // ₹ HTML में पहले से है
    document.getElementById("balance").innerText =
        outstanding.toFixed(2);

}
// ======================================
// Loan Manager Pro v2 (2026 Stable)
// customer-details.js (Part 2/3)
// ======================================

// ----------------------------
// Initialize Buttons
// ----------------------------

function initializeButtons() {

    document
        .getElementById("addPayment")
        .addEventListener("click", addPayment);

    document
        .getElementById("historyBtn")
        .addEventListener("click", openHistory);

    document
        .getElementById("blacklistBtn")
        .addEventListener("click", blacklistCustomer);

    document
        .getElementById("editBtn")
        .addEventListener("click", editCustomer);

    document
        .getElementById("deleteBtn")
        .addEventListener("click", deleteCustomerRecord);

}

// ----------------------------
// Add Payment
// ----------------------------

function addPayment() {

    if (!selectedCustomer) return;

    const amount = Number(
        document.getElementById("paymentAmount").value
    );

    if (isNaN(amount) || amount <= 0) {

        alert("Enter Valid Payment Amount");

        return;

    }

    if (typeof applyPayment !== "function") {

        alert("Payment System Missing");

        return;

    }

    const success =
        applyPayment(selectedCustomer, amount);

    if (!success) {

        alert("Payment Failed");

        return;

    }

    updateCustomer(selectedCustomer, function () {

        document.getElementById("paymentAmount").value = "";

        document.getElementById("totalPaid").innerText =
            Number(selectedCustomer.paid || 0).toFixed(2);

        updateOutstanding();

        alert("Payment Added Successfully");

    });

}

// ----------------------------
// Payment History
// ----------------------------

function openHistory() {

    if (!selectedCustomer) return;

    sessionStorage.setItem(
        "selectedCustomer",
        selectedCustomer.id
    );

    window.location.href =
        "payment-history.html";

}

// ----------------------------
// Refresh Customer
// ----------------------------

function refreshCustomer() {

    loadCustomer();

}

// ----------------------------
// Auto Refresh Screen
// ----------------------------

window.addEventListener("focus", function () {

    refreshCustomer();

});

// ----------------------------
// Refresh after Visibility
// ----------------------------

document.addEventListener(
    "visibilitychange",
    function () {

        if (!document.hidden) {

            refreshCustomer();

        }

    }
);

// ======================================
// End Part 2/3
// ======================================
// ======================================
// Loan Manager Pro v2 (2026 Stable)
// customer-details.js (Part 3/3)
// ======================================

// ----------------------------
// Edit Customer
// ----------------------------

function editCustomer() {

    if (!selectedCustomer) return;

    sessionStorage.setItem(
        "editCustomerId",
        selectedCustomer.id
    );

    window.location.href =
        "edit-customer.html";

}

// ----------------------------
// Delete Customer
// ----------------------------

function deleteCustomerRecord() {

    if (!selectedCustomer) return;

    const ok = confirm(
        "Delete this customer permanently?"
    );

    if (!ok) return;

    deleteCustomerDB(selectedCustomer.id, function () {

        alert("Customer Deleted Successfully");

        window.location.href =
            "dashboard.html";

    });

}

// ----------------------------
// Blacklist Customer
// ----------------------------

function blacklistCustomer() {

    if (!selectedCustomer) return;

    const ok = confirm(
        "Move customer to blacklist?"
    );

    if (!ok) return;

    selectedCustomer.blacklisted = true;

    updateCustomer(selectedCustomer, function () {

        alert("Customer Blacklisted");

        window.location.href =
            "dashboard.html";

    });

}

// ----------------------------
// Loan Status
// ----------------------------

function getLoanStatus() {

    if (!selectedCustomer)
        return "";

    if (selectedCustomer.blacklisted)
        return "Blacklisted";

    const outstanding =
        Number(selectedCustomer.currentBalance || 0) +
        Number(selectedCustomer.interestDue || 0);

    if (outstanding <= 0)
        return "Completed";

    return "Running";

}

// ----------------------------
// Loan Completed Alert
// ----------------------------

function checkLoanCompleted() {

    if (getLoanStatus() === "Completed") {

        alert("🎉 Loan Completed Successfully");

    }

}

// ----------------------------
// Manual Refresh
// ----------------------------

function reloadCustomer() {

    loadCustomer();

}

// ----------------------------
// Window Focus Refresh
// ----------------------------

window.addEventListener("focus", function () {

    reloadCustomer();

});

// ----------------------------
// Visibility Refresh
// ----------------------------

document.addEventListener(
    "visibilitychange",
    function () {

        if (!document.hidden) {

            reloadCustomer();

        }

    }
);

// ----------------------------
// Page Refresh Hook
// ----------------------------

window.addEventListener("pageshow", function () {

    reloadCustomer();

});

// ======================================
// customer-details.js
// FINAL 2026 STABLE VERSION
// ======================================