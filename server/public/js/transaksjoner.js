document.addEventListener("DOMContentLoaded", () => {
    const typeFilter = document.getElementById("type-filter");
    const statusFilter = document.getElementById("status-filter");
    const pendingContainer = document.getElementById("pending-transactions");
    const completedContainer = document.getElementById("completed-transactions");
    const declinedContainer = document.getElementById("declined-transactions");

    // Helper function to create transaction card
    function createTransactionCard(transaction) {
        const card = document.createElement("div");
        card.className = "transaction-card";

        // Determine status color and text
        const getStatusClass = (status) => {
            switch (status) {
                case "Venter":
                    return "status-waiting";
                case "Fullført":
                    return "status-accepted";
                case "AvslåttAvMottaker":
                case "AvslåttAvAvsender":
                case "Avbrutt":
                    return "status-declined";
                default:
                    return "";
            }
        };

        const statusClass = getStatusClass(transaction.status);

        card.innerHTML = `
            <div class="transaction-header">
                <span>Reinsdyr: ${transaction.reinsdyr.navn}</span>
                <span class="transaction-status ${statusClass}">${transaction.status}</span>
            </div>
            <div class="transaction-details">
                <div>
                    <strong>Fra:</strong> ${transaction.fraEier.navn}
                    <br>${transaction.fraFlokk.navn}
                </div>
                <div>
                    <strong>Til:</strong> ${transaction.tilEier.navn}
                    <br>${transaction.tilFlokk ? transaction.tilFlokk.navn : "Ikke valgt"}
                </div>
            </div>
            <div class="transaction-actions">
                ${
                    transaction.kanSvare
                        ? `
                    <a href="/respondTransfer?id=${transaction.id}" class="transaction-btn respond-btn">Svar</a>
                `
                        : ""
                }
                ${
                    transaction.kanBekrefte
                        ? `
                    <a href="/confirmTransfer?id=${transaction.id}" class="transaction-btn confirm-btn">Bekreft</a>
                `
                        : ""
                }
            </div>
        `;

        return card;
    }

    // Fetch transactions
    async function fetchTransactions(type = "all", status = "") {
        try {
            const response = await fetch(`/reinsdyr/transactions?type=${type}&status=${status}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const data = await response.json();

            if (data.success) {
                // Clear existing containers
                [pendingContainer, completedContainer, declinedContainer].forEach((container) => {
                    container.innerHTML = "";
                });

                if (data.gruppertTransaksjoner.ventende.length === 0) {
                    pendingContainer.innerHTML = '<div class="no-transactions">Ingen aktive transaksjoner</div>';
                } else {
                    data.gruppertTransaksjoner.ventende.forEach((transaction) => {
                        pendingContainer.appendChild(createTransactionCard(transaction));
                    });
                }

                if (data.gruppertTransaksjoner.fullførte.length === 0) {
                    completedContainer.innerHTML = '<div class="no-transactions">Ingen fullførte transaksjoner</div>';
                } else {
                    data.gruppertTransaksjoner.fullførte.forEach((transaction) => {
                        completedContainer.appendChild(createTransactionCard(transaction));
                    });
                }

                if (data.gruppertTransaksjoner.avslåtte.length === 0) {
                    declinedContainer.innerHTML = '<div class="no-transactions">Ingen avslåtte transaksjoner</div>';
                } else {
                    data.gruppertTransaksjoner.avslåtte.forEach((transaction) => {
                        declinedContainer.appendChild(createTransactionCard(transaction));
                    });
                }
            } else {
                console.error("Failed to fetch transactions", data.message);
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    }

    // Initial load
    fetchTransactions();

    // Event listeners for filters
    typeFilter.addEventListener("change", (e) => {
        fetchTransactions(e.target.value, statusFilter.value);
    });

    statusFilter.addEventListener("change", (e) => {
        fetchTransactions(typeFilter.value, e.target.value);
    });
});
