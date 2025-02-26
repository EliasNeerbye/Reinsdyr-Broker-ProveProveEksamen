document.addEventListener("DOMContentLoaded", function () {
    const transferForm = document.getElementById("initiateTransferForm");
    const messageDiv = document.getElementById("transferMessage");

    if (transferForm) {
        transferForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            messageDiv.textContent = "";
            messageDiv.className = "form-message";

            messageDiv.textContent = "Sender overføringsforespørsel...";
            messageDiv.style.display = "block";

            const reinsdyrId = document.getElementById("reinsdyrId").value;
            const tilEierEpost = document.getElementById("tilEierEpost").value;
            const melding = document.getElementById("melding").value;

            if (!tilEierEpost) {
                messageDiv.textContent = "Vennligst oppgi e-postadressen til den nye eieren";
                messageDiv.className = "form-message error";
                return;
            }

            try {
                const response = await fetch("/reinsdyr/initiateTransfer", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        reinsdyrId,
                        tilEierEpost,
                        melding,
                    }),
                    credentials: "include",
                });

                const result = await response.json();

                if (result.success) {
                    messageDiv.textContent = result.message;
                    messageDiv.className = "form-message success";

                    document.getElementById("tilEierEpost").disabled = true;
                    document.getElementById("melding").disabled = true;
                    document.querySelector(".submitBtn").disabled = true;

                    setTimeout(() => {
                        window.location.href = "/transaksjoner";
                    }, 3000);
                } else {
                    messageDiv.textContent = result.message || "En feil oppstod under sending av forespørselen";
                    messageDiv.className = "form-message error";
                }
            } catch (error) {
                console.error("Error during transfer initiation:", error);
                messageDiv.textContent = "Det oppstod en teknisk feil under sending av forespørselen";
                messageDiv.className = "form-message error";
            }
        });
    }
});
