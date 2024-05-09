
document.addEventListener('DOMContentLoaded', function () {
  const closeModalButton = document.getElementById('closemodalEditTeams');

  closeModalButton.addEventListener('click', () => {
    window.location.href = '/teams.html'; // Redirect to the championships page
  });

  const btnSendDataToServer = document.getElementById("btnSaveChangesModalEditTeams")
  btnSendDataToServer.addEventListener('click', () => {
    sendDataToServer()
  })

  // Get the input element
  const searchOtherPlayersInput = document.getElementById('searchOtherPlayers');

  // Add an event listener to the input field
  searchOtherPlayersInput.addEventListener('input', () => {
    // Get the value of the input field
    const searchTerm = searchOtherPlayersInput.value.toLowerCase();

    // Get all <tr> elements
    const playerRows = document.querySelectorAll('#tableOtherPlayers tbody tr');

    // Loop through each <tr> element
    playerRows.forEach(row => {
      // Get the player name and player ID from the <td> elements inside the <tr>
      const playerName = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
      const playerID = row.querySelector('td:nth-child(4)').textContent.toLowerCase();

      // Check if the player name or player ID contains the search term
      if (playerName.includes(searchTerm) || playerID.includes(searchTerm)) {
        // If it does, display the row
        row.style.display = 'table-row';
      } else {
        // If not, hide the row
        row.style.display = 'none';
      }
    });
  });
  // Get the input element
  const searchTeamsPlayersInput = document.getElementById('searchTeamPlayer');

  // Add an event listener to the input field
  searchTeamsPlayersInput.addEventListener('input', () => {
    // Get the value of the input field
    const searchTerm = searchTeamsPlayersInput.value.toLowerCase();

    // Get all <tr> elements
    const playerRows = document.querySelectorAll('#tableTeamPlayers tbody tr');

    // Loop through each <tr> element
    playerRows.forEach(row => {
      // Get the player name and player ID from the <td> elements inside the <tr>
      const playerName = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
      const playerID = row.querySelector('td:nth-child(4)').textContent.toLowerCase();

      // Check if the player name or player ID contains the search term
      if (playerName.includes(searchTerm) || playerID.includes(searchTerm)) {
        // If it does, display the row
        row.style.display = 'table-row';
      } else {
        // If not, hide the row
        row.style.display = 'none';
      }
    });
  });


  addEventListenersToMoveButtons()

})

// Function to move a player row to tablePlayersIn
function movePlayerIn(playerRow) {
  // Clone the entire row
  const clonedRow = playerRow.cloneNode(true);

  // Remove the original row from #tablePlayersOut
  playerRow.remove();

  // Add the cloned row to #tablePlayersIn
  const tableTeamPlayersBody = document.querySelector('#tableTeamPlayers tbody');
  tableTeamPlayersBody.appendChild(clonedRow);

  // Add event listener to move button within the cloned row
  const moveButtonOut = clonedRow.querySelector('.btnMovePlayerOut');
  moveButtonOut.addEventListener('click', () => {
    const playerRow = moveButtonOut.closest('tr');

    movePlayerOut(playerRow);
  });
}

// Function to move a player row to tablePlayersOut
function movePlayerOut(playerRow) {
  // Clone the entire row
  const clonedRow = playerRow.cloneNode(true);

  // Remove the original row from #tablePlayersIn
  playerRow.remove();

  // Add the cloned row to #tablePlayersOut
  const tablePlayersOutBody = document.querySelector('#tableOtherPlayers tbody');
  tablePlayersOutBody.appendChild(clonedRow);

  // Add event listener to move button within the cloned row
  const moveButtonIn = clonedRow.querySelector('.btnMovePlayerIn');
  moveButtonIn.addEventListener('click', () => {
    const playerRow = moveButtonIn.closest('tr');
    movePlayerIn(playerRow);
  });
}

// Function to add event listeners to move buttons
function addEventListenersToMoveButtons() {
  // Get all buttons with the class .btnMovePlayerIn
  const movePlayerInButtons = document.querySelectorAll('.btnMovePlayerIn');

  // Add click event listener to each button
  movePlayerInButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Get the parent <tr> element of the clicked button
      const playerRow = button.closest('tr');
      movePlayerIn(playerRow);
    });
  });

  // Get all buttons with the class .btnMovePlayerOut
  const movePlayerOutButtons = document.querySelectorAll('.btnMovePlayerOut');

  // Add click event listener to each button
  movePlayerOutButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Get the parent <tr> element of the clicked button
      const playerRow = button.closest('tr');
      movePlayerOut(playerRow);
    });
  });
}

function sendDataToServer() {
  // Get IDs from data attributes
  const table = document.querySelector('#tableTeamPlayers');
  const championshipId = table.getAttribute('data-championship-id');
  const teamId = table.getAttribute('data-team-id');

  // Validate IDs
  if (!championshipId) {
    console.error('Championship ID not found.');
    return;
  }
  if (!teamId) {
    console.error('Team ID not found.');
    return;
  }

  // Determine the team name
  const spanTeamName = document.getElementById('spanTeamName');
  const oldTeamName = spanTeamName.getAttribute('data-team-name');
  const inputTeamName = document.getElementById('inputTeamName');
  const newTeamName = inputTeamName.value.trim();
  let teamName = oldTeamName;

  if (newTeamName) {
    teamName = newTeamName;
  } else if (!oldTeamName) {
    alert('Please type in a team name');
    return;
  }

  // Prepare data for team name update
  const dataUpdateTeamName = {
    teamId: teamId,
    championshipId: championshipId,
    teamName: teamName
  };

  if (teamId != 0 || teamId != '0') {

    updateTeamName(dataUpdateTeamName, oldTeamName, newTeamName)
  }

  // Collect player IDs to add
  const players = Array.from(document.querySelectorAll('#tableTeamPlayers tbody tr')).map(row => ({
    playerId: row.getAttribute('data-player-id')
  }));

  // Data objects for adding and removing players
  const dataRemoveTeamPlayers = {
    championshipId: championshipId,
    teamId: teamId
  };

  const dataAddTeamPlayers = {
    players: players,
    championshipId: championshipId,
    teamId: teamId,
    teamName: teamName
  };

  // Adding or replacing players based on the teamId value
  if (teamId === '0') {
    // Adding players to a new team
    if (players.length > 0) {
      addPlayersToTeam(dataAddTeamPlayers)
    } else {
      console.log('No players to add.');
    }
  } else {
    removeAllPlayersFromTeam(dataRemoveTeamPlayers)
    .then(() => {
      // Check if players are available to add before calling the add function
      if (dataAddTeamPlayers.players.length > 0) {
        return addPlayersToTeam(dataAddTeamPlayers);
      } else {
        // No players to add, resolve immediately
        return Promise.resolve();
      }
    })
    .then(() => {
      console.log('Players updated successfully.');
      alert('Editions recorded successfully');
    })
    .catch(error => {
      console.error('Error updating players:', error.message);
    });
  }
}

// Function to update team name using the provided data
function updateTeamName(dataUpdateTeamName, oldTeamName, newTeamName) {
  fetch('/update_team_name', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataUpdateTeamName)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update team name.');
      }
      return response.json(); // Optional: parse the response if needed
    })
    .then(() => {
      console.log('Team name updated successfully.');
      alert(`Team name updated successfully from ${oldTeamName} to ${newTeamName}`);
    })
    .catch(error => {
      console.error('Error updating team name:', error.message);
    });
}



// Function to remove all players from a team
function removeAllPlayersFromTeam(dataRemoveTeamPlayers) {
  return fetch('/remove_all_players_from_team', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataRemoveTeamPlayers)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to remove players from the team.');
    }
    return response.json(); // You can use the response if needed
  });
}

// Function to add players to a team
function addPlayersToTeam(dataAddTeamPlayers) {
  return fetch('/add_players_to_team', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataAddTeamPlayers)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to add players to the team.');
    }
    alert("Team insertion succesful");
    return response.json(); // Optional: parse response data if required
  });
}