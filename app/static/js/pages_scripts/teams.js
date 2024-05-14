document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('btnCreateNewTeam').addEventListener('click', function () {
    let currentChampionshipID = localStorage.getItem('currentChampionshipID')
    if (currentChampionshipID) {

      window.location.href = `/edit_team_players/${currentChampionshipID}/0`; // Redirect to edit_team_players.html
    } else {
      alert('Please click CHANGE to select a championship')
    }
  });



  // Get the input element
  const inputSearchTeam = document.getElementById('teamSearch');

  // Add an event listener to the input field
  inputSearchTeam.addEventListener('input', () => {
    console.log('input')
    // Get the value of the input field
    const searchTerm = inputSearchTeam.value.toLowerCase();

    // Get all <tr> elements
    const teamsRows = document.querySelectorAll('#teamTable tbody tr');

    // Loop through each <tr> element
    teamsRows.forEach(row => {
      // Get the player name and player ID from the <td> elements inside the <tr>
      const teamName = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
      const teamId = row.querySelector('td:nth-child(2)').textContent.toLowerCase();

      // Check if the player name or player ID contains the search term
      if (teamName.includes(searchTerm) || teamId.includes(searchTerm)) {
        // If it does, display the row
        row.style.display = 'table-row';
      } else {
        // If not, hide the row
        row.style.display = 'none';
      }
    });
  });
})


document.addEventListener('DOMContentLoaded', function () {
  let currentChampionshipID = localStorage.getItem('currentChampionshipID')

  const teamsTableBody = document.getElementById('teamTableBody');


  if (currentChampionshipID) {

    // Fetch championship data from the server
    fetch(`/get_teams/${currentChampionshipID}`)
      .then(response => response.json())
      .then(data => {
        renderTeams(data); // Render fetched data in the table
      })
      .catch(error => {
        console.error('Error fetching championship data:', error);
      });

  }
  function createTeamRow(team) {
    const row = document.createElement('tr');
    row.setAttribute('data-team-id', team.teamID);


    // Create and append table cells for each championship property
    const nameCell = document.createElement('td');
    nameCell.textContent = team.teamName;
    row.appendChild(nameCell);


    const idCell = document.createElement('td');
    idCell.textContent = team.teamID;
    row.appendChild(idCell);

    // Create and append edit button
    const editCell = document.createElement('td');
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = 'bg-yellow-600 text-white hover:bg-yellow-900 px-3 py-1 rounded-md edit-button';
    editButton.addEventListener('click', () => {
      // Get the championship data from the row
      const teamRow = editButton.closest('tr');
      const teamIdInRow = teamRow.getAttribute('data-team-id')

      window.location.href = `/edit_team_players/2/${teamIdInRow}`;

    });
    editCell.appendChild(editButton);
    row.appendChild(editCell);

    // Create and append remove button
    const removeCell = document.createElement('td');
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Delete';
    removeButton.className = 'bg-red-600 text-white hover:bg-red-900 px-3 py-1 rounded-md remove-button';
    removeButton.addEventListener('click', () => {
      // Get the championship data from the row
      const teamRow = editButton.closest('tr');
      const teamIdInRow = teamRow.getAttribute('data-team-id')

      deleteTeam(teamIdInRow)
    })
    removeCell.appendChild(removeButton);
    row.appendChild(removeCell);
    return row;



  };
  // Function to render championship data in the table
  function renderTeams(teams) {
    // Clear existing table rows
    teamsTableBody.innerHTML = '';

    // Generate table rows for each championship and append to table body
    teams.forEach(team => {
      const row = createTeamRow(team);
      teamsTableBody.appendChild(row);
    });
  }
  function deleteTeam(teamId) {
    // Send an HTTP DELETE request to the backend to delete the championship
    fetch(`/delete_team/${teamId}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.ok) {
          // Find the row with the matching ID and remove it
          const rowToRemove = document.querySelector(`tr[data-team-id="${teamId}"]`);
          if (rowToRemove) {
            rowToRemove.remove();
          } else {
            throw new Error('Row not found');
          }
        } else {
          throw new Error('Failed to remove championship');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to remove championship');
      });
  }

})



