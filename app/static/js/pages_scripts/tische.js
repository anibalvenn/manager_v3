document.addEventListener('DOMContentLoaded', function () {

  let currentSerieID = localStorage.getItem('currentSerieID')
  console.log('current serie', currentSerieID)
  let currentSerieName = decodeURIComponent(localStorage.getItem('currentSerieName'))


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
    posAcell.textContent = parseInt(tisch.idPosA) > 0 ? `${tisch.namePosA.substring(0, 15)}, ${tisch.idPosA}` : '';
    row.appendChild(posAcell);

    const posBcell = document.createElement('td');
    posBcell.textContent = parseInt(tisch.idPosB) > 0 ? `${tisch.namePosB.substring(0, 15)}, ${tisch.idPosB}` : '';
    row.appendChild(posBcell);

    const posCcell = document.createElement('td');
    posCcell.textContent = parseInt(tisch.idPosC) > 0 ? `${tisch.namePosC.substring(0, 15)}, ${tisch.idPosC}` : '';
    row.appendChild(posCcell);

    const posDcell = document.createElement('td');
    posDcell.textContent = parseInt(tisch.idPosD) > 0 ? `${tisch.namePosD.substring(0, 15)}, ${tisch.idPosD}` : '';
    row.appendChild(posDcell);



    // Create and append edit button
    const editCell = document.createElement('td');
    const editButton = document.createElement('button');
    editButton.textContent = 'Insert results';
    editButton.className = 'bg-green-600 text-white hover:bg-green-900 px-3 py-1 rounded-md edit-button';
    editButton.addEventListener('click', () => {
      // Get the championship data from the row
      const tischRow = editButton.closest('tr');
      const tischId = tischRow.getAttribute('data-tisch-id')

      if (tischId) {
        window.location.href = `edit_tisch_results/${tischId}`;
      }
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