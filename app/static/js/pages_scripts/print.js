document.addEventListener('DOMContentLoaded', function () {

  let currentSerieID = localStorage.getItem('currentSerieID')
  let currentSerieName = decodeURIComponent(localStorage.getItem('currentSerieName'));
  let currentChampionshipID = localStorage.getItem('currentChampionshipID')

  const btnPreviewCurrentSeriesResults = document.getElementById('btnPreviewCurrentSeriesResults');
  btnPreviewCurrentSeriesResults.addEventListener('click', async () => {
    let currentSerieID = localStorage.getItem('currentSerieID');
    showCurrentSeriesResults(currentSerieID)
  });

  const btnPreviewOverallResults = document.getElementById('btnPreviewOverallResults');
  btnPreviewOverallResults.addEventListener('click', () => {
    showOverallResults(currentChampionshipID)
  });

  const btnPrintCurrentSeriesResults = document.getElementById('btnPrintCurrentSeriesResults');
  btnPrintCurrentSeriesResults.addEventListener('click', () => {
    // Get the championship data from the row
    generatePDFSeriesResult()
  });

  const btnPrintOverallResults = document.getElementById('btnPrintOverallResults');
  btnPrintOverallResults.addEventListener('click', () => {
    // Get the championship data from the row
    generatePDFOverallResults()
  });
  const btnPrintFrauenResults = document.getElementById('btnPrintFrauenResults');
  btnPrintFrauenResults.addEventListener('click', () => {
    // Get the championship data from the row
    generateFrauenResults()
  });

  const btnPrintCurrentSeriesListen = document.getElementById('btnPrintCurrentSeriesListen');
  btnPrintCurrentSeriesListen.addEventListener('click', () => {
    // Get the championship data from the row
    generateCurrentSeriesPdfListenComplete(currentSerieID)
  });

  const btnPrintCurrentSeriesListenDatei = document.getElementById('btnPrintCurrentSeriesListenDatei');
  btnPrintCurrentSeriesListenDatei.addEventListener('click', () => {
    // Get the championship data from the row
    generateCurrentSeriesPdfListenDatei(currentSerieID)
  });

  const btnPreviewOverallTeamsResults = document.getElementById('btnPreviewOverallTeamsResults');
  btnPreviewOverallTeamsResults.addEventListener('click', () => {
    // Get the championship data from the row
    previewOverallTeamsSeriesResults(currentChampionshipID)
  });
  const btnPrintOverallTeamsResults = document.getElementById('btnPrintOverallTeamsResults');
  btnPrintOverallTeamsResults.addEventListener('click', () => {
    // Get the championship data from the row
    generateOverallTeamsSeriesResultsPDF(currentChampionshipID)
  });
  const btnPrintPlayerZettel = document.getElementById('btnPrintPlayerZettel');
  btnPrintPlayerZettel.addEventListener('click', () => {
    // Get the championship data from the row
    generatePlayerZettelPDF(currentChampionshipID)
  });
  const btnPrintLostGamesList = document.getElementById('btnPrintLostGamesList');
  btnPrintLostGamesList.addEventListener('click', () => {
    // Get the championship data from the row
    generatePDFLostGamesList(currentChampionshipID)
  });
  const btnOpenJuniorBirthDateModal = document.getElementById('btnOpenJuniorBirthDateModal');
  btnOpenJuniorBirthDateModal.addEventListener('click', () => {
    // Get the championship data from the row
    openSelectJuniorBirthDate()
  });
  const closeModalSelectJuniorBirthDate = document.getElementById('closeModalSelectJuniorBirthDate');
  closeModalSelectJuniorBirthDate.addEventListener('click', () => {
    // Get the championship data from the row
    closeSelectJuniorBirthDate()
  });
  const btnOpenSeniorBirthDateModal = document.getElementById('btnOpenSeniorBirthDateModal');
  btnOpenSeniorBirthDateModal.addEventListener('click', () => {
    // Get the championship data from the row
    openSelectSeniorBirthDate()
  });
  const closeModalSelectSeniorBirthDate = document.getElementById('closeModalSelectSeniorBirthDate');
  closeModalSelectSeniorBirthDate.addEventListener('click', () => {
    // Get the championship data from the row
    closeSelectSeniorBirthDate()
  });

  const btnSubmitJuniorBirthDate = document.getElementById('btnSubmitJuniorBirthDate');
  btnSubmitJuniorBirthDate.addEventListener('click', () => {
    const dateInput = document.getElementById('inputSelectJuniorBirthDate').value;

    // Check if the date is valid
    if (!dateInput || isNaN(Date.parse(dateInput))) {
      alert('Please enter a valid date.');
    } else {
      // If the date is valid, invoke the submitJuniorBirthDate method
      generateJuniorResults(dateInput);
    }
    closeSelectJuniorBirthDate()
  });
  const btnSubmitSeniorBirthDate = document.getElementById('btnSubmitSeniorBirthDate');
  btnSubmitSeniorBirthDate.addEventListener('click', () => {
    const dateInput = document.getElementById('inputSelectSeniorBirthDate').value;

    // Check if the date is valid
    if (!dateInput || isNaN(Date.parse(dateInput))) {
      alert('Please enter a valid date.');
    } else {
      // If the date is valid, invoke the submitSeniorBirthDate method
      generateSeniorResults(dateInput);
    }
    closeSelectSeniorBirthDate()
  });



  async function generatePDFSeriesResult() {
    if (!currentSerieID) {
      alert("Please select a series to get results");
      return;
    }

    try {
      const results = await fetchResults(currentSerieID);

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Center the main title
      const pageWidth = doc.internal.pageSize.getWidth();
      const title = "Series Results";
      const titleX = (pageWidth - doc.getTextWidth(title)) / 2;
      doc.setFontSize(18);
      doc.text(title, titleX, 20);

      // Add the series name and ID below the main title
      doc.setFontSize(10);
      const seriesInfo = `Series Name: ${currentSerieName}, Overall ID: ${currentSerieID}`;
      const seriesInfoX = (pageWidth - doc.getTextWidth(seriesInfo)) / 2;
      doc.text(seriesInfo, seriesInfoX, 26);

      // Prepare table data
      const tableColumn = ["Rank", "Player Name, ID", "Total Points"];
      const tableRows = [];

      results.forEach((player, index) => {
        const playerData = [
          index + 1, // Rank
          `${player.player_name}, ${player.player_id}`, // Player Name with ID
          player.total_points // Total Points
        ];
        tableRows.push(playerData);
      });

      // AutoTable plugin to generate table
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 30, // Adjust startY to move the table down
        theme: 'grid',
        styles: {
          cellPadding: 1, // Decrease the cell padding to reduce row height
          fontSize: 10,
          valign: 'middle', // Change to middle to vertically center the content
          halign: 'left'
        },
        columnStyles: {
          0: { cellWidth: '10%' },
          1: { cellWidth: '80%' },
          2: { cellWidth: '10%' }
        },
        alternateRowStyles: {
          fillColor: [224, 235, 255] // Soft green background for alternate rows
        },
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontStyle: 'bold'
        },
      });

      doc.save(`${currentSerieName}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF');
    }
  }
  async function fetchResults(seriesId) {
    const response = await fetch(`/api/get_series_rank?series_id=${seriesId}`);
    const data = await response.json();
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.error);
    }
  }

  function showOverallResults(currentChampionshipID) {

    if (currentChampionshipID) {
      fetch(`/api/get_championship_rank?championship_id=${currentChampionshipID}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
          }
          return response.json();
        })
        .then(data => {
          if (data.success) {
            // Process the data
            console.log(data.data);
            const resultContainer = document.getElementById('resultContainer');
            resultContainer.innerHTML = ''; // Clear previous results

            // Create the table
            const table = document.createElement('table');
            table.classList.add('min-w-full', 'bg-white', 'border', 'border-gray-300');

            // Create the table header
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');

            // Create header cells
            const headers = ['Rank', 'Player Name'];
            const seriesCount = Object.keys(data.data[0].series_points).length;
            for (let i = 1; i <= seriesCount; i++) {
              headers.push(`Series ${i}`);
            }
            headers.push('Total Points');
            headers.forEach(headerText => {
              const th = document.createElement('th');
              th.classList.add('px-4', 'py-0', 'border', 'border-gray-300');
              th.textContent = headerText;
              headerRow.appendChild(th);
            });

            thead.appendChild(headerRow);
            table.appendChild(thead);

            // Create the table body
            const tbody = document.createElement('tbody');
            data.data.forEach((player, index) => {
              console.log(player)
              const row = document.createElement('tr');

              // Rank cell
              const rankCell = document.createElement('td');
              rankCell.classList.add('px-4', 'py-0', 'border', 'border-gray-300');
              rankCell.textContent = index + 1;
              row.appendChild(rankCell);

              // Player name cell
              const nameCell = document.createElement('td');
              nameCell.classList.add('px-4', 'py-0', 'border', 'border-gray-300');
              nameCell.textContent = `${player.player_name}, ${player.player_id}`;
              row.appendChild(nameCell);

              // Series points cells
              for (const seriesPoints of Object.values(player.series_points)) {
                const seriesCell = document.createElement('td');
                seriesCell.classList.add('px-4', 'py-0', 'border', 'border-gray-300');
                seriesCell.textContent = seriesPoints;
                row.appendChild(seriesCell);
              }

              // Total points cell
              const totalPointsCell = document.createElement('td');
              totalPointsCell.classList.add('px-4', 'py-0', 'border', 'border-gray-300');
              totalPointsCell.textContent = player.total_points;
              row.appendChild(totalPointsCell);

              tbody.appendChild(row);
            });

            table.appendChild(tbody);
            resultContainer.appendChild(table);
          } else {
            console.error('Error:', data.error);
          }
        })
        .catch(error => {
          console.error('There has been a problem with your fetch operation:', error);
        });
    } else {
      console.error('No championship ID found in local storage');
    }
  }

  async function showCurrentSeriesResults(currentSerieID) {
    if (!currentSerieID) {
      alert("Please select a series to get results");
      return;
    }

    try {
      const results = await fetchResults(currentSerieID);

      const resultContainer = document.getElementById('resultContainer');
      resultContainer.innerHTML = ''; // Clear previous results

      // Create the table
      const table = document.createElement('table');
      table.classList.add('min-w-full', 'bg-white', 'border', 'border-gray-300');

      // Create the table header
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');

      // Create header cells
      const headers = ['Rank', 'Player Name', 'Player ID', 'Total Points'];
      headers.forEach(headerText => {
        const th = document.createElement('th');
        th.classList.add('px-4', 'py-0', 'border', 'border-gray-300');
        th.textContent = headerText;
        headerRow.appendChild(th);
      });

      thead.appendChild(headerRow);
      table.appendChild(thead);

      // Create the table body
      const tbody = document.createElement('tbody');
      results.forEach((player, index) => {
        const row = document.createElement('tr');

        // Rank cell
        const rankCell = document.createElement('td');
        rankCell.classList.add('px-4', 'py-0', 'border', 'border-gray-300');
        rankCell.textContent = index + 1;
        row.appendChild(rankCell);

        // Player name cell
        const nameCell = document.createElement('td');
        nameCell.classList.add('px-4', 'py-0', 'border', 'border-gray-300');
        nameCell.textContent = player.player_name;
        row.appendChild(nameCell);

        // Player ID cell
        const idCell = document.createElement('td');
        idCell.classList.add('px-4', 'py-0', 'border', 'border-gray-300');
        idCell.textContent = player.player_id;
        row.appendChild(idCell);

        // Total points cell
        const pointsCell = document.createElement('td');
        pointsCell.classList.add('px-4', 'py-0', 'border', 'border-gray-300');
        pointsCell.textContent = player.total_points;
        row.appendChild(pointsCell);

        tbody.appendChild(row);
      });

      table.appendChild(tbody);
      resultContainer.appendChild(table);
    } catch (error) {
      console.error('Error fetching results:', error);
      alert('Failed to fetch results');
    }
  }
  async function generatePDFOverallResults() {
    let currentChampionshipID = localStorage.getItem('currentChampionshipID');

    if (!currentChampionshipID) {
      alert("No championship ID found in local storage");
      return;
    }

    try {
      const response = await fetch(`/api/get_championship_rank?championship_id=${currentChampionshipID}`);
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      const data = await response.json();
      if (!data.success) {
        console.error('Error:', data.error);
        return;
      }

      const results = data.data;

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Center the main title
      const pageWidth = doc.internal.pageSize.getWidth();
      const title = "Overall Results";
      const titleX = (pageWidth - doc.getTextWidth(title)) / 2;
      doc.setFontSize(18);
      doc.text(title, titleX, 20);

      // Add the championship ID below the main title
      doc.setFontSize(10);
      const championshipInfo = `Championship ID: ${currentChampionshipID}`;
      const championshipInfoX = (pageWidth - doc.getTextWidth(championshipInfo)) / 2;
      doc.text(championshipInfo, championshipInfoX, 26);

      // Prepare table data
      const headers = ['Rank', 'Player Name'];
      const seriesCount = Object.keys(results[0].series_points).length;
      for (let i = 1; i <= seriesCount; i++) {
        headers.push(`Series ${i}`);
      }
      headers.push('Total Points');

      const tableRows = [];
      results.forEach((player, index) => {
        const row = [
          index + 1, // Rank
          `${player.player_name}, ${player.player_id}`
        ];
        for (const seriesPoints of Object.values(player.series_points)) {
          row.push(seriesPoints);
        }
        row.push(player.total_points); // Total Points
        tableRows.push(row);
      });

      // AutoTable plugin to generate table
      doc.autoTable({
        head: [headers],
        body: tableRows,
        startY: 30, // Adjust startY to move the table down
        theme: 'grid',
        styles: {
          cellPadding: 1, // Decrease the cell padding to reduce row height
          fontSize: 10,
          valign: 'middle', // Change to middle to vertically center the content
          halign: 'left'
        },
        columnStyles: {
          0: { cellWidth: '10%' },
          1: { cellWidth: '30%' },
          2: { cellWidth: '10%' },
          // Adjust widths of series columns dynamically
          ...Object.fromEntries([...Array(seriesCount).keys()].map(i => [i + 3, { cellWidth: '10%' }])),
          [3 + seriesCount]: { cellWidth: '10%' } // Total Points column
        },
        alternateRowStyles: {
          fillColor: [224, 235, 255] // Soft blue background for alternate rows
        },
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontStyle: 'bold'
        },
      });

      doc.save(`Overall_Results_Championship_${currentChampionshipID}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF');
    }
  }
  async function generateFrauenResults() {
    let currentChampionshipID = localStorage.getItem('currentChampionshipID');

    if (!currentChampionshipID) {
      alert("No championship ID found in local storage");
      return;
    }

    try {
      const response = await fetch(`/api/get_frauen_rank?championship_id=${currentChampionshipID}`);
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      const data = await response.json();
      if (!data.success) {
        console.error('Error:', data.error);
        return;
      }

      const results = data.data;

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Center the main title
      const pageWidth = doc.internal.pageSize.getWidth();
      const title = "Female Results";
      const titleX = (pageWidth - doc.getTextWidth(title)) / 2;
      doc.setFontSize(18);
      doc.text(title, titleX, 20);

      // Add the championship ID below the main title
      doc.setFontSize(10);
      const championshipInfo = `Championship ID: ${currentChampionshipID}`;
      const championshipInfoX = (pageWidth - doc.getTextWidth(championshipInfo)) / 2;
      doc.text(championshipInfo, championshipInfoX, 26);

      // Prepare table data
      const headers = ['Rank', 'Player Name'];
      const seriesCount = Object.keys(results[0].series_points).length;
      for (let i = 1; i <= seriesCount; i++) {
        headers.push(`Series ${i}`);
      }
      headers.push('Total Points');

      const tableRows = [];
      results.forEach((player, index) => {
        const row = [
          index + 1, // Rank
          `${player.player_name}, ${player.player_id}`
        ];
        for (const seriesPoints of Object.values(player.series_points)) {
          row.push(seriesPoints);
        }
        row.push(player.total_points); // Total Points
        tableRows.push(row);
      });

      // AutoTable plugin to generate table
      doc.autoTable({
        head: [headers],
        body: tableRows,
        startY: 30, // Adjust startY to move the table down
        theme: 'grid',
        styles: {
          cellPadding: 1, // Decrease the cell padding to reduce row height
          fontSize: 10,
          valign: 'middle', // Change to middle to vertically center the content
          halign: 'left'
        },
        columnStyles: {
          0: { cellWidth: '10%' },
          1: { cellWidth: '30%' },
          2: { cellWidth: '10%' },
          // Adjust widths of series columns dynamically
          ...Object.fromEntries([...Array(seriesCount).keys()].map(i => [i + 3, { cellWidth: '10%' }])),
          [3 + seriesCount]: { cellWidth: '10%' } // Total Points column
        },
        alternateRowStyles: {
          fillColor: [224, 235, 255] // Soft blue background for alternate rows
        },
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontStyle: 'bold'
        },
      });

      doc.save(`Female_Results_Championship_${currentChampionshipID}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF');
    }
  }
  async function generateJuniorResults(dateInput) {
    let currentChampionshipID = localStorage.getItem('currentChampionshipID');

    if (!currentChampionshipID) {
      alert("No championship ID found in local storage");
      return;
    }

    try {
      const response = await fetch(`/api/get_junior_rank?championship_id=${currentChampionshipID}&date=${encodeURIComponent(dateInput)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      const data = await response.json();
      if (!data.success) {
        console.error('Error:', data.error);
        return;
      }

      const results = data.data;

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Center the main title
      const pageWidth = doc.internal.pageSize.getWidth();
      const title = "Junior Results";
      const titleX = (pageWidth - doc.getTextWidth(title)) / 2;
      doc.setFontSize(18);
      doc.text(title, titleX, 20);

      // Add the championship ID below the main title
      doc.setFontSize(10);
      const championshipInfo = `Championship ID: ${currentChampionshipID}`;
      const championshipInfoX = (pageWidth - doc.getTextWidth(championshipInfo)) / 2;
      doc.text(championshipInfo, championshipInfoX, 26);

      // Prepare table data
      const headers = ['Rank', 'Player Name'];
      const seriesCount = Object.keys(results[0].series_points).length;
      for (let i = 1; i <= seriesCount; i++) {
        headers.push(`Series ${i}`);
      }
      headers.push('Total Points');

      const tableRows = [];
      results.forEach((player, index) => {
        const row = [
          index + 1, // Rank
          `${player.player_name}, ${player.player_id}`
        ];
        for (const seriesPoints of Object.values(player.series_points)) {
          row.push(seriesPoints);
        }
        row.push(player.total_points); // Total Points
        tableRows.push(row);
      });

      // AutoTable plugin to generate table
      doc.autoTable({
        head: [headers],
        body: tableRows,
        startY: 30, // Adjust startY to move the table down
        theme: 'grid',
        styles: {
          cellPadding: 1, // Decrease the cell padding to reduce row height
          fontSize: 10,
          valign: 'middle', // Change to middle to vertically center the content
          halign: 'left'
        },
        columnStyles: {
          0: { cellWidth: '10%' },
          1: { cellWidth: '30%' },
          2: { cellWidth: '10%' },
          // Adjust widths of series columns dynamically
          ...Object.fromEntries([...Array(seriesCount).keys()].map(i => [i + 3, { cellWidth: '10%' }])),
          [3 + seriesCount]: { cellWidth: '10%' } // Total Points column
        },
        alternateRowStyles: {
          fillColor: [224, 235, 255] // Soft blue background for alternate rows
        },
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontStyle: 'bold'
        },
      });

      doc.save(`Junior_Results_Championship_${currentChampionshipID}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF');
    }
  }
  async function generateSeniorResults(dateInput) {
    let currentChampionshipID = localStorage.getItem('currentChampionshipID');

    if (!currentChampionshipID) {
      alert("No championship ID found in local storage");
      return;
    }

    try {
      const response = await fetch(`/api/get_senior_rank?championship_id=${currentChampionshipID}&date=${encodeURIComponent(dateInput)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      const data = await response.json();
      if (!data.success) {
        console.error('Error:', data.error);
        return;
      }

      const results = data.data;

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Center the main title
      const pageWidth = doc.internal.pageSize.getWidth();
      const title = "Senior Results";
      const titleX = (pageWidth - doc.getTextWidth(title)) / 2;
      doc.setFontSize(18);
      doc.text(title, titleX, 20);

      // Add the championship ID below the main title
      doc.setFontSize(10);
      const championshipInfo = `Championship ID: ${currentChampionshipID}`;
      const championshipInfoX = (pageWidth - doc.getTextWidth(championshipInfo)) / 2;
      doc.text(championshipInfo, championshipInfoX, 26);

      // Prepare table data
      const headers = ['Rank', 'Player Name'];
      const seriesCount = Object.keys(results[0].series_points).length;
      for (let i = 1; i <= seriesCount; i++) {
        headers.push(`Series ${i}`);
      }
      headers.push('Total Points');

      const tableRows = [];
      results.forEach((player, index) => {
        const row = [
          index + 1, // Rank
          `${player.player_name}, ${player.player_id}`
        ];
        for (const seriesPoints of Object.values(player.series_points)) {
          row.push(seriesPoints);
        }
        row.push(player.total_points); // Total Points
        tableRows.push(row);
      });

      // AutoTable plugin to generate table
      doc.autoTable({
        head: [headers],
        body: tableRows,
        startY: 30, // Adjust startY to move the table down
        theme: 'grid',
        styles: {
          cellPadding: 1, // Decrease the cell padding to reduce row height
          fontSize: 10,
          valign: 'middle', // Change to middle to vertically center the content
          halign: 'left'
        },
        columnStyles: {
          0: { cellWidth: '10%' },
          1: { cellWidth: '30%' },
          2: { cellWidth: '10%' },
          // Adjust widths of series columns dynamically
          ...Object.fromEntries([...Array(seriesCount).keys()].map(i => [i + 3, { cellWidth: '10%' }])),
          [3 + seriesCount]: { cellWidth: '10%' } // Total Points column
        },
        alternateRowStyles: {
          fillColor: [224, 235, 255] // Soft blue background for alternate rows
        },
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontStyle: 'bold'
        },
      });

      doc.save(`Senior_Results_Championship_${currentChampionshipID}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF');
    }
  }

  async function generateCurrentSeriesPdfListenComplete(currentSerieID) {
    if (!currentSerieID) {
      alert("No series ID found in local storage");
      return;
    }

    try {
      const response = await fetch(`/get_serie_tische/${currentSerieID}`);
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      const tische = await response.json();

      const { PDFDocument } = PDFLib;
      const mergedPdf = await PDFDocument.create();

      for (const tisch of tische) {
        const positions = [
          { pos: 'PosA', name: tisch.namePosA, id: tisch.idPosA },
          { pos: 'PosB', name: tisch.namePosB, id: tisch.idPosB },
          { pos: 'PosC', name: tisch.namePosC, id: tisch.idPosC },
          { pos: 'PosD', name: tisch.namePosD, id: tisch.idPosD }
        ];

        const validPositions = positions.filter(position => position.id > 0);
        const numPlayers = validPositions.length;

        let templatePath;
        if (numPlayers === 4) {
          templatePath = '/static/pdf_templates/4er_Liste_BR.pdf';
        } else if (numPlayers === 3) {
          templatePath = '/static/pdf_templates/3er_Liste_BR.pdf';
        } else {
          continue; // Skip if the number of players is not 3 or 4
        }

        const existingPdfBytes = await fetch(templatePath).then(res => res.arrayBuffer());
        const existingPdf = await PDFDocument.load(existingPdfBytes);
        const [templatePage] = await mergedPdf.copyPages(existingPdf, [0]);
        mergedPdf.addPage(templatePage);

        const page = mergedPdf.getPage(mergedPdf.getPageCount() - 1);
        const tischName = tisch.tischName
        const labels = extractLabels(tischName);
        const tischLabel = labels.tischLabel
        const seriesLabel = labels.seriesLabel
        const todayDate = getCurrentDateFormatted()
        if (numPlayers == 4) {
          page.drawText(`${todayDate}`, { x: 110, y: 760, size: 12 });
          page.drawText(`${tischLabel}`, { x: 535, y: 760, size: 20 });
          page.drawText(`${seriesLabel}`, { x: 455, y: 760, size: 20 });
          // Customize the template page with the tisch and player data
          page.drawText(`${tisch.tischName}`, { x: 200, y: 760, size: 12 });
          page.drawText(`, T_ID: ${tisch.tischID}`, { x: 320, y: 760, size: 6 });
          page.drawText(`${truncateString(tisch.namePosA, 15)}`, { x: 261, y: 738, size: 8 });
          page.drawText(`${truncateString(tisch.namePosB, 15)}`, { x: 341, y: 738, size: 8 });
          page.drawText(`${truncateString(tisch.namePosC, 15)}`, { x: 421, y: 738, size: 8 });
          page.drawText(`${truncateString(tisch.namePosD, 15)}`, { x: 501, y: 738, size: 8 });
          page.drawText(`${tisch.idPosA}`, { x: 300, y: 717, size: 14 });
          page.drawText(`${tisch.idPosB}`, { x: 380, y: 717, size: 14 });
          page.drawText(`${tisch.idPosC}`, { x: 460, y: 717, size: 14 });
          page.drawText(`${tisch.idPosD}`, { x: 540, y: 717, size: 14 });


        }
        if (numPlayers == 3) {
          page.drawText(`${todayDate}`, { x: 110, y: 760, size: 12 });
          page.drawText(`${tischLabel}`, { x: 520, y: 760, size: 20 });
          page.drawText(`${seriesLabel}`, { x: 430, y: 760, size: 20 });
          // Customize the template page with the tisch and player data
          page.drawText(`${tisch.tischName}`, { x: 200, y: 760, size: 12 });
          page.drawText(`, T_ID: ${tisch.tischID}`, { x: 320, y: 760, size: 6 });
          if (tisch.idPosA == -1) {
            page.drawText(`${truncateString(tisch.namePosB, 15)}`, { x: 301, y: 738, size: 10 });
            page.drawText(`${truncateString(tisch.namePosC, 15)}`, { x: 391, y: 738, size: 10 });
            page.drawText(`${truncateString(tisch.namePosD, 15)}`, { x: 481, y: 738, size: 10 });
            page.drawText(`${tisch.idPosB}`, { x: 360, y: 712, size: 16 });
            page.drawText(`${tisch.idPosC}`, { x: 450, y: 712, size: 16 });
            page.drawText(`${tisch.idPosD}`, { x: 540, y: 712, size: 16 });
          }
          if (tisch.idPosB == -1) {
            page.drawText(`${truncateString(tisch.namePosA, 15)}`, { x: 301, y: 738, size: 10 });
            page.drawText(`${truncateString(tisch.namePosC, 15)}`, { x: 391, y: 738, size: 10 });
            page.drawText(`${truncateString(tisch.namePosD, 15)}`, { x: 481, y: 738, size: 10 });
            page.drawText(`${tisch.idPosA}`, { x: 360, y: 712, size: 16 });
            page.drawText(`${tisch.idPosC}`, { x: 450, y: 712, size: 16 });
            page.drawText(`${tisch.idPosD}`, { x: 540, y: 712, size: 16 });
          }
          if (tisch.idPosC == -1) {
            page.drawText(`${truncateString(tisch.namePosA, 15)}`, { x: 301, y: 738, size: 10 });
            page.drawText(`${truncateString(tisch.namePosB, 15)}`, { x: 391, y: 738, size: 10 });
            page.drawText(`${truncateString(tisch.namePosD, 15)}`, { x: 481, y: 738, size: 10 });
            page.drawText(`${tisch.idPosA}`, { x: 360, y: 712, size: 16 });
            page.drawText(`${tisch.idPosB}`, { x: 450, y: 712, size: 16 });
            page.drawText(`${tisch.idPosD}`, { x: 540, y: 712, size: 16 });
          }
          if (tisch.idPosD == -1) {
            page.drawText(`${truncateString(tisch.namePosA, 15)}`, { x: 301, y: 738, size: 10 });
            page.drawText(`${truncateString(tisch.namePosB, 15)}`, { x: 391, y: 738, size: 10 });
            page.drawText(`${truncateString(tisch.namePosC, 15)}`, { x: 481, y: 738, size: 10 });
            page.drawText(`${tisch.idPosA}`, { x: 360, y: 712, size: 16 });
            page.drawText(`${tisch.idPosB}`, { x: 450, y: 712, size: 16 });
            page.drawText(`${tisch.idPosC}`, { x: 540, y: 712, size: 16 });
          }


        }



      }

      const pdfBytes = await mergedPdf.save();

      // Trigger download of the PDF
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Series_${currentSerieID}_Tisch_Listen.pdf`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF');
    }
  }

  async function generateCurrentSeriesPdfListenDatei(currentSerieID) {
    if (!currentSerieID) {
      alert("No series ID found in local storage");
      return;
    }

    try {
      const response = await fetch(`/get_serie_tische/${currentSerieID}`);
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      const tische = await response.json();

      const { PDFDocument } = PDFLib;
      const pdfDoc = await PDFDocument.create();

      for (const tisch of tische) {
        const positions = [
          { pos: 'PosA', name: tisch.namePosA, id: tisch.idPosA },
          { pos: 'PosB', name: tisch.namePosB, id: tisch.idPosB },
          { pos: 'PosC', name: tisch.namePosC, id: tisch.idPosC },
          { pos: 'PosD', name: tisch.namePosD, id: tisch.idPosD }
        ];

        const validPositions = positions.filter(position => position.id > 0);
        const numPlayers = validPositions.length;

        if (numPlayers !== 3 && numPlayers !== 4) {
          continue; // Skip if the number of players is not 3 or 4
        }

        const page = pdfDoc.addPage([595.28, 841.89]); // A4 size in points
        const { width, height } = page.getSize();
        const tischName = tisch.tischName;
        const labels = extractLabels(tischName);
        const tischLabel = labels.tischLabel;
        const seriesLabel = labels.seriesLabel;
        const todayDate = getCurrentDateFormatted();

        if (numPlayers === 4) {
          page.drawText(`${tisch.tischName}`, { x: 60, y: height - 46, size: 12 });
          page.drawText(`${todayDate}`, { x: 305, y: height - 45, size: 12 });
          page.drawText(`${seriesLabel}`, { x: 435, y: height - 45, size: 20 });
          page.drawText(`${tischLabel}`, { x: 525, y: height - 45, size: 20 });
          page.drawText(`, T_ID: ${tisch.tischID}`, { x: 560, y: height - 45, size: 6 });
          // Customize the template page with the tisch and player data
          page.drawText(`${truncateString(tisch.namePosA, 15)}`, { x: 221, y: height - 73, size: 8 });
          page.drawText(`${truncateString(tisch.namePosB, 15)}`, { x: 301, y: height - 73, size: 8 });
          page.drawText(`${truncateString(tisch.namePosC, 15)}`, { x: 381, y: height - 73, size: 8 });
          page.drawText(`${truncateString(tisch.namePosD, 15)}`, { x: 461, y: height - 73, size: 8 });
          page.drawText(`${tisch.idPosA}`, { x: 240, y: height - 112, size: 14 });
          page.drawText(`${tisch.idPosB}`, { x: 325, y: height - 112, size: 14 });
          page.drawText(`${tisch.idPosC}`, { x: 405, y: height - 112, size: 14 });
          page.drawText(`${tisch.idPosD}`, { x: 489, y: height - 112, size: 14 });
        }

        if (numPlayers === 3) {
          page.drawText(`${tisch.tischName}`, { x: 70, y: height - 47, size: 12 });
          page.drawText(`${todayDate}`, { x: 290, y: height - 47, size: 12 });
          page.drawText(`${seriesLabel}`, { x: 435, y: height - 47, size: 20 });
          page.drawText(`${tischLabel}`, { x: 525, y: height - 47, size: 20 });
          page.drawText(`, T_ID: ${tisch.tischID}`, { x: 560, y: height - 45, size: 6 });
          // Customize the template page with the tisch and player data

          if (tisch.idPosA === -1) {
            page.drawText(`${truncateString(tisch.namePosB, 15)}`, { x: 251, y: height - 83, size: 10 });
            page.drawText(`${truncateString(tisch.namePosC, 15)}`, { x: 351, y: height - 83, size: 10 });
            page.drawText(`${truncateString(tisch.namePosD, 15)}`, { x: 451, y: height - 83, size: 10 });
            page.drawText(`${tisch.idPosB}`, { x: 269, y: height - 109, size: 16 });
            page.drawText(`${tisch.idPosC}`, { x: 369, y: height - 109, size: 16 });
            page.drawText(`${tisch.idPosD}`, { x: 472, y: height - 109, size: 16 });
          } else if (tisch.idPosB === -1) {
            page.drawText(`${truncateString(tisch.namePosA, 15)}`, { x: 251, y: height - 83, size: 10 });
            page.drawText(`${truncateString(tisch.namePosC, 15)}`, { x: 351, y: height - 83, size: 10 });
            page.drawText(`${truncateString(tisch.namePosD, 15)}`, { x: 451, y: height - 83, size: 10 });
            page.drawText(`${tisch.idPosA}`, { x: 269, y: height - 109, size: 16 });
            page.drawText(`${tisch.idPosC}`, { x: 369, y: height - 109, size: 16 });
            page.drawText(`${tisch.idPosD}`, { x: 472, y: height - 109, size: 16 });
          } else if (tisch.idPosC === -1) {
            page.drawText(`${truncateString(tisch.namePosA, 15)}`, { x: 251, y: height - 83, size: 10 });
            page.drawText(`${truncateString(tisch.namePosB, 15)}`, { x: 351, y: height - 83, size: 10 });
            page.drawText(`${truncateString(tisch.namePosD, 15)}`, { x: 451, y: height - 83, size: 10 });
            page.drawText(`${tisch.idPosA}`, { x: 269, y: height - 109, size: 16 });
            page.drawText(`${tisch.idPosB}`, { x: 369, y: height - 109, size: 16 });
            page.drawText(`${tisch.idPosD}`, { x: 472, y: height - 109, size: 16 });
          } else if (tisch.idPosD === -1) {
            page.drawText(`${truncateString(tisch.namePosA, 15)}`, { x: 251, y: height - 83, size: 10 });
            page.drawText(`${truncateString(tisch.namePosB, 15)}`, { x: 351, y: height - 83, size: 10 });
            page.drawText(`${truncateString(tisch.namePosC, 15)}`, { x: 451, y: height - 83, size: 10 });
            page.drawText(`${tisch.idPosA}`, { x: 269, y: height - 109, size: 16 });
            page.drawText(`${tisch.idPosB}`, { x: 369, y: height - 109, size: 16 });
            page.drawText(`${tisch.idPosC}`, { x: 472, y: height - 109, size: 16 });
          }
        }
      }

      const pdfBytes = await pdfDoc.save();

      // Trigger download of the PDF
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Series_${currentSerieID}_Tisch_Listen.pdf`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF');
    }
  }

  function extractLabels(tableName) {
    const seriesMatch = tableName.match(/_S#(\d+)/);
    const tischMatch = tableName.match(/_T#(\d+)/);

    const seriesLabel = seriesMatch ? seriesMatch[1] : null;
    const tischLabel = tischMatch ? tischMatch[1] : null;

    return {
      seriesLabel,
      tischLabel
    };
  }

  function getCurrentDateFormatted() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = today.getFullYear();

    return `${day}-${month}-${year}`;
  }
  function truncateString(str, maxLength) {
    if (str.length > maxLength) {
      return str.slice(0, maxLength);
    }
    return str;
  }

  async function getSingleSeriesTeamResults(championshipId, seriesId) {
    try {
      const response = await fetch('/api/get_teams_results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ championship_id: championshipId, series_id: seriesId })
      });

      const result = await response.json();

      if (result.success) {
        return result.data
        // Handle the result data, e.g., update the UI
      } else {
        alert('Error fetching single series team results: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch single series team results');
    }
  }

  async function getOverallTeamsSeriesResults(championshipId) {
    try {
      const response = await fetch('/api/get_teams_results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ championship_id: championshipId })
      });

      const result = await response.json();

      if (result.success) {
        return result.data
        // Handle the result data, e.g., update the UI
      } else {
        alert('Error fetching overall teams series results: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch overall teams series results');
    }
  }
  async function previewSingleSeriesTeamResults(championshipId, seriesId) {
    const data = await getSingleSeriesTeamResults(championshipId, seriesId);

    const resultContainer = document.getElementById('resultContainer');
    resultContainer.innerHTML = ''; // Clear previous results

    data.forEach(team => {
      // Create the table for each team
      const table = document.createElement('table');
      table.classList.add('min-w-full', 'bg-white', 'border', 'border-gray-300', 'mb-4');

      // Create the table header
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');

      // Create header cells
      const headers = ['Team Name', 'Player ID', 'Series Name', 'Total Points'];
      headers.forEach(headerText => {
        const th = document.createElement('th');
        th.classList.add('px-4', 'py-0', 'border', 'border-gray-300');
        th.textContent = headerText;
        headerRow.appendChild(th);
      });

      thead.appendChild(headerRow);
      table.appendChild(thead);

      // Create the table body
      const tbody = document.createElement('tbody');
      let teamTotalPoints = 0;

      team.players.forEach(player => {
        player.series_points.forEach(point => {
          const row = document.createElement('tr');

          // Team name cell
          const teamNameCell = document.createElement('td');
          teamNameCell.classList.add('px-4', 'py-0', 'border', 'border-gray-300');
          teamNameCell.textContent = team.team_name;
          row.appendChild(teamNameCell);

          // Player ID cell
          const playerIdCell = document.createElement('td');
          playerIdCell.classList.add('px-4', 'py-0', 'border', 'border-gray-300');
          playerIdCell.textContent = player.player_id;
          row.appendChild(playerIdCell);

          // Series name cell
          const seriesNameCell = document.createElement('td');
          seriesNameCell.classList.add('px-4', 'py-0', 'border', 'border-gray-300');
          seriesNameCell.textContent = point.series_name;
          row.appendChild(seriesNameCell);

          // Total points cell
          const totalPointsCell = document.createElement('td');
          totalPointsCell.classList.add('px-4', 'py-0', 'border', 'border-gray-300');
          totalPointsCell.textContent = point.total_points;
          row.appendChild(totalPointsCell);

          // Accumulate team total points
          teamTotalPoints += point.total_points;

          tbody.appendChild(row);
        });
      });

      // Append total points row for the team
      const totalRow = document.createElement('tr');
      const totalLabelCell = document.createElement('td');
      totalLabelCell.classList.add('px-4', 'py-0', 'border', 'border-gray-300', 'font-bold');
      totalLabelCell.setAttribute('colspan', '3');
      totalLabelCell.textContent = 'Total Points';
      totalRow.appendChild(totalLabelCell);

      const totalPointsCell = document.createElement('td');
      totalPointsCell.classList.add('px-4', 'py-0', 'border', 'border-gray-300', 'font-bold');
      totalPointsCell.textContent = teamTotalPoints;
      totalRow.appendChild(totalPointsCell);

      tbody.appendChild(totalRow);
      table.appendChild(tbody);
      resultContainer.appendChild(table);
    });
  }

  async function previewOverallTeamsSeriesResults(championshipId) {
    const data = await getOverallTeamsSeriesResults(championshipId);

    // Sort teams by descending order of total points
    data.sort((a, b) => {
      const aTotalPoints = a.players.reduce((acc, player) => acc + player.series_points.reduce((sum, point) => sum + point.total_points, 0), 0);
      const bTotalPoints = b.players.reduce((acc, player) => acc + player.series_points.reduce((sum, point) => sum + point.total_points, 0), 0);
      return bTotalPoints - aTotalPoints;
    });

    const resultContainer = document.getElementById('resultContainer');
    resultContainer.innerHTML = ''; // Clear previous results

    data.forEach(team => {
      // Create a table for each team
      const table = document.createElement('table');
      table.classList.add('min-w-full', 'bg-white', 'border', 'border-gray-300', 'mb-4');

      // Create the team name header row
      const teamNameRow = document.createElement('tr');
      const teamNameCell = document.createElement('th');
      teamNameCell.classList.add('px-4', 'py-2', 'bg-gray-100', 'text-left', 'font-bold');
      teamNameCell.setAttribute('colspan', team.players.length + 3);
      teamNameCell.textContent = `Team: ${team.team_name}`;
      teamNameRow.appendChild(teamNameCell);
      table.appendChild(teamNameRow);

      // Create the player IDs header row
      const playerIDsHeaderRow = document.createElement('tr');
      const seriesNameHeader = document.createElement('th');
      seriesNameHeader.classList.add('px-4', 'py-2', 'border', 'border-gray-300');
      seriesNameHeader.textContent = 'Series Name';
      playerIDsHeaderRow.appendChild(seriesNameHeader);

      team.players.forEach(player => {
        const playerIDHeader = document.createElement('th');
        playerIDHeader.classList.add('px-4', 'py-2', 'border', 'border-gray-300');
        playerIDHeader.textContent = `Player ID ${player.player_id}`;
        playerIDsHeaderRow.appendChild(playerIDHeader);
      });

      const totalPointsHeader = document.createElement('th');
      totalPointsHeader.classList.add('px-4', 'py-2', 'border', 'border-gray-300');
      totalPointsHeader.textContent = 'Total Points';
      playerIDsHeaderRow.appendChild(totalPointsHeader);
      table.appendChild(playerIDsHeaderRow);

      // Create the table body
      const tbody = document.createElement('tbody');
      let teamTotalPoints = 0;
      const playerTotals = new Array(team.players.length).fill(0);

      // Calculate series points for each player and total points for the team
      const seriesMap = new Map();
      team.players.forEach(player => {
        player.series_points.forEach(point => {
          if (!seriesMap.has(point.series_name)) {
            seriesMap.set(point.series_name, { total: 0, points: new Array(team.players.length).fill(0) });
          }
          const series = seriesMap.get(point.series_name);
          const playerIndex = team.players.findIndex(p => p.player_id === player.player_id);
          series.points[playerIndex] = point.total_points;
          series.total += point.total_points;
          playerTotals[playerIndex] += point.total_points;
        });
      });

      // Add rows to the table body
      seriesMap.forEach((series, seriesName) => {
        const row = document.createElement('tr');

        // Series name cell
        const seriesNameCell = document.createElement('td');
        seriesNameCell.classList.add('px-4', 'py-0', 'border', 'border-gray-300');
        seriesNameCell.textContent = seriesName;
        row.appendChild(seriesNameCell);

        // Player points cells
        series.points.forEach(points => {
          const pointsCell = document.createElement('td');
          pointsCell.classList.add('px-4', 'py-0', 'border', 'border-gray-300');
          pointsCell.textContent = points;
          row.appendChild(pointsCell);
        });

        // Total points cell
        const totalPointsCell = document.createElement('td');
        totalPointsCell.classList.add('px-4', 'py-0', 'border', 'border-gray-300');
        totalPointsCell.textContent = series.total;
        row.appendChild(totalPointsCell);

        tbody.appendChild(row);
        teamTotalPoints += series.total;
      });

      // Add the last row for sum of team points
      const totalRow = document.createElement('tr');
      const totalRowLabel = document.createElement('td');
      totalRowLabel.classList.add('px-4', 'py-0', 'border', 'border-gray-300', 'font-bold');
      totalRowLabel.textContent = 'Sum Team Points';
      totalRow.appendChild(totalRowLabel);

      playerTotals.forEach(playerTotal => {
        const playerTotalCell = document.createElement('td');
        playerTotalCell.classList.add('px-4', 'py-0', 'border', 'border-gray-300');
        playerTotalCell.textContent = playerTotal;
        totalRow.appendChild(playerTotalCell);
      });

      const teamTotalPointsCell = document.createElement('td');
      teamTotalPointsCell.classList.add('px-4', 'py-0', 'border', 'border-gray-300', 'font-bold');
      teamTotalPointsCell.textContent = teamTotalPoints;
      totalRow.appendChild(teamTotalPointsCell);

      tbody.appendChild(totalRow);
      table.appendChild(tbody);
      resultContainer.appendChild(table);
    });
  }

  async function generateOverallTeamsSeriesResultsPDF(championshipId) {
    const data = await getOverallTeamsSeriesResults(championshipId);

    // Sort teams by descending order of sum of total points
    data.sort((a, b) => {
      const aTotalPoints = a.players.reduce((acc, player) => acc + player.series_points.reduce((sum, point) => sum + point.total_points, 0), 0);
      const bTotalPoints = b.players.reduce((acc, player) => acc + player.series_points.reduce((sum, point) => sum + point.total_points, 0), 0);
      return bTotalPoints - aTotalPoints;
    });

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    data.forEach(team => {
      const headers = [
        [team.team_name, ...new Array(team.players.length + 2).fill('')], // Team name header
        ['Player Name / Series', ...team.players.map(player => `${player.player_name}, #${player.player_id}`), 'Total Points'] // Column headers
      ];
      const body = [];
      let teamTotalPoints = 0;
      const playerTotals = new Array(team.players.length).fill(0);

      // Calculate series points for each player and total points for the team
      const seriesMap = new Map();
      team.players.forEach(player => {
        player.series_points.forEach(point => {
          if (!seriesMap.has(point.series_name)) {
            seriesMap.set(point.series_name, { total: 0, points: new Array(team.players.length).fill(0) });
          }
          const series = seriesMap.get(point.series_name);
          const playerIndex = team.players.findIndex(p => p.player_id === player.player_id);
          series.points[playerIndex] = point.total_points;
          series.total += point.total_points;
          playerTotals[playerIndex] += point.total_points;
        });
      });

      // Add rows to the table body
      seriesMap.forEach((series, seriesName) => {
        const row = [seriesName, ...series.points, series.total];
        body.push(row);
        teamTotalPoints += series.total;
      });

      // Add the last row for sum of team points
      const totalRow = ['Sum Team Points', ...playerTotals, teamTotalPoints];
      body.push(totalRow);

      // Check if a new table fits on the current page, if not, add a new page
      if (doc.lastAutoTable && doc.lastAutoTable.finalY + (body.length + 2) * 10 > doc.internal.pageSize.height) {
        doc.addPage();
      }

      doc.autoTable({
        head: headers, // Table headers
        body: body,    // Table body rows
        startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 10, // Starting Y position
        theme: 'grid', // Table theme
        headStyles: {
          fillColor: [255, 255, 255], // White background
          textColor: [0, 0, 0]        // Black text
        },
        footStyles: {
          fillColor: [255, 255, 255], // Optional: White background for footer if needed
          textColor: [0, 0, 0]        // Optional: Black text for footer
        }
      });

    });

    doc.save(`Overall_Teams_Series_Results_${championshipId}.pdf`);
  }


  async function fetchPlayerTischPositions(championshipId) {
    try {
      const response = await fetch(`/get_player_tisch_positions/${championshipId}`);
      const result = await response.json();

      if (result.success) {
        console.log(result.data)
        return result.data;
      } else {
        alert('Error fetching player tisch positions: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch player tisch positions');
    }
  }

  async function generatePlayerTischPositionsPDF(championshipId) {
    const response = await fetch(`/get_player_tisch_positions/${championshipId}`);
    const result = await response.json();

    if (result.success) {
      const data = result.data;
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text(`Championship ID: ${championshipId}`, 14, 15);

      Object.keys(data).forEach((playerId, index) => {
        if (index > 0) {
          doc.addPage();
        }

        let lastSeriesChar = '';
        const player = data[playerId];
        const playerName = player.player_name;
        const rankedSeriesCount = player.ranked_series_count; // Retrieve the ranked_series_count for each player

        doc.setFontSize(14);
        doc.text(`${playerName},  #${playerId}`, 14, 25);

        // Update headers to include new columns
        const headers = [['Serie', 'Tisch', 'Position', 'Gew', 'Verl', 'Serie Punkte', 'Total']];

        const body = player.positions.map(item => {
          // Update lastSeriesChar with the last character of the current series_name
          lastSeriesChar = item.series_name.slice(-1);
          // Placeholder values for the new columns, adjust as necessary
          return [
            `Serie ${lastSeriesChar}`,
            `Tisch ${item.tisch_name.split('_T#').pop()}`,
            item.position,
            '',  // Serie Punkte
            '',  // Gew
            '',  // Verl
            ''   // Total
          ];
        });

        // Add empty rows for non-random series based on ranked_series_count
        for (let i = 0; i < rankedSeriesCount; i++) {
          body.push([
            `Serie ${parseInt(lastSeriesChar) + i + 1}`,
            '',  // Tisch Name
            '',  // Position
            '',  // Serie Punkte
            '',  // Gew
            '',  // Verl
            ''   // Total
          ]);
        }

        doc.autoTable({
          head: headers,
          body: body,
          startY: 30,
          theme: 'grid',
          headStyles: { fillColor: [211, 211, 211] },
          footStyles: { fillColor: [211, 211, 211] }
        });
      });

      doc.save(`Player_Tisch_Positions_${championshipId}.pdf`);
    } else {
      console.error('Error fetching player tisch positions:', result.error);
      alert('Failed to fetch player tisch positions');
    }
  }

  function generatePlayerZettelPDF(championshipId) {

    if (championshipId) {
      generatePlayerTischPositionsPDF(championshipId);
    } else {
      alert('Please enter a valid championship ID');
    }
  }

  async function generatePDFLostGamesList() {
    let currentChampionshipID = localStorage.getItem('currentChampionshipID');

    if (!currentChampionshipID) {
      alert("No championship ID found in local storage");
      return;
    }

    try {
      const response = await fetch(`/api/get_lost_games_list?championship_id=${currentChampionshipID}`);
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      const data = await response.json();
      if (!data.success) {
        console.error('Error:', data.error);
        return;
      }

      const results = data.data;
      results.sort((a, b) => a.player_name.localeCompare(b.player_name));

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Center the main title
      const pageWidth = doc.internal.pageSize.getWidth();
      const title = "Lost Games List";
      const titleX = (pageWidth - doc.getTextWidth(title)) / 2;
      doc.setFontSize(18);
      doc.text(title, titleX, 20);

      // Add the championship ID below the main title
      doc.setFontSize(10);
      const championshipInfo = `Championship ID: ${currentChampionshipID}`;
      const championshipInfoX = (pageWidth - doc.getTextWidth(championshipInfo)) / 2;
      doc.text(championshipInfo, championshipInfoX, 26);

      const seriesCount = Object.keys(results[0].series_lost_games).length;
      const headers = ['Player Name'];
      for (let i = 1; i <= seriesCount; i++) {
        headers.push(`S_${i}`);
      }
      headers.push('Verlorene', 'Extra', 'Total');

      const tableRows = [];
      const seriesTotals = Array(seriesCount + 1).fill(0); // To store totals for each series and the total column
      let totalExtraBons = 0; // Initialize the sum for Extra Bons
      let totalOverall = 0; // Initialize the total for the new "Total" column

      results.forEach(player => {
        const row = [player.player_name];
        let extraBons = 0;

        Object.keys(player.series_lost_games).forEach((key, index) => {
          const gameCount = player.series_lost_games[key];
          if (gameCount > 3) {
            extraBons += (gameCount - 3);  // Calculate the extra bons for values greater than 3
          }
          seriesTotals[index] += gameCount; // Sum each series for the footer
          row.push(gameCount);
        });

        const totalLostGames = player.total_lost_games;
        seriesTotals[seriesCount] += totalLostGames; // Sum the total lost games
        totalExtraBons += extraBons; // Sum the Extra Bons for the footer
        const playerTotal = totalLostGames + extraBons;
        totalOverall += playerTotal; // Sum the overall totals for the footer
        row.push(totalLostGames, extraBons, playerTotal); // Append total lost games, extra bons, and overall total
        tableRows.push(row);
      });

      // Add footer row
      const footerRow = ['Total per Serie'];
      seriesTotals.forEach(total => footerRow.push(total));
      footerRow.push(totalExtraBons); // Add the total of Extra Bons to the footer
      footerRow.push(totalOverall); // Add the overall total to the footer

      // AutoTable plugin to generate table
      doc.autoTable({
        head: [headers],
        body: tableRows,
        foot: [footerRow],
        startY: 30,
        theme: 'grid',
        styles: {
          cellPadding: 1,
          fontSize: 10,
          valign: 'middle',
          halign: 'left'
        },
        columnStyles: {
          0: { cellWidth: '20%' },
          ...Object.fromEntries([...Array(seriesCount).keys()].map(i => [i + 1, { cellWidth: '10%' }])),
          [1 + seriesCount]: { cellWidth: '10%' }, // Total Lost Games column
          [2 + seriesCount]: { cellWidth: '10%' }, // Extra Bons column
          [3 + seriesCount]: { cellWidth: '10%' } // Overall Total column
        },
        headStyles: {
          fillColor: [211, 211, 211],
          textColor: [0, 0, 0],
          fontStyle: 'bold'
        },
        footStyles: {
          fillColor: [211, 211, 211],
          textColor: [0, 0, 0],
          fontStyle: 'bold'
        }
      });

      doc.save(`Lost_Games_List_Championship_${currentChampionshipID}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF');
    }
  }



  function openSelectJuniorBirthDate() {
    const divSelectJuniorBirthDate = document.getElementById('divSelectJuniorBirthDate');
    divSelectJuniorBirthDate.classList.remove('hidden');
  }

  function closeSelectJuniorBirthDate() {
    document.getElementById('inputSelectJuniorBirthDate').value = '';
    const divSelectJuniorBirthDate = document.getElementById('divSelectJuniorBirthDate');
    divSelectJuniorBirthDate.classList.add('hidden');
  }
  function openSelectSeniorBirthDate() {
    const divSelectSeniorBirthDate = document.getElementById('divSelectSeniorBirthDate');
    divSelectSeniorBirthDate.classList.remove('hidden');
  }

  function closeSelectSeniorBirthDate() {
    document.getElementById('inputSelectSeniorBirthDate').value = '';
    const divSelectSeniorBirthDate = document.getElementById('divSelectSeniorBirthDate');
    divSelectSeniorBirthDate.classList.add('hidden');
  }




})