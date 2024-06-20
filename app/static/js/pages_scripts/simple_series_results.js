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
                body: JSON.stringify({ playerId: playerId, total_points: newPoints, seriesId: seriesId })
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


    const btnBackToResults = document.getElementById('closeModalEditSimplesResults');
    btnBackToResults.addEventListener('click', () => {
        // Get the championship data from the row
        window.location.href = "/series.html"

    });
    const btnSaveChangesSimpleResults = document.getElementById('btnSaveChangesSimpleResults');
    btnSaveChangesSimpleResults.addEventListener('click', () => {
        // Get the championship data from the row
        alert('Changes saved succesfully')
    });
})