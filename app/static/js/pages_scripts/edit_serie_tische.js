
document.addEventListener('DOMContentLoaded', function () {
  const modalEditSerie = document.getElementById('modalEditSerie')
  const championshipID = modalEditSerie.getAttribute('data-champioship-id')
  const seriesID = parseInt(modalEditSerie.getAttribute('data-serie-id'))

  const closeModalEditSerieTische = document.getElementById('closeModalEditSerieTische');
  closeModalEditSerieTische.addEventListener('click', () => {
    // Get the championship data from the row
    window.location.href = "/series.html"

  });
  const openModalSelectSeriesID = document.getElementById('btnSortSeriesBySeriesIdResults');
  openModalSelectSeriesID.addEventListener('click', () => {
    openSelectSeriesID()
  });
  const btnCreateTischeBasedOnTableSeriePlayers = document.getElementById('btnCreateTischeBasedOnTableSeriePlayers');
  btnCreateTischeBasedOnTableSeriePlayers.addEventListener('click', () => {
    gatherDataAndSendPostRequest()
  });

  const closeModalSelectSeriesID = document.getElementById('closeModalSelectSeriesID');
  closeModalSelectSeriesID.addEventListener('click', () => {
    closeSelectSeriesID()
  });
  const btnShufflePlayersSerieTische = document.getElementById('btnShufflePlayersSerieTische');
  btnShufflePlayersSerieTische.addEventListener('click', () => {
    shuffleTablePlayers()
  });
  const btnSortSeriesByOverallResults = document.getElementById('btnSortSeriesByOverallResults');
  btnSortSeriesByOverallResults.addEventListener('click', () => {
    const selectedSeriesID = 0; // Special identifier for overall results
    if (isNaN(selectedSeriesID)) {
      alert('Please enter a valid series ID');
      return;
    }

    window.location.href = `/edit_serie_tische/${championshipID}/${seriesID}/${selectedSeriesID}`;

  })
  const btnSubmitSeriesID = document.getElementById('btnSubmitSeriesID');
  btnSubmitSeriesID.addEventListener('click', () => {

    const inputSelectSeriesID = document.getElementById('inputSelectSeriesID');
    const selectedSeriesID = parseInt(inputSelectSeriesID.value, 10); // Adding radix 10

    if (isNaN(selectedSeriesID)) {
      alert('Please enter a valid series ID');
      return;
    }
    if (selectedSeriesID >= seriesID) {
      alert(`input a series ID lower than ${seriesID}`)
    }
    else {
      // Check if the selectedSeriesID belongs to the same championship
      fetch(`/api/check_series?championship_id=${championshipID}&selected_series_id=${selectedSeriesID}`)
        .then(response => response.json())
        .then(data => {
          if (data.belongs) {
            // Navigate to the new URL
            window.location.href = `/edit_serie_tische/${championshipID}/${seriesID}/${selectedSeriesID}`;
          } else {
            alert('Selected series ID does not belong to the same championship.');
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('An error occurred while checking the series.');
        });
    }
  });

  const movePlayerOutButtons = document.querySelectorAll('.btnMovePlayerOut');

  // Add event listener to each button
  movePlayerOutButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Get the parent row (tr) of the clicked button
      const playerRow = button.closest('tr');

      // Get the data-player-id attribute of the row
      const playerId = playerRow.getAttribute('data-player-id');

      // Remove the row from the DOM
      playerRow.remove();

      // Invoke the applyRowGrouping method
      applyRowGrouping('tableSeriePlayers');

      console.log(`Player with ID ${playerId} removed`);
    });
  });

  // const btnSendDataToServer = document.getElementById("btnSaveChangesModalEditTeams")
  // btnSendDataToServer.addEventListener('click', () => {
  //   sendDataToServer()
  // })

  // Get the input element
  const searchSeriePlayersInput = document.getElementById('searchSeriePlayer');

  // Add an event listener to the input field
  searchSeriePlayersInput.addEventListener('input', () => {
    // Get the value of the input field
    const searchTerm = searchSeriePlayersInput.value.toLowerCase();
    console.log(searchTerm)

    // Get all <tr> elements
    const playerRows = document.querySelectorAll('#tableSeriePlayers tbody tr');

    // Loop through each <tr> element
    playerRows.forEach(row => {
      // Get the player name and player ID from the <td> elements inside the <tr>
      const playerName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();

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

  document.addEventListener('change', function (event) {
    const checkbox = event.target;
    if (checkbox.type === 'checkbox' && checkbox.checked) {
      const checkboxes = document.querySelectorAll('tr input[type="checkbox"]');
      checkboxes.forEach(cb => {
        if (cb !== checkbox) {
          cb.checked = false;
        }
      });
    }
  });
  document.addEventListener('keydown', function (event) {
    if (event.altKey && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      const checkedRows = document.querySelectorAll('tr input[type="checkbox"]:checked');
      checkedRows.forEach(row => {
        const currentRow = row.closest('tr');
        const nextRow = currentRow.nextElementSibling;
        const previousRow = currentRow.previousElementSibling;

        if (event.key === 'ArrowDown' && nextRow) {
          nextRow.parentNode.insertBefore(nextRow, currentRow);
          nextRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else if (event.key === 'ArrowUp' && previousRow) {
          currentRow.parentNode.insertBefore(currentRow, previousRow);
          currentRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
      applyRowGrouping('tableSeriePlayers');
    }
  });

  applyRowGrouping('tableSeriePlayers');

})

function applyRowGrouping(tableId) {
  const table = document.getElementById(tableId);
  const seek4er = table.getAttribute('data-serie-seek4er') === 'True';
  const rows = Array.from(table.querySelectorAll('tbody tr'));
  const totalRows = rows.length;

  if (totalRows !== 5) {
    let remainder = seek4er ? totalRows % 4 : totalRows % 3;
    let regularGroups = seek4er ? Math.floor(totalRows / 4) : Math.floor(totalRows / 3);
    let extraGroups = 0;

    if (seek4er) {
      if (remainder === 1) {
        extraGroups = 3;
        regularGroups = Math.floor((totalRows - 9) / 4);
      } else if (remainder === 2) {
        extraGroups = 2;
        regularGroups = Math.floor((totalRows - 6) / 4);
      } else if (remainder === 3) {
        extraGroups = 1;
        regularGroups = Math.floor((totalRows - 3) / 4);
      }
    } else {
      if (remainder === 1) {
        extraGroups = 1;
        regularGroups = Math.floor((totalRows - 4) / 3);
      } else if (remainder === 2) {
        extraGroups = 2;
        regularGroups = Math.floor((totalRows - 8) / 3);
      }
    }

    rows.forEach((row, index) => {
      let groupIndex;
      if (seek4er) {
        if (index >= totalRows - (extraGroups * 3)) {
          groupIndex = regularGroups + Math.floor((index - (totalRows - (extraGroups * 3))) / 3);
        } else {
          groupIndex = Math.floor(index / 4);
        }
      } else {
        if (remainder === 0) {
          groupIndex = Math.floor(index / 3);
        } else {
          if (remainder === 1 && index < 4) {
            groupIndex = 0;
          } else if (remainder === 2 && index < 8) {
            groupIndex = Math.floor(index / 4);
          } else {
            groupIndex = Math.floor((index - (remainder === 1 ? 4 : 8)) / 3) + (remainder > 0 ? remainder : 0);
          }
        }
      }

      row.setAttribute('data-tisch-index', groupIndex + 1);  // Add group index for debugging

      // Replace the content of the specific <td> element with data-tisch-index value
      const tischCell = row.querySelector('td:nth-child(4)');
      if (tischCell) {
        tischCell.textContent = groupIndex + 1;
      }

      const bgColor = groupIndex % 2 === 0 ? 'bg-gray-200' : 'bg-gray-300';
      row.classList.remove('bg-gray-200', 'bg-gray-300'); // Remove previous background color
      row.classList.add(bgColor);
    });
  }
}

async function gatherDataAndSendPostRequest() {
  // Step 1: Loop through all tr elements to gather data-player-id and data-tisch-index
  const rows = document.querySelectorAll('#tableSeriePlayers tbody tr');
  const tischData = {};

  rows.forEach(row => {
    const playerId = row.getAttribute('data-player-id');
    const tischIndex = row.getAttribute('data-tisch-index');

    if (!tischData[tischIndex]) {
      tischData[tischIndex] = [];
    }
    tischData[tischIndex].push(playerId);
  });

  // Step 2: Get data-championship-id and data-serie-id from the div
  const modalEditSerie = document.getElementById('modalEditSerie');
  const championshipId = modalEditSerie.getAttribute('data-championship-id');
  const seriesId = modalEditSerie.getAttribute('data-serie-id');

  // Step 3: Get series name from the span
  const spanSerieName = document.getElementById('spanSerieName');
  const seriesName = spanSerieName.getAttribute('data-serie-name');

  // Step 4: Check if there are existing records with TotalPoints > 0
  const checkResponse = await fetch(`/check_series_player_records?series_id=${seriesId}`);
  const checkData = await checkResponse.json();

  if (checkData.exists) {
    alert('Couldn\'t create tables because there are already results assigned to players in this series');
    return;
  }

  // Step 5: Check if there are existing tische for the series
  const tischeResponse = await fetch(`/check_existing_tische?series_id=${seriesId}`);
  const tischeData = await tischeResponse.json();

  if (tischeData.exists) {
    const deleteResponse = await fetch(`/delete_existing_tische?series_id=${seriesId}`, { method: 'DELETE' });
    const deleteData = await deleteResponse.json();

    if (!deleteData.success) {
      alert('Failed to delete existing tische');
      return;
    }
  }

  // Step 6: Gather all data into a JSON object
  const requestData = {
    championship_id: championshipId,
    series_id: seriesId,
    series_name: seriesName,
    tisch_data: tischData
  };

  // Step 7: Send a POST request with the gathered data
  fetch('/build_edited_tische', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData)
  })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      alert(`Tische from ${requestData.series_name} were created successfully`);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}


// Example: Attach the function to a button click event
// const btnSendData = document.getElementById('btnSendData');
// btnSendData.addEventListener('click', gatherDataAndSendPostRequest);






function openSelectSeriesID() {
  const divSelectSeriesID = document.getElementById('divSelectSeriesID');
  divSelectSeriesID.classList.remove('hidden');

}

function closeSelectSeriesID() {
  // Get the championship data from the row
  const divSelectSeriesID = document.getElementById('divSelectSeriesID');
  divSelectSeriesID.classList.add('hidden');

}

function shuffleTablePlayers() {
  const table = document.getElementById('tableSeriePlayers');
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));

  // Shuffle the rows array
  for (let i = rows.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rows[i], rows[j]] = [rows[j], rows[i]];
  }

  // Clear the tbody
  tbody.innerHTML = '';

  // Append the shuffled rows
  rows.forEach(row => tbody.appendChild(row));
  applyRowGrouping('tableSeriePlayers')
}