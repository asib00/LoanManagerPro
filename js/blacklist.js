// ======================================
// Loan Manager Pro v2
// blacklist.js (Part 1/3)
// ======================================

let blacklistCustomers = [];

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

    loadBlacklist();

    initializeSearch();

}

// ----------------------------
// Load Blacklist
// ----------------------------

function loadBlacklist() {

    getCustomers(function(customers){

        blacklistCustomers = customers.filter(customer =>

            customer.blacklisted === true

        );

        showBlacklist(blacklistCustomers);

    });

}

// ----------------------------
// Show Blacklist
// ----------------------------

function showBlacklist(customers) {

    const container =
        document.getElementById("blacklistContainer");

    container.innerHTML = "";

    if (customers.length === 0) {

        container.innerHTML =

        `
        <div class="empty">

        No Blacklisted Customer

        </div>
        `;

        return;

    }

    customers.forEach(customer => {

        container.innerHTML += createCustomerCard(customer);

    });

}

// ----------------------------
// Customer Card
// ----------------------------

function createCustomerCard(customer) {

    let photo = customer.profilePhoto || "images/user.png";

    return `

<div class="customer-card">

<div class="left">

<img src="${photo}">

<div>

<h3>${customer.name}</h3>

<p>${customer.phone}</p>

<p>₹${Number(customer.currentBalance || 0).toFixed(2)}</p>

</div>

</div>

<div class="buttons">

<button
onclick="restoreCustomer(${customer.id})">

Restore

</button>

<button
onclick="deleteCustomer(${customer.id})">

Delete

</button>

</div>

</div>

`;

}
// ======================================
// blacklist.js (Part 2/3)
// ======================================

// ----------------------------
// Initialize Search
// ----------------------------

function initializeSearch() {

    const search = document.getElementById("searchInput");

    if (!search) return;

    search.addEventListener("input", function () {

        const value = this.value.toLowerCase().trim();

        const filtered = blacklistCustomers.filter(customer => {

            return (

                customer.name.toLowerCase().includes(value) ||

                customer.phone.toLowerCase().includes(value)

            );

        });

        showBlacklist(filtered);

    });

}

// ----------------------------
// Restore Customer
// ----------------------------

function restoreCustomer(id) {

    const customer = blacklistCustomers.find(c => c.id == id);

    if (!customer) return;

    const ok = confirm("Restore this customer?");

    if (!ok) return;

    customer.blacklisted = false;

    updateCustomer(customer, function () {

        alert("Customer Restored Successfully");

        loadBlacklist();

    });

}

// ----------------------------
// Delete Customer
// ----------------------------

function deleteCustomer(id) {

    const ok = confirm(
        "Delete this customer permanently?"
    );

    if (!ok) return;

    deleteCustomerDB(id, function () {

        alert("Customer Deleted Successfully");

        loadBlacklist();

    });

}

// ----------------------------
// Refresh List
// ----------------------------

function refreshBlacklist() {

    loadBlacklist();

}
// ======================================
// Loan Manager Pro v2
// blacklist.js (Part 3/3)
// ======================================

// ----------------------------
// Blacklist Count
// ----------------------------

function getBlacklistCount() {

    return blacklistCustomers.length;

}

// ----------------------------
// Sort By Name
// ----------------------------

function sortByName() {

    blacklistCustomers.sort(function (a, b) {

        return a.name.localeCompare(b.name);

    });

    showBlacklist(blacklistCustomers);

}

// ----------------------------
// Sort By Date
// ----------------------------

function sortByDate() {

    blacklistCustomers.sort(function (a, b) {

        return new Date(b.createdAt || 0) -

               new Date(a.createdAt || 0);

    });

    showBlacklist(blacklistCustomers);

}

// ----------------------------
// Export (Future)
// ----------------------------

function exportBlacklist() {

    alert("Blacklist Export feature will be added soon.");

}

// ----------------------------
// Print (Future)
// ----------------------------

function printBlacklist() {

    window.print();

}

// ----------------------------
// Open Customer Details
// ----------------------------

function openCustomer(id) {

    sessionStorage.setItem("selectedCustomer", id);

    window.location.href = "customer.html";

}

// ----------------------------
// Auto Refresh
// ----------------------------

window.addEventListener("focus", function () {

    loadBlacklist();

});

// ----------------------------
// End blacklist.js
// ======================================