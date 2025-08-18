import { useState } from 'react';


interface AnalysisResponse {
  sucess: boolean;
  ats_score: number;
  cv_feedback: {
    missing_sctions: string[];
    found_keywords: string[];
    missing_keywords: string[];
    grammar_issues: string[];
  };
}

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Please select a PDF file');
        return;
      }
      setFile(selectedFile);
      setError(null);
      console.log('File selected:', selectedFile.name, 'Size:', selectedFile.size);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('resume', file);

    console.log('Sending request to backend...');
    console.log('File being sent:', file.name, 'Size:', file.size);

    try {
      const response = await fetch('http://localhost:5001/analyse', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResult(data);
    } catch (err) {
      console.error('Error details:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
        Resume Analyzer
      </h1>
      
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
        Upload your PDF resume to get ATS optimization feedback
      </p>

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <div style={{ 
          border: '2px dashed #ccc', 
          padding: '40px', 
          textAlign: 'center', 
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            style={{ marginBottom: '10px' }}
          />
          <p style={{ color: '#666', fontSize: '14px' }}>
            {file ? `Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)` : 'Choose a PDF file'}
          </p>
        </div>

        <button
          type="submit"
          disabled={!file || loading}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            width: '100%'
          }}
        >
          {loading ? 'Analysing...' : 'Analyse Resume'}
        </button>
      </form>

      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '15px',
          borderRadius: '4px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
          <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>
            Analysis Results
          </h2>

          {/* ATS Score */}
          <div style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '10px', color: '#333' }}>ATS Score</h3>
            <div style={{ 
              fontSize: '48px', 
              fontWeight: 'bold', 
              color: '#007bff',
              marginBottom: '10px'
            }}>
              {result.ats_score}/100
            </div>
            <div style={{ 
              width: '100%', 
              backgroundColor: '#e9ecef', 
              borderRadius: '10px', 
              height: '20px',
              marginBottom: '10px'
            }}>
              <div style={{
                width: `${result.ats_score}%`,
                backgroundColor: result.ats_score >= 80 ? '#28a745' : 
                               result.ats_score >= 60 ? '#ffc107' : '#dc3545',
                height: '100%',
                borderRadius: '10px',
                transition: 'width 1s ease-in-out'
              }}></div>
            </div>
            <p style={{ color: '#666', fontSize: '14px' }}>
              {result.ats_score >= 80 ? 'Excellent! Your resume is well-optimized.' :
               result.ats_score >= 60 ? 'Good! Your resume has room for improvement.' :
               'Your resume needs significant optimization.'}
            </p>
          </div>

          {/* Feedback Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {/* Found Keywords */}
            {result.cv_feedback.found_keywords.length > 0 && (
              <div style={{ 
                backgroundColor: 'white', 
                padding: '20px', 
                borderRadius: '8px'
              }}>
                <h3 style={{ marginBottom: '15px', color: '#28a745' }}>✅ Strong Skills Found</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {result.cv_feedback.found_keywords.map((keyword, index) => (
                    <span key={index} style={{
                      backgroundColor: '#d4edda',
                      color: '#155724',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      border: '1px solid #c3e6cb'
                    }}>
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Keywords */}
            {result.cv_feedback.missing_keywords.length > 0 && (
              <div style={{ 
                backgroundColor: 'white', 
                padding: '20px', 
                borderRadius: '8px'
              }}>
                <h3 style={{ marginBottom: '15px', color: '#ffc107' }}>⚠️ Missing Keywords</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {result.cv_feedback.missing_keywords.map((keyword, index) => (
                    <span key={index} style={{
                      backgroundColor: '#fff3cd',
                      color: '#856404',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      border: '1px solid #ffeaa7'
                    }}>
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Grammar Issues */}
          {result.cv_feedback.grammar_issues.length > 0 && (
            <div style={{ 
              backgroundColor: 'white', 
              padding: '20px', 
              borderRadius: '8px', 
              marginTop: '20px'
            }}>
              <h3 style={{ marginBottom: '15px', color: '#007bff' }}>✍️ Grammar Suggestions</h3>
              <div style={{ display: 'grid', gap: '15px' }}>
                {result.cv_feedback.grammar_issues.map((issue, index) => (
                  <div key={index} style={{
                    backgroundColor: '#f8f9fa',
                    padding: '15px',
                    borderRadius: '6px',
                    borderLeft: '4px solid #007bff'
                  }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                      {issue.message}
                    </div>
                    {issue.suggestion && (
                      <div style={{ marginBottom: '8px' }}>
                        <span style={{ color: '#666' }}>Suggestion: </span>
                        <span style={{ color: '#28a745' }}>{issue.suggestion}</span>
                      </div>
                    )}
                    <div style={{ 
                      backgroundColor: '#fff',
                      padding: '10px',
                      borderRadius: '4px',
                      fontFamily: 'monospace',
                      fontSize: '14px'
                    }}>
                      {issue.context.substring(0, issue.context.indexOf(issue.error_word))}
                      <span style={{ 
                        backgroundColor: '#fff3cd',
                        textDecoration: 'underline' 
                      }}>
                        {issue.error_word}
                      </span>
                      {issue.context.substring(
                        issue.context.indexOf(issue.error_word) + issue.error_word.length
                      )}
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#6c757d', 
                      marginTop: '8px' 
                    }}>
                      Rule: {issue.rule_id}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing Sections */}
          {result.cv_feedback.missing_sctions.length > 0 && (
            <div style={{ 
              backgroundColor: 'white', 
              padding: '20px', 
              borderRadius: '8px', 
              marginTop: '20px'
            }}>
              <h3 style={{ marginBottom: '15px', color: '#dc3545' }}>❌ Missing Sections</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {result.cv_feedback.missing_sctions.map((section, index) => (
                  <span key={index} style={{
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    border: '1px solid #f5c6cb'
                  }}>
                    {section}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
