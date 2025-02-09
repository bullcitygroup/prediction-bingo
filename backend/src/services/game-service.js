class GameService {
  checkWinConditions(completed) {
    const wins = [];
    const size = 5;

    // Check rows
    for (let i = 0; i < size; i++) {
      if (completed.slice(i * size, (i + 1) * size).every(cell => cell)) {
        wins.push(`Row ${i + 1}`);
      }
    }

    // Check columns
    for (let i = 0; i < size; i++) {
      if (completed.filter((_, index) => index % size === i).every(cell => cell)) {
        wins.push(`Column ${i + 1}`);
      }
    }

    // Check diagonals
    if (completed.filter((_, index) => index % (size + 1) === 0).every(cell => cell)) {
      wins.push('Diagonal (top-left to bottom-right)');
    }
    if (completed.filter((_, index) => 
      index > 0 && 
      index < size * size - 1 && 
      index % (size - 1) === 0
    ).every(cell => cell)) {
      wins.push('Diagonal (top-right to bottom-left)');
    }

    return wins;
  }

  calculateScore(wins, completedCount) {
    // 10 points per completed prediction
    // 50 points per win (row, column, or diagonal)
    return (completedCount * 10) + (wins.length * 50);
  }
}

module.exports = new GameService();