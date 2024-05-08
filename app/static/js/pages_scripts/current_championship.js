document.addEventListener('DOMContentLoaded', function () {
  const changeChampionshipButton = document.getElementById('btnChangeCurrentChampionship');
  const chooseChampionshipContainer = document.getElementById('chooseCurrentChampionship');

  // Hide the container initially
  chooseChampionshipContainer.style.display = 'none';

  changeChampionshipButton.addEventListener('click', function () {
    // Toggle the visibility of the container
    if (chooseChampionshipContainer.style.display === 'none') {
      chooseChampionshipContainer.style.display = 'flex';
      // Load the content of choose_current_championship.html into the container
      // Make an AJAX request to get championships data
      fetch('/get_championships')
        .then(response => response.json())
        .then(championships => {
          // Update the table with the received data
          const tableBody = document.querySelector('#tableSelectChampionships tbody');
          tableBody.innerHTML = ''; // Clear existing table rows

          championships.forEach(championship => {
            const row = document.createElement('tr');
            row.dataset.championshipId = championship.championshipID; // Set the data-championship-id attribute

            row.innerHTML = `
                <td class="truncate w-20">${championship.name}</td>
                <td class="truncate w-12">${championship.acronym}</td>
                <td class="truncate w-12">${championship.championshipID}</td>
                <td class="truncate w-12">
                    <button class="btnSelectCurrentChampionship bg-green-500 text-white px-1 rounded">
                        Select
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
          });

        })
        .catch(error => {
          console.error('Error fetching championships:', error);
        });

    } else {
      chooseChampionshipContainer.style.display = 'none';
    }
  });

  document.getElementById('searchCurrentChampionship').addEventListener('input', function () {
    const searchText = this.value.trim().toLowerCase();
    const rows = document.querySelectorAll('#tableSelectChampionships tbody tr');

    rows.forEach(row => {
      const name = row.querySelector('td:nth-child(1)').textContent.trim().toLowerCase();
      const acronym = row.querySelector('td:nth-child(2)').textContent.trim().toLowerCase();
      const id = row.querySelector('td:nth-child(3)').textContent.trim().toLowerCase();
      const matchesSearch = name.includes(searchText) || acronym.includes(searchText) || id.includes(searchText);

      if (matchesSearch) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });

  document.getElementById('btnCloseCurrentChampionships').addEventListener('click', ()=> {
    const modal = document.getElementById('chooseCurrentChampionship');
    modal.style.display = 'none';
  });
});
