console.log("script.js is loaded!");

// Move the function definition outside the DOMContentLoaded listener
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
            co
