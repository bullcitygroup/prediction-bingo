import React, { useState, useEffect } from 'react';
import Leaderboard from './components/Leaderboard';

const BingoCard = () => {
  const [email, setEmail] = useState('');
  const [card, setCard] = useState(Array(16).fill(null));
  const [completed, setCompleted] = useState(Array(16).fill(false));
  const [predictions, setPredictions] = useState([]);
  const [wins, setWins] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [showWins, setShowWins] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Add drag-related styles
  useEffect(() => {
    document.body.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    const style = document.createElement('style');
    style.innerHTML = `
      .dragging { opacity: 0.5; }
      .drag-over { background-color: #e5edff !important; }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Fetch predictions
  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await fetch('/api/predictions');
        const data = await response.json();
        console.log('Fetched predictions:', data);
        setPredictions(data);
      } catch (error) {
        console.error('Error fetching predictions:', error);
      }
    };
    fetchPredictions();
  }, []);

  // Load card
const loadCard = async () => {
  if (!email) return;
  try {
    const response = await fetch(`/api/cards/${email}`);
    const data = await response.json();
    console.log('Loaded card data:', data);  // Debug log
    if (data.card) {
      // Ensure each card item has the embedUrl
      const loadedCard = data.card.map(item => {
        if (!item) return null;
        return {
          ...item,
          embedUrl: `https://embed.polymarket.com/market.html?market=${item.id}&features=volume&theme=dark`
        };
      });
      console.log('Processed loaded card:', loadedCard); // Debug log
      setCard(loadedCard);
      setCompleted(data.completed || Array(25).fill(false));
      checkWins();
    }
  } catch (error) {
    console.error('Error loading card:', error);
  }
};

  // Save card
  const saveCard = async () => {
    if (!email) return;
    try {
      await fetch('/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          card,
          completed
        }),
      });
      alert('Card saved successfully!');
      checkWins();
    } catch (error) {
      console.error('Error saving card:', error);
    }
  };

  // Check wins
  const checkWins = async () => {
    if (!email) return;
    try {
      const response = await fetch(`/api/check-wins/${email}`);
      const data = await response.json();
      setWins(data.wins || []);
    } catch (error) {
      console.error('Error checking wins:', error);
    }
  };

  return (
    <div className="p-4 max-w-[2050px] mx-auto">
      <h1 className="text-3xl font-bold mb-4">2025 Prediction Market Bingo</h1>
      
      {/* Email and Controls */}
      <div className="mb-4 flex gap-2 w-[800px]">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="border p-2 flex-grow"
        />
        <button
          onClick={loadCard}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Load Card
        </button>
        <button
          onClick={saveCard}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Save Card
        </button>
      </div>

      {/* Wins Display */}

{showWins && wins.length > 0 && (
  <div className="mb-4 p-4 bg-yellow-100 rounded">
    <h2 className="font-bold">🎉 Winning Combinations:</h2>
    <ul>
      {wins.map((win, index) => (
        <li key={index}>{win}</li>
      ))}
    </ul>
  </div>
)}

      {/* Main Game Area */}
      <div className="flex gap-4">
        {/* Bingo Card */}
        <div className="grid grid-cols-4 gap-0 flex-1"> 
          {card.map((cell, index) => (
            <div
              key={index}
              className={`border p-2 w-[400px] h-[180px] cursor-move ${
                completed[index] ? 'bg-green-200' : 'bg-white'
              } ${selectedCell === index ? 'ring-2 ring-blue-500' : ''}`}
              draggable={!!cell}
              onDragStart={(e) => {
                e.stopPropagation();
                e.target.classList.add('dragging');
                e.dataTransfer.setData('prediction', JSON.stringify(cell));
                e.dataTransfer.setData('fromIndex', index.toString());
                e.dataTransfer.effectAllowed = 'move';
              }}
              onDragEnd={(e) => {
                e.target.classList.remove('dragging');
              }}
              onDragEnter={(e) => {
                e.preventDefault();
                e.target.classList.add('drag-over');
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.target.classList.remove('drag-over');
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.target.classList.remove('drag-over');
                const prediction = JSON.parse(e.dataTransfer.getData('prediction'));
                const fromIndex = e.dataTransfer.getData('fromIndex');
                
                const newCard = [...card];
                
                if (fromIndex !== '') {
                  newCard[parseInt(fromIndex)] = null;
                }
                
                if (newCard[index]) {
                  setPredictions(prev => [...prev, newCard[index]]);
                }
                
                newCard[index] = prediction;
                setCard(newCard);
              }}
            >
              {cell ? (
                <div className="h-full w-full">
                  <iframe
                    title={`prediction-${index}`}
                    src={cell.embedUrl}
                    width="375"
                    height="180"
                    frameBorder="0"
                    className="pointer-events-none"
                  />
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  Drag prediction here
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Predictions Sidebar */}
        <div className="w-[425px] bg-gray-50 p-4 rounded">
          <h2 className="font-bold mb-2">Available Predictions</h2>
          <div className="space-y-4 max-h-[655px] overflow-y-auto">
            {predictions.filter(p => !card.some(c => c?.id === p.id)).map((prediction) => (
              <div
                key={prediction.id}
                className="p-2 bg-white rounded shadow cursor-move hover:bg-blue-50 relative"
                draggable="true"
                onDragStart={(e) => {
                  e.stopPropagation();
                  e.target.classList.add('dragging');
                  e.dataTransfer.setData('prediction', JSON.stringify(prediction));
                  e.dataTransfer.setData('fromIndex', '');
                  e.dataTransfer.effectAllowed = 'move';
                }}
                onDragEnd={(e) => {
                  e.target.classList.remove('dragging');
                }}
              >
                <div className="mb-2">
                  <iframe
                    title={`prediction-preview-${prediction.id}`}
                    src={prediction.embedUrl}
                    width="375"
                    height="150"
                    frameBorder="0"
                    className="pointer-events-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leaderboard Section */}
		{showLeaderboard && (
		<div className="mt-8">
			<Leaderboard data={leaderboardData} userRank={userRank} />
			{lastUpdate && (
			  <p className="text-sm text-gray-500 mt-2">
				Last updated: {lastUpdate.toLocaleString()}
			 </p>
			)}
		  </div>
		)}
    </div>
  );
};

export default BingoCard;