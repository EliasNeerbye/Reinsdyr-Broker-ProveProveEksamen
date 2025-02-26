document.addEventListener("DOMContentLoaded", function () {
    const flokkerContainer = document.querySelector(".flokker-container");
    const reinsdyrDetailsContainer = document.getElementById("reinsdyr-details");
    const backToFlokkerBtn = document.getElementById("back-to-flokker");
    const reinsdyrFlokkName = document.getElementById("reinsdyr-flokk-name");
    const reinsdyrTbody = document.getElementById("reinsdyr-tbody");
    const currentPageElem = document.getElementById("current-page");
    const totalPagesElem = document.getElementById("total-pages");
    const prevPageBtn = document.getElementById("prev-page");
    const nextPageBtn = document.getElementById("next-page");
    const itemsPerPageSelect = document.getElementById("items-per-page");
    const loadingIndicator = document.getElementById("loading-indicator");
    const noReinsdyrElem = document.getElementById("no-reinsdyr");

    let currentState = {
        flokkId: null,
        flokkName: "",
        currentPage: 1,
        itemsPerPage: 10,
        totalPages: 1,
    };

    document.querySelectorAll(".view-reinsdyr-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
            const flokkId = this.getAttribute("data-flokk-id");
            const flokkCard = document.querySelector(`.flokk-card[data-flokk-id="${flokkId}"]`);
            const flokkName = flokkCard.querySelector("h4").textContent;

            currentState.flokkId = flokkId;
            currentState.flokkName = flokkName;
            currentState.currentPage = 1;
            currentState.itemsPerPage = parseInt(itemsPerPageSelect.value);

            reinsdyrFlokkName.textContent = flokkName;
            flokkerContainer.classList.add("hidden");
            reinsdyrDetailsContainer.classList.remove("hidden");

            fetchReinsdyr();
        });
    });

    if (backToFlokkerBtn) {
        backToFlokkerBtn.addEventListener("click", function () {
            reinsdyrDetailsContainer.classList.add("hidden");
            flokkerContainer.classList.remove("hidden");
            reinsdyrTbody.innerHTML = "";
            currentState.flokkId = null;
        });
    }

    if (prevPageBtn) {
        prevPageBtn.addEventListener("click", function () {
            if (currentState.currentPage > 1) {
                currentState.currentPage--;
                fetchReinsdyr();
            }
        });
    }

    if (nextPageBtn) {
        nextPageBtn.addEventListener("click", function () {
            if (currentState.currentPage < currentState.totalPages) {
                currentState.currentPage++;
                fetchReinsdyr();
            }
        });
    }

    if (itemsPerPageSelect) {
        itemsPerPageSelect.addEventListener("change", function () {
            currentState.itemsPerPage = parseInt(this.value);
            currentState.currentPage = 1;
            fetchReinsdyr();
        });
    }

    async function fetchReinsdyr() {
        if (!currentState.flokkId) return;

        try {
            reinsdyrTbody.innerHTML = "";
            loadingIndicator.classList.remove("hidden");
            noReinsdyrElem.classList.add("hidden");

            prevPageBtn.disabled = true;
            nextPageBtn.disabled = true;

            const response = await fetch(`/flokk/getFlokk/${currentState.flokkId}?page=${currentState.currentPage}&limit=${currentState.itemsPerPage}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const data = await response.json();

            loadingIndicator.classList.add("hidden");

            if (data.success) {
                currentState.totalPages = data.pagination.totalPages;
                currentPageElem.textContent = currentState.currentPage;
                totalPagesElem.textContent = currentState.totalPages;

                prevPageBtn.disabled = currentState.currentPage <= 1;
                nextPageBtn.disabled = currentState.currentPage >= currentState.totalPages;

                if (data.reinsdyr.length === 0) {
                    noReinsdyrElem.classList.remove("hidden");
                } else {
                    data.reinsdyr.forEach((reinsdyr) => {
                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td>${reinsdyr.navn}</td>
                            <td>${reinsdyr.serienummer}</td>
                            <td>${reinsdyr.fødselsdato}</td>
                            <td>
                                <button class="action-btn transfer-btn" data-id="${reinsdyr.id}" data-type="reinsdyr">Overfør</button>
                            </td>
                        `;
                        reinsdyrTbody.appendChild(row);
                    });

                    addButtonEventListeners();
                }
            } else {
                console.error("Error fetching reinsdyr:", data.message);
                noReinsdyrElem.classList.remove("hidden");
                noReinsdyrElem.querySelector("p").textContent = "Feil ved henting av reinsdyr. Prøv igjen senere.";
            }
        } catch (error) {
            console.error("Error fetching reinsdyr:", error);
            loadingIndicator.classList.add("hidden");
            noReinsdyrElem.classList.remove("hidden");
            noReinsdyrElem.querySelector("p").textContent = "Feil ved henting av reinsdyr. Prøv igjen senere.";
        }
    }

    function addButtonEventListeners() {
        document.querySelectorAll(".transfer-btn").forEach((btn) => {
            btn.addEventListener("click", function () {
                const id = this.getAttribute("data-id");
                const type = this.getAttribute("data-type");
                if (type === "reinsdyr") {
                    window.location.href = `/transferRein?id=${id}`;
                }
            });
        });
    }
});
