async function fetchStockData(symbol) {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=COGO909UH464RKKY`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Example: Fetch Apple (AAPL) stock data
fetchStockData("AAPL");
