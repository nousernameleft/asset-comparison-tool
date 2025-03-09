async function fetchStockData(symbol) {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=COGO909UH464RKKY`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data["Time Series (Daily)"]) {
            displayChart(data["Time Series (Daily)"], symbol);
        } else {
            document.getElementById("result").innerHTML = "<p>Invalid symbol or data not available.</p>";
        }
    } catch (error) {
        document.getElementById("result").innerHTML = "<p>Error fetching data.</p>";
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

function searchAsset() {
    const symbol = document.getElementById("searchInput").value.toUpperCase();
    fetchStockData(symbol);
}

function displayData(data) {
    document.getElementById("result").innerHTML = `
        <h3>${data["01. symbol"]}</h3>
        <p>Price: $${data["05. price"]}</p>
        <p>Volume: ${data["06. volume"]}</p>
        <p>Change: ${data["09. change"]} (${data["10. change percent"]})</p>
    `;
}
