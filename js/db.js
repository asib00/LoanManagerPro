let db;

const request = indexedDB.open("LoanManagerDB", 1);

request.onupgradeneeded = function (event) {

    db = event.target.result;

    // Users
    if (!db.objectStoreNames.contains("users")) {

        db.createObjectStore("users", {
            keyPath: "id",
            autoIncrement: true
        });

    }

    // Customers
    if (!db.objectStoreNames.contains("customers")) {

        db.createObjectStore("customers", {
            keyPath: "id",
            autoIncrement: true
        });

    }

    // Payments
    if (!db.objectStoreNames.contains("payments")) {

        db.createObjectStore("payments", {
            keyPath: "id",
            autoIncrement: true
        });

    }

    // Blacklist
    if (!db.objectStoreNames.contains("blacklist")) {

        db.createObjectStore("blacklist", {
            keyPath: "id",
            autoIncrement: true
        });

    }

    // Settings
    if (!db.objectStoreNames.contains("settings")) {

        db.createObjectStore("settings", {
            keyPath: "id",
            autoIncrement: true
        });

    }

};

request.onsuccess = function (event) {

    db = event.target.result;

    console.log("LoanManager Database Connected");

};

request.onerror = function () {

    console.log("Database Error");

};

// ---------- USERS ----------

function addUser(user, callback) {

    const tx = db.transaction("users", "readwrite");

    const store = tx.objectStore("users");

    const req = store.add(user);

    req.onsuccess = () => {

        if (callback) callback();

    };

}

function getUsers(callback) {

    const tx = db.transaction("users", "readonly");

    const store = tx.objectStore("users");

    const req = store.getAll();

    req.onsuccess = () => callback(req.result);

}

// ---------- CUSTOMERS ----------

function addCustomer(customer, callback) {

    const tx = db.transaction("customers", "readwrite");

    const store = tx.objectStore("customers");

    const req = store.add(customer);

    req.onsuccess = () => {

        if (callback) callback();

    };

}

function getCustomers(callback) {

    const tx = db.transaction("customers", "readonly");

    const store = tx.objectStore("customers");

    const req = store.getAll();

    req.onsuccess = () => callback(req.result);

}

function updateCustomer(customer, callback) {

    const tx = db.transaction("customers", "readwrite");

    const store = tx.objectStore("customers");

    const req = store.put(customer);

    req.onsuccess = () => {

        if (callback) callback();

    };

}

function deleteCustomerDB(id, callback) {

    const tx = db.transaction("customers", "readwrite");

    const store = tx.objectStore("customers");

    const req = store.delete(Number(id));

    req.onsuccess = function () {

        if (callback) callback();

    };

    req.onerror = function () {

        alert("Customer Delete Failed");

    };

}