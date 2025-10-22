import pytest
from fastapi.testclient import TestClient
from src.app import app

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def test_activity():
    return {
        "Chess Club": {
            "description": "Learn strategies and compete in chess tournaments",
            "schedule": "Fridays, 3:30 PM - 5:00 PM",
            "max_participants": 12,
            "participants": ["michael@mergington.edu", "daniel@mergington.edu"]
        }
    }

@pytest.fixture
def valid_email():
    return "test@mergington.edu"

@pytest.fixture
def invalid_email():
    return "invalid@example.com"

@pytest.fixture
def activity_name():
    return "Chess Club"