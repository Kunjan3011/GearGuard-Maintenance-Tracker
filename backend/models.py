from typing import List, Optional
from sqlmodel import Field, Relationship, SQLModel, Session, create_engine, select
from datetime import date, datetime

class Team(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    leader: str
    members_count: int = 0
    technicians: List["Technician"] = Relationship(back_populates="team")

class Technician(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    avatar: str
    team_id: int = Field(foreign_key="team.id")
    team: Optional[Team] = Relationship(back_populates="technicians")

class WorkCenter(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    code: str = Field(index=True)
    tag: Optional[str] = None
    alternative_workcenters: Optional[str] = None
    cost_per_hour: float = 0.0
    capacity_time: float = 100.0
    time_efficiency: float = 100.0
    oee_target: float = 85.0

class EquipmentCategory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    responsible_user_id: Optional[int] = Field(default=None, foreign_key="user.id")
    company: Optional[str] = None
    
    # Optional: relationship to equipment
    equipment: List["Equipment"] = Relationship(back_populates="category")

class Equipment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    serial_number: str = Field(index=True)
    purchase_date: str
    warranty: str
    location: str
    department: str
    employee: str
    status: str = "operational" # operational, scrapped
    health: int = 100
    team_id: Optional[int] = Field(default=None, foreign_key="team.id")
    team: Optional[Team] = Relationship()
    technician_id: Optional[int] = Field(default=None, foreign_key="technician.id")
    technician: Optional["Technician"] = Relationship()
    company: Optional[str] = None # Company/Organization responsible for equipment
    category_id: Optional[int] = Field(default=None, foreign_key="equipmentcategory.id")
    category: Optional[EquipmentCategory] = Relationship(back_populates="equipment")

class MaintenanceRequest(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    subject: str
    equipment_id: Optional[int] = Field(default=None, foreign_key="equipment.id")
    work_center_id: Optional[int] = Field(default=None, foreign_key="workcenter.id")
    type: str # Corrective, Preventive
    stage: str = "New" # New, In Progress, Repaired, Scrap
    scheduled_date: str
    duration: float = 0.0
    technician_id: Optional[int] = Field(default=None, foreign_key="technician.id")
    team_id: Optional[int] = Field(default=None, foreign_key="team.id")
    priority: str = "Medium" # Low, Medium, High
    company: Optional[str] = None # Company/Organization responsible for maintenance
    worksheet_notes: Optional[str] = None # Technical notes for the worksheet

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    email: str = Field(unique=True)
    hashed_password: str
    role: str = "technician"  # technician, admin
    reset_token: Optional[str] = Field(default=None)
    reset_token_expires: Optional[datetime] = Field(default=None)
