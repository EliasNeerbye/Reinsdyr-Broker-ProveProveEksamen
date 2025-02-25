document.getElementById("registerFlokkForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const messageDiv = document.getElementById("registerFlokkMessage");
    messageDiv.textContent = "Registrerer flokk...";
    messageDiv.className = "form-message";

    try {
        const formData = new FormData(this);

        const merkeBilde = document.getElementById("merkeBilde").files[0];
        const merkeBildelenke = document.getElementById("merkeBildelenke").value;

        if (!merkeBilde && !merkeBildelenke) {
            messageDiv.textContent = "Du må enten laste opp et bilde eller angi en bildelenke.";
            messageDiv.className = "form-message error";
            return;
        }

        const response = await fetch("/flokk/registerFlokk", {
            method: "POST",
            body: formData,
            credentials: "include",
        });

        const data = await response.json();

        if (data.success) {
            messageDiv.textContent = "Flokk registrert! Omdirigerer...";
            messageDiv.className = "form-message success";
            setTimeout(() => {
                window.location.href = "/";
            }, 1500);
        } else {
            messageDiv.textContent = data.message || "Registrering mislyktes. Prøv igjen.";
            messageDiv.className = "form-message error";
        }
    } catch (error) {
        console.error("Flokk registration error:", error);
        messageDiv.textContent = "En feil oppstod under registrering. Prøv igjen senere.";
        messageDiv.className = "form-message error";
    }
});

document.getElementById("merkeBilde").addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();

        const imagePreviewDiv = document.querySelector(".image-preview") || createImagePreviewElement();

        const previewImage = imagePreviewDiv.querySelector("img") || document.createElement("img");

        reader.onload = function (e) {
            previewImage.src = e.target.result;

            if (!imagePreviewDiv.contains(previewImage)) {
                imagePreviewDiv.appendChild(previewImage);
            }

            imagePreviewDiv.style.display = "block";
        };

        reader.readAsDataURL(file);
    }
});

function createImagePreviewElement() {
    const preview = document.createElement("div");
    preview.className = "image-preview";

    const fileInput = document.getElementById("merkeBilde");
    fileInput.parentNode.insertBefore(preview, fileInput.nextSibling);

    return preview;
}
