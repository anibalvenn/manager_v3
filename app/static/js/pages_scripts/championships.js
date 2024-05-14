
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
  const closeModalEditChampionship = document.getElementById('closeModalEditChampionship');
  closeModalEditChampionship.addEventListener('click', () => {
    console.log('Closing Edit modal');
    hideEditModal();
  });

  // Event listener for closing the "Remove" modal
  const closeModalRemoveChampionship = document.getElementById('closemodalRemoveChampionship');
  closeModalRemoveChampionship.addEventListener('click', () => {
    console.log('Closing Remove modal');
    hideRemoveModal();
  });


  const btnAddNewChampionship = document.getElementById('btnAddNewChampionship')
  btnAddNewChampionship.addEventListener('click', function () {
    // Get input field values
    const championshipName = document.getElementById('inputChampionshipName').value;
    const championshipStart = document.getElementById('inputChampionshipStart').value;
    const championshipAcronym = document.getElementById('inputChampionshipAcronym').value;

    // Check if all fields are filled
    if (championshipName.trim() && championshipStart.trim() && championshipAcronym.trim()) {
      // Parse and format birthdate
      const championshipBirth = formatDate(new Date(championshipStart));

      // Send an HTTP POST request to the backend
      fetch('/add_championship', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          championshipName: championshipName,
          championshipStart: championshipStart,
          championshipAcronym: championshipAcronym
        })
      })
        .then(response => {
          if (response.ok) {
            window.location.reload()
            // // Clear input fields
            // document.getElementById('inputChampionshipName').value = '';
            // document.getElementById('inputChampionshipStart').value = '';
            // document.getElementById('inputChampionshipAcronym').value = '';
          } else {
            throw new Error('Failed to add championship');
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Failed to add championship');
        });
    } else {
      // If any field is empty, alert the user
      alert('Please fill in all fields.');
    }
  });
});



document.addEventListener('DOMContentLoaded', function () {
  const btnRemoveChampionship = document.getElementById('btnRemoveChampionship');

  const championshipTableBody = document.getElementById('championshipTableBody');

  function createChampionshipRow(championship) {
    const row = document.createElement('tr');
    row.id = championship.championshipID; // Set the id of the row to championship acronym

    // Create and append table cells for each championship property
    const nameCell = document.createElement('td');
    nameCell.textContent = championship.name;
    row.appendChild(nameCell);

    const startDateCell = document.createElement('td');
    startDateCell.textContent = championship.start_date;
    row.appendChild(startDateCell);

    const acronymCell = document.createElement('td');
    acronymCell.textContent = championship.acronym;
    row.appendChild(acronymCell);

    // Create and append edit button
    const editCell = document.createElement('td');
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = 'bg-yellow-600 text-white hover:bg-yellow-900 px-3 py-1 rounded-md edit-button';
    editButton.addEventListener('click', () => {
      // Get the championship data from the row
      const championshipName = row.cells[0].textContent.trim();
      const championshipStart = row.cells[1].textContent.trim();
      const championshipAcronym = row.cells[2].textContent.trim();

      // Fill the form fields with the championship data
      document.getElementById('editChampionshipName').value = championshipName;
      document.getElementById('editChampionshipStart').value = championshipStart;
      document.getElementById('editChampionshipAcronym').value = championshipAcronym;

      const modalEditChampionship = document.getElementById('modalEditChampionship');
      modalEditChampionship.setAttribute('data-championship-id', championship.championshipID);


      showEditModal();
    });
    editCell.appendChild(editButton);
    row.appendChild(editCell);

    // Create and append remove button
    const removeCell = document.createElement('td');
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Delete';
    removeButton.className = 'bg-red-600 text-white hover:bg-red-900 px-3 py-1 rounded-md remove-button';
    removeButton.addEventListener('click', () => {
      const spanRemoveChampionship = document.getElementById('spanRemoveChampionship');
      spanRemoveChampionship.textContent = championship.name;

      const modalRemoveChampionship = document.getElementById('modalRemoveChampionship');
      modalRemoveChampionship.setAttribute('data-championship-id', championship.championshipID);

      // Add event listener to the "Delete" button
      btnRemoveChampionship.addEventListener('click', handleDeleteChampionship);

      showRemoveModal();
    });
    removeCell.appendChild(removeButton);
    row.appendChild(removeCell);

    // Create and append players cell
    const playersCell = document.createElement('td');
    const playersButton = document.createElement('button');
    playersButton.textContent = 'Players';
    playersButton.className = 'bg-green-500 text-white hover:bg-green-600 px-3 py-1 rounded-md players-button';
    playersButton.addEventListener('click', () => {
      console.log(championship.championshipID)
      window.location.href = `/championship_players/${championship.championshipID}`;

    });
    playersCell.appendChild(playersButton);
    row.appendChild(playersCell);

    return row;
  }


  // Function to render championship data in the table
  function renderChampionships(championships) {
    // Clear existing table rows
    championshipTableBody.innerHTML = '';

    // Generate table rows for each championship and append to table body
    championships.forEach(championship => {
      const row = createChampionshipRow(championship);
      championshipTableBody.appendChild(row);
    });
  }

  // Fetch championship data from the server
  fetch('/get_championships')
    .then(response => response.json())
    .then(data => {
      renderChampionships(data); // Render fetched data in the table
    })
    .catch(error => {
      console.error('Error fetching championship data:', error);
    });


  const formEditChampionship = document.getElementById('formEditChampionship');

  formEditChampionship.addEventListener('submit', function (event) {
    event.preventDefault();

    // Get the championship ID from the modal attribute
    const championshipId = document.getElementById('modalEditChampionship').getAttribute('data-championship-id');

    // Get the values from the form fields
    const championshipName = document.getElementById('editChampionshipName').value;
    const championshipStart = document.getElementById('editChampionshipStart').value;
    const championshipAcronym = document.getElementById('editChampionshipAcronym').value;

    // Send an HTTP POST request to the backend to update the championship
    fetch(`/update_championship/${championshipId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: championshipName,
        acronym: championshipAcronym,
        creation_date: championshipStart // Assuming the creation date is also being updated
      })
    })
      .then(response => {
        if (response.ok) {
          window.location.reload()
        } else {
          throw new Error('Failed to update championship');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to update championship');
      });
  });

  // Get the input element
  const inputSearchChampionship = document.getElementById('championshipSearch');

  // Add an event listener to the input field
  inputSearchChampionship.addEventListener('input', () => {
    console.log('input')
    // Get the value of the input field
    const searchTerm = inputSearchChampionship.value.toLowerCase();

    // Get all <tr> elements
    const championshipRows = document.querySelectorAll('#championshipTable tbody tr');

    // Loop through each <tr> element
    championshipRows.forEach(row => {
      // Get the player name and player ID from the <td> elements inside the <tr>
      const championshipName = row.querySelector('td:nth-child(1)').textContent.toLowerCase();

      // Check if the player name or player ID contains the search term
      if (championshipName.includes(searchTerm)) {
        // If it does, display the row
        row.style.display = 'table-row';
      } else {
        // If not, hide the row
        row.style.display = 'none';
      }
    });
  });

});


function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
// Function to toggle the visibility of modalEditChampionship
function showEditModal() {
  const modalEditChampionship = document.getElementById('modalEditChampionship');
  modalEditChampionship.classList.remove('hidden');
}
// Function to toggle the visibility of modalEditChampionship
function hideEditModal() {
  const modalEditChampionship = document.getElementById('modalEditChampionship');
  modalEditChampionship.classList.add('hidden');
}

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

function renderEditPlayers() {

}
