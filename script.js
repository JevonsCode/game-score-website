// Array to hold player objects
const players = [];

/**
 * Render the scoreboard table based on the current state of the players array.
 * Each row includes buttons for adjusting scores in different increments and
 * removing the player from the list. Data attributes are used to identify
 * which player a button belongs to and the amount by which to change the
 * score when clicked.
 */
function renderTable() {
  const tbody = document.querySelector('#scoreTable tbody');
  tbody.innerHTML = '';
  players.forEach((player, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${player.name}</td>
      <td>${player.score}</td>
      <td class="actions">
        <button class="increment" data-index="${index}" data-change="1">+1</button>
        <button class="increment5" data-index="${index}" data-change="5">+5</button>
        <button class="decrement" data-index="${index}" data-change="-1">-1</button>
        <button class="decrement5" data-index="${index}" data-change="-5">-5</button>
        <button class="remove" data-index="${index}">&times;</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Add a new player when the "Add Player" button is clicked
document.getElementById('addPlayerBtn').addEventListener('click', () => {
  const input = document.getElementById('playerName');
  const name = input.value.trim();
  if (name) {
    players.push({ name, score: 0 });
    input.value = '';
    renderTable();
  }
});

// Event delegation for score adjustments and removal
const tableBody = document.querySelector('#scoreTable tbody');
tableBody.addEventListener('click', (e) => {
  if (e.target.tagName.toLowerCase() === 'button') {
    const index = parseInt(e.target.getAttribute('data-index'));
    // If the button has a data-change attribute, adjust the score
    if (e.target.dataset.change) {
      const delta = parseInt(e.target.dataset.change);
      players[index].score += delta;
    } else if (e.target.classList.contains('remove')) {
      // Remove player
      players.splice(index, 1);
    }
    renderTable();
  }
});

// Distribute a total number of points evenly to all players
function distributePoints() {
  const total = parseInt(document.getElementById('totalPoints').value);
  if (!isNaN(total) && players.length > 0) {
    const share = Math.floor(total / players.length);
    players.forEach(player => {
      player.score += share;
    });
    renderTable();
  }
}

// Reset all player scores to zero
function resetScores() {
  players.forEach(player => {
    player.score = 0;
  });
  renderTable();
}

// Attach event listeners to the distribute and reset buttons
document.getElementById('distributeBtn').addEventListener('click', distributePoints);
document.getElementById('resetBtn').addEventListener('click', resetScores);
