from flask import Flask, request, jsonify

import PyPDF2
import spacy
import language_tool_python

app = Flask(__name__)
nlp = spacy.load("en_core_web_sm")
tool = language_tool_python.LanguageTool('en-GB')

def extract_text_from_pdf(file):
    try:
        reader = PyPDF2.PdfReader(file)
        text = " ".join([page.extract_text() for page in reader.pages if page.extract_text()])
        return text.strip().lower()
    except Exception as e:
        raise ValueError(f"Failed to process PDF: {str(e)}")



@app.route('/analyse', methods=['POST'])
def analyse():
    if 'resume' not in request.files:
        return jsonify({"error": "No CV file uploaded"}), 400

    file = request.files['resume']

    if not file.filename.lower().endswith('.pdf'):
        return jsonify({"error": "Only PDF CVs are accepted"})

    try:
        text = extract_text_from_pdf(file)
        sections = {
            "experience": ["experience", "work history", "employment history"],
            "education": ["education", "qualifications", "degrees"],
            "technical_skills": ["technical skills", "technologies", "programming languages"]
        }

        tech_keywords = [
            "python", "java", "c#", "javascript", "typescript",
            "sql", "nosql", "git", "docker", "kubernetes",
            "aws", "azure", "agile", "scrum", "ci/cd",
            "machine learning", "data structures", "algorithms",
            "restful apis", "microservices", "tdd", "oop"
        ]


        found_sections = {
            name: any(variant in text for variant in variants)
            for name, variants in sections.items()
        }

        found_keywords= [
            kw for kw in tech_keywords if kw in text
        ]

        section_score = (sum(found_sections.values()) / len(sections)) * 40
        keyword_score = (len(found_keywords) / len(tech_keywords)) * 50
        grammar_matches = tool.check(text)
        grammar_score = max(0, 100 - len(grammar_matches)) * 0.1

        ats_score = round(section_score + keyword_score + grammar_score)


        return jsonify({
            "sucess": True,
            "ats_score": ats_score,
            "cv_feedback": {
                "missing_sctions": [name for name, found in found_sections.items() if not found],
                "found_keywords": found_keywords,
                "missing_keywords": list(set(tech_keywords)- set(found_keywords)),
                "grammar_issues": [match.message for match in grammar_matches[:3]]
            },
        })

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error":"Server error processing your CV"}), 500




if __name__ == "__main__":
    app.run(debug=True)








