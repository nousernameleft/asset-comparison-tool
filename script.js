console.log("script.js is loaded!");

// Define the function globally
async function fetchStockData(symbol) {
    try {
        const response = await fetch(`https://corsproxy.io/?https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`);
        const data = await response.json();

        if (!data.quoteResponse || !data.quoteResponse.result || data.quoteResponse.result.length === 0) {
            console.error(`No data found for ${symbol}`);
            return;
        }

        const stock = data.quoteResponse.result[0];
        const stockInfo = document.getElementById("stockInfo");

        if (stockInfo) {
            stockInfo.innerHTML += `<p><strong>${symbol}</strong>: $${stock.regularMarketPrice} | Volume: ${stock.regularMarketVolume} | Change: ${stock.regularMarketChangePercent.toFixed(2)}%</p>`;
        } else {
            console.error("stockInfo element is missing in index.html!");
        }
    } catch (error) {
        console.error(`Error fetching stock data for ${symbol}:`, error);
    }
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

// Define searchAssets function globally
function searchAssets() {
    const symbols = document.getElementById("searchInput").value.split(",").map(symbol => symbol.trim().toUpperCase());
    // Fetch data for all symbols in parallel
    symbols.forEach(symbol => fetchStockData(symbol));
}

// No need for DOMContentLoaded event listener, as we're now loading the script last
