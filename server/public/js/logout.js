document.addEventListener("DOMContentLoaded", async function () {
    const messageDiv = document.getElementById("logoutMessage");

    try {
        const response = await fetch("/auth/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        const data = await response.json();

        if (data.success) {
            messageDiv.textContent = "Du er nå logget ut. Omdirigerer...";
            messageDiv.className = "form-message success";
        } else {
            messageDiv.textContent = data.message || "Utlogging mislyktes. Prøv igjen senere.";
            messageDiv.className = "form-message error";
        }

        setTimeout(() => {
            window.location.href = "/";
        }, 2000);
    } catch (error) {
        console.error("Logout error:", error);
        messageDiv.textContent = "En feil oppstod under utlogging. Prøv igjen senere.";
        messageDiv.className = "form-message error";

        setTimeout(() => {
            window.location.href = "/";
        }, 3000);
    }
});
