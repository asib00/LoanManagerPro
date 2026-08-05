// ======================================
// Loan Manager Pro v2
// edit-customer.js (Part 1/2)
// ======================================

let customer = null;
let profilePhoto = "";

document.addEventListener("DOMContentLoaded", function () {

    waitDatabase();

});

// ----------------------------
// Wait Database
// ----------------------------

function waitDatabase() {

    if (!db) {

        setTimeout(waitDatabase, 100);

        return;

    }

    loadCustomer();

}

// ----------------------------
// Load Customer
// ----------------------------

function loadCustomer() {

    const id = Number(
        sessionStorage.getItem("editCustomerId")
    );

    if (!id) {

        alert("Customer Not Found");

        window.location.href = "dashboard.html";

        return;

    }

    getCustomers(function (customers) {

        customer = customers.find(c => c.id == id);

        if (!customer) {

            alert("Customer Not Found");

            window.location.href = "dashboard.html";

            return;

        }

        fillForm();

    });

}

// ----------------------------
// Fill Form
// ----------------------------

function fillForm() {

    document.getElementById("name").value =
        customer.name || "";

    document.getElementById("phone").value =
        customer.phone || "";

    document.getElementById("address").value =
        customer.address || "";

    document.getElementById("loan").value =
        customer.loan || "";

    document.getElementById("interest").value =
        customer.interest || "";

    document.getElementById("paymentType").value =
        customer.paymentType || "Daily";

    document.getElementById("duration").value =
        customer.duration || "";

    document.getElementById("durationType").value =
        customer.durationType || "Days";

    if (customer.profilePhoto) {

        profilePhoto = customer.profilePhoto;

        document.getElementById("preview").src =
            customer.profilePhoto;

    }

    document
        .getElementById("photo")
        .addEventListener("change", previewPhoto);

    document
        .getElementById("updateBtn")
        .addEventListener("click", updateCustomerData);

}

// ----------------------------
// Preview Photo
// ----------------------------

function previewPhoto() {

    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        profilePhoto = e.target.result;

        document.getElementById("preview").src =
            profilePhoto;

    };

    reader.readAsDataURL(file);

}
// ======================================
// Loan Manager Pro v2
// edit-customer.js (Part 2/2)
// ======================================

// ----------------------------
// Update Customer
// ----------------------------

function updateCustomerData() {

    if (!customer) return;

    customer.name =
        document.getElementById("name").value.trim();

    customer.phone =
        document.getElementById("phone").value.trim();

    customer.address =
        document.getElementById("address").value.trim();

const newLoan = Number(
    document.getElementById("loan").value
);

const alreadyPaid = Number(
    customer.paid || 0
);

customer.loan = newLoan;

customer.principal = newLoan;

// Outstanding = Loan - Paid
customer.currentBalance = Math.max(
    0,
    newLoan - alreadyPaid
);

    customer.interest =
        Number(document.getElementById("interest").value);

    customer.paymentType =
        document.getElementById("paymentType").value;

    customer.duration =
        Number(document.getElementById("duration").value);

    customer.durationType =
        document.getElementById("durationType").value;

    customer.profilePhoto = profilePhoto;

    if (!customer.name || !customer.phone || !customer.loan) {

        alert("Please fill all required fields");

        return;

    }

    updateCustomer(customer, function () {

        alert("Customer Updated Successfully");

        sessionStorage.setItem(
            "selectedCustomer",
            customer.id
        );

        window.location.href = "customer.html";

    });

}

// ----------------------------
// Go Back
// ----------------------------

function goBack() {

    history.back();

}

// ======================================
// End edit-customer.js
// ======================================