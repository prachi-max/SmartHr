from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from models import JobStatus

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class JobCreate(BaseModel):
    company: str
    role: str
    status: Optional[JobStatus] = JobStatus.applied
    job_url: Optional[str] = None
    job_description: Optional[str] = None
    notes: Optional[str] = None
    contact_name: Optional[str] = None
    contact_email: Optional[str] = None
    deadline: Optional[datetime] = None

class JobUpdate(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    status: Optional[JobStatus] = None
    job_url: Optional[str] = None
    job_description: Optional[str] = None
    notes: Optional[str] = None
    contact_name: Optional[str] = None
    contact_email: Optional[str] = None
    deadline: Optional[datetime] = None

class JobOut(BaseModel):
    id: int
    company: str
    role: str
    status: JobStatus
    job_url: Optional[str]
    job_description: Optional[str]
    notes: Optional[str]
    contact_name: Optional[str]
    contact_email: Optional[str]
    applied_date: datetime
    deadline: Optional[datetime]
    class Config:
        from_attributes = True

class AIRequest(BaseModel):
    resume_text: str
    job_description: str
