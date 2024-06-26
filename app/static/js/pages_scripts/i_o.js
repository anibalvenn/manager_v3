document.addEventListener('DOMContentLoaded', function () {

  let currentSerieID = localStorage.getItem('currentSerieID')
  let currentSerieName = decodeURIComponent(localStorage.getItem('currentSerieName'));
  let currentChampionshipID = localStorage.getItem('currentChampionshipID')

  // SINGLE SERIES RESULTS IMPORT
  document.getElementById('btnImportSeriesResults').addEventListener('click', () => {
    document.getElementById('fileInputSeriesResults').click();
  });
  document.getElementById('fileInputSeriesResults').addEventListener('change', handleSingleSeriesCsvFileUpload);
  
  // OVERALL RESULTS  IMPORT
  document.getElementById('btnImportOverallResults').addEventListener('click', () => {
    document.getElementById('fileInputOverallResults').click();
  });
  document.getElementById('fileInputOverallResults').addEventListener('change', handleOverallResultsCsvFileUpload);
  
  
  // SINGLE SERIES RESULTS EXPORT
  document.getElementById('btnExportSeriesResults').addEventListener('click', () => {
    generateCurrentSeriesCsvResults(currentSerieID)
  });
  
  // OVERALL RESULTS EXPORT
  document.getElementById('btnExportOverallResults').addEventListener('click', () => {
    generateOverallResultsCsv(currentChampionshipID)
  });



  async function generateCurrentSeriesCsvResults(currentSerieID) {
    if (!currentSerieID) {
      alert("Please select a series to get results");
      return;
    }

    try {
      const results = await fetchResults(currentSerieID);

      // Prepare CSV data
      let csvContent = 'player_id,total_points\n'; // CSV header
      results.forEach(player => {
        csvContent += `${player.player_id},${player.total_points}\n`;
      });

      // Create a blob with the CSV data
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

      // Create a link element to trigger the download
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `current_series_results_${currentSerieID}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Error fetching results:', error);
      alert('Failed to fetch results');
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

  async function generateOverallResultsCsv(currentChampionshipID) {
    if (!currentChampionshipID) {
      alert('No championship ID found in local storage');
      return;
    }

    try {
      const response = await fetch(`/api/get_championship_rank?championship_id=${currentChampionshipID}`);
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      const data = await response.json();
      if (data.success) {
        // Prepare CSV data
        const headers = ['player_id', 'player_name'];
        const seriesCount = Object.keys(data.data[0].series_points).length;
        for (let i = 1; i <= seriesCount; i++) {
          headers.push(`s_${i}`);
        }
        headers.push('total_points');
        let csvContent = headers.join(',') + '\n'; // CSV header

        data.data.forEach(player => {
          const seriesPoints = Object.values(player.series_points).map(points => points || 0);
          const row = [
            player.player_id,
            player.player_name,
            ...seriesPoints,
            player.total_points
          ];
          csvContent += row.join(',') + '\n';
        });

        // Create a blob with the CSV data
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

        // Create a link element to trigger the download
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `overall_results_${currentChampionshipID}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  }

  async function sendOverallResultsDataToBackend(data) {
    const championshipId = currentChampionshipID // Assume you have a method to get the current championship ID
    try {
      const response = await fetch(`/api/import_series_results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ championship_id: championshipId, data })
      });
      const result = await response.json();
      if (result.success) {
        alert('Data imported successfully');
      } else {
        alert('Error importing data: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to import data');
    }
  }
  

  async function handleOverallResultsCsvFileUpload(event) {
    const file = event.target.files[0];
    if (!file) {
      alert('No file selected');
      return;
    }
  
    const reader = new FileReader();
    reader.onload = async function (e) {
      const text = e.target.result;
      const data = parseCSV(text);
      await sendOverallResultsDataToBackend(data);
    };
    reader.readAsText(file);
  }
  
  function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    const seriesHeaders = headers.slice(2, headers.length - 1); // Extract series headers
  
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].split(',');
      const playerData = {
        player_id: line[0],
        player_name: line[1],
        series_points: seriesHeaders.map((header, index) => ({
          series: header,
          points: line[index + 2]
        })),
        total_points: line[line.length - 1]
      };
      data.push(playerData);
    }
    return data;
  }

  async function handleSingleSeriesCsvFileUpload(event) {
    const file = event.target.files[0];
    if (!file) {
      alert('No file selected');
      return;
    }
  
    const reader = new FileReader();
    reader.onload = async function(e) {
      const text = e.target.result;
      const data = parseSingleSeriesCSV(text);
      await sendSingleSeriesDataToBackend(data);
    };
    reader.readAsText(file);
  }
  
  function parseSingleSeriesCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
  
    if (headers[0] !== 'player_id' || headers[1] !== 'total_points') {
      throw new Error('Invalid CSV format');
    }
  
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].split(',');
      const playerData = {
        player_id: line[0],
        total_points: line[1]
      };
      data.push(playerData);
    }
    return data;
  }
  
  async function sendSingleSeriesDataToBackend(data) {
    const championshipId = currentChampionshipID; // Assume you have a method to get the current championship ID
    try {
      const response = await fetch(`/api/import_single_series_results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ championship_id: championshipId, data })
      });
      const result = await response.json();
      if (result.success) {
        alert('Data imported successfully');
      } else {
        alert('Error importing data: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to import data');
    }
  }
});




