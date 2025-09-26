// Array to hold player objects. Each player has a name and a score.
// The list is persisted in localStorage so that it survives page reloads.
const players = [];

/**
 * Load players from localStorage on page load. If there is saved data,
 * it will replace the contents of the `players` array.
 */
function loadPlayers() {
  try {
    const saved = JSON.parse(localStorage.getItem('players'));
    if (Array.isArray(saved)) {
      players.splice(0, players.length, ...saved);
    }
  } catch (e) {
    console.error('Failed to load players from storage:', e);
  }
}

/**
 * Save the current players array to localStorage. This should be called
 * after any change to the player list or their scores.
 */
function savePlayers() {
  try {
    localStorage.setItem('players', JSON.stringify(players));
  } catch (e) {
    console.error('Failed to save players to storage:', e);
  }
}

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
        <button class="rename" data-index="${index}">✏️</button>
        <button class="remove" data-index="${index}">&times;</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Add a new player when the "Add Player" button is clicked
document.getElementById('addPlayerBtn').addEventListener('click', () => {
  const input = document.getElementById('playerName');
  const scoreInput = document.getElementById('playerScore');
  const name = input.value.trim();
  // parse initial score; if empty or invalid use zero
  const initialScore = parseInt(scoreInput.value);
  const score = !isNaN(initialScore) ? initialScore : 0;
  if (name) {
    players.push({ name, score });
    input.value = '';
    scoreInput.value = '';
    savePlayers();
    renderTable();
  }
});

// Event delegation for score adjustments, removal, and rename
const tableBody = document.querySelector('#scoreTable tbody');
tableBody.addEventListener('click', (e) => {
  if (e.target.tagName.toLowerCase() === 'button') {
    const index = parseInt(e.target.getAttribute('data-index'));
    if (e.target.dataset.change) {
      // Adjust the score by the specified delta
      const delta = parseInt(e.target.dataset.change);
      players[index].score += delta;
      savePlayers();
    } else if (e.target.classList.contains('remove')) {
      // Remove player
      players.splice(index, 1);
      savePlayers();
    } else if (e.target.classList.contains('rename')) {
      // Rename player
      const newName = prompt('Enter a new name:', players[index].name);
      if (newName !== null) {
        const trimmed = newName.trim();
        if (trimmed) {
          players[index].name = trimmed;
          savePlayers();
        }
      }
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
    savePlayers();
    renderTable();
  }
}

// Reset all player scores to zero
function resetScores() {
  players.forEach(player => {
    player.score = 0;
  });
  savePlayers();
  renderTable();
}

// Attach event listeners to the distribute and reset buttons
document.getElementById('distributeBtn').addEventListener('click', distributePoints);
document.getElementById('resetBtn').addEventListener('click', resetScores);

// Load players from storage and render when the page is loaded
window.addEventListener('DOMContentLoaded', () => {
  loadPlayers();
  renderTable();
});
