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
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800/50 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
        <h2 className="text-lg font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-600"></span>
          Standings
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
        <div className="space-y-3">
          {leaderboardData.map((owner, index) => {
            const isFirst = index === 0;
            const isSecond = index === 1;
            const isThird = index === 2;

            let cardColor = 'bg-slate-900/40 border-slate-800/50 hover:bg-slate-800/40';
            let rankColor = 'bg-slate-800 text-slate-400 border border-slate-700';
            let textColor = 'text-slate-300';
            let budgetColor = 'text-slate-300';
            let badgeColor = 'bg-slate-700';

            if (isSecond) {
              cardColor = 'bg-amber-950/40 border-amber-900/30';
              rankColor = 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
              textColor = 'text-amber-400/90';
              budgetColor = 'text-amber-500';
              badgeColor = 'bg-amber-600';
            } else if (isFirst) {
              cardColor = 'bg-yellow-800/40 border-yellow-700/50';
              rankColor = 'bg-yellow-700 text-yellow-200 border border-yellow-600';
              textColor = 'text-yellow-200';
              budgetColor = 'text-yellow-300';
              badgeColor = 'bg-yellow-500';
            } else if (isThird) {
              cardColor = 'bg-orange-950/40 border-orange-900/30';
              rankColor = 'bg-orange-500/10 text-orange-500 border border-orange-500/20';
              textColor = 'text-orange-400/90';
              budgetColor = 'text-orange-500';
              badgeColor = 'bg-orange-600';
            }

            return (
              <div
                key={owner._id}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${cardColor}`}
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
                      <span className={`block w-1.5 h-1.5 rounded-full ${badgeColor}`}></span>
                      <p className="text-xs font-medium text-slate-400">
                        {owner.playersBought} {owner.playersBought === 1 ? 'Player' : 'Players'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 pl-4 border-l border-slate-800">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                    Budget
                  </p>
                  <p className={`font-mono text-lg font-bold tracking-tight ${budgetColor}`}>
                    ₹{owner.remainingBudget.toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {leaderboardData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-slate-900/50 rounded-xl border border-slate-800 border-dashed">
            <svg className="w-10 h-10 text-slate-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-sm font-medium text-slate-400">No Teams Found</h3>
            <p className="text-xs text-slate-500 mt-1">Teams will appear here once added.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
