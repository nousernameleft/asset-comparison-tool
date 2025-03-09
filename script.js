async function fetchStockData(symbol) {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=COGO909UH464RKKY`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data["Global Quote"]) {
            displayData(data["Global Quote"]);
        } else {
            document.getElementById("result").innerHTML = "<p>Invalid symbol or data not available.</p>";
        }
    } catch (error) {
        document.getElementById("result").innerHTML = "<p>Error fetching data.</p>";
    }
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
