import flask from Flask, request, jsonify

import PyPDF2
import spacy
import language_tool_python

app = Flask(__name__)
nlp = spacy.load("en_core_web_sm")
tool = language_tool_python.LanguageTool('en-GB')


if __name__ == "__main__":
    app.run(debug=True)








