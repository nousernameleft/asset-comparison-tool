console.log("script.js is loaded!");

let chart; // Store chart instance globally

async function fetchStockData(symbol) {
    try {
        const response = await fetch(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`);
        const data = await response.json();

        const stock = data.quoteResponse.result[0]; // Get stock data
        if (!stock) {
            console.error("No stock data found for:", symbol);
            return;
        }

        // Display stock information in the table
        const table = document.getElementById("comparisonTable");
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${stock.symbol}</td>
            <td>$${stock.regularMarketPrice}</td>
            <td>${stock.regularMarketVolume}</td>
            <td>${stock.regularMarketChange} (${stock.regularMarketChangePercent}%)</td>
        `;
        table.appendChild(row);

        // Fetch historical data for the chart
        fetchChartData(symbol);
    } catch (error) {
        console.error("Error fetching stock data:", error);
    }
}

async function fetchChartData(symbol) {
    try {
        const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=COGO909UH464RKKY`);
        const data = await response.json();

        if (!data["Time Series (Daily)"]) {
            console.error("No chart data found for:", symbol);
            return;
        }

        const timeSeries = data["Time Series (Daily)"];
        const dates = Object.keys(timeSeries).slice(0, 30).reverse();
        const prices = dates.map(date => parseFloat(timeSeries[date]["4. close"]));

        updateChart(dates, prices, symbol);
    } catch (error) {
        console.error("Error fetching chart data:", error);
    }
}

// ✅ Update or create the chart
function updateChart(dates, prices, symbol) {
    const ctx = document.getElementById("priceChart").getContext("2d");

    // Generate a random color for each stock
    const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;

    if (!chart) {
        chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: dates,
                datasets: [],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { title: { display: true, text: "Date" } },
                    y: { title: { display: true, text: "Price (USD)" } },
                },
            },
        });
    }

    chart.data.datasets.push({
        label: symbol,
        data: prices,
        borderColor: randomColor,
        borderWidth: 2,
        fill: false,
    });

    chart.update();
}

// ✅ Search assets when clicking "Search" or pressing "Enter"
function searchAssets() {
    const symbols = document.getElementById("searchInput").value.split(",").map(s => s.trim().toUpperCase());
    symbols.forEach(symbol => fetchStockData(symbol));
}

// ✅ Reset function to clear everything
function resetData() {
    document.getElementById("comparisonTable").innerHTML = ""; // Clear table
    document.getElementById("stockInfo").innerHTML = ""; // Clear stock info
    if (chart) {
        chart.destroy(); // Destroy existing chart
        chart = null; // Reset chart instance
    }
}

// ✅ Add "Enter" key event listener for searching
document.getElementById("searchInput").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        searchAssets();
    }
});

// ✅ Initialize when the page loads
document.addEventListener("DOMContentLoaded", function () {
    console.log("Page is loaded!");
});
