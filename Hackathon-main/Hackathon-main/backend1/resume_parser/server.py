from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends
from pdfminer.high_level import extract_text
from together import Together
from fastapi.middleware.cors import CORSMiddleware
import json
from typing import Dict, Any, Optional
import logging
from dotenv import load_dotenv
import os
import tempfile

load_dotenv() 

api_key = os.getenv("TOGETHER_API_KEY")

# Set up logging with more detail
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Resume Parser API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Together(api_key=api_key)

def extract_text_from_pdf(pdf_path: str) -> str:
    try:
        text = extract_text(pdf_path)
        logger.info(f"Successfully extracted {len(text)} characters from PDF")
        return text
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to extract text from PDF: {str(e)}")

def extract_details_with_llm(text: str) -> Dict[str, Any]:
    prompt = f"""
    You are a resume parser. Your task is to extract information from the resume text below and format it as a JSON object.
    
    Rules:
    1. Return ONLY a valid JSON object
    2. Do not include any explanatory text or markdown formatting
    3. Ensure all fields are properly formatted
    4. Use empty strings or arrays for missing information
    
    Required JSON structure:
    {{
        "name": "string",
        "phone": "string",
        "email": "string",
        "skills": ["skill1", "skill2", ...],
        "achievements": ["achievement1", "achievement2", ...],
        "work_experience": [
            {{
                "company": "string",
                "role": "string",
                "duration": "string"
            }}
        ]
    }}

    Resume Text:
    {text}
    """

    try:
        logger.info("Sending request to LLM")
        response = client.chat.completions.create(
            model="meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo-128K",
            messages=[
                {
                    "role": "system", 
                    "content": "You are a resume parser that only outputs valid JSON. Never include explanatory text or markdown formatting."
                },
                {"role": "user", "content": prompt}
            ],
            temperature=0.1,
            max_tokens=2000
        )
        
        response_text = response.choices[0].message.content
        logger.info("Received response from LLM")
        
        # Clean the response text
        response_text = response_text.strip()
        if response_text.startswith("```json"):
            response_text = response_text[7:-3].strip()
        elif response_text.startswith("```"):
            response_text = response_text[3:-3].strip()
            
        logger.info(f"Cleaned response text: {response_text[:100]}...")  # Log first 100 chars
            
        try:
            parsed_data = json.loads(response_text)
            logger.info("Successfully parsed JSON response")
            return parsed_data
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON response: {response_text}")
            logger.error(f"JSON parse error: {str(e)}")
            raise HTTPException(
                status_code=500, 
                detail="Failed to parse resume data. Invalid JSON format received from LLM."
            )
            
    except Exception as e:
        logger.error(f"Error in LLM processing: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to process resume with LLM: {str(e)}"
        )

@app.get("/")
async def root():
    """Root endpoint that provides API information"""
    return {
        "message": "Resume Parser API",
        "endpoints": {
            "/": "This information",
            "/extract": "Extract information from resume (POST with file)",
            "/": "Upload and extract information from resume (alternate endpoint)"
        },
        "status": "running"
    }

@app.post("/extract")
async def extract_resume(
    file: UploadFile = File(...),
    file_name: Optional[str] = Form(None),
    file_size: Optional[str] = Form(None),
    file_type: Optional[str] = Form(None),
    file_last_modified: Optional[str] = Form(None)
):
    """
    Extract information from an uploaded resume PDF file
    Can accept additional metadata about the file
    """
    try:
        # Log file metadata if provided
        if file_name:
            logger.info(f"File metadata - Name: {file_name}")
        if file_size:
            logger.info(f"File metadata - Size: {file_size} bytes")
        if file_type:
            logger.info(f"File metadata - Type: {file_type}")
        if file_last_modified:
            logger.info(f"File metadata - Last Modified: {file_last_modified}")
            
        logger.info(f"Processing uploaded file: {file.filename}")
        
        # Check if the file is a PDF
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        # Create a temporary file to store the uploaded PDF
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            # Write uploaded file content to the temporary file
            content = await file.read()
            temp_file.write(content)
            temp_path = temp_file.name
        
        logger.info(f"Saved uploaded file to temporary location: {temp_path}")
        
        try:
            # Extract text from PDF
            text = extract_text_from_pdf(temp_path)
            if not text.strip():
                raise HTTPException(status_code=400, detail="Extracted text is empty")
            
            logger.info(f"Extracted text length: {len(text)}")
            
            # Process with LLM
            extracted_data = extract_details_with_llm(text)
            
            # Add file metadata to response if provided
            if file_name or file_size or file_type or file_last_modified:
                extracted_data["file_metadata"] = {
                    "name": file_name or file.filename,
                    "size": file_size,
                    "type": file_type,
                    "last_modified": file_last_modified
                }
                
            logger.info("Successfully extracted resume data")
            return extracted_data
            
        finally:
            # Ensure the temporary file is deleted even if an exception occurs
            if os.path.exists(temp_path):
                os.unlink(temp_path)
                logger.info(f"Cleaned up temporary file: {temp_path}")
                
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Unexpected error processing file: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Internal server error: {str(e)}"
        )

# Keep the upload-resume endpoint for compatibility
@app.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...),
    file_name: Optional[str] = Form(None),
    file_size: Optional[str] = Form(None),
    file_type: Optional[str] = Form(None),
    file_last_modified: Optional[str] = Form(None)
):
    """
    Upload and extract information from a resume PDF file
    This is an alternate endpoint that does the same as /extract
    """
    return await extract_resume(file, file_name, file_size, file_type, file_last_modified)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")