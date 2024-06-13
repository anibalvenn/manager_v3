
document.addEventListener('DOMContentLoaded', function () {
  const modalEditSerie = document.getElementById('modalEditSerie')
  const championshipID = modalEditSerie.getAttribute('data-champioship-id')
  const seriesID = parseInt(modalEditSerie.getAttribute('data-serie-id'))

  const closeModalEditSerieTische = document.getElementById('closeModalEditSerieTische');
  closeModalEditSerieTische.addEventListener('click', () => {
    // Get the championship data from the row
    window.location.href = "/series.html"

  });
  const openModalSelectSeriesID = document.getElementById('btnSortSeriesBySeriesIdResults');
  openModalSelectSeriesID.addEventListener('click', () => {
    openSelectSeriesID()
  });

  const closeModalSelectSeriesID = document.getElementById('closeModalSelectSeriesID');
  closeModalSelectSeriesID.addEventListener('click', () => {
    closeSelectSeriesID()
  });
  const btnSubmitSeriesID = document.getElementById('btnSubmitSeriesID');
  btnSubmitSeriesID.addEventListener('click', () => {

    const inputSelectSeriesID = document.getElementById('inputSelectSeriesID');
    const selectedSeriesID = parseInt(inputSelectSeriesID.value, 10); // Adding radix 10

    if (isNaN(selectedSeriesID)) {
      alert('Please enter a valid series ID');
      return;
    }
    if (selectedSeriesID >= seriesID) {
      alert(`input a series ID lower than ${seriesID}`)
    }else{
      // Navigate to the new URL
      window.location.href = `/edit_serie_tische/${championshipID}/${seriesID}/${selectedSeriesID}`;

    }





  });


  // const btnSendDataToServer = document.getElementById("btnSaveChangesModalEditTeams")
  // btnSendDataToServer.addEventListener('click', () => {
  //   sendDataToServer()
  // })

  // Get the input element
  const searchSeriePlayersInput = document.getElementById('searchSeriePlayer');

  // Add an event listener to the input field
  searchSeriePlayersInput.addEventListener('input', () => {
    // Get the value of the input field
    const searchTerm = searchSeriePlayersInput.value.toLowerCase();
    console.log(searchTerm)

    // Get all <tr> elements
    const playerRows = document.querySelectorAll('#tableSeriePlayers tbody tr');

    // Loop through each <tr> element
    playerRows.forEach(row => {
      // Get the player name and player ID from the <td> elements inside the <tr>
      const playerName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();

      // Check if the player name or player ID contains the search term
      if (playerName.includes(searchTerm)) {
        // If it does, display the row
        row.style.display = 'table-row';
      } else {
        // If not, hide the row
        row.style.display = 'none';
      }
    });
  });

  document.addEventListener('change', function (event) {
    const checkbox = event.target;
    if (checkbox.type === 'checkbox' && checkbox.checked) {
      const checkboxes = document.querySelectorAll('tr input[type="checkbox"]');
      checkboxes.forEach(cb => {
        if (cb !== checkbox) {
          cb.checked = false;
        }
      });
    }
  });
  document.addEventListener('keydown', function (event) {
    if (event.altKey && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      const checkedRows = document.querySelectorAll('tr input[type="checkbox"]:checked');
      checkedRows.forEach(row => {
        const currentRow = row.closest('tr');
        const nextRow = currentRow.nextElementSibling;
        const previousRow = currentRow.previousElementSibling;

        if (event.key === 'ArrowDown' && nextRow) {
          nextRow.parentNode.insertBefore(nextRow, currentRow);
          nextRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else if (event.key === 'ArrowUp' && previousRow) {
          currentRow.parentNode.insertBefore(currentRow, previousRow);
          currentRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
      applyRowGrouping('tableSeriePlayers');
    }
  });

  applyRowGrouping('tableSeriePlayers');

})

function applyRowGrouping(tableId) {
  const table = document.getElementById(tableId);
  const seek4er = table.getAttribute('data-serie-seek4er') === 'True';
  const rows = Array.from(table.querySelectorAll('tbody tr'));
  const totalRows = rows.length;

  if (totalRows !== 5) {
    let remainder = seek4er ? totalRows % 4 : totalRows % 3;
    let regularGroups = seek4er ? Math.floor(totalRows / 4) : Math.floor(totalRows / 3);
    let extraGroups = 0;

    if (seek4er) {
      if (remainder === 1) {
        extraGroups = 3;
        regularGroups = Math.floor((totalRows - 9) / 4);
      } else if (remainder === 2) {
        extraGroups = 2;
        regularGroups = Math.floor((totalRows - 6) / 4);
      } else if (remainder === 3) {
        extraGroups = 1;
        regularGroups = Math.floor((totalRows - 3) / 4);
      }
    } else {
      if (remainder === 1) {
        extraGroups = 1;
        regularGroups = Math.floor((totalRows - 4) / 3);
      } else if (remainder === 2) {
        extraGroups = 2;
        regularGroups = Math.floor((totalRows - 8) / 3);
      }
    }

    rows.forEach((row, index) => {
      let groupIndex;
      if (seek4er) {
        if (index >= totalRows - (extraGroups * 3)) {
          groupIndex = regularGroups + Math.floor((index - (totalRows - (extraGroups * 3))) / 3);
        } else {
          groupIndex = Math.floor(index / 4);
        }
      } else {
        if (remainder === 0) {
          groupIndex = Math.floor(index / 3);
        } else {
          if (remainder === 1 && index < 4) {
            groupIndex = 0;
          } else if (remainder === 2 && index < 8) {
            groupIndex = Math.floor(index / 4);
          } else {
            groupIndex = Math.floor((index - (remainder === 1 ? 4 : 8)) / 3) + (remainder > 0 ? remainder : 0);
          }
        }
      }

      row.setAttribute('data-tisch-index', groupIndex + 1);  // Add group index for debugging

      // Replace the content of the specific <td> element with data-tisch-index value
      const tischCell = row.querySelector('td:nth-child(4)');
      if (tischCell) {
        tischCell.textContent = groupIndex + 1;
      }

      const bgColor = groupIndex % 2 === 0 ? 'bg-gray-200' : 'bg-gray-300';
      row.classList.remove('bg-gray-200', 'bg-gray-300'); // Remove previous background color
      row.classList.add(bgColor);
    });
  }
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
      return response.json(); // Move JSON parsing here to handle based on response status
    })
    .then(data => { // Assuming 'data' contains meaningful info about the operation's success
      if (dataAddTeamPlayers.teamId === '0') {
        window.location.href = '/teams.html'; // Redirect to the teams page
      } else {
        alert("Team insertion successful");
      }
    })
    .catch(error => { // Handle any errors from fetch or from response handling
      console.error('Error:', error);
      alert("Error adding team");
    });
}


function openSelectSeriesID() {
  const divSelectSeriesID = document.getElementById('divSelectSeriesID');
  divSelectSeriesID.classList.remove('hidden');

}

function closeSelectSeriesID() {
  // Get the championship data from the row
  const divSelectSeriesID = document.getElementById('divSelectSeriesID');
  divSelectSeriesID.classList.add('hidden');

}

