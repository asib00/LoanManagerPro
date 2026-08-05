// ======================================
// Loan Manager Pro
// login.js (Final 2026 Stable) Part 2/3
// ======================================

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

    initializeLogin();

}

// ----------------------------
// Initialize
// ----------------------------

function initializeLogin() {

    const loginBtn = document.getElementById("loginBtn");

    loginBtn.addEventListener("click", loginUser);

    document
        .getElementById("password")
        .addEventListener("keypress", function (e) {

            if (e.key === "Enter") {

                loginUser();

            }

        });

}

// ----------------------------
// Login User
// ----------------------------

function loginUser() {

    const username =
        document.getElementById("username")
        .value.trim();

    const password =
        document.getElementById("password")
        .value.trim();

    if (username === "" || password === "") {

        alert("Please enter Username and Password");

        return;

    }

    const tx =
        db.transaction("users", "readonly");

    const store =
        tx.objectStore("users");

    const req =
        store.getAll();

    req.onsuccess = function () {

        const users = req.result || [];

        const user = users.find(u =>

            (u.username === username ||

             u.phone === username) &&

             u.password === password

        );

        if (!user) {

            alert("Invalid Username or Password");

            return;

        }

        // Remember Login

        localStorage.setItem(
            "loggedInUser",
            JSON.stringify(user)
        );

        sessionStorage.setItem(
            "loggedInUser",
            JSON.stringify(user)
        );
                alert("Login Successful");

        window.location.replace("dashboard.html");

    };

    req.onerror = function () {

        alert("Database Error");

    };

}

// ----------------------------
// Auto Login Check
// ----------------------------

(function () {

    const user = localStorage.getItem("loggedInUser");

    if (user &&
        window.location.pathname.endsWith("index.html")) {

        window.location.replace("dashboard.html");

    }

})();

// ======================================
// End login.js
// Final 2026 Stable
// ======================================