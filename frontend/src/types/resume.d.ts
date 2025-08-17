interface CVFeedback {
    missing_sctions: string[];
    found_keywords: string[];
    missing_keywords: string[];
    grammar_issues: string[];
}

interface AnalysisResponse {
    sucess: boolean;
    ats_score: number;
    cv_feedback: CVFeedback;
    error?: string;
}

