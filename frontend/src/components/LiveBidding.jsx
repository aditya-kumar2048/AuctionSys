import React from 'react';

function LiveBidding({ activePlayer, gridData, owners }) {
  if (!activePlayer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-white border border-gray-200 rounded-lg shadow-sm p-12">
        <div className="w-16 h-16 mb-4 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Active Auction</h2>
        <p className="text-gray-500 text-center max-w-md">
          Waiting for the admin to start the next player auction. The live feed will update automatically.
        </p>
      </div>
    );
  }

  // Find the highest bid for the active player
  let highestBidAmount = 0;
  let highestBidOwner = null;

  gridData.forEach(bid => {
    if (bid.playerId === activePlayer._id && bid.amount > highestBidAmount) {
      highestBidAmount = bid.amount;
      highestBidOwner = owners.find(o => o._id === bid.ownerId);
    }
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-4xl mx-auto">
      
      <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row">
        
        {/* Player Image Section */}
        <div className="w-full md:w-1/2 bg-gray-50 border-r border-gray-200 flex flex-col items-center justify-center p-12 min-h-[400px]">
          {activePlayer.photo ? (
            <img 
              src={activePlayer.photo} 
              alt={activePlayer.name} 
              className="w-64 h-64 rounded-full object-cover border-4 border-white shadow-sm mb-6" 
            />
          ) : (
            <div className="w-64 h-64 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-300 text-6xl font-medium shadow-sm mb-6">
              {activePlayer.name.charAt(0)}
            </div>
          )}
          
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Live Auction</span>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 text-center tracking-tight">
            {activePlayer.name}
          </h2>
          <div className="mt-4 px-4 py-1 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600">
            Base Price: ${activePlayer.basePrice.toLocaleString()}
          </div>
        </div>

        {/* Bidding Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="mb-2">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Current Highest Bid</h3>
          </div>
          
          <div className="mb-8">
            {highestBidAmount > 0 ? (
              <div className="text-6xl font-mono font-bold text-gray-900 tracking-tighter">
                ${highestBidAmount.toLocaleString()}
              </div>
            ) : (
              <div className="text-5xl font-mono font-medium text-gray-300 tracking-tighter">
                No Bids Yet
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 pt-8 mt-auto">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">Bid Leader</h3>
            {highestBidOwner ? (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 text-gray-600 font-bold text-lg">
                  {highestBidOwner.name.charAt(0)}
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">{highestBidOwner.name}</div>
                  <div className="text-sm text-gray-500">Available: ${highestBidOwner.remainingBudget.toLocaleString()}</div>
                </div>
              </div>
            ) : (
              <div className="text-gray-400 italic">
                Awaiting first bid...
              </div>
            )}
          </div>
          
        </div>
      </div>
      
    </div>
  );
}

export default LiveBidding;
