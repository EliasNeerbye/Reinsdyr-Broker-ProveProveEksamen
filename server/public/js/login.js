document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const messageDiv = document.getElementById("loginMessage");
    const epost = document.getElementById("epost").value;
    const passord = document.getElementById("passord").value;

    try {
        const response = await fetch("/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ epost, passord }),
            credentials: "include",
        });

        const data = await response.json();

        if (data.success) {
            messageDiv.textContent = "Innlogging vellykket! Omdirigerer...";
            messageDiv.className = "form-message success";
            setTimeout(() => {
                window.location.href = "/";
            }, 1000);
        } else {
            messageDiv.textContent = data.message || "Innlogging mislyktes. Prøv igjen.";
            messageDiv.className = "form-message error";
        }
    } catch (error) {
        console.error("Login error:", error);
        messageDiv.textContent = "En feil oppstod under innlogging. Prøv igjen senere.";
        messageDiv.className = "form-message error";
    }
});
