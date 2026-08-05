// ======================================
// Loan Manager Pro v2
// backup.js
// ======================================

document.addEventListener("DOMContentLoaded", function () {

    document
        .getElementById("backupBtn")
        .addEventListener("click", createBackup);

});

// ----------------------------
// Create Full Backup
// ----------------------------

function createBackup() {

    const backup = {};

    const stores = [
        "users",
        "customers",
        "payments",
        "blacklist",
        "settings"
    ];

    let completed = 0;

    stores.forEach(function (storeName) {

        const tx = db.transaction(storeName, "readonly");

        const store = tx.objectStore(storeName);

        const req = store.getAll();

        req.onsuccess = function () {

            backup[storeName] = req.result;

            completed++;

            if (completed === stores.length) {

                downloadBackup(backup);

            }

        };

    });

}

// ----------------------------
// Download Backup
// ----------------------------

function downloadBackup(data) {

    const json =
        JSON.stringify(data, null, 2);

    const blob = new Blob(
        [json],
        {
            type: "application/json"
        }
    );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        "LoanManager_Backup_" +
        new Date().toISOString().split("T")[0] +
        ".json";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);

    alert("Backup Created Successfully");

}