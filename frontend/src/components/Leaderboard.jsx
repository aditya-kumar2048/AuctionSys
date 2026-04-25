import React from 'react';

function Leaderboard({ owners, players }) {
  const leaderboardData = owners.map(owner => {
    const boughtPlayers = players.filter(p => p.soldTo === owner._id);
    return {
      ...owner,
      playersBought: boughtPlayers.length
    };
  }).sort((a, b) => b.remainingBudget - a.remainingBudget);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg">
      <div className="flex-1 overflow-y-auto px-3 py-3">
        <div className="space-y-3">
          {leaderboardData.map((owner, index) => {
            const isFirst = index === 0;
            const isSecond = index === 1;
            const isThird = index === 2;

            let cardColor = 'bg-white border-gray-200 hover:border-gray-300';
            let rankColor = 'bg-gray-100 text-gray-500';
            let textColor = 'text-gray-900';
            let budgetColor = 'text-gray-900';

            if (isFirst) {
              cardColor = 'bg-blue-50/50 border-blue-200 shadow-sm';
              rankColor = 'bg-blue-600 text-white shadow-sm';
              textColor = 'text-blue-900';
              budgetColor = 'text-blue-700';
            } else if (isSecond) {
              cardColor = 'bg-emerald-50/50 border-emerald-200 shadow-sm';
              rankColor = 'bg-emerald-600 text-white shadow-sm';
              textColor = 'text-emerald-900';
              budgetColor = 'text-emerald-700';
            } else if (isThird) {
              cardColor = 'bg-orange-50/50 border-orange-200 shadow-sm';
              rankColor = 'bg-orange-500 text-white shadow-sm';
              textColor = 'text-orange-900';
              budgetColor = 'text-orange-700';
            }

            return (
              <div 
                key={owner._id} 
                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:shadow-sm ${cardColor}`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm shrink-0 ${rankColor}`}>
                    {index + 1}
                  </div>
                  
                  <div className="min-w-0">
                    <h4 className={`text-base font-semibold truncate ${textColor}`} title={owner.name}>
                      {owner.name}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="flex w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                      <p className="text-xs font-medium text-gray-500">
                        {owner.playersBought} {owner.playersBought === 1 ? 'Player' : 'Players'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 pl-4 border-l border-gray-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                    Budget
                  </p>
                  <p className={`font-mono text-lg font-bold tracking-tight ${budgetColor}`}>
                    ${owner.remainingBudget.toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        {leaderboardData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-gray-50 rounded-xl border border-gray-200 border-dashed">
            <svg className="w-10 h-10 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-sm font-medium text-gray-900">No Teams Found</h3>
            <p className="text-xs text-gray-500 mt-1">Teams will appear here once added.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
