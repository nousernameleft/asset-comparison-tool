console.log("script.js is loaded!");

const API_KEY = "COGO909UH464RKKY"; // Replace with your Alpha Vantage API key
let chartInstance = null; // Store chart instance

async function fetchStockData(symbol) {
    try {
        const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`);
        const data = await response.json();

        if (!data["Time Series (Daily)"]) {
            console.error(`No data found for ${symbol}`);
            return;
        }

        const stockData = data["Time Series (Daily)"];
        updateStockInfo(symbol, stockData);
        updateComparisonTable(symbol, stockData);
        updateChart(symbol, stockData);
    } catch (error) {
        console.error(`Error fetching stock data for ${symbol}:`, error);
    }
}

function updateStockInfo(symbol, stockData) {
    const stockInfo = document.getElementById("stockInfo");
    const latestDate = Object.keys(stockData)[0];
    const latestPrice = stockData[latestDate]["4. close"];

    stockInfo.innerHTML += `<p><strong>${symbol}</strong>: $${latestPrice}</p>`;
}

function updateComparisonTable(symbol, stockData) {
    const table = document.getElementById("comparisonTable");
    const latestDate = Object.keys(stockData)[0];
    const latestPrice = stockData[latestDate]["4. close"];
    const volume = stockData[latestDate]["5. volume"];

    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${symbol}</td>
        <td>$${latestPrice}</td>
        <td>${volume}</td>
    `;

    table.appendChild(row);
}

function updateChart(symbol, stockData) {
    const dates = Object.keys(stockData).slice(0, 30).reverse();
    const prices = dates.map(date => parseFloat(stockData[date]["4. close"]));

    const ctx = document.getElementById("priceChart").getContext("2d");

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
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
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function searchAssets() {
    const symbols = document.getElementById("searchInput").value.split(",").map(symbol => symbol.trim().toUpperCase());
    symbols.forEach(symbol => fetchStockData(symbol));
}

function resetData() {
    document.getElementById("stockInfo").innerHTML = "";
    document.getElementById("comparisonTable").innerHTML = "";
    document.getElementById("searchInput").value = "";
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }
}
