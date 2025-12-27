"""
Test script to verify signup validation rules
"""
import requests
import random

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

def test_duplicate_email():
    """Test that duplicate email is rejected"""
    print("Testing duplicate email rejection...")
    
    # Use an existing email
    response = requests.post(
        f"{BASE_URL}/auth/register",
        json={
            "username": f"newuser{random.randint(1000, 9999)}",
            "email": "admin_test@gearguard.com",  # Existing email
            "hashed_password": "ValidPass123!",
            "role": "technician"
        }
    )
    
    if response.status_code == 400:
        error = response.json().get("detail")
        print(f"  Response: {error}")
        if error == "Email already registered":
            print("  ✓ Correct error message!")
            return True
        else:
            print(f"  ✗ Expected 'Email already registered', got '{error}'")
            return False
    else:
        print(f"  ✗ Unexpected status code: {response.status_code}")
        return False

def test_password_too_short():
    """Test that password <= 8 characters is rejected"""
    print("Testing password too short (<=8 chars)...")
    
    response = requests.post(
        f"{BASE_URL}/auth/register",
        json={
            "username": f"user{random.randint(1000, 9999)}",
            "email": f"test{random.randint(1000, 9999)}@test.com",
            "hashed_password": "Pass1!",  # Only 6 characters
            "role": "technician"
        }
    )
    
    if response.status_code == 400:
        error = response.json().get("detail")
        print(f"  Response: {error}")
        if "more than 8 characters" in error:
            print("  ✓ Correct error message!")
            return True
        else:
            print(f"  ✗ Wrong error message: '{error}'")
            return False
    else:
        print(f"  ✗ Unexpected status code: {response.status_code}")
        return False

def test_password_no_lowercase():
    """Test that password without lowercase is rejected"""
    print("Testing password without lowercase...")
    
    response = requests.post(
        f"{BASE_URL}/auth/register",
        json={
            "username": f"user{random.randint(1000, 9999)}",
            "email": f"test{random.randint(1000, 9999)}@test.com",
            "hashed_password": "PASSWORD123!",  # No lowercase
            "role": "technician"
        }
    )
    
    if response.status_code == 400:
        error = response.json().get("detail")
        print(f"  Response: {error}")
        if "lowercase" in error:
            print("  ✓ Correct error message!")
            return True
        else:
            print(f"  ✗ Wrong error message: '{error}'")
            return False
    else:
        print(f"  ✗ Unexpected status code: {response.status_code}")
        return False

def test_password_no_uppercase():
    """Test that password without uppercase is rejected"""
    print("Testing password without uppercase...")
    
    response = requests.post(
        f"{BASE_URL}/auth/register",
        json={
            "username": f"user{random.randint(1000, 9999)}",
            "email": f"test{random.randint(1000, 9999)}@test.com",
            "hashed_password": "password123!",  # No uppercase
            "role": "technician"
        }
    )
    
    if response.status_code == 400:
        error = response.json().get("detail")
        print(f"  Response: {error}")
        if "uppercase" in error:
            print("  ✓ Correct error message!")
            return True
        else:
            print(f"  ✗ Wrong error message: '{error}'")
            return False
    else:
        print(f"  ✗ Unexpected status code: {response.status_code}")
        return False

def test_password_no_special():
    """Test that password without special character is rejected"""
    print("Testing password without special character...")
    
    response = requests.post(
        f"{BASE_URL}/auth/register",
        json={
            "username": f"user{random.randint(1000, 9999)}",
            "email": f"test{random.randint(1000, 9999)}@test.com",
            "hashed_password": "Password123",  # No special character
            "role": "technician"
        }
    )
    
    if response.status_code == 400:
        error = response.json().get("detail")
        print(f"  Response: {error}")
        if "special character" in error:
            print("  ✓ Correct error message!")
            return True
        else:
            print(f"  ✗ Wrong error message: '{error}'")
            return False
    else:
        print(f"  ✗ Unexpected status code: {response.status_code}")
        return False

def test_valid_signup():
    """Test that valid signup succeeds"""
    print("Testing valid signup...")
    
    username = f"validuser{random.randint(1000, 9999)}"
    email = f"{username}@test.com"
    
    response = requests.post(
        f"{BASE_URL}/auth/register",
        json={
            "username": username,
            "email": email,
            "hashed_password": "ValidPass123!",  # Valid password
            "role": "technician"
        }
    )
    
    if response.status_code == 200:
        user_data = response.json()
        print(f"  ✓ User created successfully!")
        print(f"    Username: {user_data.get('username')}")
        print(f"    Email: {user_data.get('email')}")
        print(f"    Role: {user_data.get('role')}")
        return True
    else:
        print(f"  ✗ Signup failed: {response.status_code}")
        print(f"    Response: {response.text}")
        return False

def main():
    print("\n" + "="*70)
    print(" SIGNUP VALIDATION TEST SUITE")
    print("="*70)
    
    results = []
    
    # Test 1: Duplicate email
    results.append(test_scenario(
        "Duplicate email should be rejected",
        test_duplicate_email
    ))
    
    # Test 2: Password too short
    results.append(test_scenario(
        "Password ≤8 characters should be rejected",
        test_password_too_short
    ))
    
    # Test 3: No lowercase
    results.append(test_scenario(
        "Password without lowercase should be rejected",
        test_password_no_lowercase
    ))
    
    # Test 4: No uppercase
    results.append(test_scenario(
        "Password without uppercase should be rejected",
        test_password_no_uppercase
    ))
    
    # Test 5: No special character
    results.append(test_scenario(
        "Password without special character should be rejected",
        test_password_no_special
    ))
    
    # Test 6: Valid signup
    results.append(test_scenario(
        "Valid signup should succeed",
        test_valid_signup
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
