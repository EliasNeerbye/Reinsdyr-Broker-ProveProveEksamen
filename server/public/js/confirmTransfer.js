document.addEventListener("DOMContentLoaded", function () {
    const confirmForm = document.getElementById("confirmTransferForm");
    const messageDiv = document.getElementById("confirmMessage");
    const confirmBtn = document.getElementById("confirmBtn");
    const declineBtn = document.getElementById("declineBtn");

    if (confirmBtn && declineBtn) {
        const responseField = document.getElementById("godkjent");

        confirmBtn.addEventListener("click", function () {
            responseField.value = "true";
            confirmBtn.classList.add("active");
            declineBtn.classList.remove("active");
        });

        declineBtn.addEventListener("click", function () {
            responseField.value = "false";
            declineBtn.classList.add("active");
            confirmBtn.classList.remove("active");
        });
    }

    if (confirmForm) {
        confirmForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            messageDiv.textContent = "";
            messageDiv.className = "form-message";

            const transaksjonId = document.getElementById("transaksjonId").value;
            const godkjent = document.getElementById("godkjent").value === "true";

            const message = godkjent
                ? "Er du sikker på at du vil fullføre denne overføringen? Dette kan ikke angres."
                : "Er du sikker på at du vil avslå denne overføringen? Dette kan ikke angres.";

            if (!confirm(message)) {
                return;
            }

            messageDiv.textContent = "Behandler forespørsel...";
            messageDiv.style.display = "block";

            try {
                const response = await fetch("/reinsdyr/confirmTransfer", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        transaksjonId,
                        godkjent,
                    }),
                    credentials: "include",
                });

                const result = await response.json();

                if (result.success) {
                    messageDiv.textContent = result.message;
                    messageDiv.className = "form-message success";

                    document.querySelectorAll("#confirmTransferForm input, #confirmTransferForm button").forEach((el) => {
                        el.disabled = true;
                    });

                    setTimeout(() => {
                        window.location.href = "/transaksjoner";
                    }, 3000);
                } else {
                    messageDiv.textContent = result.message || "En feil oppstod under behandling av forespørselen";
                    messageDiv.className = "form-message error";
                }
            } catch (error) {
                console.error("Error during transfer confirmation:", error);
                messageDiv.textContent = "Det oppstod en teknisk feil under behandling av forespørselen";
                messageDiv.className = "form-message error";
            }
        });
    }
});
