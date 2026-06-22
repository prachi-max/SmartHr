from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from auth import get_current_user
import models, schemas
from scraper import scrape_job_url

router = APIRouter()

@router.get("/", response_model=List[schemas.JobOut])
def get_jobs(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Job).filter(models.Job.user_id == current_user.id).order_by(models.Job.applied_date.desc()).all()

@router.post("/", response_model=schemas.JobOut, status_code=201)
def create_job(job: schemas.JobCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    new_job = models.Job(**job.dict(), user_id=current_user.id)
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job

@router.put("/{job_id}", response_model=schemas.JobOut)
def update_job(job_id: int, job: schemas.JobUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    existing = db.query(models.Job).filter(models.Job.id == job_id, models.Job.user_id == current_user.id).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Job not found")
    for key, value in job.dict(exclude_unset=True).items():
        setattr(existing, key, value)
    db.commit()
    db.refresh(existing)
    return existing

@router.delete("/{job_id}", status_code=204)
def delete_job(job_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    job = db.query(models.Job).filter(models.Job.id == job_id, models.Job.user_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    db.delete(job)
    db.commit()

@router.get("/stats")
def get_stats(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    jobs = db.query(models.Job).filter(models.Job.user_id == current_user.id).all()
    status_counts = {}
    for job in jobs:
        status_counts[job.status.value] = status_counts.get(job.status.value, 0) + 1
    return {"total": len(jobs), "by_status": status_counts}

@router.post("/scrape")
def scrape(url: dict):
    job_url = url.get("url", "")
    if not job_url:
        raise HTTPException(status_code=400, detail="URL is required")
    result = scrape_job_url(job_url)
    return result
