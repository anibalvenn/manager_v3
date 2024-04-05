
document.addEventListener('DOMContentLoaded', function () {
  console.log("loaded")

  // Function to toggle the visibility of modalEditChampionship
  function showEditModal() {
    const modalEditChampionship = document.getElementById('modalEditChampionship');
    console.log('Toggling Edit Modal');
    modalEditChampionship.classList.remove('hidden');
  }
  // Function to toggle the visibility of modalEditChampionship
  function hideEditModal() {
    const modalEditChampionship = document.getElementById('modalEditChampionship');
    console.log('Toggling Edit Modal');
    modalEditChampionship.classList.add('hidden');
  }

  // Function to toggle the visibility of modalRemoveChampionship
  function showRemoveModal() {
    const modalRemoveChampionship = document.getElementById('modalRemoveChampionship');
    console.log('Toggling Remove Modal');
    modalRemoveChampionship.classList.remove('hidden');
  }
  // Function to toggle the visibility of modalRemoveChampionship
  function hideRemoveModal() {
    const modalRemoveChampionship = document.getElementById('modalRemoveChampionship');
    console.log('Toggling Remove Modal');
    modalRemoveChampionship.classList.add('hidden');
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
    if (championshipName.trim() && championshipStart.trim()&& championshipAcronym.trim()) {
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
            alert('championship added successfully');
            // Clear input fields
            document.getElementById('inputChampionshipName').value = '';
            document.getElementById('inputChampionshipStart').value = '';
            document.getElementById('inputChampionshipAcronym').value = '';
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

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}