// ======================================
// Loan Manager Pro v2
// profile.js (Part 1/3)
// ======================================

let ownerProfile = {};
let profileImage = "";

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

    initializeProfile();

}

// ----------------------------
// Initialize
// ----------------------------

function initializeProfile() {

    document
        .getElementById("profilePhoto")
        .addEventListener("change", previewPhoto);

    document
        .getElementById("saveProfile")
        .addEventListener("click", saveProfile);
 
        document
    .getElementById("deleteProfile")
    .addEventListener("click", deleteProfile);

    loadProfile();

}

// ----------------------------
// Load Profile
// ----------------------------

function loadProfile() {

    const saved =
        JSON.parse(localStorage.getItem("ownerProfile"));

    if (!saved) return;

    ownerProfile = saved;

    document.getElementById("ownerName").value =
        saved.name || "";

    document.getElementById("ownerPhone").value =
        saved.phone || "";

    document.getElementById("shopName").value =
        saved.shopName || "";

    document.getElementById("ownerAddress").value =
        saved.address || "";

    if (saved.photo) {

        profileImage = saved.photo;

        document.getElementById("profilePreview").src =
            saved.photo;

    }

}

// ----------------------------
// Preview Photo
// ----------------------------

function previewPhoto() {

    const file =
        document.getElementById("profilePhoto").files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        profileImage = e.target.result;

        document.getElementById("profilePreview").src =
            profileImage;

    };

    reader.readAsDataURL(file);

}
// ======================================
// Loan Manager Pro v2
// profile.js (Part 2/3)
// ======================================

// ----------------------------
// Save Profile
// ----------------------------

function saveProfile() {

    const name =
        document.getElementById("ownerName").value.trim();

    const phone =
        document.getElementById("ownerPhone").value.trim();

    const shopName =
        document.getElementById("shopName").value.trim();

    const address =
        document.getElementById("ownerAddress").value.trim();

    const password =
        document.getElementById("newPassword").value;

    if (name === "") {

        alert("Please Enter Owner Name");

        return;

    }

    if (phone === "") {

        alert("Please Enter Phone Number");

        return;

    }

    ownerProfile = {

        name: name,

        phone: phone,

        shopName: shopName,

        address: address,

        photo: profileImage,

        password: password

    };

    localStorage.setItem(

        "ownerProfile",

        JSON.stringify(ownerProfile)

    );

    alert("Profile Saved Successfully");

}
// ======================================
// Loan Manager Pro v2
// profile.js (Part 3/3)
// ======================================

// ----------------------------
// Phone Validation
// ----------------------------

document.getElementById("ownerPhone").addEventListener("input", function () {

    this.value = this.value.replace(/[^0-9]/g, "");

    if (this.value.length > 10) {

        this.value = this.value.substring(0, 10);

    }

});

// ----------------------------
// Default Photo
// ----------------------------

function setDefaultPhoto() {

    if (!profileImage || profileImage === "") {

        document.getElementById("profilePreview").src =
            "images/user.png";

    }

}

// ----------------------------
// Clear Password Field
// ----------------------------

function clearPassword() {

    document.getElementById("newPassword").value = "";

}

// ----------------------------
// Refresh Profile
// ----------------------------

function refreshProfile() {

    loadProfile();

    setDefaultPhoto();

    clearPassword();

}

// ----------------------------
// Logout
// ----------------------------

function logoutOwner() {

    if (!confirm("Logout from Loan Manager?")) return;

    localStorage.removeItem("loggedInUser");

    window.location.href = "index.html";

}

// ----------------------------
// App Information
// ----------------------------

function appInfo() {

    return {

        app: "Loan Manager Pro",

        version: "2.0",

        developer: "Abdul Nur Asib"

    };

}

// ----------------------------
// Auto Refresh
// ----------------------------

window.addEventListener("focus", function () {

    refreshProfile();

});

// ----------------------------
// Initialize Default Photo
// ----------------------------

setDefaultPhoto();

// ======================================
// End profile.js
// ======================================
function deleteProfile() {

    if (!confirm("Delete Profile?")) return;

    localStorage.removeItem("ownerProfile");

    ownerProfile = {};
    profileImage = "";

    document.getElementById("ownerName").value = "";
    document.getElementById("ownerPhone").value = "";
    document.getElementById("shopName").value = "";
    document.getElementById("ownerAddress").value = "";
    document.getElementById("newPassword").value = "";

    document.getElementById("profilePreview").src =
        "images/user.png";

    alert("Profile Deleted Successfully");

}