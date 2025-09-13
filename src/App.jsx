import { useState, useEffect } from 'react';
import './App.css';

function Square({ value, onSquareClick, isWinningSquare }) {
  return (
    <button 
      className={`square ${value || ''} ${isWinningSquare ? 'winner' : ''}`} 
      onClick={onSquareClick}
      aria-label={value ? `${value} square` : 'empty square'}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, onPlayAgain }) {
  const winner = calculateWinner(squares);
  const winningLine = winner ? getWinningLine(squares) : null;
  
  function getWinningLine(squares) {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];
    
    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return line;
      }
    }
    return null;
  }
  
  function isWinningSquare(index) {
    return winningLine && winningLine.includes(index);
  }
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  let status;
  if (winner) {
    status = `Winner: ${winner} 🎉`;
  } else if (squares.every(square => square)) {
    status = 'Game ended in a draw! 🤝';
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  // handlePlayAgain is now in the Game component

  return (
    <>
      <div className="status">{status}</div>
      {(winner || squares.every(square => square)) && (
        <button 
          className="play-again-btn"
          onClick={onPlayAgain}
        >
          Play Again
        </button>
      )}
      <div className="board-row">
        <Square 
          value={squares[0]} 
          onSquareClick={() => handleClick(0)} 
          isWinningSquare={isWinningSquare(0)}
        />
        <Square 
          value={squares[1]} 
          onSquareClick={() => handleClick(1)} 
          isWinningSquare={isWinningSquare(1)}
        />
        <Square 
          value={squares[2]} 
          onSquareClick={() => handleClick(2)} 
          isWinningSquare={isWinningSquare(2)}
        />
      </div>
      <div className="board-row">
        <Square 
          value={squares[3]} 
          onSquareClick={() => handleClick(3)} 
          isWinningSquare={isWinningSquare(3)}
        />
        <Square 
          value={squares[4]} 
          onSquareClick={() => handleClick(4)} 
          isWinningSquare={isWinningSquare(4)}
        />
        <Square 
          value={squares[5]} 
          onSquareClick={() => handleClick(5)} 
          isWinningSquare={isWinningSquare(5)}
        />
      </div>
      <div className="board-row">
        <Square 
          value={squares[6]} 
          onSquareClick={() => handleClick(6)} 
          isWinningSquare={isWinningSquare(6)}
        />
        <Square 
          value={squares[7]} 
          onSquareClick={() => handleClick(7)} 
          isWinningSquare={isWinningSquare(7)}
        />
        <Square 
          value={squares[8]} 
          onSquareClick={() => handleClick(8)} 
          isWinningSquare={isWinningSquare(8)}
        />
      </div>
    </>
  );
}

function ThemeToggle({ darkMode, toggleTheme }) {
  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
}

export default function Game() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function handleReset() {
    const newHistory = [Array(9).fill(null)];
    setHistory(newHistory);
    setCurrentMove(0);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className={`app ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      <ThemeToggle darkMode={darkMode} toggleTheme={toggleTheme} />
      <h1 className="game-title">Tic-Tac-Toe</h1>
      <div className="game">
        <div className="game-board">
          <Board 
          xIsNext={xIsNext} 
          squares={currentSquares} 
          onPlay={handlePlay} 
          onPlayAgain={handleReset}
        />
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
      </div>
      <footer className="app-footer">
        <p>Developed by Aryan Bhagat | CS 651 - Web Systems</p>
      </footer>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
