
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

  const inputTeamName = document.getElementById('inputTeamName');
  const teamName = inputTeamName.value;
  if (!teamName || teamName == '') {
    alert("Please type in a team name")
    console.log("Please type in a team name")
    return
  }else{
    console.log(teamName)
  }


  // Get the championship ID from the data attribute
  const championshipId = document.querySelector('#tableTeamPlayers').getAttribute('data-championship-id');

  // Check if championshipId exists
  if (!championshipId) {
    console.error('Championship ID not found.');
    return;
  }
  // Get the team ID from the data attribute
  const teamId = document.querySelector('#tableTeamPlayers').getAttribute('data-team-id');

  // Check if teamId exists
  if (!teamId) {
    console.error('team ID not found.');
    return;
  }

  // Initialize an array to store player IDs
  const players = [];

  // Get all player rows from the table
  const playerRows = document.querySelectorAll('#tableTeamPlayers tbody tr');

  // Loop through each player row
  playerRows.forEach(row => {
    // Get the player ID from the data attribute
    const playerId = row.getAttribute('data-player-id');


    // Create an object for the player
    const player = {
      playerId: playerId
    };

    // Add the player ID to the array
    players.push(player);
  });

  // Prepare the data object to send to the server for removing players
  const dataRemoveTeamPlayers = {
    championshipId: championshipId,
    teamId: teamId
  };

  // Prepare the data object to send to the server for adding players
  const dataAddTeamPlayers = {
    players: players,
    championshipId: championshipId,
    teamId: teamId,
    teamName: teamName
  };

  if (teamId == 0 || teamId == '0') {
    if (dataAddTeamPlayers.players.length > 0) {

      fetch('/add_players_to_team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataAddTeamPlayers)
      })
        .then(response => {
          if (!response.ok) {
            // Handle error response
            throw new Error('Failed to add players to championship.');
          }
          // Handle success response
          console.log('Players added successfully.');
          alert('Editions recorded successfully');

        })
        .catch(error => {
          // Handle error
          console.error(error);
        });
    } else {
      // Return a resolved promise since there are no players to add
      return Promise.resolve();
    }

  } else {

    fetch('/remove_all_players_from_team', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataRemoveTeamPlayers)
    })
      .then(response => {
        if (!response.ok) {
          // Handle error response
          throw new Error('Failed to remove players from championship.');
        }
        // Otherwise, return the response to continue processing
        return response.json();
      })
      .then(() => {
        // Check if players array is not empty before proceeding
        if (dataAddTeamPlayers.players.length > 0) {
          // Now, send data to add players to the championship
          return fetch('/add_players_to_team', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataAddTeamPlayers)
          });
        } else {
          // Return a resolved promise since there are no players to add
          return Promise.resolve();
        }
      })
      .then(response => {
        if (!response.ok) {
          // Handle error response
          throw new Error('Failed to add players to championship.');
        }
        // Handle success response
        console.log('Players added successfully.');
        alert('Editions recorded successfully');

      })
      .catch(error => {
        // Handle error
        console.error(error);
      });
  }
  // Send the data to the server to remove players from the championship
}


