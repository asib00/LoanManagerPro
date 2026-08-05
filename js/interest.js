// ======================================
// Loan Manager Pro v2
// interest.js (Final 1/3)
// ======================================

// ----------------------------
// Main Interest Engine
// ----------------------------

function calculateOutstanding(customer) {

    if (!customer) return;

    // पहली बार currentBalance बनाओ
    if (
        customer.currentBalance === undefined ||
        customer.currentBalance === null
    ) {
        customer.currentBalance =
            Number(customer.loan || 0);
    }

    if (
        customer.interestDue === undefined ||
        customer.interestDue === null
    ) {
        customer.interestDue = 0;
    }

    let principal =
        Number(customer.currentBalance);

    let interestRate =
        Number(customer.interest || 0);

    let interestDue =
        Number(customer.interestDue);

    let today = new Date();

    let lastDate;

    if (customer.lastInterestDate) {

        lastDate = new Date(customer.lastInterestDate);

    } else {

        lastDate = new Date(customer.loanDate || today);

    }

    let periods = getPendingPeriods(
        lastDate,
        today,
        customer.paymentType
    );

    if (periods <= 0) {

        return;

    }

    for (let i = 0; i < periods; i++) {

        let interest =
            (principal * interestRate) / 100;

        interestDue += interest;

        // Compound Interest
        principal += interest;

    }

    customer.currentBalance = principal;

    customer.interestDue = interestDue;

    customer.lastInterestDate =
        today.toISOString().split("T")[0];

}

// ----------------------------
// Pending Period
// ----------------------------

function getPendingPeriods(
    lastDate,
    today,
    paymentType
) {

    if (paymentType === "Daily") {

        return daysBetween(lastDate, today);

    }

    if (paymentType === "Weekly") {

        return Math.floor(
            daysBetween(lastDate, today) / 7
        );

    }

    if (paymentType === "Monthly") {

        return monthsBetween(lastDate, today);

    }

    return 0;

}
// ======================================
// interest.js (Final 2/3)
// ======================================

// ----------------------------
// Days Difference
// ----------------------------

function daysBetween(startDate, endDate) {

    const oneDay = 24 * 60 * 60 * 1000;

    const diff = Math.floor(
        (endDate - startDate) / oneDay
    );

    return diff > 0 ? diff : 0;

}

// ----------------------------
// Months Difference
// ----------------------------

function monthsBetween(startDate, endDate) {

    let months =
        (endDate.getFullYear() - startDate.getFullYear()) * 12;

    months +=
        endDate.getMonth() - startDate.getMonth();

    if (endDate.getDate() < startDate.getDate()) {

        months--;

    }

    return months > 0 ? months : 0;

}

// ----------------------------
// Update Interest
// ----------------------------

function updateInterest(customer, callback) {

    calculateOutstanding(customer);

    updateCustomer(customer, function () {

        if (callback) callback();

    });

}

// ----------------------------
// Refresh All Interest
// ----------------------------

function refreshAllInterest(callback) {

    getCustomers(function (customers) {

        let pending = customers.length;

        if (pending === 0) {

            if (callback) callback();

            return;

        }

        customers.forEach(customer => {

            calculateOutstanding(customer);

            updateCustomer(customer, function () {

                pending--;

                if (pending === 0 && callback) {

                    callback();

                }

            });

        });

    });

}

// ----------------------------
// Loan Completed?
// ----------------------------

function isLoanCompleted(customer) {

    return (

        Number(customer.currentBalance || 0) <= 0 &&

        Number(customer.interestDue || 0) <= 0

    );

}
// ======================================
// interest.js (Final 3/3)
// ======================================

// ----------------------------
// Apply Payment
// ----------------------------

function applyPayment(customer, amount) {

    amount = Number(amount);

    if (!customer || amount <= 0) {

        return false;

    }

    calculateOutstanding(customer);

    let originalAmount = amount;

    // Interest पहले कटेगा
    if (customer.interestDue > 0) {

        if (amount >= customer.interestDue) {

            amount -= customer.interestDue;
            customer.interestDue = 0;

        } else {

            customer.interestDue -= amount;
            amount = 0;

        }

    }

    // फिर Principal कटेगा
    if (amount > 0) {

        customer.currentBalance -= amount;

        if (customer.currentBalance < 0) {

            customer.currentBalance = 0;

        }

    }

    customer.paid =
        Number(customer.paid || 0) +
        originalAmount;

    if (!customer.paymentHistory) {

        customer.paymentHistory = [];

    }

    customer.paymentHistory.push({

        amount: originalAmount,

        date: new Date().toLocaleString(),

        balance: customer.currentBalance,

        interestDue: customer.interestDue

    });

    return true;

}

// ----------------------------
// Outstanding
// ----------------------------

function getOutstanding(customer) {

    calculateOutstanding(customer);

    return (

        Number(customer.currentBalance || 0) +

        Number(customer.interestDue || 0)

    );

}

// ----------------------------
// Interest Summary
// ----------------------------

function getInterestSummary(customer) {

    return {

        principal:
            Number(customer.currentBalance || 0),

        interest:
            Number(customer.interestDue || 0),

        paid:
            Number(customer.paid || 0),

        outstanding:
            getOutstanding(customer)

    };

}

// ----------------------------
// Reset Loan
// ----------------------------

function resetLoan(customer) {

    customer.currentBalance =
        Number(customer.loan || 0);

    customer.principal =
        Number(customer.loan || 0);

    customer.interestDue = 0;

    customer.paid = 0;

    customer.paymentHistory = [];

    customer.lastInterestDate =
        customer.loanDate;

}

// ----------------------------
// Loan Status
// ----------------------------

function getLoanStatus(customer) {

    if (isLoanCompleted(customer)) {

        return "Completed";

    }

    if (customer.blacklisted) {

        return "Blacklisted";

    }

    return "Running";

}

// ======================================
// End interest.js
// ======================================