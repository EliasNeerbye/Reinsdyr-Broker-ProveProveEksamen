function registerClicks() {
    const registerButton = document.getElementById("registerBtn");
    const loginButton = document.getElementById("loginBtn");
    const profileButton = document.getElementById("profileBtn");

    if (registerButton) {
        registerButton.addEventListener("click", () => {
            window.location.href = "/register";
        });
    }

    if (loginButton) {
        loginButton.addEventListener("click", () => {
            window.location.href = "/login";
        });
    }

    if (profileButton) {
        profileButton.addEventListener("click", () => {
            window.location.href = "/profile";
        });
    }
}

document.addEventListener("DOMContentLoaded", registerClicks);
