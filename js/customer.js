// ======================================
// Loan Manager Pro v2
// customer.js (Part 1/3)
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    const saveBtn = document.getElementById("saveBtn");

    if (saveBtn) {

        saveBtn.addEventListener("click", saveCustomer);

    }

    const photo = document.getElementById("photo");

    if (photo) {

        photo.addEventListener("change", previewProfilePhoto);

    }

    const loanDate = document.getElementById("loanDate");

    if (loanDate && loanDate.value === "") {

        loanDate.value =
            new Date().toISOString().split("T")[0];

    }

});

// ----------------------------
// Preview Profile Photo
// ----------------------------

function previewProfilePhoto() {

    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        document.getElementById("previewPhoto").src =
            e.target.result;

    };

    reader.readAsDataURL(file);

}

// ----------------------------
// Save Customer
// ----------------------------

function saveCustomer() {

    const name =
        document.getElementById("name").value.trim();

    const phone =
        document.getElementById("phone").value.trim();

    const address =
        document.getElementById("address").value.trim();

    const loan =
        Number(document.getElementById("loan").value);

    const interest =
        Number(document.getElementById("interest").value);

    const paymentType =
        document.getElementById("paymentType").value;

    const duration =
        Number(document.getElementById("duration").value);

    const durationType =
        document.getElementById("durationType").value;

    const loanDate =
        document.getElementById("loanDate").value;

    const idType =
        document.getElementById("idType").value;

    const notes =
        document.getElementById("notes").value.trim();

    if (
        !name ||
        !phone ||
        !loan ||
        !interest
    ) {

        alert("Please fill all required fields.");

        return;

    }

    readProfilePhoto(function(profilePhoto){

        readIdPhoto(function(idPhoto){

            const customer = {

                name: name,

                phone: phone,

                address: address,

                profilePhoto: profilePhoto,

                idType: idType,

                idPhoto: idPhoto,

                notes: notes,

                loan: loan,

                principal: loan,

                currentBalance: loan,

                interest: interest,

                paymentType: paymentType,

                duration: duration,

                durationType: durationType,

                loanDate: loanDate,

                lastInterestDate: loanDate,

                paid: 0,

                interestDue: 0,

                paymentHistory: [],

                blacklisted: false,

                createdAt:
                    new Date().toISOString()

            };

            addCustomer(customer,function(){

                alert("Customer Added Successfully");

                window.location.href =
                    "dashboard.html";

            });

        });

    });

}
// ======================================
// Loan Manager Pro v2
// customer.js (Part 2/3)
// ======================================

// ----------------------------
// Read Customer Profile Photo
// ----------------------------

function readProfilePhoto(callback) {

    const file = document.getElementById("photo").files[0];

    if (!file) {

        callback("");

        return;

    }

    const reader = new FileReader();

    reader.onload = function (e) {

        callback(e.target.result);

    };

    reader.readAsDataURL(file);

}

// ----------------------------
// Read ID Proof Photo
// ----------------------------

function readIdPhoto(callback) {

    const file = document.getElementById("idPhoto").files[0];

    if (!file) {

        callback("");

        return;

    }

    const reader = new FileReader();

    reader.onload = function (e) {

        callback(e.target.result);

    };

    reader.readAsDataURL(file);

}

// ----------------------------
// Phone Validation
// ----------------------------

function isValidPhone(phone) {

    return /^[0-9]{10}$/.test(phone);

}

// ----------------------------
// Duplicate Customer Check
// ----------------------------

function customerExists(phone, callback) {

    getCustomers(function(customers){

        const found = customers.find(c => c.phone === phone);

        callback(found);

    });

}

// ----------------------------
// Required Field Validation
// ----------------------------

function validateCustomer(data) {

    if (data.name === "") {

        alert("Enter Customer Name");

        return false;

    }

    if (!isValidPhone(data.phone)) {

        alert("Enter Valid Phone Number");

        return false;

    }

    if (data.loan <= 0) {

        alert("Enter Valid Loan Amount");

        return false;

    }

    if (data.interest < 0) {

        alert("Enter Valid Interest");

        return false;

    }

    return true;

}
// ======================================
// Loan Manager Pro v2
// customer.js (Part 3/3)
// ======================================

// ----------------------------
// Compress Image
// ----------------------------

function compressImage(file, callback) {

    if (!file) {

        callback("");

        return;

    }

    const reader = new FileReader();

    reader.onload = function (e) {

        const img = new Image();

        img.onload = function () {

            const canvas = document.createElement("canvas");

            const MAX_WIDTH = 600;
            const MAX_HEIGHT = 600;

            let width = img.width;
            let height = img.height;

            if (width > height) {

                if (width > MAX_WIDTH) {

                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;

                }

            } else {

                if (height > MAX_HEIGHT) {

                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;

                }

            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");

            ctx.drawImage(img, 0, 0, width, height);

            callback(canvas.toDataURL("image/jpeg", 0.75));

        };

        img.src = e.target.result;

    };

    reader.readAsDataURL(file);

}

// ----------------------------
// Clear Form
// ----------------------------

function clearForm() {

    document.getElementById("name").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("address").value = "";
    document.getElementById("loan").value = "";
    document.getElementById("interest").value = "";
    document.getElementById("duration").value = "";
    document.getElementById("notes").value = "";

    document.getElementById("photo").value = "";
    document.getElementById("idPhoto").value = "";

    document.getElementById("previewPhoto").src =
        "images/user.png";

}

// ----------------------------
// Cancel Button (Future)
// ----------------------------

function cancelCustomer() {

    history.back();

}

// ----------------------------
// Generate Loan Number
// ----------------------------

function generateLoanNumber() {

    return "LN-" + Date.now();

}

// ----------------------------
// Customer Status
// ----------------------------

function getCustomerStatus(customer) {

    if (customer.blacklisted) {

        return "Blacklisted";

    }

    return "Active";

}

// ----------------------------
// Today's Date
// ----------------------------

function todayDate() {

    return new Date().toISOString().split("T")[0];

}

// ======================================
// End customer.js
// ======================================