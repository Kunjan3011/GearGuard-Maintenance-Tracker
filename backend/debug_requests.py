import requests
import sys

BASE_URL = "http://127.0.0.1:8001"

def check_endpoint(endpoint):
    print(f"Checking {endpoint}...")
    try:
        response = requests.get(f"{BASE_URL}{endpoint}")
        print(f"Status: {response.status_code}")
        if response.status_code != 200:
            print("Response:", response.text)
        else:
            print("Success (first 100 chars):", response.text[:100])
    except Exception as e:
        print(f"Error connecting to {endpoint}: {e}")

print("--- Testing API ---")
check_endpoint("/api/equipment")
check_endpoint("/api/requests")
check_endpoint("/api/work-centers")
