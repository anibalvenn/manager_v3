import formatDate from '../utils'
document.addEventListener('DOMContentLoaded', function () {

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
                    alert('Player added successfully');
                    // Clear input fields
                    document.getElementById('inputPlayerName').value = '';
                    document.getElementById('inputPlayerBirth').value = '';
                    document.querySelector('input[name="sex"]:checked').checked = false;
                    document.getElementById('inputPlayerCountry').value = '';
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
