document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("registerBtn")
        .addEventListener("click", registerUser);

});

function registerUser() {

    const name = document.getElementById("name").value.trim();
    const username = document.getElementById("username").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!name || !username || !phone || !password || !confirmPassword) {

        alert("Please fill all fields.");
        return;

    }

    if (password !== confirmPassword) {

        alert("Passwords do not match.");
        return;

    }

    getUsers(function (users) {

        const exists = users.find(u =>
            u.username === username || u.phone === phone
        );

        if (exists) {

            alert("Username or Phone already exists.");
            return;

        }

        const user = {

            name: name,
            username: username,
            phone: phone,
            password: password,
            createdAt: new Date().toISOString()

        };

        addUser(user, function () {

            alert("Registration Successful");

            window.location.href = "index.html";

        });

    });

}