from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
from youtube_transcript_api._api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound
from urllib.parse import urlparse, parse_qs
import os
import markdown

STATIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static')
app = Flask(__name__, static_folder=STATIC_DIR)
CORS(app)

# --- Transcript Utilities ---
def get_video_id(youtube_url: str) -> str:
    q = urlparse(youtube_url)
    host = q.hostname
    if host == "youtu.be":
        return q.path.lstrip("/")
    if host in ("www.youtube.com", "youtube.com"):
        if q.path == "/watch":
            return parse_qs(q.query)["v"][0]
        if q.path.startswith(("/embed/", "/v/")):
            return q.path.split("/")[2]
    raise ValueError("Unrecognized YouTube URL format")

def fetch_transcript(video_id: str) -> str:
    try:
        segments = YouTubeTranscriptApi.get_transcript(video_id)
        return " ".join(seg["text"] for seg in segments)
    except TranscriptsDisabled:
        return "Transcripts are disabled for this video."
    except NoTranscriptFound:
        return "No transcript available (private video, region‑locked, or captions turned off)."

def generate_blog_with_ollama(transcript: str) -> str:
    # --- AI Prompt: Enforce real blog structure and 800-1000 word count ---
    prompt = (
        "You are an expert blog writer. Write a detailed, engaging blog post based on the following YouTube transcript. "
        "STRICT REQUIREMENTS:\n"
        "- The blog MUST be between 800 and 1000 words. (Ideal: 1000, Minimum: 800. Do NOT go under 800 or over 1000 words.)\n"
        "- The blog MUST be structured as follows:\n"
        "  1. Start with a single main title at the top using <h1> tags (do not repeat this as a subheading).\n"
        "  2. Write a short introduction using <p> tags.\n"
        "  3. Organize the main content into at least 3 distinct sections, each with a clear subheading using <h2> tags. Each section should have multiple paragraphs using <p> tags.\n"
        "  4. Finish with a conclusion section, also with a <h2> subheading and several <p> tags.\n"
        "  5. The entire blog should be between 800 and 1000 words.\n"
        "  6. Output valid HTML only. Do NOT use Markdown, asterisks, or <b>/<strong> tags. Only use <h1>, <h2>, <p> tags. Do not use <h3> or any other tags.\n"
        "  7. Do not include any code blocks, lists, or tables. Only use headings and paragraphs.\n"
        "  8. If you do not follow this format or the word count, your output will be rejected.\n"
        "EXAMPLE FORMAT:\n"
        "<h1>Main Blog Title</h1>\n"
        "<p>Intro paragraph...</p>\n"
        "<h2>First Section Heading</h2>\n"
        "<p>First section paragraph...</p>\n"
        "<p>Another paragraph...</p>\n"
        "<h2>Second Section Heading</h2>\n"
        "<p>Second section paragraph...</p>\n"
        "<h2>Conclusion</h2>\n"
        "<p>Conclusion paragraph...</p>\n"
        "Here is the transcript:\n"
        f"{transcript}\n"
    )
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={"model": "llama3:8b", "prompt": prompt, "stream": False}
    )
    if response.ok:
        data = response.json()
        blog_raw = data.get("response", "(No response from model)")
        # Convert Markdown to HTML if no <h1> or <h2> tags present
        if "<h1>" not in blog_raw and "<h2>" not in blog_raw:
            blog_html = markdown.markdown(blog_raw)
            return blog_html
        return blog_raw
    return "Failed to generate blog post."

# --- API Endpoint ---
@app.route('/generate_blog', methods=['POST'])
def generate_blog():
    data = request.get_json()
    youtube_url = data.get('url')
    if not youtube_url:
        return jsonify({"error": "No YouTube URL provided."}), 400
    try:
        video_id = get_video_id(youtube_url)
        transcript = fetch_transcript(video_id)
        if transcript.startswith("Transcripts are disabled") or transcript.startswith("No transcript"):
            return jsonify({"error": transcript}), 400
        blog_post = generate_blog_with_ollama(transcript)
        return jsonify({"blog_post": blog_post})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Serve Frontend ---
@app.route('/')
def serve_index():
    return send_from_directory(STATIC_DIR, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(STATIC_DIR, path)

if __name__ == "__main__":
    app.run(debug=True) 