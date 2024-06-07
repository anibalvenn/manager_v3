document.addEventListener('DOMContentLoaded', function () {

  document.querySelectorAll('input[name="points"]').forEach(input => {
    input.addEventListener('change', function () {
      const playerId = this.closest('tr').getAttribute('data-player-id');
      const newPoints = this.value;

      fetch(`/update_player_points`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': '{{ csrf_token() }}' // Add CSRF token for security if using Flask-WTF or similar
        },
        body: JSON.stringify({ playerId: playerId, points: newPoints })
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


})