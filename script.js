console.log("script.js is loaded!");

// Define the function globally
async function fetchStockData(symbol) {
    try {
        const response = await fetch(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`);
        const data = await response.json();
        
        const stockInfo = document.getElementById("stockInfo");
        
        // ✅ Check if element exists before updating
        if (stockInfo) {
            const stock = data.quoteResponse.result[0]; // Get the first stock's data
            stockInfo.innerHTML += `<p>${symbol}: $${stock.regularMarketPrice}</p>`;
        } else {
            console.error("stockInfo element is missing in index.html!");
        }
    } catch (error) {
        console.error("Error fetching stock data:", error);
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
