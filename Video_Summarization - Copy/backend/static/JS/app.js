document.getElementById('upload-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const videoFile = document.getElementById('video-file').files[0];
    const youtubeLink = document.getElementById('youtube-link').value;

    if (videoFile) {
        formData.append('video', videoFile);
    } else if (youtubeLink) {
        if (!isValidYouTubeUrl(youtubeLink)) {
            alert("Please enter a valid YouTube link.");
            return;
        }
        formData.append('youtube_link', youtubeLink);
    } else {
        alert('Please upload a video or paste a YouTube link.');
        return;
    }

    document.getElementById('loading').style.display = 'block';
    document.getElementById('error').innerText = '';
    document.getElementById('summary').innerText = '';

    try {
        const response = await fetch('/summarize', {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();

        if (data.error) {
            document.getElementById('error').innerText = data.error;
        } else {
            document.getElementById('summary').innerText = data.summary;
        }
    } catch (error) {
        document.getElementById('error').innerText = 'An error occurred. Please try again.';
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
});

document.getElementById('reset-btn').addEventListener('click', () => {
    document.getElementById('upload-form').reset();
    document.getElementById('error').innerText = '';
    document.getElementById('summary').innerText = '';
});

function isValidYouTubeUrl(url) {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return regex.test(url);
}