document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('btnCreateNewTeam').addEventListener('click', function () {
    window.location.href = '/edit_team_players/1/0'; // Redirect to edit_team_players.html
  });
})


document.addEventListener('DOMContentLoaded', function () {

  const championshipTableBody = document.getElementById('teamTableBody');

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
      console.log("remove")
    });
    removeCell.appendChild(removeButton);
    row.appendChild(removeCell);



    return row;
  }


  // Function to render championship data in the table
  function renderTeams(teams) {
    // Clear existing table rows
    championshipTableBody.innerHTML = '';

    // Generate table rows for each championship and append to table body
    teams.forEach(team => {
      const row = createTeamRow(team);
      championshipTableBody.appendChild(row);
    });
  }

  // Fetch championship data from the server
  fetch('/get_teams/2')
    .then(response => response.json())
    .then(data => {
      renderTeams(data); // Render fetched data in the table
    })
    .catch(error => {
      console.error('Error fetching championship data:', error);
    });



 

});






// Function to toggle the visibility of modalRemoveChampionship
function showRemoveModal() {
  const modalRemoveChampionship = document.getElementById('modalRemoveChampionship');
  modalRemoveChampionship.classList.remove('hidden');
}
// Function to toggle the visibility of modalRemoveChampionship
function hideRemoveModal() {
  const modalRemoveChampionship = document.getElementById('modalRemoveChampionship');
  modalRemoveChampionship.classList.add('hidden');
}
// Function to toggle the visibility of modalRemoveChampionship
function showEditPlayersModal() {
  const modalEditPlayersChampionship = document.getElementById('modalEditPlayersChampionship');
  modalEditPlayersChampionship.classList.remove('hidden');
}
// Function to toggle the visibility of modalEditPlayersChampionship
function hideEditPlayersModal() {
  const modalEditPlayersChampionship = document.getElementById('modalEditPlayersChampionship');
  modalEditPlayersChampionship.classList.add('hidden');
}

function deleteChampionship(rowID) {
  const championshipId = rowID; // Get the championship ID from the row id
  // Send an HTTP DELETE request to the backend to delete the championship
  fetch(`/delete_championship/${championshipId}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (response.ok) {
        alert('Championship removed successfully');
        // Find the row with the matching ID and remove it
        const rowToRemove = document.getElementById(championshipId);
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

function handleDeleteChampionship() {
  const btnRemoveChampionship = document.getElementById('btnRemoveChampionship');

  const modalRemoveChampionship = document.getElementById('modalRemoveChampionship');
  const championshipId = modalRemoveChampionship.getAttribute('data-championship-id');
  deleteChampionship(championshipId);
  hideRemoveModal();

  // Remove event listener from the "Delete" button
  btnRemoveChampionship.removeEventListener('click', handleDeleteChampionship);
}

