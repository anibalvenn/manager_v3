document.addEventListener('DOMContentLoaded', function () {

    document.querySelectorAll('input[name="points"]').forEach(input => {
        input.addEventListener('change', function () {
            const playerId = this.closest('tr').getAttribute('data-player-id');
            const seriesId = this.closest('tr').getAttribute('data-serie-id');
            const newPoints = this.value;

            fetch(`/update_player_points`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ playerId: playerId, points: newPoints, seriesId: seriesId })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log('Points updated successfully');
                    } else {
                        console.error('Failed to update points');
                    }
                })
                .catch(error => console.error('Error:', error));
        });
    });


    async function fetchResults(seriesId) {
        const response = await fetch(`/api/get_series_rank?series_id=${seriesId}`);
        const data = await response.json();
        if (data.success) {
            return data.data;
        } else {
            throw new Error(data.error);
        }
    }

    async function generatePDFSeriesResult() {
        const modalEditSerie = document.getElementById('modalEditSerie');
        const seriesId = modalEditSerie.getAttribute('data-serie-id');
        const seriesName = modalEditSerie.getAttribute('data-serie-name');
        if (!seriesId) {
            alert("Please enter a series ID");
            return;
        }

        try {
            const results = await fetchResults(seriesId);

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
            const seriesInfo = `Series Name: ${seriesName}, Overall ID: ${seriesId}`;
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

            doc.save('series_results.pdf');
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF');
        }
    }



    const btnGeneratePDF = document.getElementById('btnPDFGenerator');
    btnGeneratePDF.addEventListener('click', () => {
        // Get the championship data from the row
        generatePDFSeriesResult()


    });
    const btnBackToResults = document.getElementById('closeModalEditSimplesResults');
    btnBackToResults.addEventListener('click', () => {
        // Get the championship data from the row
        window.location.href = "/results.html"

    });
    const btnSaveChangesSimpleResults = document.getElementById('btnSaveChangesSimpleResults');
    btnSaveChangesSimpleResults.addEventListener('click', () => {
        // Get the championship data from the row
        alert('Changes saved succesfully')
    });
})