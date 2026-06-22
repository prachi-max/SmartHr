from fastapi import APIRouter, Depends, HTTPException
from auth import get_current_user
import models, schemas
import google.generativeai as genai
import os
import json

router = APIRouter()
genai.configure(api_key=os.getenv("GEMINI_API_KEY", ""))

@router.post("/analyze")
def analyze_resume(request: schemas.AIRequest, current_user: models.User = Depends(get_current_user)):
    if not os.getenv("GEMINI_API_KEY"):
        raise HTTPException(status_code=500, detail="Gemini API key not configured")
    try:
        # ✅ FIX 1: Updated to active model endpoint
        model = genai.GenerativeModel("gemini-2.5-flash")
        
        prompt = f"""
You are a resume coach helping a job seeker improve their application.

JOB DESCRIPTION:
{request.job_description}

CANDIDATE RESUME:
{request.resume_text}

Analyze and return a JSON response with exactly these keys:
1. "match_score": percentage (0-100) of how well the resume matches the JD
2. "missing_keywords": list of important keywords/skills from JD missing in resume
3. "strong_points": list of things in resume that match JD well
4. "suggestions": list of specific improvements to make
5. "summary": one sentence overall assessment
"""
        # ✅ FIX 2: Enforce strict native JSON formatting on Google's engine side
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        
        # Parse and return directly
        result = json.loads(response.text.strip())
        return result
        
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned invalid JSON formatting structure")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")
