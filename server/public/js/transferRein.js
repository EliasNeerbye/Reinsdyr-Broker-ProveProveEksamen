document.addEventListener("DOMContentLoaded", function () {
    const transferForm = document.getElementById("transferReinForm");
    const messageDiv = document.getElementById("transferMessage");

    if (transferForm) {
        transferForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            messageDiv.textContent = "";
            messageDiv.className = "form-message";

            messageDiv.textContent = "Overfører reinsdyr...";
            messageDiv.style.display = "block";

            const reinsdyrId = document.getElementById("reinsdyrId").value;
            const targetFlokkId = document.getElementById("targetFlokkId").value;

            if (!targetFlokkId) {
                messageDiv.textContent = "Vennligst velg en målflokk";
                messageDiv.className = "form-message error";
                return;
            }

            try {
                const response = await fetch("/reinsdyr/transferRein", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        reinsdyrId,
                        targetFlokkId,
                    }),
                    credentials: "include",
                });

                const result = await response.json();

                if (result.success) {
                    messageDiv.textContent = result.message;
                    messageDiv.className = "form-message success";

                    document.getElementById("targetFlokkId").disabled = true;
                    document.querySelector(".submitBtn").disabled = true;

                    setTimeout(() => {
                        window.location.href = "/profile";
                    }, 2000);
                } else {
                    messageDiv.textContent = result.message || "En feil oppstod under overføring";
                    messageDiv.className = "form-message error";
                }
            } catch (error) {
                console.error("Error during transfer:", error);
                messageDiv.textContent = "Det oppstod en teknisk feil under overføring";
                messageDiv.className = "form-message error";
            }
        });
    }
});
