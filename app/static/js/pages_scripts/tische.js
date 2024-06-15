document.addEventListener('DOMContentLoaded', function () {

  let currentSerieID = localStorage.getItem('currentSerieID')
  console.log('current serie', currentSerieID)
  let currentSerieName = localStorage.getItem('currentSerieName')


  const tischeTableBody = document.getElementById('tischeTableBody');

  if (currentSerieID) {
    // Fetch championship data from the server
    fetch(`/get_serie_tische/${currentSerieID}`)
      .then(response => response.json())
      .then(data => {
        renderTische(data); // Render fetched data in the table
      })
      .catch(error => {
        console.error('Error fetching championship data:', error);
      });

  }
  function createTischRow(tisch) {
    const row = document.createElement('tr');
    row.setAttribute('data-tisch-id', tisch.tischID);


    // Create and append table cells for each championship property
    const nameCell = document.createElement('td');
    nameCell.textContent = tisch.tischName;
    row.appendChild(nameCell);

    const idCell = document.createElement('td');
    idCell.textContent = tisch.tischID;
    row.appendChild(idCell);

    const posAcell = document.createElement('td');
    posAcell.textContent = tisch.posA;
    row.appendChild(posAcell);
    const posBcell = document.createElement('td');
    posBcell.textContent = tisch.posB;
    row.appendChild(posBcell);
    const posCcell = document.createElement('td');
    posCcell.textContent = tisch.posC;
    row.appendChild(posCcell);
    const posDcell = document.createElement('td');
    posDcell.textContent = tisch.posD;
    row.appendChild(posDcell);


    // Create and append edit button
    const editCell = document.createElement('td');
    const editButton = document.createElement('button');
    editButton.textContent = 'Sort Players';
    editButton.className = 'bg-yellow-600 text-white hover:bg-yellow-900 px-3 py-1 rounded-md edit-button';
    editButton.addEventListener('click', () => {
      // Get the championship data from the row
      const serieRow = editButton.closest('tr');
      const serieIdInRow = serieRow.getAttribute('data-tisch-id')

      window.location.href = `/edit_serie_tische/${currentChampionshipID}/${serieIdInRow}`;

    });
    editCell.appendChild(editButton);
    row.appendChild(editCell);


    return row;



  };
  // Function to render championship data in the table
  function renderTische(tische) {
    // Clear existing table rows
    tischeTableBody.innerHTML = '';

    // Generate table rows for each championship and append to table body
    tische.forEach(tisch => {
      const row = createTischRow(tisch);
      tischeTableBody.appendChild(row);
    });
  }

})