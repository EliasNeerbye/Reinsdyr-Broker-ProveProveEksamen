async function search() {
    const searchInput = document.getElementById("searchBar").value;
    if (searchInput.length >= 3) {
        try {
            const response = await fetch("/search?q=" + searchInput);
            const result = await response.json();
            const div = document.getElementById("resultDiv");

            div.innerHTML = "";

            if (result && result.success && result.totalCount > 0) {
                const resultCount = document.createElement("p");
                resultCount.textContent = `Fant ${result.totalCount} resultater`;
                div.appendChild(resultCount);

                if (result.results.eierResults && result.results.eierResults.length > 0) {
                    const eierHeader = document.createElement("h3");
                    eierHeader.textContent = "Eiere";
                    div.appendChild(eierHeader);

                    const eierTable = document.createElement("table");
                    eierTable.className = "results-table eier-table";

                    const eierThead = document.createElement("thead");
                    const eierHeaderRow = document.createElement("tr");
                    eierHeaderRow.innerHTML = `
              <th>Navn</th>
              <th>Telefon</th>
              <th>E-post</th>
              <th>Språk</th>
              <th>Flokker</th>
            `;
                    eierThead.appendChild(eierHeaderRow);
                    eierTable.appendChild(eierThead);

                    const eierTbody = document.createElement("tbody");
                    result.results.eierResults.forEach((eier) => {
                        const row = document.createElement("tr");

                        // Format flokker list
                        let flokkerHTML = "";
                        if (eier.flokker && eier.flokker.length > 0) {
                            flokkerHTML = eier.flokker.map((f) => f.navn).join(", ");
                        } else {
                            flokkerHTML = "Ingen flokker";
                        }

                        row.innerHTML = `
                <td>${eier.navn}</td>
                <td>${eier.telefon}</td>
                <td>${eier.epost}</td>
                <td>${eier.språk}</td>
                <td>${flokkerHTML}</td>
              `;
                        eierTbody.appendChild(row);
                    });

                    eierTable.appendChild(eierTbody);
                    div.appendChild(eierTable);
                }

                if (result.results.flokkResults && result.results.flokkResults.length > 0) {
                    const flokkHeader = document.createElement("h3");
                    flokkHeader.textContent = "Flokker";
                    div.appendChild(flokkHeader);

                    const flokkTable = document.createElement("table");
                    flokkTable.className = "results-table flokk-table";

                    const flokkThead = document.createElement("thead");
                    const flokkHeaderRow = document.createElement("tr");
                    flokkHeaderRow.innerHTML = `
              <th>Navn</th>
              <th>Serienummer</th>
              <th>Merke</th>
              <th>Eier</th>
              <th>Antall Reinsdyr</th>
            `;
                    flokkThead.appendChild(flokkHeaderRow);
                    flokkTable.appendChild(flokkThead);

                    const flokkTbody = document.createElement("tbody");
                    result.results.flokkResults.forEach((flokk) => {
                        const row = document.createElement("tr");

                        const eierName = flokk.eier ? flokk.eier.navn : "Ukjent";
                        const reinsdyrCount = flokk.reinsdyr ? flokk.reinsdyr.length : 0;

                        row.innerHTML = `
                <td>${flokk.navn}</td>
                <td>${flokk.serienummer}</td>
                <td>${flokk.merke}</td>
                <td>${eierName}</td>
                <td>${reinsdyrCount}</td>
              `;
                        flokkTbody.appendChild(row);
                    });

                    flokkTable.appendChild(flokkTbody);
                    div.appendChild(flokkTable);
                }

                if (result.results.reinsdyrResults && result.results.reinsdyrResults.length > 0) {
                    const reinsdyrHeader = document.createElement("h3");
                    reinsdyrHeader.textContent = "Reinsdyr";
                    div.appendChild(reinsdyrHeader);

                    const reinsdyrTable = document.createElement("table");
                    reinsdyrTable.className = "results-table reinsdyr-table";

                    const reinsdyrThead = document.createElement("thead");
                    const reinsdyrHeaderRow = document.createElement("tr");
                    reinsdyrHeaderRow.innerHTML = `
              <th>Navn</th>
              <th>Serienummer</th>
              <th>Fødselsdato</th>
              <th>Flokk</th>
            `;
                    reinsdyrThead.appendChild(reinsdyrHeaderRow);
                    reinsdyrTable.appendChild(reinsdyrThead);

                    const reinsdyrTbody = document.createElement("tbody");
                    result.results.reinsdyrResults.forEach((reinsdyr) => {
                        const row = document.createElement("tr");

                        const flokkInfo = reinsdyr.flokk ? reinsdyr.flokk.navn : "Ukjent";

                        row.innerHTML = `
                <td>${reinsdyr.navn}</td>
                <td>${reinsdyr.serienummer}</td>
                <td>${reinsdyr.fødselsdato}</td>
                <td>${flokkInfo}</td>
              `;
                        reinsdyrTbody.appendChild(row);
                    });

                    reinsdyrTable.appendChild(reinsdyrTbody);
                    div.appendChild(reinsdyrTable);
                }
            } else {
                div.innerHTML = "<p>Ingen resultater funnet</p>";
            }
        } catch (error) {
            console.error("Error fetching search results:", error);
            document.getElementById("resultDiv").innerHTML = "<p>Feil ved søk</p>";
        }
    } else if (searchInput.length === 0) {
        document.getElementById("resultDiv").innerHTML = `
        <h2>Søk etter:</h2>
        <ul>
            <li>Navn</li>
            <li>Tlf</li>
            <li>Serienummer</li>
            <li>Språk</li>
            <li><i>Og mye annet!</i></li>
        </ul>
        <h3><u><a href="/profile">Sjekk profilen din for å se dine registrerte flokker og reinsdyr</a></u></h3>
        `;
    } else {
        document.getElementById("resultDiv").innerHTML = "<p>Skriv minst 3 tegn for å søke</p>";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const searchBar = document.getElementById("searchBar");

    let debounceTimer;
    searchBar.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            search();
        }, 300);
    });
});
