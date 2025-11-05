// Complete percentage distribution table (all sum to 100%)
const PRIZE_PERCENTAGES = {
  24: [28, 24, 18, 13, 10, 7],
  28: [27, 22, 17, 12, 9, 8, 5],
  32: [26, 21, 16, 11, 8, 7, 6, 5],
  36: [25, 20, 15, 10, 8, 7, 6, 5, 4],
  40: [24, 19, 14, 10, 8, 7, 6, 5, 4, 3],
  44: [23, 18, 14, 10, 8, 7, 6, 5, 4, 3, 2],
  48: [23, 17, 13, 10, 8, 7, 6, 5, 4, 3, 2, 2],
  52: [21, 16, 13, 10, 8, 7, 6, 5, 4, 3, 3, 2, 2],
  56: [20, 15, 13, 10, 8, 7, 6, 5, 4, 3, 3, 2, 2, 2],
  60: [20, 14, 12, 10, 8, 7, 6, 5, 4, 3, 3, 2, 2, 2, 2],
  64: [19, 14, 12, 10, 8, 7, 6, 5, 4, 3, 3, 2, 2, 2, 1, 1],
  68: [18, 14, 12, 10, 8, 7, 6, 5, 4, 3, 3, 2, 2, 2, 1, 1, 1],
  72: [17, 14, 12, 10, 8, 7, 6, 5, 4, 3, 3, 2, 2, 2, 1, 1, 1, 1],
  76: [16, 14, 12, 10, 8, 7, 6, 5, 4, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1],
  80: [16, 14, 12, 10, 8, 7, 6, 5, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1]
};

// Global state
let currentDistribution = null;
let totalPrize = 0;
let playerCount = 0;

function calculatePrizeDistribution(numPlayers, totalPrize) {
  // 1. Validate input range
  if (numPlayers < 24 || numPlayers > 80) {
    return { error: "Number of players must be between 24 and 80" };
  }
  
  if (totalPrize <= 0) {
    return { error: "Total prize must be greater than 0" };
  }
  
  // 2. Round UP to next multiple of 4
  const roundedCount = Math.ceil(numPlayers / 4) * 4;
  
  // 3. Get percentages for that count
  const percentages = PRIZE_PERCENTAGES[roundedCount];
  
  // 4. Calculate integer amounts using "largest remainder method"
  let distribution = percentages.map((percentage, index) => {
    const exactAmount = (totalPrize * percentage) / 100;
    return {
      position: index + 1,
      percentage: percentage,
      amount: Math.floor(exactAmount),
      remainder: exactAmount - Math.floor(exactAmount)
    };
  });
  
  // 5. Distribute the leftover to ensure sum equals totalPrize
  let currentTotal = distribution.reduce((sum, prize) => sum + prize.amount, 0);
  let difference = totalPrize - currentTotal;
  
  // Sort by remainder (descending) to distribute difference fairly
  const sortedByRemainder = distribution
    .map((prize, idx) => ({ ...prize, originalIndex: idx }))
    .sort((a, b) => b.remainder - a.remainder);
  
  // Add 1 to the prizes with largest remainders
  for (let i = 0; i < difference; i++) {
    sortedByRemainder[i].amount += 1;
  }
  
  // Restore original order and clean up
  distribution = sortedByRemainder
    .sort((a, b) => a.originalIndex - b.originalIndex)
    .map(({ position, percentage, amount }) => ({ position, percentage, amount }));
  
  // 6. Final verification
  const totalDistributed = distribution.reduce((sum, prize) => sum + prize.amount, 0);
  
  return {
    playerCount: roundedCount,
    actualPlayers: numPlayers,
    totalPrize: totalPrize,
    distribution: distribution,
    totalDistributed: totalDistributed,
    verified: totalDistributed === totalPrize,
    roundedUp: roundedCount !== numPlayers
  };
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  setupEventListeners();
});

function setupEventListeners() {
  document.getElementById('btnCalculate').addEventListener('click', calculateDistribution);
  document.getElementById('btnClear').addEventListener('click', clearAll);
  document.getElementById('btnAddWinner').addEventListener('click', addWinner);
  document.getElementById('btnRemoveLastWinner').addEventListener('click', removeLastWinner);
  document.getElementById('btnExportExcel').addEventListener('click', exportToExcel);
  document.getElementById('btnExportPDF').addEventListener('click', exportToPDF);
}

function calculateDistribution() {
  const playerCountInput = document.getElementById('playerCount').value;
  const totalAmountInput = document.getElementById('totalAmount').value;
  
  playerCount = parseInt(playerCountInput);
  totalPrize = parseFloat(totalAmountInput);
  
  // Validate inputs
  if (isNaN(playerCount) || playerCount === 0) {
    showAlert('Please enter the number of players', 'error');
    return;
  }
  
  if (isNaN(totalPrize) || totalPrize <= 0) {
    showAlert('Please enter a valid total inflow amount', 'error');
    return;
  }
  
  // Validate player range
  if (playerCount < 24 || playerCount > 80) {
    showAlert('Number of players must be between 24 and 80', 'error');
    return;
  }
  
  // Calculate distribution
  const result = calculatePrizeDistribution(playerCount, totalPrize);
  
  if (result.error) {
    showAlert(result.error, 'error');
    return;
  }
  
  // Show rounded up message if applicable
  if (result.roundedUp) {
    showAlert(`Using distribution for ${result.playerCount} players (rounded up from ${result.actualPlayers})`, 'info');
  }
  
  // Store current distribution
  currentDistribution = result.distribution;
  
  // Display results
  displaySummary(result);
  displayResults(result);
  
  // Show sections
  document.getElementById('summarySection').classList.remove('hidden');
  document.getElementById('resultsSection').classList.remove('hidden');
}

function displaySummary(result) {
  document.getElementById('summaryPlayers').textContent = result.actualPlayers;
  document.getElementById('summaryTotal').textContent = `$${result.totalPrize.toFixed(2)}`;
  document.getElementById('summaryDistributed').textContent = `$${result.totalDistributed.toFixed(2)}`;
  document.getElementById('summaryWinners').textContent = result.distribution.length;
}

function displayResults(result) {
  const tbody = document.getElementById('prizeTableBody');
  tbody.innerHTML = '';
  
  result.distribution.forEach((prize, index) => {
    const row = createPrizeRow(prize, index);
    tbody.appendChild(row);
  });
  
  updateTotalDistributed();
}

function createPrizeRow(prize, index) {
  const row = document.createElement('tr');
  row.className = 'hover:bg-gray-50 transition-colors';
  row.dataset.index = index;
  
  row.innerHTML = `
    <td class="px-6 py-4 whitespace-nowrap">
      <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-800 font-bold">
        ${prize.position}
      </span>
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
      ${prize.percentage}%
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      <input type="number" 
        class="amount-input w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" 
        value="${prize.amount}" 
        min="0" 
        step="0.01"
        data-index="${index}">
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-center">
      <button class="btn-delete-row text-red-600 hover:text-red-800 transition-colors" data-index="${index}">
        <i class="fas fa-trash"></i>
      </button>
    </td>
  `;
  
  // Add event listeners
  const amountInput = row.querySelector('.amount-input');
  amountInput.addEventListener('input', handleAmountEdit);
  
  const deleteBtn = row.querySelector('.btn-delete-row');
  deleteBtn.addEventListener('click', deleteRow);
  
  return row;
}

function handleAmountEdit(event) {
  const index = parseInt(event.target.dataset.index);
  const newAmount = parseFloat(event.target.value) || 0;
  
  // Update current distribution
  currentDistribution[index].amount = newAmount;
  
  // Update total
  updateTotalDistributed();
  
  // Check if total matches
  checkTotalMatch();
}

function updateTotalDistributed() {
  const total = currentDistribution.reduce((sum, prize) => sum + prize.amount, 0);
  document.getElementById('totalDistributed').textContent = `$${total.toFixed(2)}`;
  return total;
}

function checkTotalMatch() {
  const currentTotal = currentDistribution.reduce((sum, prize) => sum + prize.amount, 0);
  const percentageTotal = currentDistribution.reduce((sum, prize) => sum + prize.percentage, 0);
  
  if (Math.abs(currentTotal - totalPrize) > 0.01) {
    showAlert(`Warning: Total distributed ($${currentTotal.toFixed(2)}) does not match total inflow ($${totalPrize.toFixed(2)})`, 'warning');
  }
  
  if (Math.abs(percentageTotal - 100) > 0.01) {
    showAlert(`Warning: Total percentage (${percentageTotal.toFixed(2)}%) does not equal 100%`, 'warning');
  }
}

function addWinner() {
  if (!currentDistribution || currentDistribution.length === 0) {
    showAlert('Please calculate distribution first', 'error');
    return;
  }
  
  // Add new winner with default 1%
  const newPercentage = 1;
  const newPosition = currentDistribution.length + 1;
  const newAmount = Math.round((totalPrize * newPercentage) / 100);
  
  currentDistribution.push({
    position: newPosition,
    percentage: newPercentage,
    amount: newAmount
  });
  
  // Refresh display
  refreshTable();
  updateSummaryWinners();
  
  // Show warning that total percentage has increased
  const percentageTotal = currentDistribution.reduce((sum, prize) => sum + prize.percentage, 0);
  if (percentageTotal > 100) {
    showAlert(`Warning: Total percentage is now ${percentageTotal.toFixed(2)}% (exceeds 100%). Please adjust manually.`, 'warning');
  }
}

function removeLastWinner() {
  if (!currentDistribution || currentDistribution.length === 0) {
    showAlert('No winners to remove', 'error');
    return;
  }
  
  if (currentDistribution.length === 1) {
    showAlert('Cannot remove the last winner', 'error');
    return;
  }
  
  // Remove last winner (leave gap, show warning)
  currentDistribution.pop();
  
  // Refresh display
  refreshTable();
  updateSummaryWinners();
  
  // Check total
  const percentageTotal = currentDistribution.reduce((sum, prize) => sum + prize.percentage, 0);
  if (percentageTotal < 100) {
    showAlert(`Warning: Total percentage is now ${percentageTotal.toFixed(2)}% (less than 100%)`, 'warning');
  }
}

function deleteRow(event) {
  const index = parseInt(event.target.closest('button').dataset.index);
  
  if (currentDistribution.length === 1) {
    showAlert('Cannot remove the last winner', 'error');
    return;
  }
  
  // Remove winner at index
  currentDistribution.splice(index, 1);
  
  // Renumber positions
  currentDistribution.forEach((winner, idx) => {
    winner.position = idx + 1;
  });
  
  // Refresh display
  refreshTable();
  updateSummaryWinners();
  
  // Check total
  const percentageTotal = currentDistribution.reduce((sum, prize) => sum + prize.percentage, 0);
  if (percentageTotal < 100) {
    showAlert(`Warning: Total percentage is now ${percentageTotal.toFixed(2)}% (less than 100%)`, 'warning');
  }
}

function refreshTable() {
  const tbody = document.getElementById('prizeTableBody');
  tbody.innerHTML = '';
  
  currentDistribution.forEach((prize, index) => {
    const row = createPrizeRow(prize, index);
    tbody.appendChild(row);
  });
  
  updateTotalDistributed();
}

function updateSummaryWinners() {
  document.getElementById('summaryWinners').textContent = currentDistribution.length;
}

function clearAll() {
  // Clear inputs
  document.getElementById('playerCount').value = '';
  document.getElementById('totalAmount').value = '';
  
  // Hide sections
  document.getElementById('summarySection').classList.add('hidden');
  document.getElementById('resultsSection').classList.add('hidden');
  
  // Clear state
  currentDistribution = null;
  totalPrize = 0;
  playerCount = 0;
  
  // Clear table
  document.getElementById('prizeTableBody').innerHTML = '';
}

function showAlert(message, type = 'info') {
  // Type can be: 'info', 'error', 'warning', 'success'
  const colors = {
    info: 'bg-blue-100 border-blue-500 text-blue-700',
    error: 'bg-red-100 border-red-500 text-red-700',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
    success: 'bg-green-100 border-green-500 text-green-700'
  };
  
  const icons = {
    info: 'fa-info-circle',
    error: 'fa-exclamation-circle',
    warning: 'fa-exclamation-triangle',
    success: 'fa-check-circle'
  };
  
  const alert = document.createElement('div');
  alert.className = `fixed top-4 right-4 ${colors[type]} border-l-4 p-4 rounded shadow-lg z-50 max-w-md`;
  alert.innerHTML = `
    <div class="flex items-center">
      <i class="fas ${icons[type]} mr-3"></i>
      <p>${message}</p>
    </div>
  `;
  
  document.body.appendChild(alert);
  
  // Remove after 5 seconds
  setTimeout(() => {
    alert.remove();
  }, 5000);
}

function exportToExcel() {
  if (!currentDistribution || currentDistribution.length === 0) {
    showAlert('No data to export', 'error');
    return;
  }
  
  // Prepare data
  const data = [
    ['Prize Distribution Report'],
    [''],
    ['Total Inflow:', `$${totalPrize.toFixed(2)}`],
    ['Number of Players:', playerCount],
    ['Number of Winners:', currentDistribution.length],
    [''],
    ['Position', 'Percentage', 'Amount']
  ];
  
  currentDistribution.forEach(prize => {
    data.push([prize.position, `${prize.percentage}%`, `$${prize.amount.toFixed(2)}`]);
  });
  
  const totalDistributed = currentDistribution.reduce((sum, p) => sum + p.amount, 0);
  data.push(['', 'TOTAL:', `$${totalDistributed.toFixed(2)}`]);
  
  // Create workbook
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Prize Distribution');
  
  // Download
  XLSX.writeFile(wb, 'prize_distribution.xlsx');
  
  showAlert('Excel file exported successfully', 'success');
}

function exportToPDF() {
  if (!currentDistribution || currentDistribution.length === 0) {
    showAlert('No data to export', 'error');
    return;
  }
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.text('Prize Distribution Report', 14, 20);
  
  // Summary info
  doc.setFontSize(12);
  doc.text(`Total Inflow: $${totalPrize.toFixed(2)}`, 14, 35);
  doc.text(`Number of Players: ${playerCount}`, 14, 42);
  doc.text(`Number of Winners: ${currentDistribution.length}`, 14, 49);
  
  // Table
  const tableData = currentDistribution.map(prize => [
    prize.position,
    `${prize.percentage}%`,
    `$${prize.amount.toFixed(2)}`
  ]);
  
  const totalDistributed = currentDistribution.reduce((sum, p) => sum + p.amount, 0);
  tableData.push(['', 'TOTAL:', `$${totalDistributed.toFixed(2)}`]);
  
  doc.autoTable({
    startY: 60,
    head: [['Position', 'Percentage', 'Amount']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] }
  });
  
  // Download
  doc.save('prize_distribution.pdf');
  
  showAlert('PDF file exported successfully', 'success');
}