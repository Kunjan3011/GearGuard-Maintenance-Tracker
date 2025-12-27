from sqlmodel import Session, select
from database import engine
from models import User, Team, Technician, Equipment, MaintenanceRequest, WorkCenter
from tabulate import tabulate

def view_database():
    session = Session(engine)
    
    print("\n" + "="*80)
    print("GEAR GUARD DATABASE SNAPSHOT")
    print("="*80)
    
    # Users
    print("\n📋 USERS")
    print("-" * 80)
    users = session.exec(select(User)).all()
    if users:
        user_data = [[u.id, u.username, u.email, u.role] for u in users]
        print(tabulate(user_data, headers=["ID", "Username", "Email", "Role"], tablefmt="grid"))
    else:
        print("No users found.")
    
    # Teams
    print("\n👥 TEAMS")
    print("-" * 80)
    teams = session.exec(select(Team)).all()
    if teams:
        team_data = [[t.id, t.name, t.leader, t.members_count] for t in teams]
        print(tabulate(team_data, headers=["ID", "Name", "Leader", "Members"], tablefmt="grid"))
    else:
        print("No teams found.")
    
    # Technicians
    print("\n🔧 TECHNICIANS")
    print("-" * 80)
    technicians = session.exec(select(Technician)).all()
    if technicians:
        tech_data = [[t.id, t.name, t.team_id] for t in technicians]
        print(tabulate(tech_data, headers=["ID", "Name", "Team ID"], tablefmt="grid"))
    else:
        print("No technicians found.")
    
    # Work Centers
    print("\n🏭 WORK CENTERS")
    print("-" * 80)
    work_centers = session.exec(select(WorkCenter)).all()
    if work_centers:
        wc_data = [[wc.id, wc.name, wc.code, wc.tag, f"{wc.oee_target}%"] for wc in work_centers]
        print(tabulate(wc_data, headers=["ID", "Name", "Code", "Tag", "OEE Target"], tablefmt="grid"))
    else:
        print("No work centers found.")
    
    # Equipment
    print("\n⚙️  EQUIPMENT")
    print("-" * 80)
    equipment = session.exec(select(Equipment)).all()
    if equipment:
        eq_data = [[e.id, e.name, e.serial_number, e.department, e.status, e.team_id] for e in equipment]
        print(tabulate(eq_data, headers=["ID", "Name", "Serial #", "Department", "Status", "Team ID"], tablefmt="grid"))
    else:
        print("No equipment found.")
    
    # Maintenance Requests
    print("\n🔔 MAINTENANCE REQUESTS")
    print("-" * 80)
    requests = session.exec(select(MaintenanceRequest)).all()
    if requests:
        req_data = [[r.id, r.subject[:30], r.type, r.stage, r.equipment_id, r.team_id] for r in requests]
        print(tabulate(req_data, headers=["ID", "Subject", "Type", "Stage", "Equipment ID", "Team ID"], tablefmt="grid"))
    else:
        print("No maintenance requests found.")
    
    print("\n" + "="*80)
    print(f"Total Records: {len(users)} users, {len(teams)} teams, {len(technicians)} technicians, {len(work_centers)} work centers, {len(equipment)} equipment, {len(requests)} requests")
    print("="*80 + "\n")
    
    session.close()

if __name__ == "__main__":
    view_database()
