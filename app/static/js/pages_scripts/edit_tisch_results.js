document.addEventListener('DOMContentLoaded', (event) => {
  // Function to calculate total points
  function calculateTotalPoints(tischPoints, wonGames, lostGames, sumOpponentsLostGames, numberOfPlayers) {
    let opponentMultiplier = numberOfPlayers === 3 ? 40 : numberOfPlayers === 4 ? 30 : 0;
    let adjustedOpponentPoints = sumOpponentsLostGames * opponentMultiplier;
    return tischPoints + (wonGames - lostGames) * 50 + adjustedOpponentPoints;
  }

  // Function to update total points for a row
  function updateTotalPoints(row, numberOfPlayers, sumVerlorene, totalTischGames, gamesToAssign) {
    const tischPoints = parseFloat(row.querySelector('input[name="points"]').value) || 0;
    const wonGames = parseFloat(row.querySelector('input[name="won_games"]').value) || 0;
    const lostGames = parseFloat(row.querySelector('input[name="lost_games"]').value) || 0;
    const totalPointsInput = row.querySelector('input[name="total_points"]');

    let sumOpponentsLostGames = sumVerlorene - lostGames;

    const spanGamesToAssign = document.getElementById('spanGamesToAssign')
    spanGamesToAssign.innerText = gamesToAssign

    const totalPoints = calculateTotalPoints(tischPoints, wonGames, lostGames, sumOpponentsLostGames, numberOfPlayers);
    totalPointsInput.value = totalPoints;

  }

  // Attach event listeners to all relevant inputs
  const rows = document.querySelectorAll('#tableTischPlayers tbody tr');
  const numberOfPlayers = rows.length;

  let totalTischGames = numberOfPlayers === 3 ? 36 : numberOfPlayers === 4 ? 48 : 0;

  rows.forEach(row => {
    const inputs = row.querySelectorAll('input[name="points"], input[name="won_games"], input[name="lost_games"]');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        // Calculate sum of all Verlorene and Gewonne values
        let sumVerlorene = 0;
        let sumGewonne = 0;
        rows.forEach(r => {
          sumVerlorene += parseFloat(r.querySelector('input[name="lost_games"]').value) || 0;
          sumGewonne += parseFloat(r.querySelector('input[name="won_games"]').value) || 0;
        });

        // Calculate gamesToAssign
        let gamesToAssign = totalTischGames - (sumVerlorene + sumGewonne);

        // Update total points for each row
        rows.forEach(r => {
          updateTotalPoints(r, numberOfPlayers, sumVerlorene, totalTischGames, gamesToAssign);
        });
      });
    });

    // Initial calculation for existing values
    let sumVerlorene = 0;
    let sumGewonne = 0;
    rows.forEach(r => {
      sumVerlorene += parseFloat(r.querySelector('input[name="lost_games"]').value) || 0;
      sumGewonne += parseFloat(r.querySelector('input[name="won_games"]').value) || 0;
    });

    // Calculate gamesToAssign
    let gamesToAssign = totalTischGames - (sumVerlorene + sumGewonne);



    updateTotalPoints(row, numberOfPlayers, sumVerlorene, totalTischGames, gamesToAssign);
  });

  // Attach event listener to the button
  const btnBackToTische = document.getElementById('btnCloseTischResults');
  if (btnBackToTische) {
    btnBackToTische.addEventListener('click', redirectToTische);
  }

  document.getElementById('btnSaveTischResults').addEventListener('click', function () {
    const rows = document.querySelectorAll('#tableTischPlayers tbody tr');

    rows.forEach(row => {
      const playerId = row.getAttribute('data-player-id');
      const seriesId = row.getAttribute('data-serie-id');

      const tischPoints = row.querySelector('input[name="points"]').value;
      const wonGames = row.querySelector('input[name="won_games"]').value;
      const lostGames = row.querySelector('input[name="lost_games"]').value;
      const totalPoints = row.querySelector('input[name="total_points"]').value;

      const data = {
        playerId: playerId,
        seriesId: seriesId,
        total_points: totalPoints,
        tisch_points: tischPoints,
        won_games: wonGames,
        lost_games: lostGames
      };
      console.log(data)

      fetch('/update_player_points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            console.log(`Player ${playerId} points updated successfully.`);
          } else {
            console.error(`Failed to update points for player ${playerId}: ${data.error}`);
          }
        })
        .catch(error => console.error(`Error updating points for player ${playerId}: ${error}`));
    });
  });
});
function redirectToTische() {
  window.location.href = '/tische.html';
}