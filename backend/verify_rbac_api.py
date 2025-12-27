
import requests
import sys

BASE_URL = "http://127.0.0.1:8001"

USERS = {
    "admin": ("admin_test@gearguard.com", "password123"),
    "manager": ("manager@gearguard.com", "password123"),
    "technician": ("tech@gearguard.com", "password123"),
    "employee": ("employee@gearguard.com", "password123")
}

def get_token(username, password):
    response = requests.post(f"{BASE_URL}/api/auth/login", data={"username": username, "password": password})
    if response.status_code == 200:
        return response.json()["access_token"]
    print(f"Failed to login {username}: {response.text}")
    return None

def test_endpoint(role, token, method, endpoint, data=None, expected_status=200):
    headers = {"Authorization": f"Bearer {token}"}
    if method == "POST":
        response = requests.post(f"{BASE_URL}{endpoint}", json=data, headers=headers)
    elif method == "DELETE":
        response = requests.delete(f"{BASE_URL}{endpoint}", headers=headers)
    # Add other methods if needed
    
    if response.status_code == expected_status:
        print(f"[PASS] {role} {method} {endpoint}: Got {response.status_code}")
        return True
    else:
        print(f"[FAIL] {role} {method} {endpoint}: Expected {expected_status}, Got {response.status_code} - {response.text}")
        return False

def verify_rbac():
    print("--- Starting RBAC Verification ---")
    
    tokens = {}
    for role, creds in USERS.items():
        tokens[role] = get_token(*creds)
        if not tokens[role]:
            print(f"Skipping tests for {role} due to login failure.")
            continue

    # 1. Test Team Creation (Admin only)
    print("\n--- Testing Team Creation (Admin Only) ---")
    team_data = {"name": "Security Team", "leader": "Head Guard"}
    
    test_endpoint("admin", tokens["admin"], "POST", "/api/teams", team_data, 200)
    test_endpoint("manager", tokens["manager"], "POST", "/api/teams", team_data, 403)
    test_endpoint("technician", tokens["technician"], "POST", "/api/teams", team_data, 403)
    test_endpoint("employee", tokens["employee"], "POST", "/api/teams", team_data, 403)

    # 2. Test Equipment Creation (Admin/Manager)
    print("\n--- Testing Equipment Creation (Admin/Manager) ---")
    eq_data = {"name": "Test Drill", "serial_number": "TD-999", "model": "X", "type": "Tool", "location": "A1", "department": "Maintenance", "employee": "Test User", "purchase_date": "2023-01-01", "warranty": "2025-01-01", "notes": "", "manufacturer": "BrandX"}
    
    test_endpoint("admin", tokens["admin"], "POST", "/api/equipment", eq_data, 200)
    test_endpoint("manager", tokens["manager"], "POST", "/api/equipment", eq_data, 200)
    test_endpoint("technician", tokens["technician"], "POST", "/api/equipment", eq_data, 403)
    test_endpoint("employee", tokens["employee"], "POST", "/api/equipment", eq_data, 403)
    
    # Clean up created equipment/teams logic could be here, but for now we trust the tests.

    print("\n--- RBAC Verification Complete ---")

if __name__ == "__main__":
    try:
        verify_rbac()
    except Exception as e:
        print(f"An error occurred: {e}")
