document.addEventListener("DOMContentLoaded", () => {

    const loginBtn = document.getElementById("loginBtn");

    loginBtn.addEventListener("click", loginUser);

});

function loginUser() {

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {

        alert("Please enter Username and Password");
        return;

    }

    if (!db) {

        alert("Database is loading... Please try again.");
        return;

    }

    const tx = db.transaction("users", "readonly");
    const store = tx.objectStore("users");
    const request = store.getAll();

    request.onsuccess = function () {

        const users = request.result;

        const user = users.find(u =>
            (u.username === username || u.phone === username) &&
            u.password === password
        );

        if (!user) {

            alert("Invalid Username or Password");
            return;

        }

        sessionStorage.setItem("loggedInUser", JSON.stringify(user));

        window.location.href = "dashboard.html";

    };

}