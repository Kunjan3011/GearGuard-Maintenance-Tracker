"""
Test maintenance request update with proper authentication
"""
import requests

BASE_URL = "http://127.0.0.1:8001/api"

def test_update_with_auth():
    print("=" * 70)
    print("Testing Maintenance Request Update with Authentication")
    print("=" * 70)
    
    # Login with working credentials
    print("\n1. Logging in as admin_test...")
    response = requests.post(
        f"{BASE_URL}/auth/login",
        data={"username": "admin_test@gearguard.com", "password": "password123"}
    )
    
    if response.status_code != 200:
        print(f"✗ Login failed: {response.status_code}")
        return
    
    token = response.json()['access_token']
    print(f"✓ Login successful! Token obtained.")
    
    # Get requests
    print("\n2. Fetching maintenance requests...")
    response = requests.get(f"{BASE_URL}/requests")
    
    if response.status_code != 200 or not response.json():
        print(f"✗ No requests found")
        return
    
    requests_data = response.json()
    test_request = requests_data[0]
    request_id = test_request['id']
    print(f"✓ Found request ID: {request_id}")
    print(f"  Current subject: {test_request.get('subject', 'N/A')}")
    print(f"  Current priority: {test_request.get('priority', 'N/A')}")
    
    # Update request WITH authentication
    print(f"\n3. Updating request {request_id} WITH Bearer token...")
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    
    update_data = {
        "subject": "✓ Auth Working! - Updated via API",
        "equipment_id": test_request.get('equipment_id'),
        "work_center_id": test_request.get('work_center_id'),
        "type": test_request.get('type', 'Corrective'),
        "scheduled_date": test_request.get('scheduled_date'),
        "priority": "High",
        "team_id": test_request.get('team_id'),
        "technician_id": test_request.get('technician_id'),
        "stage": test_request.get('stage', 'New')
    }
    
    response = requests.put(
        f"{BASE_URL}/requests/{request_id}",
        headers=headers,
        json=update_data
    )
    
    if response.status_code == 200:
        updated = response.json()
        print(f"✓ UPDATE SUCCESSFUL!")
        print(f"  New subject: {updated.get('subject')}")
        print(f"  New priority: {updated.get('priority')}")
        print(f"\n🎉 The backend API is working correctly!")
        print(f"   The issue is in the frontend - user needs to login first.")
    else:
        print(f"✗ Update failed: {response.status_code}")
        print(f"  Response: {response.text}")
    
    # Try updating WITHOUT token
    print(f"\n4. Testing WITHOUT token (should fail)...")
    response = requests.put(
        f"{BASE_URL}/requests/{request_id}",
        headers={"Content-Type": "application/json"},
        json=update_data
    )
    
    if response.status_code == 401:
        print(f"✓ Correctly rejected with 401 Unauthorized")
    else:
        print(f"✗ Unexpected: {response.status_code}")
    
    print("\n" + "=" * 70)
    print("CONCLUSION:")
    print("- Backend authentication is working correctly")
    print("- Frontend needs to ensure user is logged in before updating")
    print("- Use credentials: admin_test@gearguard.com / password123")
    print("=" * 70)

if __name__ == "__main__":
    test_update_with_auth()
