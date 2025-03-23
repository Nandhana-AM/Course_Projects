from flask import Flask, request, jsonify, render_template
import os
import whisper
from transformers import pipeline
from yt_dlp import YoutubeDL
import tempfile
import uuid
import logging
import traceback

# Initialize Flask app
app = Flask(__name__)

# Configure logging
logging.basicConfig(filename='app.log', level=logging.INFO)

# Load Whisper model
whisper_model = whisper.load_model("base")

# Load summarization model
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

# Route to serve the frontend
@app.route('/')
def index():
    return render_template('index.html')

# Route to handle video summarization
@app.route('/summarize', methods=['POST'])
def summarize():
    try:
        # Get video file or YouTube link
        video_file = request.files.get('video')
        youtube_link = request.form.get('youtube_link')

        if not video_file and not youtube_link:
            return jsonify({"error": "Please upload a video or provide a YouTube link."}), 400

        # Validate YouTube link
        if youtube_link and not is_valid_youtube_url(youtube_link):
            return jsonify({"error": "Invalid YouTube link."}), 400

        # Download YouTube video or save uploaded file
        if youtube_link:
            audio_path = download_youtube_video(youtube_link)
        else:
            audio_path = save_uploaded_file(video_file)

        # Transcribe audio to text
        text = transcribe_audio(audio_path)

        # Summarize text
        summary = summarize_text(text)

        # Clean up temporary files
        if os.path.exists(audio_path):
            os.remove(audio_path)

        return jsonify({"summary": summary})

    except Exception as e:
        logging.error(f"Error: {e}\n{traceback.format_exc()}")
        return jsonify({"error": str(e)}), 500

# Function to validate YouTube URL
def is_valid_youtube_url(url):
    return "youtube.com" in url or "youtu.be" in url

# Function to download YouTube video
def download_youtube_video(url):
    try:
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': os.path.join(tempfile.gettempdir(), f"{uuid.uuid4()}.%(ext)s"),
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
        }
        with YoutubeDL(ydl_opts) as ydl:
            info_dict = ydl.extract_info(url, download=True)
            audio_path = ydl.prepare_filename(info_dict).replace('.webm', '.mp3').replace('.m4a', '.mp3')
        return audio_path
    except Exception as e:
        raise Exception(f"Failed to download YouTube video: {e}")

# Function to save uploaded file
def save_uploaded_file(file):
    try:
        file_path = os.path.join(tempfile.gettempdir(), f"{uuid.uuid4()}.mp4")
        file.save(file_path)
        return file_path
    except Exception as e:
        raise Exception(f"Failed to save uploaded file: {e}")

# Function to transcribe audio to text
def transcribe_audio(audio_path):
    try:
        result = whisper_model.transcribe(audio_path)
        if not result['text'].strip():
            raise Exception("No speech detected in the audio.")
        return result['text']
    except Exception as e:
        raise Exception(f"Failed to transcribe audio: {e}")

# Function to summarize text
def summarize_text(text):
    try:
        if len(text) > 1024:
            chunks = [text[i:i + 1024] for i in range(0, len(text), 1024)]
            summaries = []
            for chunk in chunks:
                summary = summarizer(chunk, max_length=130, min_length=30, do_sample=False)[0]['summary_text']
                summaries.append(summary)
            return " ".join(summaries)
        else:
            return summarizer(text, max_length=130, min_length=30, do_sample=False)[0]['summary_text']
    except Exception as e:
        raise Exception(f"Failed to summarize text: {e}")

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)