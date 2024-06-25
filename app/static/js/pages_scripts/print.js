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

  const btnPrintCurrentSeriesListen = document.getElementById('btnPrintCurrentSeriesListen');
  btnPrintCurrentSeriesListen.addEventListener('click', () => {
    // Get the championship data from the row
    generateCurrentSeriesPdfListen(currentSerieID)
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

  async function generateCurrentSeriesPdfListen(currentSerieID) {
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
        const tischName =tisch.tischName
        const labels = extractLabels(tischName);
        const tischLabel = labels.tischLabel
        const seriesLabel = labels.seriesLabel
        const todayDate= getCurrentDateFormatted()
        if(numPlayers==4){  
          page.drawText(`${todayDate}`, { x: 110, y: 760, size: 12 });
          page.drawText(`${tischLabel}`, { x: 535, y: 760, size: 20 });
          page.drawText(`${seriesLabel}`, { x: 455, y: 760, size: 20 });
          // Customize the template page with the tisch and player data
          page.drawText(`${tisch.tischName}`, { x: 200, y: 760, size: 12 });
          page.drawText(`, T_ID: ${tisch.tischID}`, { x: 320, y: 760, size: 6 });
          page.drawText(`${truncateString(tisch.namePosA,15)}`, { x: 261, y: 738, size: 8 });
          page.drawText(`${truncateString(tisch.namePosB,15)}`, { x: 341, y: 738, size: 8 });
          page.drawText(`${truncateString(tisch.namePosC,15)}`, { x: 421, y: 738, size: 8 });
          page.drawText(`${truncateString(tisch.namePosD,15)}`, { x: 501, y: 738, size: 8 });
          page.drawText(`${tisch.idPosA}`, { x: 300, y: 717, size: 14 });
          page.drawText(`${tisch.idPosB}`, { x: 380, y: 717, size: 14 });
          page.drawText(`${tisch.idPosC}`, { x: 460, y: 717, size: 14 });
          page.drawText(`${tisch.idPosD}`, { x: 540, y: 717, size: 14 });
  
         
        }
        if(numPlayers==3){  
          page.drawText(`${todayDate}`, { x: 110, y: 760, size: 12 });
          page.drawText(`${tischLabel}`, { x: 520, y: 760, size: 20 });
          page.drawText(`${seriesLabel}`, { x: 430, y: 760, size: 20 });
          // Customize the template page with the tisch and player data
          page.drawText(`${tisch.tischName}`, { x: 200, y: 760, size: 12 });
          page.drawText(`, T_ID: ${tisch.tischID}`, { x: 320, y: 760, size: 6 });
          if(tisch.idPosA==-1){
            page.drawText(`${truncateString(tisch.namePosB,15)}`, { x: 301, y: 738, size: 10 });
            page.drawText(`${truncateString(tisch.namePosC,15)}`, { x: 391, y: 738, size: 10 });
            page.drawText(`${truncateString(tisch.namePosD,15)}`, { x: 481, y: 738, size: 10 });
            page.drawText(`${tisch.idPosB}`, { x: 360, y: 712, size: 16 });
            page.drawText(`${tisch.idPosC}`, { x: 450, y: 712, size: 16 });
            page.drawText(`${tisch.idPosD}`, { x: 540, y: 712, size: 16 });
          }
          if(tisch.idPosB==-1){
            page.drawText(`${truncateString(tisch.namePosA,15)}`, { x: 301, y: 738, size: 10 });
            page.drawText(`${truncateString(tisch.namePosC,15)}`, { x: 391, y: 738, size: 10 });
            page.drawText(`${truncateString(tisch.namePosD,15)}`, { x: 481, y: 738, size: 10 });
            page.drawText(`${tisch.idPosA}`, { x: 360, y: 712, size: 16 });
            page.drawText(`${tisch.idPosC}`, { x: 450, y: 712, size: 16 });
            page.drawText(`${tisch.idPosD}`, { x: 540, y: 712, size: 16 });
          }
          if(tisch.idPosC==-1){
            page.drawText(`${truncateString(tisch.namePosA,15)}`, { x: 301, y: 738, size: 10 });
            page.drawText(`${truncateString(tisch.namePosB,15)}`, { x: 391, y: 738, size: 10 });
            page.drawText(`${truncateString(tisch.namePosD,15)}`, { x: 481, y: 738, size: 10 });
            page.drawText(`${tisch.idPosA}`, { x: 360, y: 712, size: 16 });
            page.drawText(`${tisch.idPosB}`, { x: 450, y: 712, size: 16 });
            page.drawText(`${tisch.idPosD}`, { x: 540, y: 712, size: 16 });
          }
          if(tisch.idPosD==-1){
            page.drawText(`${truncateString(tisch.namePosA,15)}`, { x: 301, y: 738, size: 10 });
            page.drawText(`${truncateString(tisch.namePosB,15)}`, { x: 391, y: 738, size: 10 });
            page.drawText(`${truncateString(tisch.namePosC,15)}`, { x: 481, y: 738, size: 10 });
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
})