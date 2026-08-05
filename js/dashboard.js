// ======================================
// Loan Manager Pro v2
// dashboard.js (Part 1/3)
// ======================================

let customers = [];
let currentUser = null;

document.addEventListener("DOMContentLoaded", () => {

    checkLogin();

    waitForDatabase();

});

// ----------------------------
// Wait Database
// ----------------------------

function waitForDatabase() {

    if (typeof db === "undefined" || !db) {

        setTimeout(waitForDatabase, 100);

        return;

    }

    loadCurrentUser();

    loadCustomers();

    initializeButtons();

}

// ----------------------------
// Login Check
// ----------------------------

function checkLogin() {

    const user = sessionStorage.getItem("loggedInUser");

    if (!user) {

        window.location.href = "index.html";

        return;

    }

    currentUser = JSON.parse(user);

}

// ----------------------------
// Welcome User
// ----------------------------

function loadCurrentUser() {

    if (!currentUser) return;

    const text = document.getElementById("welcomeText");

    if (text) {

        text.innerText =
            "Welcome, " + currentUser.name;

    }

}

// ----------------------------
// Load Customers
// ----------------------------

function loadCustomers() {

    getCustomers(function (data) {

        customers = data || [];

        renderCustomers(customers);

        updateTotalBalance();

    });

}

// ----------------------------
// Total Outstanding
// ----------------------------

function updateTotalBalance() {

    let total = 0;

    customers.forEach(customer => {

const balance =
    Number(customer.currentBalance || 0) +
    Number(customer.interestDue || 0);

        total += balance;

    });

    const box = document.getElementById("totalBalance");

    if (box) {

        box.innerText =
            "₹" + total.toFixed(2);

    }

}

// ----------------------------
// Render Customer List
// ----------------------------

function renderCustomers(list) {

    const customerList =
        document.getElementById("customerList");

    if (!customerList) return;

    customerList.innerHTML = "";

    if (list.length === 0) {

        customerList.innerHTML =

        `
        <div style="
        text-align:center;
        padding:40px;
        color:#888;
        ">

        No Customer Found

        </div>
        `;

        return;

    }

    list.forEach(customer => {

        customerList.innerHTML += createCustomerCard(customer);

    });

}

// ----------------------------
// Customer Card
// ----------------------------

function createCustomerCard(customer) {

    let photo = customer.profilePhoto;

    if (!photo || photo === "") {

        photo = "images/user.png";

    }

let balance =
    Number(customer.currentBalance || 0) +
    Number(customer.interestDue || 0);

    return `

<div
class="customer-card"
onclick="openCustomer(${customer.id})">

<div class="customer-left">

<div class="customer-photo">

<img src="${photo}">

</div>

<div class="customer-info">

<h3>${customer.name}</h3>

<p>${customer.phone}</p>

</div>

</div>

<div class="customer-balance">

₹${balance.toFixed(2)}

</div>

</div>

`;

}
// ======================================
// dashboard.js (Part 2/3)
// ======================================

// ----------------------------
// Initialize Buttons
// ----------------------------

function initializeButtons() {

    const search = document.getElementById("searchInput");

    if (search) {

        search.addEventListener("input", searchCustomer);

    }

    const addBtn = document.getElementById("addCustomerBtn");

    if (addBtn) {

        addBtn.addEventListener("click", function () {

            window.location.href = "add_customer.html";

        });

    }

    const profileBtn = document.getElementById("profileBtn");

    if (profileBtn) {

        profileBtn.addEventListener("click", function () {

            window.location.href = "profile.html";

        });

    }

    const menuBtn = document.getElementById("menuBtn");

    if (menuBtn) {

        menuBtn.addEventListener("click", toggleMenu);

    }

    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener("click", logout);

    }

    const historyBtn = document.getElementById("paymentHistoryBtn");

    if (historyBtn) {

        historyBtn.addEventListener("click", function () {

            window.location.href = "payment-history.html";

        });

    }

    const blacklistBtn = document.getElementById("blacklistBtn");

    if (blacklistBtn) {

        blacklistBtn.addEventListener("click", function () {

            window.location.href = "blacklist.html";

        });

    }

    const backupBtn = document.getElementById("backupBtn");

    if (backupBtn) {

        backupBtn.addEventListener("click", function () {

            alert("Backup Feature Coming Soon");

        });

    }

    const restoreBtn = document.getElementById("restoreBtn");

    if (restoreBtn) {

        restoreBtn.addEventListener("click", function () {

            alert("Restore Feature Coming Soon");

        });

    }

}

// ----------------------------
// Search Customer
// ----------------------------

function searchCustomer() {

    const value =
        document.getElementById("searchInput")
        .value
        .toLowerCase();

    const filtered = customers.filter(customer => {

        return (

            customer.name.toLowerCase().includes(value) ||

            customer.phone.toLowerCase().includes(value)

        );

    });

    renderCustomers(filtered);

}

// ----------------------------
// Menu
// ----------------------------

function toggleMenu() {

    const menu =
        document.getElementById("menuPopup");

    if (!menu) return;

    if (menu.style.display === "block") {

        menu.style.display = "none";

    } else {

        menu.style.display = "block";

    }

}

// ----------------------------
// Hide Menu
// ----------------------------

window.addEventListener("click", function (e) {

    const menu =
        document.getElementById("menuPopup");

    const button =
        document.getElementById("menuBtn");

    if (!menu || !button) return;

    if (

        !menu.contains(e.target) &&

        !button.contains(e.target)

    ) {

        menu.style.display = "none";

    }

});

// ----------------------------
// Logout
// ----------------------------

function logout() {

    const ok =
        confirm("Logout from Loan Manager?");

    if (!ok) return;

    sessionStorage.removeItem("loggedInUser");

    window.location.href = "index.html";

}
// ======================================
// dashboard.js (Part 3/3)
// ======================================

// ----------------------------
// Open Customer
// ----------------------------

function openCustomer(id) {

    sessionStorage.setItem("selectedCustomer", id);

    window.location.href = "customer.html";

}

// ----------------------------
// Delete Customer
// ----------------------------

function removeCustomer(id) {

    const ok = confirm("Delete this customer?");

    if (!ok) return;

    deleteCustomer(id, function () {

        loadCustomers();

    });

}

// ----------------------------
// Refresh Dashboard
// ----------------------------

function refreshDashboard() {

    loadCustomers();

}

// ----------------------------
// Interest Refresh
// ----------------------------

function refreshInterest() {

    customers.forEach(customer => {

        if (typeof calculateOutstanding === "function") {

            calculateOutstanding(customer);

            updateCustomer(customer);

        }

    });

}

// ----------------------------
// Format Currency
// ----------------------------

function money(amount) {

    return "₹" + Number(amount).toFixed(2);

}

// ----------------------------
// Format Date
// ----------------------------

function formatDate(date) {

    if (!date) return "";

    const d = new Date(date);

    return d.toLocaleDateString("en-IN");

}

// ----------------------------
// Customer Count
// ----------------------------

function getCustomerCount() {

    return customers.length;

}

// ----------------------------
// Window Focus Refresh
// ----------------------------

window.addEventListener("focus", function () {

    loadCustomers();

});

// ----------------------------
// Page Visibility Refresh
// ----------------------------

document.addEventListener("visibilitychange", function () {

    if (!document.hidden) {

        loadCustomers();

    }

});

// ======================================
// End of dashboard.js
// ======================================