from flask import Flask, request, jsonify, render_template
import os
import whisper
from transformers import pipeline
from yt_dlp import YoutubeDL
import tempfile
import uuid
import logging
import traceback
from PIL import Image
import requests
from io import BytesIO
from transformers import BlipProcessor, BlipForConditionalGeneration

# Initialize Flask app
app = Flask(__name__)

# Configure logging
logging.basicConfig(filename='app.log', level=logging.INFO)

# Load Whisper model for video summarization
whisper_model = whisper.load_model("base")

# Load summarization model for text summarization
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

# Load BLIP model for image summarization
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
image_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

# Route to serve the home page
@app.route('/')
def index():
    return render_template('index.html')

# Route to serve the video summarization page
@app.route('/video')
def video():
    return render_template('video.html')

# Route to serve the text summarization page
@app.route('/text')
def text():
    return render_template('text.html')

# Route to serve the image summarization page
@app.route('/image')
def image():
    return render_template('image.html')

# Route to handle video summarization
@app.route('/summarize_video', methods=['POST'])
def summarize_video():
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

# Route to handle text summarization
@app.route('/summarize_text', methods=['POST'])
def summarize_text_route():
    try:
        text = request.form.get('text')
        if not text:
            return jsonify({"error": "No text provided."}), 400

        # Summarize text
        summary = summarize_text(text)
        return jsonify({"summary": summary})

    except Exception as e:
        logging.error(f"Error: {e}\n{traceback.format_exc()}")
        return jsonify({"error": str(e)}), 500

# Route to handle image summarization
@app.route('/summarize_image', methods=['POST'])
def summarize_image():
    try:
        image_file = request.files.get('image')
        image_url = request.form.get('image_url')

        if not image_file and not image_url:
            return jsonify({"error": "Please upload an image or provide an image URL."}), 400

        # Load image
        if image_file:
            image = Image.open(image_file).convert("RGB")
        else:
            response = requests.get(image_url)
            image = Image.open(BytesIO(response.content)).convert("RGB")

        # Generate caption
        inputs = processor(image, return_tensors="pt")
        out = image_model.generate(**inputs)
        caption = processor.decode(out[0], skip_special_tokens=True)

        return jsonify({"summary": caption})

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
            'quiet': True,  # Suppress yt-dlp output
        }
        with YoutubeDL(ydl_opts) as ydl:
            info_dict = ydl.extract_info(url, download=True)
            audio_path = ydl.prepare_filename(info_dict).replace('.webm', '.mp3').replace('.m4a', '.mp3')
            logging.info(f"Downloaded audio file: {audio_path}")
        return audio_path
    except Exception as e:
        logging.error(f"Failed to download YouTube video: {e}\n{traceback.format_exc()}")
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
        # Verify the audio file exists
        if not os.path.exists(audio_path):
            raise Exception(f"Audio file not found: {audio_path}")

        # Log the audio file size
        file_size = os.path.getsize(audio_path)
        logging.info(f"Audio file size: {file_size} bytes")

        # Transcribe the audio
        result = whisper_model.transcribe(audio_path)
        if not result['text'].strip():
            raise Exception("No speech detected in the audio.")
        return result['text']
    except Exception as e:
        logging.error(f"Error transcribing audio: {e}\n{traceback.format_exc()}")
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