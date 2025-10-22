document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to update the activities display
  function updateActivitiesDisplay() {
    fetch("/activities")
      .then(response => response.json())
      .then(activities => {
        activitiesList.innerHTML = '';
        activitySelect.innerHTML = '<option value="">-- Select an activity --</option>';

        Object.entries(activities).forEach(([name, details]) => {
          // Create activity card
          const card = document.createElement('div');
          card.className = 'activity-card';
          card.innerHTML = `
            <h4>${name}</h4>
            <p><strong>Description:</strong> ${details.description}</p>
            <p><strong>Schedule:</strong> ${details.schedule}</p>
            <p><strong>Places:</strong> ${details.participants.length}/${details.max_participants}</p>
            <div class="participants">
              <h5>Participants :</h5>
              ${details.participants.length > 0
                ? `<ul>${details.participants.map(email => 
                    `<li>
                      <span>${email}</span>
                      <span class="delete-participant" title="Désinscription" data-activity="${name}" data-email="${email}">✖</span>
                    </li>`).join('')}</ul>`
                : `<div class="no-participants">Aucun participant inscrit</div>`
              }
            </div>
          `;
          activitiesList.appendChild(card);

          // Add to select options
          const option = document.createElement('option');
          option.value = name;
          option.textContent = name;
          activitySelect.appendChild(option);
        });
      });
  }

  // Initial load of activities
  updateActivitiesDisplay();

  // Handle form submission
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const activity = activitySelect.value;

    fetch(`/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`, {
      method: "POST"
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(data => Promise.reject(data));
        }
        return response.json();
      })
      .then(data => {
        messageDiv.textContent = data.message;
        messageDiv.className = 'message success';
        // Reset the form
        document.getElementById("email").value = "";
        activitySelect.value = "";
        // Update the display
        updateActivitiesDisplay();
        // Hide message after 3 seconds
        setTimeout(() => {
          messageDiv.className = 'message hidden';
        }, 3000);
      })
      .catch(error => {
        messageDiv.textContent = error.detail || error.message;
        messageDiv.className = 'message error';
        setTimeout(() => {
          messageDiv.className = 'message hidden';
        }, 3000);
      });
  });

  // Handle unregistration
  activitiesList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-participant")) {
      const activity = e.target.dataset.activity;
      const email = e.target.dataset.email;

      if (confirm(`Voulez-vous vraiment désinscrire ${email} de ${activity} ?`)) {
        fetch(`/activities/${encodeURIComponent(activity)}/unregister?email=${encodeURIComponent(email)}`, {
          method: "DELETE"
        })
          .then(response => {
            if (!response.ok) {
              return response.json().then(data => Promise.reject(data));
            }
            return response.json();
          })
          .then(data => {
            messageDiv.textContent = data.message;
            messageDiv.className = 'message success';
            // Update the display
            updateActivitiesDisplay();
            // Hide message after 3 seconds
            setTimeout(() => {
              messageDiv.className = 'message hidden';
            }, 3000);
          })
          .catch(error => {
            messageDiv.textContent = error.detail || error.message;
            messageDiv.className = 'message error';
            setTimeout(() => {
              messageDiv.className = 'message hidden';
            }, 3000);
          });
      }
    }
  });
});
