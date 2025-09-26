const players = [];

function renderTable() {
  const tbody = document.querySelector('#scoreTable tbody');
  tbody.innerHTML = '';
  players.forEach((player, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${player.name}</td>
      <td>${player.score}</td>
      <td class="actions">
        <button class="increment" data-index="${index}">+1</button>
        <button class="decrement" data-index="${index}">-1</button>
        <button class="remove" data-index="${index}">&times;</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById('addPlayerBtn').addEventListener('click', () => {
  const input = document.getElementById('playerName');
  const name = input.value.trim();
  if (name) {
    players.push({ name, score: 0 });
    input.value = '';
    renderTable();
  }
});

// Event delegation for actions
const tableBody = document.querySelector('#scoreTable tbody');
tableBody.addEventListener('click', (e) => {
  if (e.target.tagName.toLowerCase() === 'button') {
    const index = parseInt(e.target.getAttribute('data-index'));
    if (e.target.classList.contains('increment')) {
      players[index].score += 1;
    } else if (e.target.classList.contains('decrement')) {
      players[index].score -= 1;
    } else if (e.target.classList.contains('remove')) {
      players.splice(index, 1);
    }
    renderTable();
  }
});
