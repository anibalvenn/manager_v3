document.addEventListener('DOMContentLoaded', function () {
  console.log("loaded")

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
});
