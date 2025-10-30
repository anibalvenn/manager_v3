document.addEventListener('DOMContentLoaded', function () {

    document.addEventListener('change', function (event) {
        const checkbox = event.target;
        if (checkbox.type === 'checkbox' && checkbox.checked) {
            const checkboxes = document.querySelectorAll('tr input[type="checkbox"]');
            checkboxes.forEach(cb => {
                if (cb !== checkbox) {
                    cb.checked = false;
                }
            });
        }
    });
        document.addEventListener('keydown', function (event) {
            if (event.altKey && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
                const checkedRows = document.querySelectorAll('tr input[type="checkbox"]:checked');
                checkedRows.forEach(row => {
                    const currentRow = row.closest('tr');
                    const nextRow = currentRow.nextElementSibling;
                    const previousRow = currentRow.previousElementSibling;
                    
                    if (event.key === 'ArrowDown' && nextRow) {
                        nextRow.parentNode.insertBefore(nextRow, currentRow);
                        nextRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    } else if (event.key === 'ArrowUp' && previousRow) {
                        currentRow.parentNode.insertBefore(currentRow, previousRow);
                        currentRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                });
                updatePlayersInTrBackground();
                updateLineNumbers(); // Update line numbers after reordering
            }
        });
        
    updatePlayersInTrBackground()
    updateLineNumbers(); // Initial line numbers update

})

document.addEventListener('DOMContentLoaded', function () {
    const closeModalButton = document.getElementById('closemodalEditPlayersChampionship');

    closeModalButton.addEventListener('click', () => {
        window.location.href = '/championships.html'; // Redirect to the championships page
    });

    const btnSendDataToServer = document.getElementById("btnSaveChangesModalEditPlayersChampionship")
    btnSendDataToServer.addEventListener('click', () => {
        sendDataToServer()
    })

    // Get the input element
    const searchPlayerOutInput = document.getElementById('searchPlayerOut');

    // Add an event listener to the input field
    searchPlayerOutInput.addEventListener('input', () => {
        // Get the value of the input field
        const searchTerm = searchPlayerOutInput.value.toLowerCase();

        // Get all <tr> elements
        const playerRows = document.querySelectorAll('#tablePlayersOut tbody tr');

        // Loop through each <tr> element
        playerRows.forEach(row => {
            // Get the player name and player ID from the <td> elements inside the <tr>
            const playerName = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
            const playerID = row.querySelector('td:nth-child(5)').textContent.toLowerCase();

            // Check if the player name or player ID contains the search term
            if (playerName.includes(searchTerm) || playerID.includes(searchTerm)) {
                // If it does, display the row
                row.style.display = 'table-row';
            } else {
                // If not, hide the row
                row.style.display = 'none';
            }
        });
    });
    // Get the input element
    const searchPlayerInInput = document.getElementById('searchPlayerIn');

    // Add an event listener to the input field
    searchPlayerInInput.addEventListener('input', () => {
        // Get the value of the input field
        const searchTerm = searchPlayerInInput.value.toLowerCase();

        // Get all <tr> elements
        const playerRows = document.querySelectorAll('#tablePlayersIn tbody tr');

        // Loop through each <tr> element
        playerRows.forEach(row => {
            // Get the player name and player ID from the <td> elements inside the <tr>
            const playerName = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
            const playerID = row.querySelector('td:nth-child(5)').textContent.toLowerCase();

            // Check if the player name or player ID contains the search term
            if (playerName.includes(searchTerm) || playerID.includes(searchTerm)) {
                // If it does, display the row
                row.style.display = 'table-row';
            } else {
                // If not, hide the row
                row.style.display = 'none';
            }
        });
    });


    addEventListenersToMoveButtons()

})

// Function to update line numbers in both tables
function updateLineNumbers() {
    // Update #tablePlayersIn
    const tablePlayersIn = document.querySelector('#tablePlayersIn tbody');
    const rowsIn = tablePlayersIn.querySelectorAll('tr');
    
    rowsIn.forEach((row, index) => {
        const lineNumberCell = row.querySelector('.line-number');
        if (lineNumberCell) {
            lineNumberCell.textContent = index + 1;
        }
    });

    // Update #tablePlayersOut
    const tablePlayersOut = document.querySelector('#tablePlayersOut tbody');
    const rowsOut = tablePlayersOut.querySelectorAll('tr');
    
    rowsOut.forEach((row, index) => {
        const lineNumberCell = row.querySelector('.line-number');
        if (lineNumberCell) {
            lineNumberCell.textContent = index + 1;
        }
    });
}

// Function to move a player row to tablePlayersIn
function movePlayerIn(playerRow) {
    // Clone the entire row
    const clonedRow = playerRow.cloneNode(true);

    // Remove the original row from #tablePlayersOut
    playerRow.remove();

    // Add the cloned row to #tablePlayersIn
    const tablePlayersInBody = document.querySelector('#tablePlayersIn tbody');
    tablePlayersInBody.appendChild(clonedRow);

    // Add event listener to move button within the cloned row
    const moveButtonOut = clonedRow.querySelector('.btnMovePlayerOut');
    moveButtonOut.addEventListener('click', () => {
        const playerRow = moveButtonOut.closest('tr');

        movePlayerOut(playerRow);
    });
    updatePlayersInTrBackground()
    updateLineNumbers(); // Update line numbers after moving player in
}

// Function to move a player row to tablePlayersOut
function movePlayerOut(playerRow) {
    // Clone the entire row
    const clonedRow = playerRow.cloneNode(true);

    // Remove the original row from #tablePlayersIn
    playerRow.remove();

    // Add the cloned row to #tablePlayersOut
    const tablePlayersOutBody = document.querySelector('#tablePlayersOut tbody');
    tablePlayersOutBody.appendChild(clonedRow);

    // Add event listener to move button within the cloned row
    const moveButtonIn = clonedRow.querySelector('.btnMovePlayerIn');
    moveButtonIn.addEventListener('click', () => {
        const playerRow = moveButtonIn.closest('tr');
        movePlayerIn(playerRow);
    });
    updatePlayersInTrBackground()
    updateLineNumbers(); // Update line numbers after moving player out
}

// Function to add event listeners to move buttons
function addEventListenersToMoveButtons() {
    // Get all buttons with the class .btnMovePlayerIn
    const movePlayerInButtons = document.querySelectorAll('.btnMovePlayerIn');

    // Add click event listener to each button
    movePlayerInButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Get the parent <tr> element of the clicked button
            const playerRow = button.closest('tr');
            movePlayerIn(playerRow);
        });
    });

    // Get all buttons with the class .btnMovePlayerOut
    const movePlayerOutButtons = document.querySelectorAll('.btnMovePlayerOut');

    // Add click event listener to each button
    movePlayerOutButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Get the parent <tr> element of the clicked button
            const playerRow = button.closest('tr');
            movePlayerOut(playerRow);
        });
    });
}

function sendDataToServer() {
    // Get the championship ID from the data attribute
    const championshipId = document.querySelector('#tablePlayersIn').getAttribute('data-championship-id');

    // Check if championshipId exists
    if (!championshipId) {
        console.error('Championship ID not found.');
        return;
    }

    // Initialize an array to store player IDs
    const players = [];

    // Get all player rows from the table
    const playerRows = document.querySelectorAll('#tablePlayersIn tbody tr');

    // Loop through each player row
    playerRows.forEach(row => {
        // Get the player ID from the data attribute
        const playerId = row.getAttribute('data-player-id');
        const playerGroupId = row.getAttribute('data-group-id');
        const playerGroupPosition = row.getAttribute('data-group-position');

        // Create an object for the player
        const player = {
            playerId: playerId,
            championshipId: championshipId,
            playerGroupId: playerGroupId,
            playerGroupPosition: playerGroupPosition
        };

        // Add the player ID to the array
        players.push(player);
    });

    // Prepare the data object to send to the server for removing players
    const dataRemovePlayersFromChampionship = {
        championshipId: championshipId
    };

    // Prepare the data object to send to the server for adding players
    const dataAddPlayersToChampionship = {
        players: players
    };

    // Send the data to the server to remove players from the championship
    fetch('/remove_all_players_from_championship', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataRemovePlayersFromChampionship)
    })
        .then(response => {
            if (!response.ok) {
                // Handle error response
                throw new Error('Failed to remove players from championship.');
            }
            // Otherwise, return the response to continue processing
            return response.json();
        })
        .then(() => {
            // Check if players array is not empty before proceeding
            if (dataAddPlayersToChampionship.players.length > 0) {
                // Now, send data to add players to the championship
                return fetch('/add_players_to_championship', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataAddPlayersToChampionship)
                });
            } else {
                // Return a resolved promise since there are no players to add
                return Promise.resolve();
            }
        })
        .then(response => {
            if (!response.ok) {
                // Handle error response
                throw new Error('Failed to add players to championship.');
            }
            // Handle success response
            console.log('Players added successfully.');
            alert('Editions recorded successfully');

        })
        .catch(error => {
            // Handle error
            console.error(error);
        });
}

function getPlayersInRowCount() {
    // Get the table element
    var table = document.getElementById('tablePlayersIn');
    // Get the number of rows in the table
    var rowCount = table.getElementsByTagName('tr').length;
    // Display the row count outside the table
    return (rowCount - 1); // Subtract 1 to exclude the header row
}
function updatePlayersInTrBackground() {
    const table = document.getElementById("tablePlayersIn");
    const rows = table.querySelectorAll("tbody tr");
    removeAssignmentPlayerGroup(rows)


    let numBlindPlayers = 0
    // Get the table element

    let numPlayers = getPlayersInRowCount()
    let numGroups = 4;
    let groupSize = Math.ceil(numPlayers / numGroups);
    let remainder = numPlayers % numGroups;
    if (remainder > 0) {
        numBlindPlayers = numGroups - remainder;
    }   // Get the number of rows in the table
    if (numBlindPlayers == 0) {
        for (let i = 0; i < numGroups; i++) {
            const startIndex = i * groupSize;
            const endIndex = (i * groupSize + groupSize)
            assignPlayerToGroup(rows, startIndex, endIndex, i)
        }
    } else {
        if (numBlindPlayers == 1) {
            for (let i = 0; i < numGroups; i++) {
                const startIndex = i * groupSize;
                let endIndex = (i * groupSize + groupSize)

                if (i == numGroups - numBlindPlayers) {
                    endIndex = (i * groupSize + groupSize) - 1
                }

                assignPlayerToGroup(rows, startIndex, endIndex, i)
            }
        }
        if (numBlindPlayers == 2) {
            for (let i = 0; i < numGroups; i++) {
                let startIndex = i * groupSize;
                let endIndex = (i * groupSize + groupSize)

                if (i == 2) {
                    startIndex = i * groupSize
                    endIndex = (i * groupSize + groupSize) - 1
                }
                if (i == 3) {
                    startIndex = i * groupSize - 1
                    endIndex = (i * groupSize + groupSize) - 2
                }

                assignPlayerToGroup(rows, startIndex, endIndex, i)
            }
        }
        if (numBlindPlayers == 3) {
            for (let i = 0; i < numGroups; i++) {
                let startIndex
                let endIndex

                if (i == 0) {
                    startIndex = i * groupSize
                    endIndex = (i * groupSize + groupSize)
                } else if (i == 1) {
                    startIndex = i * groupSize
                    endIndex = (i * groupSize + groupSize) - 1

                } else if (i == 2) {
                    startIndex = i * groupSize - 1
                    endIndex = (i * groupSize + groupSize) - 2

                } else {
                    startIndex = i * groupSize - 2
                    endIndex = (i * groupSize + groupSize) - 3

                }

                assignPlayerToGroup(rows, startIndex, endIndex, i)
            }
        }
    }
}

function assignPlayerToGroup(rows, startIndex, endIndex, i) {
    for (let j = startIndex; j < endIndex; j++) {
        rows[j].classList.add(`group-${i + 1}`);
        rows[j].setAttribute("data-group-id", `${i + 1}`)
        rows[j].setAttribute("data-group-position", `${j - startIndex + 1}`)
    }

}
function removeAssignmentPlayerGroup(rows) {

    const pattern = /group-\d+/;

    for (let row of rows) {
        row.removeAttribute("data-group-id")
        row.removeAttribute("data-group-position")
        // Get all classes of the row
        const classes = row.classList;

        // Iterate over each class
        for (let className of classes) {
            // Check if the class matches the pattern
            if (pattern.test(className)) {
                // Remove the class if it matches the pattern
                row.classList.remove(className);
            }
        }
    }

}