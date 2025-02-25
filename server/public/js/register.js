document.getElementById("registerForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const messageDiv = document.getElementById("registerMessage");
    const formData = {
        navn: document.getElementById("navn").value,
        epost: document.getElementById("epost").value,
        telefon: document.getElementById("telefon").value,
        passord: document.getElementById("passord").value,
        kontaktspråk: document.getElementById("kontaktspråk").value,
    };

    if (!formData.kontaktspråk) {
        messageDiv.textContent = "Vennligst velg et kontaktspråk";
        messageDiv.className = "form-message error";
        return;
    }

    try {
        const response = await fetch("/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
            credentials: "include",
        });

        const data = await response.json();

        if (data.success) {
            messageDiv.textContent = "Registrering vellykket! Omdirigerer...";
            messageDiv.className = "form-message success";
            setTimeout(() => {
                window.location.href = "/";
            }, 1000);
        } else {
            messageDiv.textContent = data.message || "Registrering mislyktes. Prøv igjen.";
            messageDiv.className = "form-message error";
        }
    } catch (error) {
        console.error("Registration error:", error);
        messageDiv.textContent = "En feil oppstod under registrering. Prøv igjen senere.";
        messageDiv.className = "form-message error";
    }
});
