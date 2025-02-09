import React from 'react';

const Leaderboard = ({ data, userRank }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
      
      {userRank && (
        <div className="mb-4 p-3 bg-blue-50 rounded">
          <h3 className="font-bold">Your Stats</h3>
          <p>Rank: #{userRank.rank}</p>
          <p>Score: {userRank.score}</p>
          <p>Completed Predictions: {userRank.completedPredictions}</p>
          <p>Wins: {userRank.wins?.length || 0}</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2">
              <th className="p-2 text-left">Rank</th>
              <th className="p-2 text-left">Player</th>
              <th className="p-2 text-right">Score</th>
              <th className="p-2 text-right">Predictions</th>
              <th className="p-2 text-right">Wins</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr 
                key={entry.email} 
                className={`border-b ${
                  userRank && entry.email === userRank.email 
                    ? 'bg-blue-50' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{entry.email.split('@')[0]}...</td>
                <td className="p-2 text-right">{entry.score}</td>
                <td className="p-2 text-right">{entry.completedPredictions}</td>
                <td className="p-2 text-right">{entry.wins?.length || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;