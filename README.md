# Resume Analyzer - ATS Optimization Tool

A full-stack web application that analyses resumes for ATS (Applicant Tracking System) compatibility using NLP-powered analysis. Built with modern technologies and best practices.

## 🚀 Live Demo

[Deploy your own instance](#deployment) or try the live demo at: [Your deployed URL here]

## ✨ Features

- **PDF Resume Analysis**: Upload and analyze PDF resumes instantly
- **ATS Score Calculation**: Get a comprehensive score (0-100) showing how well your resume will perform
- **Keyword Analysis**: Identify missing and found keywords that hiring managers look for
- **Grammar & Writing Suggestions**: Receive detailed grammar feedback with context and suggestions
- **Section Detection**: Check for missing important resume sections
- **Real-time Processing**: Instant analysis with detailed feedback
- **Responsive Design**: Works perfectly on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript for type safety
- **Vite** for fast development and building
- **Modern CSS** with responsive design
- **Fetch API** for backend communication

### Backend
- **Flask** (Python) for robust API development
- **PyPDF2** for PDF text extraction
- **spaCy** for natural language processing
- **LanguageTool** for grammar checking
- **Flask-CORS** for cross-origin requests

### Development Tools
- **TypeScript** for type safety
- **ESLint** for code quality
- **Git** for version control

## 📊 How It Works

1. **PDF Upload**: Users upload their PDF resume through a clean, intuitive interface
2. **Text Extraction**: The backend extracts and processes text from the PDF
3. **Analysis Engine**: 
   - Checks for essential resume sections (experience, education, skills)
   - Analyzes against 20+ technical keywords
   - Performs grammar and writing analysis
4. **Score Calculation**: Combines section completeness, keyword matching, and grammar quality
5. **Detailed Feedback**: Provides actionable insights with specific suggestions

## 🎯 ATS Score Breakdown

The ATS score is calculated based on three components:
- **Section Score (40%)**: Presence of essential resume sections
- **Keyword Score (50%)**: Matching of technical keywords
- **Grammar Score (10%)**: Writing quality and grammar accuracy

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/resume-analyzer.git
cd resume-analyzer

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
python app.py
```

### Frontend Setup
```bash
# In a new terminal
cd frontend
npm install
npm run dev
```

### Usage
1. Open your browser to `http://localhost:5173`
2. Upload a PDF resume
3. Get instant ATS analysis and feedback

## 📁 Project Structure

```
resume-analyzer/
├── backend/
│   ├── app.py              # Flask API server
│   ├── requirements.txt    # Python dependencies
│   └── venv/              # Virtual environment
├── frontend/
│   ├── src/
│   │   ├── App.tsx        # Main React component
│   │   └── main.tsx       # App entry point
│   ├── package.json       # Node dependencies
│   └── vite.config.ts     # Vite configuration
└── README.md
```

## 🔧 API Endpoints

### POST /analyse
Analyzes a PDF resume and returns ATS optimization feedback.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `resume` (PDF file)

**Response:**
```json
{
  "sucess": true,
  "ats_score": 85,
  "cv_feedback": {
    "missing_sctions": ["technical_skills"],
    "found_keywords": ["python", "git", "agile"],
    "missing_keywords": ["docker", "kubernetes", "aws"],
    "grammar_issues": [
      {
        "message": "Consider using a more specific verb",
        "suggestion": "developed",
        "error_word": "made",
        "context": "I made a web application",
        "rule_id": "ENGLISH_WORD_REPEAT_RULE"
      }
    ]
  }
}
```

## 🚀 Deployment

### Backend Deployment (Heroku)
```bash
# Create Procfile
echo "web: gunicorn app:app" > Procfile

# Create runtime.txt
echo "python-3.9.18" > runtime.txt

# Deploy to Heroku
heroku create your-app-name
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Frontend Deployment (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel
```

### Environment Variables
Set the following environment variables:
- `BACKEND_URL`: Your deployed backend URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 About the Developer

**Your Name** - Full Stack Developer

- **LinkedIn**: [Your LinkedIn]
- **Portfolio**: [Your Portfolio]
- **Email**: [Your Email]

This project demonstrates:
- Full-stack development skills
- API design and implementation
- Modern frontend development
- NLP integration
- Deployment and DevOps practices
- Clean code and documentation

## 🔮 Future Enhancements

- [ ] Support for multiple file formats (DOCX, TXT)
- [ ] Industry-specific keyword analysis
- [ ] Resume template suggestions
- [ ] Export analysis reports
- [ ] User accounts and history
- [ ] Advanced NLP analysis
- [ ] Mobile app version

---

⭐ **Star this repository if you found it helpful!** 