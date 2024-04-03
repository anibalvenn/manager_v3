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
});
