"""
Test script to verify authentication and update request functionality
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8001/api"

def test_auth_and_update():
    print("=" * 60)
    print("Testing Authentication and Request Update")
    print("=" * 60)
    
    # Step 1: Login
    print("\n1. Logging in as admin...")
    login_data = {
        "username": "admin@gearguard.com",  # Backend uses email as username
        "password": "admin123"
    }
    
    response = requests.post(
        f"{BASE_URL}/auth/login",
        data=login_data
    )
    
    if response.status_code == 200:
        auth_data = response.json()
        print(f"✓ Login successful!")
        print(f"  Token: {auth_data['access_token'][:50]}...")
        print(f"  Role: {auth_data['role']}")
        token = auth_data['access_token']
    else:
        print(f"✗ Login failed: {response.status_code}")
        print(f"  Response: {response.text}")
        return
    
    # Step 2: Get all requests
    print("\n2. Fetching maintenance requests...")
    response = requests.get(f"{BASE_URL}/requests")
    
    if response.status_code == 200:
        requests_data = response.json()
        print(f"✓ Found {len(requests_data)} requests")
        if requests_data:
            print(f"  First request ID: {requests_data[0]['id']}")
            test_request_id = requests_data[0]['id']
        else:
            print("  No requests found to test with")
            return
    else:
        print(f"✗ Failed to fetch requests: {response.status_code}")
        return
    
    # Step 3: Try updating a request WITH authentication
    print(f"\n3. Updating request {test_request_id} WITH auth token...")
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    
    update_data = {
        "subject": "Test Update - Auth Working",
        "equipment_id": requests_data[0].get('equipment_id'),
        "work_center_id": requests_data[0].get('work_center_id'),
        "type": requests_data[0].get('type'),
        "scheduled_date": requests_data[0].get('scheduled_date'),
        "priority": "High",
        "team_id": requests_data[0].get('team_id'),
        "technician_id": requests_data[0].get('technician_id'),
        "stage": requests_data[0].get('stage', 'New')
    }
    
    response = requests.put(
        f"{BASE_URL}/requests/{test_request_id}",
        headers=headers,
        json=update_data
    )
    
    if response.status_code == 200:
        print(f"✓ Update successful!")
        print(f"  Updated request: {response.json()}")
    else:
        print(f"✗ Update failed: {response.status_code}")
        print(f"  Response: {response.text}")
    
    # Step 4: Try updating WITHOUT authentication (should fail)
    print(f"\n4. Updating request {test_request_id} WITHOUT auth token...")
    headers_no_auth = {
        "Content-Type": "application/json"
    }
    
    response = requests.put(
        f"{BASE_URL}/requests/{test_request_id}",
        headers=headers_no_auth,
        json=update_data
    )
    
    if response.status_code == 401:
        print(f"✓ Correctly rejected (401 Unauthorized)")
    else:
        print(f"✗ Unexpected response: {response.status_code}")
        print(f"  Response: {response.text}")
    
    print("\n" + "=" * 60)
    print("Test Complete!")
    print("=" * 60)

if __name__ == "__main__":
    test_auth_and_update()
