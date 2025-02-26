document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("merkeModal");
    const modalImg = document.getElementById("merkeImage");
    const closeBtn = document.querySelector(".close");

    if (modal && modalImg) {
        function setupPreviewButtons() {
            document.querySelectorAll(".merke-preview-btn").forEach((preview) => {
                preview.addEventListener("click", () => {
                    const imgSrc = preview.getAttribute("data-src");
                    console.log("Opening modal with image:", imgSrc);
                    modal.style.display = "block";
                    modalImg.src = imgSrc;
                });
            });
        }

        setupPreviewButtons();

        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                modal.style.display = "none";
            });
        }

        window.addEventListener("click", (event) => {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });

        window.setupMerkePreviewButtons = setupPreviewButtons;
    }
});
