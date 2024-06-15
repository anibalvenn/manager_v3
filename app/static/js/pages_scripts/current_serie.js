document.addEventListener('DOMContentLoaded', function () {
  let currentChampionshipID = localStorage.getItem('currentChampionshipID');
  let currentSerieName = localStorage.getItem('currentSerieName');
  if (currentSerieName) {
    setHeaderCurrentSerieName(currentSerieName)
  }

  const changeSerieButton = document.getElementById('btnChangeCurrentSerie');
  const chooseSerieContainer = document.getElementById('chooseCurrentSerie');

  // Hide the container initially
  chooseSerieContainer.style.display = 'none';

  changeSerieButton.addEventListener('click', function () {
    // Toggle the visibility of the container
    if (chooseSerieContainer.style.display === 'none') {
      chooseSerieContainer.style.display = 'flex';
      // Make an AJAX request to get championships data
      fetch(`/get_serien/${currentChampionshipID}`)
        .then(response => response.json())
        .then(serien => {
          // Update the table with the received data
          const tableBody = document.querySelector('#tableSelectSeries tbody');
          tableBody.innerHTML = ''; // Clear existing table rows

          serien.forEach(serie => {
            const row = document.createElement('tr');
            row.dataset.serieId = serie.serieID; // Set the data-serie-id attribute

            row.innerHTML = `
              <td class="truncate w-20">${serie.serieName}</td>
              <td class="truncate w-12">${serie.serieID}</td>
              <td class="truncate w-12">
                <button onclick='setCurrentSerie(${serie.serieID}, "${escape(serie.serieName)}")' class="btnSelectCurrentSerie bg-green-500 text-white px-1 rounded">
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
      chooseSerieContainer.style.display = 'none';
    }
  });

  document.getElementById('btnCloseCurrentSeries').addEventListener('click', () => {
    const modal = document.getElementById('chooseCurrentSerie');
    modal.style.display = 'none';
  });
});

function setCurrentSerie(currentSerieID, currentSerieName) {
  localStorage.setItem('currentSerieID', currentSerieID);
  localStorage.setItem('currentSerieName', currentSerieName);
  setHeaderCurrentSerieName(currentSerieName);
  window.location.reload();
}

function setHeaderCurrentSerieName(serieName) {
  const header = document.getElementById('spanCurrentSerieName');
  if (header) {
    header.innerText = serieName
  }
}
