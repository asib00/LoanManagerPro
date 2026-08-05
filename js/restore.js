// ======================================
// Loan Manager Pro v2
// restore.js
// ======================================

document.addEventListener("DOMContentLoaded", function () {

    document
        .getElementById("restoreBtn")
        .addEventListener("click", restoreBackup);

});

// ----------------------------
// Restore Backup
// ----------------------------

function restoreBackup() {

    const file = document
        .getElementById("restoreFile")
        .files[0];

    if (!file) {

        alert("Please select backup file");

        return;

    }

    const reader = new FileReader();

    reader.onload = function (e) {

        try {

            const backup = JSON.parse(e.target.result);

            importStore("users", backup.users || []);
            importStore("customers", backup.customers || []);
            importStore("payments", backup.payments || []);
            importStore("blacklist", backup.blacklist || []);
            importStore("settings", backup.settings || []);

            alert("Backup Restored Successfully");

            window.location.href = "dashboard.html";

        } catch (err) {

            console.error(err);

            alert("Invalid Backup File");

        }

    };

    reader.readAsText(file);

}

// ----------------------------
// Import Store
// ----------------------------

function importStore(storeName, data) {

    const tx = db.transaction(storeName, "readwrite");

    const store = tx.objectStore(storeName);

    // पुराने Data हटाओ
    store.clear();

    tx.oncomplete = function () {

        const tx2 = db.transaction(storeName, "readwrite");

        const store2 = tx2.objectStore(storeName);

        data.forEach(function (item) {

            store2.put(item);

        });

    };

}