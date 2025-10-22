import pytest
from fastapi import HTTPException

def test_get_root(client):
    """Test that root endpoint redirects to index.html"""
    response = client.get("/")
    assert response.status_code == 200 or response.status_code == 307
    
def test_get_activities(client):
    """Test getting all activities"""
    response = client.get("/activities")
    assert response.status_code == 200
    activities = response.json()
    assert isinstance(activities, dict)
    assert len(activities) > 0
    
    # Verify activity structure
    for activity_name, details in activities.items():
        assert isinstance(activity_name, str)
        assert isinstance(details, dict)
        assert "description" in details
        assert "schedule" in details
        assert "max_participants" in details
        assert "participants" in details
        assert isinstance(details["participants"], list)

def test_signup_success(client, activity_name, valid_email):
    """Test successful signup for an activity"""
    response = client.post(f"/activities/{activity_name}/signup?email={valid_email}")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert valid_email in data["message"]
    assert activity_name in data["message"]

def test_signup_already_registered(client, activity_name):
    """Test signup when student is already registered"""
    # Use an email that we know is already registered
    email = "michael@mergington.edu"
    response = client.post(f"/activities/{activity_name}/signup?email={email}")
    assert response.status_code == 400
    data = response.json()
    assert "detail" in data
    assert "already signed up" in data["detail"]

def test_signup_activity_not_found(client, invalid_email):
    """Test signup for non-existent activity"""
    response = client.post(f"/activities/NonExistentActivity/signup?email={invalid_email}")
    assert response.status_code == 404
    data = response.json()
    assert "detail" in data
    assert "not found" in data["detail"]

def test_unregister_success(client, activity_name):
    """Test successful unregistration from an activity"""
    # Use an email that we know is registered
    email = "michael@mergington.edu"
    response = client.delete(f"/activities/{activity_name}/unregister?email={email}")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert email in data["message"]
    assert activity_name in data["message"]

def test_unregister_not_registered(client, activity_name, invalid_email):
    """Test unregistration when student is not registered"""
    response = client.delete(f"/activities/{activity_name}/unregister?email={invalid_email}")
    assert response.status_code == 400
    data = response.json()
    assert "detail" in data
    assert "not registered" in data["detail"]

def test_unregister_activity_not_found(client, invalid_email):
    """Test unregistration from non-existent activity"""
    response = client.delete(f"/activities/NonExistentActivity/unregister?email={invalid_email}")
    assert response.status_code == 404
    data = response.json()
    assert "detail" in data
    assert "not found" in data["detail"]