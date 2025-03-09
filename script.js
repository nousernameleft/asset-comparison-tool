console.log("script.js is loaded!");

function fetchStockData(symbol) {
    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=COGO909UH464RKKY`)
        .then(response => response.json())
        .then(data => {
            const stockInfo = document.getElementById("stockInfo");
            
            // ✅ Check if element exists before updating
            if (stockInfo) {
                stockInfo.innerHTML = `<p>${symbol}: ${data["Global Quote"]["05. price"]}</p>`;
            } else {
                console.error("stockInfo element is missing in index.html!");
            }
        })
        .catch(error => console.error("Error fetching stock data:", error));
}

function displayChart(data, symbol) {
    const dates = Object.keys(data).slice(0, 30).reverse(); 
    const prices = dates.map(date => parseFloat(data[date]["4. close"]));

    const ctx = document.getElementById("priceChart").getContext("2d");

    new Chart(ctx, {
        type: "line",
        data: {
            labels: dates,
            datasets: [{
                label: `${symbol} Price`,
                data: prices,
                borderColor: "blue",
                borderWidth: 2,
                fill: false
            }]
        }
    });
}

function searchAsset() {
    const symbol = document.getElementById("searchInput").value.toUpperCase();
    fetchStockData(symbol);
}

function displayData(data) {
    const table = document.getElementById("comparisonTable");

    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${data["01. symbol"]}</td>
        <td>$${data["05. price"]}</td>
        <td>${data["06. volume"]}</td>
        <td>${data["09. change"]} (${data["10. change percent"]})</td>
    `;

    table.appendChild(row);
}
