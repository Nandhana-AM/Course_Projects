export const MATCH_RESULTS = {
    'overall_score': 62.7, 
    'score_breakdown': {
      'skills_match': {'score': 66.7, 'weight': '40%'}, 
      'achievement_match': {'score': 60, 'weight': '60%'}
    }, 
    'skills_analysis': {
      'matching_skills': ['Artificial Intelligence', 'Data Science', 'Machine Learning', 'Python'], 
      'missing_skills': ['Natural Language Processing (NLP)', 'PostgreSQL']
    }, 
    'achievement_analysis': {
      'summary': "The candidate's achievements show some relevance to the job requirements, but there is a significant gap in technical complexity and impact.", 
      'key_matches': [
        'Developed a geofencing-based attendance management system (shows some relevance to data handling and rapid experimentation)', 
        'Improved Focus by 60-70% (indicates some level of problem-solving and analytical skills)'
      ], 
      'growth_areas': [
        'Lack of direct experience with AI pipelines, vector search improvements, and LLM workflows', 
        'No mention of PostgreSQL, Python, or NLP skills', 
        'Achievements lack technical complexity and impact, indicating a need for more challenging projects'
      ]
    }, 
    'job_requirements': {
      'skills': [
        'Artificial Intelligence', 'Data Science', 'Machine Learning', 
        'Natural Language Processing (NLP)', 'PostgreSQL', 'Python'
      ], 
      'responsibilities': [
        'Work on AI pipelines- process PDFs (OCR/VLM), parse, chunk and optimize retrieval', 
        'Work on vector search improvements- implement FAISS, finetune search relevance', 
        'LLM workflows - Build long-chain/llama index workflows for our pipelines', 
        'Work on data handling - structured and unstructured across our DBS', 
        'Work on rapid experimentation - with embedding models, LLMs, classifiers, etc.'
      ], 
      'qualifications': []
    }
  };
  
  // Sample interview materials data that would normally come from the API
  export const INTERVIEW_MATERIALS = {
    "questions": {
      "existing_skills": [
        {
          "skill": "Artificial Intelligence",
          "question": "Can you walk me through how you've applied AI concepts in your geofencing-based attendance management system?",
          "rationale": "Explores how the candidate has practically implemented AI concepts in their main project.",
          "assessment_guidance": "Look for understanding of AI fundamentals and how they were applied to solve real problems, even if the project wasn't primarily AI-focused."
        },
        {
          "skill": "Machine Learning",
          "question": "How would you design an experimentation framework to rapidly test different embedding models for document similarity?",
          "rationale": "Tests the candidate's theoretical knowledge of ML experimentation even without direct experience.",
          "assessment_guidance": "Evaluate their approach to structured experimentation, baseline establishment, and evaluation metrics."
        },
        {
          "skill": "Python",
          "question": "Describe how you would structure a Python pipeline to process documents from initial ingestion to making them searchable in a vector database.",
          "rationale": "Assesses Python knowledge in the context of document processing workflows.",
          "assessment_guidance": "Look for modular design thinking, understanding of data flow, and awareness of relevant Python libraries."
        }
      ],
      "growth_areas": [
        {
          "skill": "Natural Language Processing (NLP)",
          "question": "If you were asked to classify customer support documents into different categories, what NLP approach would you take?",
          "rationale": "Tests theoretical NLP knowledge even without hands-on experience.",
          "assessment_guidance": "Look for understanding of text preprocessing, feature extraction, embedding techniques, and classification approaches."
        }
      ]
    }
  };


