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

    async function generatePDF() {
        // const seriesId = document.getElementById('seriesId').value;
        const modalEditSerie= document.getElementById('modalEditSerie')
        const seriesId = modalEditSerie.getAttribute('data-serie-id')
        if (!seriesId) {
            alert("Please enter a series ID");
            return;
        }

        try {
            const results = await fetchResults(seriesId);

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            doc.text("Series Results", 10, 10);

            let y = 20;
            results.forEach((player, index) => {
                doc.text(`${index + 1}. ${player.player_name} (ID: ${player.player_id}) - Total Points: ${player.total_points}`, 10, y);
                y += 10;
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
        generatePDF()


    });
})