document.addEventListener('DOMContentLoaded', function () {



  // Event listener for the "Edit" button
  const editButtons = document.querySelectorAll('.edit-button');
  editButtons.forEach(button => {
    button.addEventListener('click', () => {
      console.log('Edit button clicked');
      showEditModal();
    });
  });

  // Event listener for the "Remove" button
  const removeButtons = document.querySelectorAll('.remove-button');
  removeButtons.forEach(button => {
    button.addEventListener('click', () => {
      console.log('Remove button clicked');
      showRemoveModal();
    });
  });

  // Event listener for closing the "Edit" modal
  const closeModalEditPlayer = document.getElementById('closeModalEditPlayer');
  closeModalEditPlayer.addEventListener('click', () => {
    console.log('Closing Edit modal');
    hideEditModal();
  });

  // Event listener for closing the "Remove" modal
  const closeModalRemovePlayer = document.getElementById('closemodalRemovePlayer');
  closeModalRemovePlayer.addEventListener('click', () => {
    console.log('Closing Remove modal');
    hideRemoveModal();
  });

  const btnAddNewPlayer = document.getElementById('btnAddNewPlayer')
  btnAddNewPlayer.addEventListener('click', function () {
    // Get input field values
    const playerName = document.getElementById('inputPlayerName').value;
    const playerBirthInput = document.getElementById('inputPlayerBirth').value;
    const playerSex = document.querySelector('input[name="sex"]:checked').value;
    const playerCountry = document.getElementById('inputPlayerCountry').value;

    // Check if all fields are filled
    if (playerName.trim() && playerBirthInput.trim() && playerSex && playerCountry.trim()) {
      // Parse and format birthdate
      const playerBirth = formatDate(new Date(playerBirthInput));

      // Send an HTTP POST request to the backend
      fetch('/add_player', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          playerName: playerName,
          playerBirth: playerBirth,
          playerSex: playerSex,
          playerCountry: playerCountry
        })
      })
        .then(response => {
          if (response.ok) {
            window.location.reload()
          } else {
            throw new Error('Failed to add player');
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Failed to add player');
        });
    } else {
      // If any field is empty, alert the user
      alert('Please fill in all fields.');
    }
  });

});

document.addEventListener('DOMContentLoaded', function () {
  // Fetch players from the server
  fetch('/select_player')
    .then(response => response.json())
    .then(data => {
      renderPlayers(data); // Render fetched players in the table
    })
    .catch(error => {
      console.error('Error fetching players:', error);
    });
  const playersTableBody = document.querySelector('#playersTableBody');
  const btnRemovePlayer = document.getElementById('btnRemovePlayer');

  // Function to create table row for a player
  function createPlayerRow(player) {

    const row = document.createElement('tr');
    row.id = `rowplayer${player.PlayerID}`;

    // Create and append table cells for each player property
    const nameCell = document.createElement('td');
    nameCell.textContent = player.name;
    row.appendChild(nameCell);

    const birthCell = document.createElement('td');
    birthCell.textContent = player.birthdate;
    row.appendChild(birthCell);

    const sexCell = document.createElement('td');
    sexCell.textContent = player.sex;
    row.appendChild(sexCell);

    const countryCell = document.createElement('td');
    countryCell.textContent = player.country;
    row.appendChild(countryCell);

    // Create and append edit button
    const editCell = document.createElement('td');
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = 'bg-yellow-600 text-white hover:bg-yellow-900 px-3 py-1 rounded-md edit-button';

    editButton.addEventListener('click', function () {
      // Get the row id
      const rowId = this.closest('tr').id;
      // Remove "rowplayer" string from the row ID to get the player ID
      const playerId = rowId.replace('rowplayer', '');
      // Get the player data from the row
      const playerName = document.querySelector(`#${rowId} td:nth-child(1)`).textContent;
      const playerBirth = document.querySelector(`#${rowId} td:nth-child(2)`).textContent;
      const playerSex = document.querySelector(`#${rowId} td:nth-child(3)`).textContent;
      const playerCountry = document.querySelector(`#${rowId} td:nth-child(4)`).textContent;

      // Fill the modal inputs with player data
      document.getElementById('editPlayerName').value = playerName;
      document.getElementById('editPlayerBirth').value = playerBirth;
      document.getElementById('editPlayerSex').value = playerSex;
      document.getElementById('editPlayerCountry').value = playerCountry;

      // Add the data-player-id attribute to the modal
      const modalEditPlayer = document.getElementById('modalEditPlayer');
      modalEditPlayer.setAttribute('data-player-id', playerId);

      // Show the modal
      showEditModal();
    });

    editCell.appendChild(editButton);
    row.appendChild(editCell);
    // Create and append delete button
    const removeCell = document.createElement('td');
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.className = 'bg-red-600 text-white hover:bg-red-900 px-3 py-1 rounded-md remove-button';
    removeButton.addEventListener('click', function () {
      const rowId = this.closest('tr').id;
      // Remove "rowplayer" string from the row ID to get the player ID
      const playerId = rowId.replace('rowplayer', '');
      const spanRemovePlayer = document.getElementById('spanRemovePlayer');
      spanRemovePlayer.textContent = player.name;

      const modalRemovePlayer = document.getElementById('modalRemovePlayer');
      modalRemovePlayer.setAttribute('data-player-id', playerId);

      // Add event listener to the "Delete" button

      showRemoveModal();
    });


    removeCell.appendChild(removeButton);
    row.appendChild(removeCell);


    return row;
  }
  function handleFormSubmission(event) {
    event.preventDefault();

    // Get player data from modal inputs
    const playerId = document.getElementById('modalEditPlayer').getAttribute('data-player-id');
    const playerName = document.getElementById('editPlayerName').value;
    const playerBirth = document.getElementById('editPlayerBirth').value;
    const playerSex = document.getElementById('editPlayerSex').value;
    const playerCountry = document.getElementById('editPlayerCountry').value;

    // Prepare the player data object for the update request
    const playerData = {
      playerName: playerName,
      playerBirth: playerBirth,
      playerSex: playerSex,
      playerCountry: playerCountry
    };

    // Send the update request to the backend
    fetch(`/update_player/${playerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(playerData)
    })
      .then(response => {
        if (response.ok) {
          window.location.reload()
          // Optionally, hide the modal or refresh the player list
        } else {
          throw new Error('Failed to update player');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to update player');
      });
  }

  document.getElementById('formEditPlayer').addEventListener('submit', handleFormSubmission);
  btnRemovePlayer.addEventListener('click', handleDeletePlayer);

  function deletePlayer(rowID) {
    const playerId = rowID; // Get the Player ID from the row id
    console.log(rowID)
    // Send an HTTP DELETE request to the backend to delete the Player
    fetch(`/delete_player/${playerId}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.ok) {
          alert('Player removed successfully');
          // Find the row with the matching ID and remove it
          const playerToRemove = document.getElementById(playerId);
          const rowToRemove = document.getElementById("rowplayer" + playerId)
          if (rowToRemove) {
            rowToRemove.remove();
          } else {
            throw new Error('Row not found');
          }
        } else {
          throw new Error('Failed to remove Player');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to remove Player');
      });
  }

  function handleDeletePlayer() {
    // const btnRemovePlayer = document.getElementById('btnRemovePlayer');

    const modalRemovePlayer = document.getElementById('modalRemovePlayer');
    const playerId = modalRemovePlayer.getAttribute('data-player-id');
    deletePlayer(playerId);
    hideRemoveModal();

    // Remove event listener from the "Delete" button
  }
  // Function to render players in the table
  function renderPlayers(players) {
    // Clear existing table rows
    playersTableBody.innerHTML = '';

    // Generate table rows for each player and append to table body
    players.forEach(player => {
      const row = createPlayerRow(player);
      playersTableBody.appendChild(row);
    });
  }



  // Event listener for closing the "Edit" modal
  const closeModalEditPlayer = document.getElementById('closeModalEditPlayer');
  closeModalEditPlayer.addEventListener('click', () => {
    console.log('Closing Edit modal');
    hideEditModal();
  });

  // Get the input element
  const inputSearchPlayer = document.getElementById('playerSearch');

  // Add an event listener to the input field
  inputSearchPlayer.addEventListener('input', () => {
    console.log('input')
    // Get the value of the input field
    const searchTerm = inputSearchPlayer.value.toLowerCase();

    // Get all <tr> elements
    const playerRows = document.querySelectorAll('#playersTable tbody tr');

    // Loop through each <tr> element
    playerRows.forEach(row => {
      // Get the player name and player ID from the <td> elements inside the <tr>
      const playerName = row.querySelector('td:nth-child(1)').textContent.toLowerCase();

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

});


// Function to format date as 'YYYY-MM-DD'
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}



// Function to toggle the visibility of modalEditPlayer
function showEditModal() {
  const modalEditPlayer = document.getElementById('modalEditPlayer');
  console.log('Toggling Edit Modal');
  modalEditPlayer.classList.remove('hidden');
}
// Function to toggle the visibility of modalEditPlayer
function hideEditModal() {
  const modalEditPlayer = document.getElementById('modalEditPlayer');
  console.log('Toggling Edit Modal');
  modalEditPlayer.classList.add('hidden');
}

// Function to toggle the visibility of modalRemovePlayer
function showRemoveModal() {
  const modalRemovePlayer = document.getElementById('modalRemovePlayer');
  console.log('Toggling Remove Modal');
  modalRemovePlayer.classList.remove('hidden');
}
// Function to toggle the visibility of modalRemovePlayer
function hideRemoveModal() {
  const modalRemovePlayer = document.getElementById('modalRemovePlayer');
  console.log('Toggling Remove Modal');
  modalRemovePlayer.classList.add('hidden');
}
