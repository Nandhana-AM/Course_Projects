document.getElementById("summary-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const url = document.getElementById("url").value;
    const summaryType = window.location.pathname.split("-")[1];  // Extract type from URL
    const resultDiv = document.getElementById("summary-result");

    resultDiv.innerHTML = "<p>Summarizing...</p>";

    try {
        const response = await fetch("/summarize", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ url, type: summaryType }),
        });

        const data = await response.json();
        if (data.error) {
            resultDiv.innerHTML = <p class="error">${data.error}</p>;
        } else {
            resultDiv.innerHTML = <pre>${data.summary}</pre>;
        }
    } catch (error) {
        resultDiv.innerHTML = <p class="error">An error occurred. Please try again.</p>;
    }
});