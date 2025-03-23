import sys
from youtube_transcript_api import YouTubeTranscriptApi
from transformers import pipeline

def extract_video_id(url):
    if "youtube.com" in url:
        return url.split("v=")[1].split("&")[0]
    elif "youtu.be" in url:
        return url.split("/")[-1]
    return None

if __name__ == "__main__":
    youtube_url = sys.argv[1]
    video_id = extract_video_id(youtube_url)

    if not video_id:
        print("Invalid YouTube URL")
        sys.exit(1)

    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        text = " ".join([entry["text"] for entry in transcript])

        summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
        summary = summarizer(text, max_length=100, min_length=50, do_sample=False)

        print(summary[0]["summary_text"])

    except Exception as e:
        print("Error:", str(e))