
import requests
import sys

BASE_URL = "http://127.0.0.1:8001"

def get_token(username, password):
    response = requests.post(f"{BASE_URL}/api/auth/login", data={"username": username, "password": password})
    if response.status_code == 200:
        return response.json()["access_token"]
    print(f"Failed to login {username}: {response.text}")
    return None

def verify_scrap_workflow():
    print("--- Starting Scrap Workflow Verification ---")
    
    # 1. Login
    token = get_token("admin_test@gearguard.com", "password123")
    if not token:
        print("Login failed, aborting.")
        sys.exit(1)
        
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Create Equipment
    eq_data = {
        "name": "To Be Scrapped", 
        "serial_number": "SCRAP-001", 
        "location": "Yard", 
        "department": "Maintenance", 
        "employee": "Tester", 
        "purchase_date": "2020-01-01", 
        "warranty": "2021-01-01"
    }
    res = requests.post(f"{BASE_URL}/api/equipment", json=eq_data, headers=headers)
    if res.status_code != 200:
        print(f"Failed to create equipment: {res.text}")
        sys.exit(1)
    equipment_id = res.json()["id"]
    print(f"[OK] Created Equipment ID: {equipment_id}")
    
    # 3. Create Request
    req_data = {
        "subject": "Scrap this item",
        "equipment_id": equipment_id,
        "type": "Corrective",
        "scheduled_date": "2023-12-01",
        "priority": "High",
        "stage": "New",
        "technician_id": 1, # Assuming tech 1 exists
        "team_id": 1 # Assuming team 1 exists
    }
    res = requests.post(f"{BASE_URL}/api/requests", json=req_data, headers=headers)
    if res.status_code != 200:
        print(f"Failed to create request: {res.text}")
        sys.exit(1)
    request_id = res.json()["id"]
    print(f"[OK] Created Request ID: {request_id}")
    
    # 4. Update Stage to Scrap (Technician/Admin/Manager can do this)
    res = requests.put(f"{BASE_URL}/api/requests/{request_id}/stage?stage=Scrap", headers=headers)
    if res.status_code != 200:
        print(f"Failed to update stage: {res.text}")
        sys.exit(1)
    print(f"[OK] Updated Request ID {request_id} to 'Scrap'")
    
    # 5. Verify Equipment Status
    # Requests.get equipment logic needs to fetch fresh data
    res = requests.get(f"{BASE_URL}/api/equipment", headers=headers)
    all_eq = res.json()
    target_eq = next((e for e in all_eq if e["id"] == equipment_id), None)
    
    if target_eq and target_eq["status"] == "scrapped":
        print("[PASS] Equipment status is 'scrapped'")
    else:
        print(f"[FAIL] Equipment status is '{target_eq.get('status') if target_eq else 'None'}' (Expected: 'scrapped')")

    print("--- Verification Complete ---")

if __name__ == "__main__":
    verify_scrap_workflow()
