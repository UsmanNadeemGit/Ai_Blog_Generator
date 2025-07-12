# AI Blog Generator 🚀

A full-stack AI-powered blog generator that converts YouTube video transcripts into SEO-optimized blog posts using a local Ollama LLM model (llama3:8b).

## ✨ Features

- **YouTube Transcript Extraction**: Automatically extracts transcripts from YouTube video URLs
- **AI-Powered Content Generation**: Uses local Ollama LLM (llama3:8b) for blog generation
- **SEO Optimization**: Generates structured, SEO-friendly blog content
- **Modern UI/UX**: Beautiful, futuristic interface with glassmorphism effects and animations
- **Real-time Processing**: Live blog generation with progress indicators
- **Copy & Download**: Easy content sharing and downloading capabilities
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Backend
- **Flask**: Python web framework for API
- **youtube-transcript-api**: YouTube transcript extraction
- **Ollama**: Local LLM integration (llama3:8b)
- **Docker**: Containerization for easy deployment

### Frontend
- **HTML5/CSS3**: Modern, responsive design
- **JavaScript**: Interactive animations and API integration
- **Canvas API**: Particle animations and cursor trails
- **Glassmorphism**: Modern UI design patterns

## 📋 Prerequisites

Before running this project, make sure you have:

1. **Python 3.8+** installed
2. **Docker** installed (for containerized deployment)
3. **Ollama** installed with llama3:8b model
4. **Git** for version control

## 🚀 Quick Start

### Option 1: Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/UsmanNadeemGit/Ai_Blog_Generator.git
   cd Ai_Blog_Generator
   ```

2. **Start the development environment**
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:8081
   - Backend API: http://localhost:8080

### Option 2: Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/UsmanNadeemGit/Ai_Blog_Generator.git
   cd Ai_Blog_Generator
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the Flask backend**
   ```bash
   python main.py
   ```

4. **Serve the frontend**
   ```bash
   # Using Python's built-in server
   python -m http.server 8081
   ```

## 📖 Usage

1. **Open the application** in your browser at `http://localhost:8081`

2. **Enter a YouTube URL** in the input field
   - Example: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`

3. **Click "Generate Blog"** to start the process
   - The system will extract the video transcript
   - Send it to the Ollama LLM for processing
   - Generate an SEO-optimized blog post

4. **View the generated blog** with proper HTML formatting
   - Copy the content using the copy button
   - Download as text file using the download button

## 🏗️ Project Structure

```
Ai_Blog_Generator/
├── main.py                 # Flask backend API
├── static/
│   ├── styles.css         # Modern CSS with animations
│   └── script.js          # Frontend JavaScript
├── templates/
│   └── index.html         # Main HTML template
├── docker-compose.dev.yml # Development Docker setup
├── requirements.txt       # Python dependencies
└── README.md             # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
FLASK_ENV=development
FLASK_DEBUG=1
OLLAMA_HOST=http://localhost:11434
```

### Ollama Setup

1. **Install Ollama** from [ollama.ai](https://ollama.ai)

2. **Pull the llama3:8b model**
   ```bash
   ollama pull llama3:8b
   ```

3. **Start Ollama service**
   ```bash
   ollama serve
   ```

## 🎨 Features in Detail

### Frontend Features
- **Particle Animation**: Dynamic background with floating particles
- **Cursor Trail**: Subtle cursor following animation
- **Glassmorphism UI**: Modern glass-like interface elements
- **Smooth Animations**: CSS transitions and keyframe animations
- **Responsive Design**: Mobile-friendly layout
- **Copy/Download**: Easy content sharing functionality

### Backend Features
- **YouTube API Integration**: Automatic transcript extraction
- **LLM Integration**: Local Ollama model for content generation
- **Structured Output**: Enforced blog structure with HTML tags
- **Error Handling**: Comprehensive error management
- **CORS Support**: Cross-origin resource sharing enabled

## 🐛 Troubleshooting

### Common Issues

1. **Ollama Connection Error**
   - Ensure Ollama is running: `ollama serve`
   - Check if llama3:8b model is installed: `ollama list`

2. **YouTube Transcript Error**
   - Verify the YouTube URL is valid and public
   - Check if the video has available transcripts

3. **Docker Issues**
   - Ensure Docker is running
   - Try rebuilding: `docker-compose -f docker-compose.dev.yml up --build`

4. **Port Conflicts**
   - Change ports in `docker-compose.dev.yml` if 8080/8081 are in use

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Ollama](https://ollama.ai) for local LLM capabilities
- [YouTube Transcript API](https://github.com/jdepoix/youtube-transcript-api) for transcript extraction
- [Flask](https://flask.palletsprojects.com/) for the web framework

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/UsmanNadeemGit/Ai_Blog_Generator/issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

---

**Made with ❤️ using AI and modern web technologies** 
