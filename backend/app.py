from flask import Flask, request, jsonify
from flask_cors import CORS
import PyPDF2
from textblob import TextBlob

app = Flask(__name__)
CORS(app)
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024

def extract_text_from_pdf(file):
    reader = PyPDF2.PdfReader(file)
    return " ".join(page.extract_text() for page in reader.pages if page.extract_text()).strip().lower()

def analyze_text(text):
    # Section identification
    sections = {
        "experience": ["experience", "work history", "employment"],
        "education": ["education", "qualification", "degree"],
        "skills": ["skill", "technology", "programming"]
    }

    # Enhanced keyword matching
    tech_keywords = {
        "Python": ["python", "django", "flask"],
        "Java": ["java", "spring", "jvm"],
        "Cloud": ["aws", "azure", "gcp"],
        "DevOps": ["docker", "kubernetes", "ci/cd"]
    }

    # Section analysis
    found_sections = {
        name: any(keyword in text for keyword in keywords)
        for name, keywords in sections.items()
    }

    # Skills analysis
    found_skills = {
        category: any(keyword in text for keyword in keywords)
        for category, keywords in tech_keywords.items()
    }

    # Grammar analysis
    corrected_text = str(TextBlob(text).correct())
    grammar_issues = [] if text == corrected_text else [{
        "message": "Suggested correction",
        "correction": corrected_text
    }]

    # Scoring
    section_score = (sum(found_sections.values()) / len(sections)) * 40
    keyword_score = (sum(found_skills.values()) / len(tech_keywords)) * 50
    grammar_score = 80 if grammar_issues else 100

    return {
        "scores": {
            "sections": round(section_score),
            "skills": round(keyword_score),
            "grammar": grammar_score,
            "total": round(section_score + keyword_score + (grammar_score * 0.1))
        },
        "details": {
            "missing_sections": [name for name, found in found_sections.items() if not found],
            "found_skills": [cat for cat, found in found_skills.items() if found],
            "grammar_issues": grammar_issues
        }
    }

@app.route('/analyse', methods=['POST'])
def analyse():
    if 'resume' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['resume']
    if not file.filename.lower().endswith('.pdf'):
        return jsonify({"error": "Only PDF files accepted"}), 400

    try:
        text = extract_text_from_pdf(file)
        results = analyze_text(text)
        return jsonify({
            "success": True,
            "score": results["scores"]["total"],
            "analysis": results["details"]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5001)