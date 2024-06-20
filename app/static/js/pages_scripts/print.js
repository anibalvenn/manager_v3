document.addEventListener('DOMContentLoaded', function () {

  let currentSerieID = localStorage.getItem('currentSerieID')
  let currentSerieName = decodeURIComponent(localStorage.getItem('currentSerieName'));

  const btnPrintCurrentSeriesResults = document.getElementById('btnPrintCurrentSeriesResults');
  btnPrintCurrentSeriesResults.addEventListener('click', () => {
    // Get the championship data from the row
    generatePDFSeriesResult()


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







})