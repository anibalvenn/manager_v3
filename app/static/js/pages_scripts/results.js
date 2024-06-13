document.addEventListener('DOMContentLoaded', function () {

  let currentChampionshipID = localStorage.getItem('currentChampionshipID')
  let currentChampionshipName = localStorage.getItem('currentChampionshipName')


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
    // row.classList.add('items-center')


    // Create and append table cells for each championship property
    const nameCell = document.createElement('td');
    nameCell.textContent = serie.serieName;
    row.appendChild(nameCell);

    const idCell = document.createElement('td');
    idCell.textContent = serie.serieID;
    row.appendChild(idCell);

    // Create and append simple results button
    const simpleResultsCell = document.createElement('td');
    const simpleResultsButton = document.createElement('button');
    simpleResultsButton.textContent = 'Simple Results';
    simpleResultsButton.className = 'bg-yellow-600 text-white hover:bg-yellow-900 px-3 py-1 rounded-md edit-button';
    simpleResultsButton.addEventListener('click', () => {
      // Get the championship data from the row
      const serieRow = simpleResultsButton.closest('tr');
      const serieIdInRow = serieRow.getAttribute('data-serie-id')

      window.location.href = `/simple_serie_results/${currentChampionshipID}/${serieIdInRow}`;

    });
    simpleResultsCell.appendChild(simpleResultsButton);
    row.appendChild(simpleResultsCell);

    // Create and append complete results button
    const completeResultsCell = document.createElement('td');
    const completeResultsButton = document.createElement('button');
    completeResultsButton.textContent = 'Complete Results';
    completeResultsButton.className = 'bg-green-600 text-white hover:bg-green-900 px-3 py-1 rounded-md edit-button';
    completeResultsButton.addEventListener('click', () => {
      // Get the championship data from the row
      const serieRow = completeResultsButton.closest('tr');
      const serieIdInRow = serieRow.getAttribute('data-serie-id')

      window.location.href = `/complete_serie_results/${currentChampionshipID}/${serieIdInRow}`;//doesnt exist yet

    });
    completeResultsCell.appendChild(completeResultsButton);
    row.appendChild(completeResultsCell);

    // Create and append complete results button
    const printResultsCell = document.createElement('td');
    const printResultsButton = document.createElement('button');
    printResultsButton.textContent = 'Print Results';
    printResultsButton.className = 'bg-blue-600 text-white hover:bg-blue-900 px-3 py-1 rounded-md edit-button';
    printResultsButton.addEventListener('click', () => {
      // Get the championship data from the row
      const serieRow = printResultsButton.closest('tr');
      const serieIdInRow = serieRow.getAttribute('data-serie-id')

      window.location.href = `/print_results/${currentChampionshipID}/${serieIdInRow}`;//doesnt exist yet

    });
    printResultsCell.appendChild(printResultsButton);
    row.appendChild(printResultsCell);
    
   
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