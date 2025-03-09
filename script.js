console.log("script.js is loaded!");

const API_KEY = "COGO909UH464RKKY"; // Replace with your own Alpha Vantage API key

async function fetchStockData(symbol) {
    try {
        const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`);
        const data = await response.json();

        if (!data["Global Quote"] || Object.keys(data["Global Quote"]).length === 0) {
            console.error(`No data found for ${symbol}`);
            return;
        }

        const stockInfo = document.getElementById("stockInfo");
        if (stockInfo) {
            const stock = data["Global Quote"];
            stockInfo.innerHTML += `<p><strong>${symbol}</strong>: $${stock["05. price"]} | Volume: ${stock["06. volume"]} | Change: ${stock["09. change"]} (${stock["10. change percent"]})</p>`;
        } else {
            console.error("stockInfo element is missing in index.html!");
        }
    } catch (error) {
        console.error(`Error fetching stock data for ${symbol}:`, error);
    }
}

function searchAssets() {
    const symbols = document.getElementById("searchInput").value.split(",").map(symbol => symbol.trim().toUpperCase());
    symbols.forEach(symbol => fetchStockData(symbol));
}
