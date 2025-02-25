document.getElementById("registerReinForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const messageDiv = document.getElementById("registerReinMessage");
    messageDiv.textContent = "Registrerer reinsdyr...";
    messageDiv.className = "form-message";

    const formData = {
        navn: document.getElementById("navn").value,
        flokkId: document.getElementById("flokkId").value,
        fødselsdato: document.getElementById("fødselsdato").value,
        customSerienummer: document.getElementById("customSerienummer").value,
    };

    try {
        const response = await fetch("/reinsdyr/registerRein", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
            credentials: "include",
        });

        const data = await response.json();

        if (data.success) {
            messageDiv.textContent = "Reinsdyr registrert! Omdirigerer...";
            messageDiv.className = "form-message success";
            setTimeout(() => {
                window.location.href = "/";
            }, 1500);
        } else {
            messageDiv.textContent = data.message || "Registrering mislyktes. Prøv igjen.";
            messageDiv.className = "form-message error";
        }
    } catch (error) {
        console.error("Reinsdyr registration error:", error);
        messageDiv.textContent = "En feil oppstod under registrering. Prøv igjen senere.";
        messageDiv.className = "form-message error";
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("fødselsdato").setAttribute("max", today);
});
