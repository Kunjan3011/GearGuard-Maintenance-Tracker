"""
Test login with different user credentials
"""
import requests

BASE_URL = "http://127.0.0.1:8001/api"

def test_login(email, password, expected_role):
    print(f"\nTesting login: {email}")
    print(f"  Password: {password}")
    
    login_data = {
        "username": email,
        "password": password
    }
    
    response = requests.post(
        f"{BASE_URL}/auth/login",
        data=login_data
    )
    
    if response.status_code == 200:
        auth_data = response.json()
        print(f"  ✓ Login successful!")
        print(f"    Role: {auth_data['role']}")
        print(f"    Token: {auth_data['access_token'][:50]}...")
        return auth_data['access_token']
    else:
        print(f"  ✗ Login failed: {response.status_code}")
        print(f"    Response: {response.text}")
        return None

def main():
    print("=" * 60)
    print("Testing Different User Logins")
    print("=" * 60)
    
    # Test different accounts
    test_accounts = [
        ("admin@gearguard.com", "admin123", "admin"),
        ("admin_test@gearguard.com", "password123", "admin"),
        ("manager@gearguard.com", "password123", "manager"),
        ("tech@gearguard.com", "password123", "technician"),
    ]
    
    for email, password, role in test_accounts:
        token = test_login(email, password, role)
        if token:
            print(f"  ✓ Can use this account for testing!")
            break
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    main()
