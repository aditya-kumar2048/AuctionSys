import React, { useRef, useState } from 'react';
import { History, Search } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import Mousetrap from 'mousetrap';
import Logo from "/logo.png"
import "./auction.css"

gsap.registerPlugin(useGSAP);

function AuctionGrid({ owners, players, gridData, onViewHistory }) {
  const container = useRef();
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredCol, setHoveredCol] = useState(null);
  const size = ["text-lg", "text-xl", "text-2xl"];
  const [fontSize, setFontSize] = useState(0);
  const gsapAnimation = useRef([]);
  const ActivePlayer = players.filter(p => p.status === 'Active');
  const LeftOverPlayer = players.filter(p => p.status !== 'Active');
  
  




  const handleFontSizeChange = () => {
    setFontSize(prev => (prev + 1) % size.length);
  }
  Mousetrap.bind('ctrl+1', () => {
    console.log("s")
  });
  Mousetrap.bind('f', () => {
    handleFontSizeChange();
    console.log("font size changed", fontSize)
  });

  // GSAP Entrance Animations
  useGSAP(() => {
    gsap.from(gsapAnimation.current, {
      opacity: 0,
      y: 15,
      stagger: 0.03,
      duration: 0.5,
      ease: "power2.out",
      clearProps: "all"
    });
  }, { scope: container, dependencies: [players.length] });

  if (!owners.length || !players.length) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[300px] bg-slate-950 border border-slate-800 rounded-xl m-4">
        <div className="text-slate-400 font-mono flex flex-col items-center gap-4">
          <Search className="w-12 h-12 text-slate-700" strokeWidth={1} />
          <p className="text-lg">No active auction data</p>
          <p className="text-xs text-slate-600">Awaiting players and teams initialization.</p>
        </div>
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
    <div className="h-full w-full bg-slate-950 font-sans text-slate-200 overflow-hidden flex flex-col border border-slate-800/50  relative" ref={container}>
          {/* Decorative gradient blur in background */}
    <div className="absolute top-[15%]  right-[20%]  w-250 h-250 pointer-events-none z-0">
      <img
        src={Logo}
        alt="Logo"
        className="w-full h-full object-contain opacity-20 blur-[6px]"
      />
    </div>
      {/*<div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-900/10 rounded-full blur-[100px] pointer-events-none -z-0"></div> */}


      <div className="overflow-x-auto overflow-y-auto h-full relative z-10 custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-max text-sm tabular-nums">
          <thead className="sticky top-0 z-30 shadow-md">
            <tr >
              <th className="px-3 py-4  border-b  border-white backdrop-blur-xl bg-slate-950/90 sticky left-0 z-40 w-72  text-slate-400 uppercase tracking-widest text-center text-xl font-bold">
                Players / Teams
              </th>
              {owners.map(owner => (
                <th
                  key={owner._id}
                  className={`px-2 py-2 border-b-2 border-white backdrop-blur-xl bg-slate-950/80 font-medium text-center min-w-35 transition-colors duration-300 ${hoveredCol === owner._id ? 'bg-slate-800/50' : ''}`}
                  onMouseEnter={() => setHoveredCol(owner._id)}
                  onMouseLeave={() => setHoveredCol(null)}
                >
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center text-xs font-bold text-slate-300 shadow-sm">
                      {
                          owner.photo ? (
                            <img src={owner.photo} alt={owner.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            owner.name.substring(0, 2).toUpperCase()
                          )
                      }
                      
                      
                    </div>
                    <div className="text-slate-200 truncate w-full text-xs font-semibold">{owner.name}</div>
                    <div className={` text-blue-700 font-bold ${size[fontSize]} `}>
                      Bal: ₹{owner.remainingBudget.toLocaleString()}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
              {ActivePlayer.map((player) => {
              const isActiveRow = player.status === 'Active';
              const isHovered = hoveredRow === player._id;

              let rowClasses = "auction-row transition-all duration-200 group/row ";
              let nameColClasses = "border-r border-slate-800/50 transition-colors duration-300 ";
              let paddingClass = "py-3 ";

              if (isActiveRow) {
                rowClasses += "bg-blue-950/20 ";
                nameColClasses += "backdrop-blur-xl bg-slate-900/90 ";
                paddingClass = "py-5 ";
              } else if (player.status === 'Sold') {
                rowClasses += "bg-emerald-950/10 opacity-70 ";
                nameColClasses += "backdrop-blur-xl bg-slate-950/90 ";
                paddingClass = "py-2 ";
              } else if (player.status === 'Unsold') {
                rowClasses += "bg-rose-950/10 opacity-50 ";
                nameColClasses += "backdrop-blur-xl bg-slate-950/90 ";
              } else {
                rowClasses += "hover:bg-slate-800/20 ";
                nameColClasses += "backdrop-blur-xl bg-slate-950/90 ";
              }

              if (isHovered && !isActiveRow) {
                nameColClasses = nameColClasses.replace("bg-slate-950/90", "bg-slate-900/90");
              }

              return (
                <tr
                  key={player._id}
                  ref={gsapAnimation}
                  className={rowClasses}
                  onMouseEnter={() => setHoveredRow(player._id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className={`px-3 ${paddingClass} sticky left-0 z-20 ${nameColClasses} border-b border-slate-800/30`}>
                    <div className="flex items-center gap-4">
                      {player.photo ? (
                        <div className="relative">
                          <img src={player.photo} alt={player.name} className="w-15 h-15 rounded-full object-center border border-slate-700 shadow-lg" />
                          {isActiveRow && (
                            <div className="absolute inset-0 rounded-full ring-2 ring-blue-500 animate-pulse"></div>
                          )}
                        </div>
                      ) : (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border shadow-inner ${isActiveRow ? 'bg-blue-900/40 text-blue-400 border-blue-500/50 ring-2 ring-blue-500/30 ring-offset-slate-950 ring-offset-2' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                          {player.name.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0 flex-2">
                        <div className={`font-semibold text-xl truncate ${isActiveRow ? 'text-white text-base' : 'text-slate-300'}`}>
                          {player.name}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded text-lg text-white font-bold">
                            Base: ₹{player.basePrice}
                          </span>
                          <StatusBadge status={player.status} />
                        </div>
                      </div>
                      <div className="ml-2 flex items-center">
                        <button
                          onClick={() => onViewHistory(player)}
                          className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all border border-transparent hover:border-slate-700"
                          title="View Bid History"
                        >
                          <History className="w-4 h-4" />
                        </button>
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

                    const isCrosshairHovered = hoveredRow === player._id || hoveredCol === owner._id;

                    let cellClasses = `px-4 ${paddingClass} text-center font-mono border-r border-slate-800/30 last:border-r-0 transition-colors duration-200 border-b relative `;
                    let textClasses = "text-sm ";

                    if (isHighestActive) {
                      cellClasses += "bg-blue-900/20 ";
                      textClasses = "text-blue-400 font-bold text-2xl drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] ";
                    } else if (isWinner) {
                      cellClasses += "bg-slate-800/40 ";
                      textClasses = "text-amber-400/90 font-semibold text-xl";
                    } else if (isLoser) {
                      cellClasses += " ";
                      textClasses = "text-slate-600 text-lg line-through decoration-slate-700/50 ";
                    } else if (bid) {
                      textClasses = "text-slate-300 text-lg font-medium group-hover/row:text-slate-200";
                    } else {
                      textClasses = "text-slate-700 text-xs";
                    }

                    if (isCrosshairHovered && !isHighestActive && !isWinner && player.status !== 'Sold' && player.status !== 'Unsold') {
                      cellClasses += "bg-slate-800/30 ";
                    }

                    return (
                      <td key={`${player._id}-${owner._id}`} className={cellClasses}>
                        {isHighestActive && (
                          <div className="absolute inset-0 border border-blue-500/50 shadow-[inset_0_0_15px_rgba(59,130,246,0.2)] pointer-events-none"></div>
                        )}
                        {isWinner && (
                          <div className="absolute inset-0 border border-amber-500/20 bg-amber-500/5 pointer-events-none"></div>
                        )}
                        {bid ? (
                          <span className={`${textClasses} ${size[fontSize]}`}>₹{bid.amount.toLocaleString()}</span>
                        ) : (
                          <span className={textClasses}>-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
              })} 
            {LeftOverPlayer.map((player) => {
              const isActiveRow = player.status === 'Active';
              const isHovered = hoveredRow === player._id;

              let rowClasses = "auction-row transition-all duration-200 group/row ";
              let nameColClasses = "border-r border-slate-800/50 transition-colors duration-300 ";
              let paddingClass = "py-3 ";

              if (isActiveRow) {
                rowClasses += "bg-blue-950/20 ";
                nameColClasses += "backdrop-blur-xl bg-slate-900/90 ";
                paddingClass = "py-5 ";
              } else if (player.status === 'Sold') {
                rowClasses += "bg-emerald-950/10 opacity-70 ";
                nameColClasses += "backdrop-blur-xl bg-slate-950/90 ";
                paddingClass = "py-2 ";
              } else if (player.status === 'Unsold') {
                rowClasses += "bg-rose-950/10 opacity-50 ";
                nameColClasses += "backdrop-blur-xl bg-slate-950/90 ";
              } else {
                rowClasses += "hover:bg-slate-800/20 ";
                nameColClasses += "backdrop-blur-xl bg-slate-950/90 ";
              }

              if (isHovered && !isActiveRow) {
                nameColClasses = nameColClasses.replace("bg-slate-950/90", "bg-slate-900/90");
              }

              return (
                <tr
                  key={player._id}
                  ref={gsapAnimation}
                  className={rowClasses}
                  onMouseEnter={() => setHoveredRow(player._id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className={`px-3 ${paddingClass} sticky left-0 z-20 ${nameColClasses} border-b border-slate-800/30`}>
                    <div className="flex items-center gap-4">
                      {player.photo ? (
                        <div className="relative">
                          <img src={player.photo} alt={player.name} className="w-15 h-15 rounded-full object-center border border-slate-700 shadow-lg" />
                          {isActiveRow && (
                            <div className="absolute inset-0 rounded-full ring-2 ring-blue-500 animate-pulse"></div>
                          )}
                        </div>
                      ) : (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border shadow-inner ${isActiveRow ? 'bg-blue-900/40 text-blue-400 border-blue-500/50 ring-2 ring-blue-500/30 ring-offset-slate-950 ring-offset-2' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                          {player.name.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0 flex-2">
                        <div className={`font-semibold text-xl truncate ${isActiveRow ? 'text-white text-base' : 'text-slate-300'}`}>
                          {player.name}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded text-lg text-white font-bold">
                            Base: ₹{player.basePrice}
                          </span>
                          <StatusBadge status={player.status} />
                        </div>
                      </div>
                      <div className="ml-2 flex items-center">
                        <button
                          onClick={() => onViewHistory(player)}
                          className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all border border-transparent hover:border-slate-700"
                          title="View Bid History"
                        >
                          <History className="w-4 h-4" />
                        </button>
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

                    const isCrosshairHovered = hoveredRow === player._id || hoveredCol === owner._id;

                    let cellClasses = `px-4 ${paddingClass} text-center font-mono border-r border-slate-800/30 last:border-r-0 transition-colors duration-200 border-b relative `;
                    let textClasses = "text-sm ";

                    if (isHighestActive) {
                      cellClasses += "bg-blue-900/20 ";
                      textClasses = "text-blue-400 font-bold text-2xl drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] ";
                    } else if (isWinner) {
                      cellClasses += "bg-slate-800/40 ";
                      textClasses = "text-amber-400/90 font-semibold text-xl";
                    } else if (isLoser) {
                      cellClasses += " ";
                      textClasses = "text-slate-600 text-lg line-through decoration-slate-700/50 ";
                    } else if (bid) {
                      textClasses = "text-slate-300 text-lg font-medium group-hover/row:text-slate-200";
                    } else {
                      textClasses = "text-slate-700 text-xs";
                    }

                    if (isCrosshairHovered && !isHighestActive && !isWinner && player.status !== 'Sold' && player.status !== 'Unsold') {
                      cellClasses += "bg-slate-800/30 ";
                    }

                    return (
                      <td key={`${player._id}-${owner._id}`} className={cellClasses}>
                        {isHighestActive && (
                          <div className="absolute inset-0 border border-blue-500/50 shadow-[inset_0_0_15px_rgba(59,130,246,0.2)] pointer-events-none"></div>
                        )}
                        {isWinner && (
                          <div className="absolute inset-0 border border-amber-500/20 bg-amber-500/5 pointer-events-none"></div>
                        )}
                        {bid ? (
                          <span className={`${textClasses} ${size[fontSize]}`}>₹{bid.amount.toLocaleString()}</span>
                        ) : (
                          <span className={textClasses}>-</span>
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

      {/* Custom Styles overrides for scrollbars within this component scope */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #020617; /* slate-950 */
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b; /* slate-800 */
          border-radius: 4px;
          border: 1px solid #0f172a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155; /* slate-700 */
        }
        .custom-scrollbar::-webkit-scrollbar-corner {
          background: #020617;
        }
      `}} />
    </div>
  );
}

function StatusBadge({ status }) {
  const getStyles = () => {
    switch (status) {
      case 'Active':
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30',
          text: 'text-blue-400',
          dot: 'bg-blue-400 animate-pulse drop-shadow-[0_0_5px_rgba(96,165,250,0.8)]'
        };
      case 'Sold':
        return {
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/20',
          text: 'text-emerald-500',
          dot: 'bg-emerald-500'
        };
      case 'Unsold':
        return {
          bg: 'bg-rose-500/10',
          border: 'border-rose-500/20',
          text: 'text-rose-500',
          dot: 'bg-rose-500'
        };
      default:
        return {
          bg: 'bg-slate-800',
          border: 'border-slate-700',
          text: 'text-slate-400',
          dot: 'bg-slate-500'
        };
    }
  };

  const styles = getStyles();

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 ] font-bold uppercase tracking-wider rounded border  ${styles.bg} ${styles.border} ${styles.text}  text-lg`}>
      <span className={`w-2 h-2 rounded-full ${styles.dot}`}></span>
      {status}
    </span>
  );
}

export default AuctionGrid;
