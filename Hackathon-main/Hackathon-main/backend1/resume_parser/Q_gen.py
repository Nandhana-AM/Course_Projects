from json import loads, dumps
import asyncio
from together import Together
from dotenv import load_dotenv
import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from functools import wraps
import re

load_dotenv()

api_key = os.getenv("TOGETHER_API_KEY")
client = Together(api_key=api_key)

# Flask setup

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})  # Allow requests from your frontend

# Helper for running async functions in Flask
def async_route(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        return asyncio.run(f(*args, **kwargs))
    return wrapper

async def generate_interview_questions(match_results):
    """
    Generate tailored interview questions based on resume-job analysis results
    
    Args:
        match_results: JSON object containing the match analysis between resume and job
    
    Returns:
        JSON object with interview questions by category
    """
    # Extract key information from match results
    try:
        matching_skills = match_results["skills_analysis"]["matching_skills"]
        missing_skills = match_results["skills_analysis"]["missing_skills"]
        key_achievement_matches = match_results["achievement_analysis"]["key_matches"]
        growth_areas = match_results["achievement_analysis"]["growth_areas"]
        job_requirements = match_results["job_requirements"]
        
        # Extract responsibilities specifically for AI/ML internship context
        responsibilities = job_requirements.get("responsibilities", [])
    
        prompt = f"""
        You are an expert technical interviewer with deep domain knowledge about AI, Machine Learning, Data Science, NLP, and database systems.

        # Analysis Context
        The candidate has applied for an AI/ML internship with the following requirements:
        - Skills: {json.dumps(job_requirements.get('skills', []))}
        - Responsibilities: {json.dumps(responsibilities)}
        - Overall match score: {match_results.get('overall_score', 'Not specified')}

        # Candidate Profile
        The candidate's profile shows:
        - Skills they match: {json.dumps(matching_skills)}
        - Skills they're missing: {json.dumps(missing_skills)}
        - Key achievement matches: {json.dumps(key_achievement_matches)}
        - Growth areas: {json.dumps(growth_areas)}

        # Task
        Generate exactly 5 interview questions in total:
        1. 3 questions on their existing skills (focus on: {', '.join(matching_skills)})
        2. 2 questions on growth areas or missing skills (focus on: {', '.join(missing_skills)})

        Make sure your questions are specifically tailored to assess:
        - Their ability to work on AI pipelines for document processing
        - Their experience with vector search concepts (even if they haven't used FAISS)
        - Their understanding of LLM workflows and chains
        - Their capabilities in data handling across structured/unstructured data
        - Their approach to rapid experimentation with AI models

        # Required Output
        Return ONLY a valid JSON object with this structure (no extra text):
        {{
          "existing_skills": [
            {{
              "skill": "string",
              "question": "string",
              "rationale": "string",
              "assessment_guidance": "string"
            }}
          ],
          "growth_areas": [
            {{
              "skill": "string",
              "question": "string",
              "rationale": "string",
              "assessment_guidance": "string"
            }}
          ],
          "interview_approach_advice": "string"
        }}
        """

        response = client.chat.completions.create(
            model="meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo-128K",
            messages=[
                {"role": "system", "content": "You are an expert technical interviewer that provides precise, structured JSON responses with no additional text."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
            max_tokens=5000
        )

        # Extract response text
        response_text = response.choices[0].message.content.strip()
        
        # Handle potential markdown code block wrapping
        if response_text.startswith("```json"):
            response_text = response_text[7:-3].strip()
        elif response_text.startswith("```"):
            response_text = response_text[3:-3].strip()
            
        # Parse JSON response
        try:
            parsed_response = json.loads(response_text)
            return parsed_response
        except json.JSONDecodeError as e:
            print(f"❌ JSON parsing error: {str(e)}")
            print(f"Raw response: {response_text}")
            # Fallback to a basic structure
            return {
                "existing_skills": [
                    {
                        "skill": "Artificial Intelligence",
                        "question": "Can you explain your experience with AI models and how you've applied them in your projects?",
                        "rationale": "Assesses practical AI experience",
                        "assessment_guidance": "Look for concrete examples and understanding of AI concepts"
                    }
                ],
                "growth_areas": [
                    {
                        "skill": "Natural Language Processing",
                        "question": "How would you approach implementing an NLP pipeline for document classification?",
                        "rationale": "Tests theoretical knowledge of NLP",
                        "assessment_guidance": "Evaluate their general understanding of NLP concepts"
                    }
                ],
                "interview_approach_advice": "Focus on assessing potential and willingness to learn"
            }

    except Exception as e:
        print(f"❌ Error generating interview questions: {str(e)}")
        return {"error": f"Failed to generate interview questions: {str(e)}"}

async def generate_preparation_advice(interview_questions, match_results):
    """
    Generate preparation advice for the identified growth areas and missing skills
    
    Args:
        interview_questions: The generated interview questions
        match_results: The resume-job match analysis
        
    Returns:
        JSON object with preparation advice
    """
    try:
        missing_skills = match_results["skills_analysis"]["missing_skills"]
        growth_areas = match_results["achievement_analysis"]["growth_areas"]
        responsibilities = match_results["job_requirements"].get("responsibilities", [])
        
        prompt = f"""
        You are an expert career coach specializing in AI/ML technical interview preparation for internships.

        # Growth Areas Identified
        Missing skills: {json.dumps(missing_skills)}
        General growth areas: {json.dumps(growth_areas)}
        
        # Job Responsibilities
        {json.dumps(responsibilities)}

        # Task
        Create a preparation plan to help the candidate address these growth areas before their AI/ML internship interview.
        Focus on practical advice for:
        1. Natural Language Processing (NLP)
        2. PostgreSQL database skills
        3. AI pipelines for document processing
        4. Vector search implementation and optimization
        5. LLM workflow development

        Include specific tutorials, projects, courses, and GitHub repos they should explore.
        Provide talking points they can use to address their lack of direct experience.

        # Required Output Format
        Return ONLY a valid JSON object with this exact structure (no extra text):
        {{
          "preparation_advice": [
            {{
              "skill_or_area": "NLP",
              "short_term_preparation": "Complete HuggingFace NLP course",
              "long_term_development": "Build a document classifier",
              "resources": ["Resource 1", "Resource 2"],
              "talking_points": ["Point 1", "Point 2"]
            }}
          ],
          "general_strategies": "Focus on learning fundamentals",
          "practice_project_ideas": ["Project 1", "Project 2"]
        }}

        The JSON must be valid with proper commas, quotes, and brackets.
        """

        response = client.chat.completions.create(
            model="meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo-128K",
            messages=[
                {"role": "system", "content": "You are an expert career coach that provides precise, structured JSON responses with no additional text."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
            max_tokens=5000
        )

        # Extract response text
        response_text = response.choices[0].message.content.strip()
        
        # Handle potential markdown code block wrapping
        if response_text.startswith("```json"):
            response_text = response_text[7:-3].strip()
        elif response_text.startswith("```"):
            response_text = response_text[3:-3].strip()
        
        # Try to fix common JSON errors
        try:
            # Fix trailing commas - a common error in LLM-generated JSON
            response_text = re.sub(r',\s*([}\]])', r'\1', response_text)
            # Ensure proper quotes around property names
            response_text = re.sub(r'([{,]\s*)([a-zA-Z0-9_]+)(\s*:)', r'\1"\2"\3', response_text)
            
            # Parse JSON response
            parsed_response = json.loads(response_text)
            return parsed_response
        except json.JSONDecodeError as e:
            print(f"❌ JSON parsing error: {str(e)}")
            print(f"Raw response: {response_text}")
            # Fallback to a basic structure with meaningful preparation advice
            return {
                "preparation_advice": [
                    {
                        "skill_or_area": "Natural Language Processing (NLP)",
                        "short_term_preparation": "Complete Hugging Face NLP course (free) to understand transformer models and basic NLP tasks",
                        "long_term_development": "Build a document classification system using spaCy or Hugging Face transformers",
                        "resources": [
                            "Hugging Face NLP Course: https://huggingface.co/learn/nlp-course",
                            "spaCy Tutorial: https://spacy.io/usage/spacy-101",
                            "NLP with Python's NLTK: https://www.nltk.org/book/"
                        ],
                        "talking_points": [
                            "I've been studying NLP fundamentals through Hugging Face's course",
                            "I understand how transformer models work for text processing"
                        ]
                    },
                    {
                        "skill_or_area": "PostgreSQL",
                        "short_term_preparation": "Complete PostgreSQL Bootcamp on Udemy or Coursera",
                        "long_term_development": "Build a project that stores and retrieves vector embeddings in PostgreSQL",
                        "resources": [
                            "PostgreSQL Tutorial: https://www.postgresqltutorial.com/",
                            "PostgreSQL for Everybody Specialization on Coursera",
                            "pgvector extension documentation for vector storage"
                        ],
                        "talking_points": [
                            "I've worked with relational databases and understand SQL fundamentals",
                            "I'm familiar with how vector databases work for ML applications"
                        ]
                    }
                ],
                "general_strategies": "Focus on quick wins by building small projects that demonstrate your ability to learn. Emphasize transferable skills from your work with geofencing systems and problem-solving. Be honest about gaps but show enthusiasm and concrete steps you're taking to address them.",
                "practice_project_ideas": [
                    "Build a simple document retrieval system using Python, FAISS and basic PDF processing",
                    "Create a PostgreSQL database to store embeddings and implement basic vector search",
                    "Develop a small-scale LLM chain using LangChain or LlamaIndex for a specific use case"
                ]
            }

    except Exception as e:
        print(f"❌ Error generating preparation advice: {str(e)}")
        return {"error": f"Failed to generate preparation advice: {str(e)}"}

@app.route("/generate-interview-questions", methods=["POST"])
@async_route
async def generate_interview_materials():
    """
    API endpoint to generate interview questions and preparation advice
    
    Request body should include the match_results from the resume analysis
    """
    try:
        # Get match results from request body
        data = request.get_json()
        match_results = data.get("match_results")
        
        if not match_results:
            return jsonify({"status": "error", "message": "Match results are required"}), 400
        
        # Generate interview questions
        questions = await generate_interview_questions(match_results)
        
        # Generate preparation advice based on questions and match results
        preparation = await generate_preparation_advice(questions, match_results)
        
        return jsonify({
            "status": "success",
            "interview_materials": {
                "questions": questions,
                "preparation": preparation
            }
        })
        
    except Exception as e:
        print(f"❌ Error processing request: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

# For integration with your existing code
async def process_match_results(match_results):
    """
    Main function to process match results and generate interview materials
    
    Args:
        match_results: JSON object containing the match analysis
        
    Returns:
        JSON object with interview questions and preparation guide
    """
    # Generate interview questions
    interview_questions = await generate_interview_questions(match_results)
    preparation_guide = await generate_preparation_advice(interview_questions, match_results)
    return {"interview_questions": interview_questions, "candidate_preparation": preparation_guide}

# For testing with the provided sample data
async def test_with_provided_sample_data():
    # Sample match_results provided by user
    sample_match_results = {
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
    }
    
    print("\n=== Running test with provided sample data ===")
    
    # Generate interview questions
    print("Generating interview questions...")
    interview_questions = await generate_interview_questions(sample_match_results)
    print("\n=== Generated Interview Questions ===")
    print(json.dumps(interview_questions, indent=2))
    
    # Generate preparation advice
    print("\nGenerating preparation advice...")
    preparation_advice = await generate_preparation_advice(interview_questions, sample_match_results)
    print("\n=== Generated Preparation Advice ===")
    print(json.dumps(preparation_advice, indent=2))
    
    return {"interview_questions": interview_questions, "preparation_advice": preparation_advice}

if __name__ == "__main__":
    # Choose one of these based on your needs:
    
    # Option 1: Run the Flask API standalone
    #app.run(port=5001, debug=True)
    
    # Option 2: Test with the sample data provided
    asyncio.run(test_with_provided_sample_data())