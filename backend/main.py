from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, SQLModel, create_engine, select
from typing import List
from models import Team, Technician, Equipment, MaintenanceRequest, User, WorkCenter, EquipmentCategory
from auth import get_password_hash, verify_password, create_access_token, get_current_user, generate_reset_token, send_reset_email
from database import get_session, create_db_and_tables, engine
import os
from datetime import datetime, timedelta
from pydantic import BaseModel

# Database Setup handled in database.py

app = FastAPI(title="GearGuard API")

# CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    with Session(engine) as session:
        if session.exec(select(Team)).first() is None:
            seed_data(session)
        if session.exec(select(User)).first() is None:
            admin_user = User(
                username="admin", 
                email="admin@gearguard.com", 
                hashed_password=get_password_hash("admin123"),
                role="admin"
            )
            session.add(admin_user)
            session.commit()

def seed_data(session: Session):
    # Initial Teams
    mechanics = Team(name="Mechanics", leader="John Doe", members_count=5)
    electricians = Team(name="Electricians", leader="Sarah Sparks", members_count=3)
    it_support = Team(name="IT Support", leader="Alan Turing", members_count=4)
    session.add_all([mechanics, electricians, it_support])
    session.commit()

    # Initial Technicians
    t1 = Technician(name="Mike Tools", avatar="https://i.pravatar.cc/150?u=1", team_id=mechanics.id)
    t2 = Technician(name="Alice Volt", avatar="https://i.pravatar.cc/150?u=2", team_id=electricians.id)
    t3 = Technician(name="Kevin Byte", avatar="https://i.pravatar.cc/150?u=3", team_id=it_support.id)
    session.add_all([t1, t2, t3])
    session.commit()
    # Initial Work Centers
    wc1 = WorkCenter(name="Assembly 1", code="ASSEM/01", tag="Line A", capacity_time=1.0, time_efficiency=100.0, oee_target=94.59)
    wc2 = WorkCenter(name="Drill 1", code="DRILL/01", tag="Line B", capacity_time=1.0, time_efficiency=100.0, oee_target=90.00)
    session.add_all([wc1, wc2])
    session.commit()

    # Initial Equipment Categories
    cat1 = EquipmentCategory(name="Computers", company="My Company (San Francisco)")
    cat2 = EquipmentCategory(name="Software", company="My Company (San Francisco)")
    cat3 = EquipmentCategory(name="Monitors", company="My Company (San Francisco)")
    session.add_all([cat1, cat2, cat3])
    session.commit()

    # Initial Equipment
    e1 = Equipment(
        name="CNC Machine 01", 
        serial_number="MT/125/222", 
        purchase_date="2022-05-10", 
        warranty="2025-05-10", 
        location="Shop Floor A", 
        department="Production", 
        employee="Tejas Modi",
        team_id=mechanics.id,
        technician_id=t1.id,
        company="Gear Guard Industries"
    )
    e2 = Equipment(
        name="Samsung Monitor 15\"", 
        serial_number="IT/SR/012", 
        purchase_date="2023-01-15", 
        warranty="2024-01-15", 
        location="Office 201", 
        department="Admin", 
        employee="Tejas Modi",
        team_id=it_support.id,
        technician_id=t3.id,
        company="Gear Guard Admin Office",
        category_id=cat3.id
    )
    session.add_all([e1, e2])
    session.commit()

# --- Auth Endpoints ---

@app.post("/api/auth/register", response_model=User)
def register(user: User, session: Session = Depends(get_session)):
    # Check if username exists
    existing_username = session.exec(select(User).where(User.username == user.username)).first()
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # Check if email exists (duplicate check)
    existing_email = session.exec(select(User).where(User.email == user.email)).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Validate password complexity
    password = user.hashed_password  # This is the plain password before hashing
    
    # Check password length (more than 8 characters)
    if len(password) <= 8:
        raise HTTPException(
            status_code=400, 
            detail="Password must be more than 8 characters"
        )
    
    # Check for at least one lowercase letter
    if not any(c.islower() for c in password):
        raise HTTPException(
            status_code=400, 
            detail="Password must contain at least one lowercase letter"
        )
    
    # Check for at least one uppercase letter
    if not any(c.isupper() for c in password):
        raise HTTPException(
            status_code=400, 
            detail="Password must contain at least one uppercase letter"
        )
    
    # Check for at least one special character
    special_characters = "!@#$%^&*()_+-=[]{}|;:,.<>?/"
    if not any(c in special_characters for c in password):
        raise HTTPException(
            status_code=400, 
            detail="Password must contain at least one special character"
        )
    
    # Hash the password after validation
    user.hashed_password = get_password_hash(password)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@app.post("/api/auth/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    # Check if user exists
    user = session.exec(select(User).where(User.email == form_data.username)).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account not exist",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify password
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer", "username": user.username, "role": user.role}

@app.get("/api/auth/me")
def read_users_me(current_user: str = Depends(get_current_user), session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == current_user)).first()
    return user

# --- Password Reset Endpoints ---

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class VerifyTokenRequest(BaseModel):
    token: str

@app.post("/api/auth/forgot-password")
def forgot_password(request: ForgotPasswordRequest, session: Session = Depends(get_session)):
    """Request a password reset email"""
    user = session.exec(select(User).where(User.email == request.email)).first()
    
    # For security, always return success even if email doesn't exist
    # This prevents email enumeration attacks
    if user:
        # Generate reset token
        reset_token = generate_reset_token()
        user.reset_token = reset_token
        user.reset_token_expires = datetime.utcnow() + timedelta(hours=1)
        session.add(user)
        session.commit()
        
        # Send reset email
        send_reset_email(user.email, reset_token)
    
    return {"message": "If your email is registered, you will receive a password reset link."}

@app.post("/api/auth/verify-reset-token")
def verify_reset_token(request: VerifyTokenRequest, session: Session = Depends(get_session)):
    """Verify if a reset token is valid"""
    user = session.exec(select(User).where(User.reset_token == request.token)).first()
    
    if not user:
        raise HTTPException(status_code=400, detail="Invalid reset token")
    
    if user.reset_token_expires < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Reset token has expired")
    
    return {"valid": True, "email": user.email}

@app.post("/api/auth/reset-password")
def reset_password(request: ResetPasswordRequest, session: Session = Depends(get_session)):
    """Reset password using a valid token"""
    user = session.exec(select(User).where(User.reset_token == request.token)).first()
    
    if not user:
        raise HTTPException(status_code=400, detail="Invalid reset token")
    
    if user.reset_token_expires < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Reset token has expired")
    
    # Update password
    user.hashed_password = get_password_hash(request.new_password)
    # Clear reset token
    user.reset_token = None
    user.reset_token_expires = None
    session.add(user)
    session.commit()
    
    return {"message": "Password has been reset successfully"}

# --- API Endpoints ---

@app.get("/api/teams", response_model=List[Team])
def get_teams(session: Session = Depends(get_session)):
    return session.exec(select(Team)).all()

@app.get("/api/technicians", response_model=List[Technician])
def get_technicians(session: Session = Depends(get_session)):
    return session.exec(select(Technician)).all()

@app.get("/api/equipment-categories", response_model=List[EquipmentCategory])
def get_equipment_categories(session: Session = Depends(get_session)):
    return session.exec(select(EquipmentCategory)).all()

@app.post("/api/equipment-categories", response_model=EquipmentCategory)
def create_equipment_category(cat: EquipmentCategory, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    session.add(cat)
    session.commit()
    session.refresh(cat)
    return cat

@app.put("/api/equipment-categories/{cat_id}", response_model=EquipmentCategory)
def update_equipment_category(cat_id: int, cat: EquipmentCategory, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    db_cat = session.get(EquipmentCategory, cat_id)
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found")
    cat_data = cat.dict(exclude_unset=True)
    for key, value in cat_data.items():
        setattr(db_cat, key, value)
    session.add(db_cat)
    session.commit()
    session.refresh(db_cat)
    return db_cat

@app.delete("/api/equipment-categories/{cat_id}")
def delete_equipment_category(cat_id: int, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    db_cat = session.get(EquipmentCategory, cat_id)
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found")
    session.delete(db_cat)
    session.commit()
    return {"ok": True}
@app.get("/api/work-centers", response_model=List[WorkCenter])
def get_work_centers(session: Session = Depends(get_session)):
    return session.exec(select(WorkCenter)).all()

@app.post("/api/work-centers", response_model=WorkCenter)
def create_work_center(wc: WorkCenter, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    session.add(wc)
    session.commit()
    session.refresh(wc)
    return wc

@app.put("/api/work-centers/{wc_id}", response_model=WorkCenter)
def update_work_center(wc_id: int, wc: WorkCenter, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    db_wc = session.get(WorkCenter, wc_id)
    if not db_wc:
        raise HTTPException(status_code=404, detail="Work Center not found")
    wc_data = wc.dict(exclude_unset=True)
    for key, value in wc_data.items():
        setattr(db_wc, key, value)
    session.add(db_wc)
    session.commit()
    session.refresh(db_wc)
    return db_wc

@app.delete("/api/work-centers/{wc_id}")
def delete_work_center(wc_id: int, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    db_wc = session.get(WorkCenter, wc_id)
    if not db_wc:
        raise HTTPException(status_code=404, detail="Work Center not found")
    session.delete(db_wc)
    session.commit()
    return {"ok": True}

@app.post("/api/teams", response_model=Team)
def create_team(team: Team, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can create teams")
    session.add(team)
    session.commit()
    session.refresh(team)
    return team

@app.put("/api/teams/{team_id}", response_model=Team)
def update_team(team_id: int, team: Team, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can update teams")
    db_team = session.get(Team, team_id)
    if not db_team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    team_data = team.dict(exclude_unset=True)
    for key, value in team_data.items():
        setattr(db_team, key, value)
    
    session.add(db_team)
    session.commit()
    session.refresh(db_team)
    return db_team

@app.delete("/api/teams/{team_id}")
def delete_team(team_id: int, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can delete teams")
    db_team = session.get(Team, team_id)
    if not db_team:
        raise HTTPException(status_code=404, detail="Team not found")
    session.delete(db_team)
    session.commit()
    return {"ok": True}

@app.post("/api/technicians", response_model=Technician)
def create_technician(tech: Technician, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    session.add(tech)
    session.commit()
    session.refresh(tech)
    return tech

@app.put("/api/technicians/{tech_id}", response_model=Technician)
def update_technician(tech_id: int, tech: Technician, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    db_tech = session.get(Technician, tech_id)
    if not db_tech:
        raise HTTPException(status_code=404, detail="Technician not found")
    
    tech_data = tech.dict(exclude_unset=True)
    for key, value in tech_data.items():
        setattr(db_tech, key, value)
    
    session.add(db_tech)
    session.commit()
    session.refresh(db_tech)
    return db_tech

@app.delete("/api/technicians/{tech_id}")
def delete_technician(tech_id: int, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    db_tech = session.get(Technician, tech_id)
    if not db_tech:
        raise HTTPException(status_code=404, detail="Technician not found")
    session.delete(db_tech)
    session.commit()
    return {"ok": True}

@app.get("/api/equipment", response_model=List[Equipment])
def get_equipment(session: Session = Depends(get_session)):
    return session.exec(select(Equipment)).all()

@app.get("/api/requests", response_model=List[MaintenanceRequest])
def get_requests(session: Session = Depends(get_session)):
    return session.exec(select(MaintenanceRequest)).all()

@app.post("/api/requests", response_model=MaintenanceRequest)
def create_request(request: MaintenanceRequest, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    # Any authenticated user can create a request
    session.add(request)
    session.commit()
    session.refresh(request)
    return request

@app.post("/api/equipment", response_model=Equipment)
def create_equipment(equipment: Equipment, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    session.add(equipment)
    session.commit()
    session.refresh(equipment)
    return equipment

@app.put("/api/equipment/{equipment_id}", response_model=Equipment)
def update_equipment(equipment_id: int, item: Equipment, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    db_item = session.get(Equipment, equipment_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Equipment not found")
    
    item_data = item.dict(exclude_unset=True)
    for key, value in item_data.items():
        setattr(db_item, key, value)
    
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item

@app.delete("/api/equipment/{equipment_id}")
def delete_equipment(equipment_id: int, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    db_item = session.get(Equipment, equipment_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Equipment not found")
    session.delete(db_item)
    session.commit()
    return {"ok": True}

@app.put("/api/requests/{request_id}", response_model=MaintenanceRequest)
def update_request(request_id: int, req: MaintenanceRequest, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role not in ["admin", "manager", "technician"]:
         raise HTTPException(status_code=403, detail="Insufficient permissions")
    db_req = session.get(MaintenanceRequest, request_id)
    if not db_req:
        raise HTTPException(status_code=404, detail="Request not found")
    
    req_data = req.dict(exclude_unset=True)
    for key, value in req_data.items():
        setattr(db_req, key, value)
    
    session.add(db_req)
    session.commit()
    session.refresh(db_req)
    return db_req

@app.put("/api/requests/{request_id}/stage", response_model=MaintenanceRequest)
def update_stage(request_id: int, stage: str, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role not in ["admin", "manager", "technician"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    db_request = session.get(MaintenanceRequest, request_id)
    if not db_request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    db_request.stage = stage
    
    # Scrap logic
    if stage == "Scrap":
        equipment = session.get(Equipment, db_request.equipment_id)
        if equipment:
            equipment.status = "scrapped"
            session.add(equipment)
            
    session.add(db_request)
    session.commit()
    session.refresh(db_request)
    session.refresh(db_request)
    return db_request

@app.delete("/api/requests/{request_id}")
def delete_request(request_id: int, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    db_req = session.get(MaintenanceRequest, request_id)
    if not db_req:
        raise HTTPException(status_code=404, detail="Request not found")
    session.delete(db_req)
    session.commit()
    return {"ok": True}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
