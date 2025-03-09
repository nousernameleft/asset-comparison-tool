console.log("script.js is loaded!");

const API_KEY = "COGO909UH464RKKY"; // Replace with your Alpha Vantage API key

async function fetchStockData(symbol) {
    try {
        const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`);
        const data = await response.json();

        if (!data["Global Quote"] || Object.keys(data["Global Quote"]).length === 0) {
            console.error(`No data found for ${symbol}`);
            return;
        }

        const stock = data["Global Quote"];
        updateStockInfo(symbol, stock);
        updateComparisonTable(stock);
    } catch (error) {
        console.error(`Error fetching stock data for ${symbol}:`, error);
    }
}

function updateStockInfo(symbol, stock) {
    const stockInfo = document.getElementById("stockInfo");
    stockInfo.innerHTML += `<p><strong>${symbol}</strong>: $${stock["05. price"]} | Volume: ${stock["06. volume"]} | Change: ${stock["09. change"]} (${stock["10. change percent"]})</p>`;
}

function updateComparisonTable(stock) {
    const table = document.getElementById("comparisonTable");

    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${stock["01. symbol"]}</td>
        <td>$${stock["05. price"]}</td>
        <td>${stock["06. volume"]}</td>
        <td>${stock["09. change"]} (${stock["10. change percent"]})</td>
    `;

    table.appendChild(row);
}

function searchAssets() {
    const symbols = document.getElementById("searchInput").value.split(",").map(symbol => symbol.trim().toUpperCase());
    document.getElementById("stockInfo").innerHTML = ""; // Clear previous results
    document.getElementById("comparisonTable").innerHTML = ""; // Clear table

    symbols.forEach(symbol => fetchStockData(symbol));
}
