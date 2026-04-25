import React from 'react';

function AuctionGrid({ owners, players, gridData, onViewHistory }) {
  if (!owners.length || !players.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 bg-white">
        <p className="text-sm font-medium">No active auction data.</p>
        <p className="text-xs mt-1">Please add players and teams from the Admin Controls.</p>
      </div>
    );
  }

  let highestBidAmount = 0;
  let highestBidOwnerId = null;
  let highestBidPlayerId = null;

  gridData.forEach(bid => {
    const player = players.find(p => p._id === bid.playerId);
    if (player && player.status === 'Active' && bid.amount > highestBidAmount) {
      highestBidAmount = bid.amount;
      highestBidOwnerId = bid.ownerId;
      highestBidPlayerId = bid.playerId;
    }
  });

  return (
    <div className="overflow-x-auto h-full bg-white relative">
      <table className="w-full text-left border-collapse text-sm">
        <thead className="sticky top-0 z-30 bg-gray-50">
          <tr>
            <th className="px-4 py-3 border-b border-gray-200 sticky left-0 z-40 w-64 bg-gray-50 font-medium text-gray-500 uppercase tracking-wider text-xs">
              Players / Teams
            </th>
            {owners.map(owner => (
              <th key={owner._id} className="px-4 py-3 border-b border-gray-200 bg-gray-50 font-medium text-center min-w-[120px]">
                <div className="text-gray-900 truncate">{owner.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  Bal: ${owner.remainingBudget.toLocaleString()}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {players.map((player) => {
            const isActiveRow = player.status === 'Active';
            
            return (
              <tr key={player._id} className={`hover:bg-gray-50 transition-colors ${isActiveRow ? 'bg-blue-50/30' : 'bg-white'}`}>
                <td className={`px-4 py-3 sticky left-0 z-20 border-r border-gray-100 transition-colors ${isActiveRow ? 'bg-blue-50/90' : 'bg-white'}`}>
                  <div className="flex items-center gap-3">
                    {player.photo ? (
                      <img src={player.photo} alt={player.name} className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 font-medium text-xs">
                        {player.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {player.name}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="px-2 py-0.5 bg-gray-50 border border-gray-200 rounded-md text-[10px] text-gray-600 font-semibold font-mono">
                          Base: ${player.basePrice}
                        </span>
                        <StatusBadge status={player.status} />
                        <button 
                          onClick={() => onViewHistory(player)} 
                          className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors ml-1 border border-transparent hover:border-blue-100"
                          title="View Bid History"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          History
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
                {owners.map(owner => {
                  const bid = gridData.find(b => b.playerId === player._id && b.ownerId === owner._id);
                  const isHighestActive = player.status === 'Active' && 
                                          highestBidPlayerId === player._id && 
                                          highestBidOwnerId === owner._id;
                  
                  const isWinner = player.status === 'Sold' && player.soldTo === owner._id;
                  const isLoser = player.status === 'Sold' && player.soldTo !== owner._id;

                  let cellClasses = "px-4 py-3 text-center font-mono border-r border-gray-50 last:border-r-0 ";
                  let textClasses = "text-gray-400 ";

                  if (isHighestActive) {
                    cellClasses += "bg-blue-50 border-blue-200 ring-1 ring-inset ring-blue-500 ";
                    textClasses = "text-blue-700 font-bold ";
                  } else if (isWinner) {
                    cellClasses += "bg-gray-100 ";
                    textClasses = "text-gray-900 font-medium ";
                  } else if (isLoser) {
                    cellClasses += "opacity-50 ";
                    textClasses = "text-gray-400 ";
                  } else if (bid) {
                    textClasses = "text-gray-700 ";
                  }

                  return (
                    <td key={`${player._id}-${owner._id}`} className={cellClasses}>
                      {bid ? (
                        <span className={textClasses}>${bid.amount.toLocaleString()}</span>
                      ) : (
                        <span className="text-gray-200">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    'Not Started': 'bg-gray-100 text-gray-600 border-gray-200',
    'Active': 'bg-blue-100 text-blue-700 border-blue-200 animate-pulse',
    'Sold': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Unsold': 'bg-red-100 text-red-700 border-red-200'
  };

  const badgeStyle = styles[status] || styles['Not Started'];

  return (
    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${badgeStyle}`}>
      {status}
    </span>
  );
}

export default AuctionGrid;
