document.addEventListener("DOMContentLoaded", () => {
    const summarizeBtn = document.getElementById("summarize-btn");

    if (!summarizeBtn) {
        console.error("Button not found! Check if the ID matches in HTML.");
        return;
    }

    summarizeBtn.addEventListener("click", async () => {
        const youtubeUrl = document.getElementById("youtube-url").value.trim();

        if (!youtubeUrl) {
            alert("Please enter a YouTube URL.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/summarize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ youtubeUrl }),
            });

            const data = await response.json();

            if (response.ok) {
                document.getElementById("summary").innerText = data.summary;
            } else {
                document.getElementById("summary").innerText = "Error: " + data.error;
            }
        } catch (error) {
            console.error("Error:", error);
            document.getElementById("summary").innerText = "Failed to connect to backend.";
        }
    });
});