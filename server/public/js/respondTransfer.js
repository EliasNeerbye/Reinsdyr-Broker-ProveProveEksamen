document.addEventListener("DOMContentLoaded", function () {
    const responseForm = document.getElementById("respondTransferForm");
    const messageDiv = document.getElementById("responseMessage");
    const tilFlokkIdField = document.getElementById("tilFlokkId");
    const acceptBtn = document.getElementById("acceptBtn");
    const declineBtn = document.getElementById("declineBtn");

    if (acceptBtn && declineBtn) {
        const responseField = document.getElementById("godkjent");

        acceptBtn.addEventListener("click", function () {
            responseField.value = "true";
            acceptBtn.classList.add("active");
            declineBtn.classList.remove("active");

            document.getElementById("flokkSelector").style.display = "block";
            tilFlokkIdField.required = true;
        });

        declineBtn.addEventListener("click", function () {
            responseField.value = "false";
            declineBtn.classList.add("active");
            acceptBtn.classList.remove("active");

            document.getElementById("flokkSelector").style.display = "none";
            tilFlokkIdField.required = false;
        });
    }

    if (responseForm) {
        responseForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            messageDiv.textContent = "";
            messageDiv.className = "form-message";

            const transaksjonId = document.getElementById("transaksjonId").value;
            const godkjent = document.getElementById("godkjent").value === "true";
            const tilFlokkId = tilFlokkIdField.value;
            const melding = document.getElementById("melding").value;

            if (godkjent && !tilFlokkId) {
                messageDiv.textContent = "Vennligst velg en flokk for reinsdyret";
                messageDiv.className = "form-message error";
                return;
            }

            messageDiv.textContent = "Behandler forespørsel...";
            messageDiv.style.display = "block";

            try {
                const response = await fetch("/reinsdyr/respondTransfer", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        transaksjonId,
                        godkjent,
                        tilFlokkId: godkjent ? tilFlokkId : null,
                        melding,
                    }),
                    credentials: "include",
                });

                const result = await response.json();

                if (result.success) {
                    messageDiv.textContent = result.message;
                    messageDiv.className = "form-message success";

                    document
                        .querySelectorAll("#respondTransferForm input, #respondTransferForm select, #respondTransferForm textarea, #respondTransferForm button")
                        .forEach((el) => {
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
                console.error("Error during transfer response:", error);
                messageDiv.textContent = "Det oppstod en teknisk feil under behandling av forespørselen";
                messageDiv.className = "form-message error";
            }
        });
    }
});
