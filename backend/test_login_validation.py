"""
Test script to verify enhanced login validation and error messages
"""
import requests

BASE_URL = "http://127.0.0.1:8001/api"

def test_scenario(name, test_func):
    print(f"\n{'='*70}")
    print(f"Test: {name}")
    print('='*70)
    result = test_func()
    if result:
        print("✓ PASSED")
    else:
        print("✗ FAILED")
    return result

def test_login_nonexistent_email():
    """Test login with non-existent email"""
    print("Attempting login with non-existent email...")
    
    response = requests.post(
        f"{BASE_URL}/auth/login",
        data={"username": "nonexistent@test.com", "password": "anypassword"}
    )
    
    if response.status_code == 401:
        error = response.json().get("detail")
        print(f"  Response: {error}")
        if error == "Account not exist":
            print("  ✓ Correct error message!")
            return True
        else:
            print(f"  ✗ Expected 'Account not exist', got '{error}'")
            return False
    else:
        print(f"  ✗ Unexpected status code: {response.status_code}")
        return False

def test_login_wrong_password():
    """Test login with correct email but wrong password"""
    print("Attempting login with correct email but wrong password...")
    
    response = requests.post(
        f"{BASE_URL}/auth/login",
        data={"username": "admin_test@gearguard.com", "password": "wrongpassword"}
    )
    
    if response.status_code == 401:
        error = response.json().get("detail")
        print(f"  Response: {error}")
        if error == "Invalid Password":
            print("  ✓ Correct error message!")
            return True
        else:
            print(f"  ✗ Expected 'Invalid Password', got '{error}'")
            return False
    else:
        print(f"  ✗ Unexpected status code: {response.status_code}")
        return False

def test_login_success():
    """Test login with correct credentials"""
    print("Attempting login with correct credentials...")
    
    response = requests.post(
        f"{BASE_URL}/auth/login",
        data={"username": "admin_test@gearguard.com", "password": "password123"}
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"  ✓ Login successful!")
        print(f"    Username: {data.get('username')}")
        print(f"    Role: {data.get('role')}")
        print(f"    Token: {data.get('access_token')[:50]}...")
        return True
    else:
        print(f"  ✗ Login failed: {response.status_code}")
        print(f"    Response: {response.text}")
        return False

def test_signup_creates_portal_user():
    """Test that signup creates a portal user (technician role)"""
    print("Testing signup creates portal user...")
    
    import random
    test_username = f"testuser{random.randint(1000, 9999)}"
    test_email = f"{test_username}@test.com"
    
    response = requests.post(
        f"{BASE_URL}/auth/register",
        json={
            "username": test_username,
            "email": test_email,
            "hashed_password": "testpass123",
            "role": "technician"
        }
    )
    
    if response.status_code == 200:
        user_data = response.json()
        print(f"  ✓ User created successfully!")
        print(f"    Username: {user_data.get('username')}")
        print(f"    Email: {user_data.get('email')}")
        print(f"    Role: {user_data.get('role')}")
        
        if user_data.get('role') == 'technician':
            print("  ✓ User has 'technician' role (portal user)")
            return True
        else:
            print(f"  ✗ Expected 'technician' role, got '{user_data.get('role')}'")
            return False
    else:
        print(f"  ✗ Signup failed: {response.status_code}")
        print(f"    Response: {response.text}")
        return False

def test_forgot_password():
    """Test forgot password functionality"""
    print("Testing forgot password...")
    
    response = requests.post(
        f"{BASE_URL}/auth/forgot-password",
        json={"email": "admin_test@gearguard.com"}
    )
    
    if response.status_code == 200:
        message = response.json().get("message")
        print(f"  ✓ Response: {message}")
        print("  ✓ Check backend console for reset link")
        return True
    else:
        print(f"  ✗ Request failed: {response.status_code}")
        print(f"    Response: {response.text}")
        return False

def main():
    print("\n" + "="*70)
    print(" ENHANCED LOGIN VALIDATION TEST SUITE")
    print("="*70)
    
    results = []
    
    # Test 1: Non-existent email
    results.append(test_scenario(
        "Login with non-existent email should return 'Account not exist'",
        test_login_nonexistent_email
    ))
    
    # Test 2: Wrong password
    results.append(test_scenario(
        "Login with wrong password should return 'Invalid Password'",
        test_login_wrong_password
    ))
    
    # Test 3: Successful login
    results.append(test_scenario(
        "Login with correct credentials should succeed",
        test_login_success
    ))
    
    # Test 4: Signup creates portal user
    results.append(test_scenario(
        "Signup should create portal user with 'technician' role",
        test_signup_creates_portal_user
    ))
    
    # Test 5: Forgot password
    results.append(test_scenario(
        "Forgot password should generate reset token",
        test_forgot_password
    ))
    
    # Summary
    print("\n" + "="*70)
    print(" TEST SUMMARY")
    print("="*70)
    print(f"  Total Tests: {len(results)}")
    print(f"  Passed: {sum(results)}")
    print(f"  Failed: {len(results) - sum(results)}")
    
    if all(results):
        print("\n  🎉 ALL TESTS PASSED!")
    else:
        print("\n  ⚠️  SOME TESTS FAILED")
    
    print("="*70 + "\n")

if __name__ == "__main__":
    main()
