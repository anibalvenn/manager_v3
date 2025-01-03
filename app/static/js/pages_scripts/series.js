document.addEventListener('DOMContentLoaded', function () {

  let currentChampionshipID = localStorage.getItem('currentChampionshipID')
  let currentChampionshipName = decodeURIComponent(localStorage.getItem('currentChampionshipName'))
  let currentChampionshipAcronym = localStorage.getItem('currentChampionshipAcronym')

  document.getElementById('inputCounterSeries').addEventListener('input', function (event) {
    const newValue = event.target.value;
    const spanSeriesCounter = document.getElementById('spanSeriesCounter')
    spanSeriesCounter.innerText = newValue
    // You can perform further actions with the new value here
  });
  document.getElementById('closeConfirmSeriesDeletionModal').addEventListener('click', function (event) {
    hidePasswordModal()
    // You can perform further actions with the new value here
  });

  document.getElementById('btnConfirmSeriesDeletion').addEventListener('click', function () {
    // Get the password value
    const password = document.getElementById('password').value;

    // Get the series ID from the modal's data attribute
    const modal = document.getElementById('modalCheckPasswordToSeriesDeletion');
    const seriesId = modal.getAttribute('data-serie-id');

    // Check if the password and series ID are provided
    if (!password || !seriesId) {
      alert('Both password and series ID are required');
      return;
    }

    // Send the POST request to the backend
    fetch('/delete_series', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: password,
        series_id: seriesId
      })
    })
      .then(response => response.json())
      .then(data => {

        if (data.success) {
          // Find the <tr> with the matching data-serie-id and remove it
          const rows = document.querySelectorAll('#serienTableBody tr');
          rows.forEach(row => {
            if (row.getAttribute('data-serie-id') === seriesId) {
              row.remove();
            }
          });
          hidePasswordModal()
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });



  function getSelectedValue() {
    const selectedRadio = document.querySelector('input[name="ranking"]:checked');
    if (selectedRadio) {
      let selectedType = selectedRadio.value;
      const spanMirrorSeriesType = document.getElementById('spanMirrorSeriesType')
      spanMirrorSeriesType.innerText = selectedType
    }
  }

  // Get all radio buttons with name 'ranking'
  const radioButtons = document.querySelectorAll('input[name="ranking"]');

  // Add change event listener to each radio button
  radioButtons.forEach(radio => {
    radio.addEventListener('change', getSelectedValue);
  });

  // Call the function initially to get the default selected value
  getSelectedValue();
  const btnAddSeries = document.getElementById('btnAddSeries')
  btnAddSeries.addEventListener('click', function (event) {

    const seriesAmount = document.getElementById('inputCounterSeries').value;
    const playersPerTischAmount = document.getElementById('inputCounterPlayersPerTisch').value;
    const selectedType = document.querySelector('input[name="ranking"]:checked').value;
    if (selectedType.toLowerCase() == 'random') {

      fetch('/build_all_random_series', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          randomSeriesAmount: seriesAmount,
          playersPerRandomTischAmount: playersPerTischAmount,
          currentChampionshipID: currentChampionshipID,
          currentChampionshipName: currentChampionshipName,
          currentChampionshipAcronym: currentChampionshipAcronym
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
    } else if (selectedType.toLowerCase() == 'ranked') {
      // Send an HTTP POST request to the backend
      fetch('/add_ranked_series', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rankedSeriesAmount: seriesAmount,
          playersPerRankedTischAmount: playersPerTischAmount,
          currentChampionshipID: currentChampionshipID,
          currentChampionshipName: currentChampionshipName,
          currentChampionshipAcronym: currentChampionshipAcronym
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
      console.log('series type doesnt exist')
    }
  });


  const serienTableBody = document.getElementById('serienTableBody');

  if (currentChampionshipID) {
    // Fetch championship data from the server
    fetch(`/get_serien/${currentChampionshipID}`)
      .then(response => response.json())
      .then(data => {
        renderSerien(data); // Render fetched data in the table
      })
      .catch(error => {
        console.error('Error fetching championship data:', error);
      });

  }
  function createSerieRow(serie) {
    const row = document.createElement('tr');
    row.setAttribute('data-serie-id', serie.serieID);


    // Create and append table cells for each championship property
    const nameCell = document.createElement('td');
    nameCell.textContent = serie.serieName;
    row.appendChild(nameCell);

    const idCell = document.createElement('td');
    idCell.textContent = serie.serieID;
    row.appendChild(idCell);

    const typeCell = document.createElement('td');
    let type = serie.isRandomSerie ? 'Random' : 'Ranked';
    typeCell.textContent = type
    row.appendChild(typeCell);

    const playersPerTisch = document.createElement('td');
    let seek4er = serie.seek_4er_tische ? '4' : '3';
    playersPerTisch.textContent = seek4er
    row.appendChild(playersPerTisch);

    // Create and append edit button
    const editCell = document.createElement('td');
    const editButton = document.createElement('button');
    editButton.textContent = 'Sort Players';
    editButton.className = 'bg-yellow-600 text-white hover:bg-yellow-900 px-3 py-1 rounded-md edit-button';
    editButton.addEventListener('click', () => {
      // Get the championship data from the row
      const serieRow = editButton.closest('tr');
      const serieIdInRow = serieRow.getAttribute('data-serie-id')

      window.location.href = `/edit_serie_tische/${currentChampionshipID}/${serieIdInRow}`;

    });
    editCell.appendChild(editButton);
    row.appendChild(editCell);

    // Create and append remove button
    const simpleSeriesResultsCell = document.createElement('td');
    const simpleSeriesResultsBtn = document.createElement('button');
    simpleSeriesResultsBtn.textContent = 'Insert Results';
    simpleSeriesResultsBtn.className = 'bg-green-600 text-white hover:bg-green-900 px-3 py-1 rounded-md';
    simpleSeriesResultsBtn.addEventListener('click', () => {
      // Get the championship data from the row
      const serieRow = simpleSeriesResultsBtn.closest('tr');
      const serieIdInRow = serieRow.getAttribute('data-serie-id')

      window.location.href = `/simple_serie_results/${currentChampionshipID}/${serieIdInRow}`;

    });

    simpleSeriesResultsCell.appendChild(simpleSeriesResultsBtn);
    row.appendChild(simpleSeriesResultsCell);

    const deleteSeriesCell = document.createElement('td');
    const deleteSeriesBtn = document.createElement('button');
    deleteSeriesBtn.textContent = 'Delete';
    deleteSeriesBtn.className = 'bg-red-600 text-white hover:bg-red-900 px-3 py-1 rounded-md';
    deleteSeriesBtn.addEventListener('click', () => {
      // Get the championship data from the row
      const serieRow = deleteSeriesBtn.closest('tr');
      const serieIdInRow = serieRow.getAttribute('data-serie-id')

      showPasswordModal(serieIdInRow)

      // window.location.href = `/delete_serie/${serieIdInRow}`;

    });

    deleteSeriesCell.appendChild(deleteSeriesBtn);
    row.appendChild(deleteSeriesCell);
    return row;



  };
  // Function to render championship data in the table
  function renderSerien(serien) {
    // Clear existing table rows
    serienTableBody.innerHTML = '';

    // Generate table rows for each championship and append to table body
    serien.forEach(serie => {
      const row = createSerieRow(serie);
      serienTableBody.appendChild(row);
    });
  }

})

// Method to show the modal
function showPasswordModal(seriesId) {
  const modal = document.getElementById('modalCheckPasswordToSeriesDeletion');
  modal.setAttribute('data-serie-id', seriesId)
  const spanSeriesId = document.getElementById('spanSeriesId');
  spanSeriesId.innerText = seriesId
  modal.classList.remove('hidden');  // Remove the 'hidden' class to show the modal
}

// Method to hide the modal
function hidePasswordModal() {
  const modal = document.getElementById('modalCheckPasswordToSeriesDeletion');
  modal.removeAttribute('data-serie-id')
  const spanSeriesId = document.getElementById('spanSeriesId');
  spanSeriesId.innerText = ''
  modal.classList.add('hidden');  // Add the 'hidden' class to hide the modal
}
