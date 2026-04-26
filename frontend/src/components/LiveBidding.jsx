import React, { useState, useEffect, useRef } from 'react';
import { getHistory } from '../api';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

function LiveBidding({ activePlayer, gridData, owners }) {
  const container = useRef();
  const [history, setHistory] = useState([]);
  const [highestBid, setHighestBid] = useState(null);

  useEffect(() => {
    let interval;
    if (activePlayer) {
      const fetchHistory = () => {
        getHistory(activePlayer._id)
          .then(data => {
            setHistory(data);
            if (data.length > 0) {
              setHighestBid(data[0]);
            } else {
              setHighestBid(null);
            }
          })
          .catch(console.error);
      };

      // Fetch immediately, then loop
      fetchHistory();
      interval = setInterval(fetchHistory, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activePlayer]);

  // Entrance animations for the top layout
  // useGSAP(() => {
  //   gsap.from(".animate-in", {
  //     y: 20,
  //     opacity: 0,
  //     stagger: 0.1,
  //     duration: 0.7,
  //     ease: "power3.out"
  //   });
  // }, { scope: container, dependencies: [activePlayer] });

  // List entry animations
  useGSAP(() => {
    gsap.from(".bid-row", {
      x: -20,
      opacity: 0,
      stagger: 0.05,
      duration: 0.4,
      ease: "power2.out",
      clearProps: "all"
    });
  }, { scope: container, dependencies: [history.length] })

  if (!activePlayer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-slate-950/50 border border-slate-800/50 rounded-2xl shadow-xl p-12 backdrop-blur-xl">
        <div className="w-20 h-20 mb-6 rounded-full bg-slate-900 flex items-center justify-center border border-slate-700/50 shadow-inner">
          <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-slate-200 mb-2 tracking-tight">No Active Player</h2>
        <p className="text-slate-400 text-center max-w-md text-lg">
          Awaiting the hammer... Next auction lot will appear here shortly.
        </p>
      </div>
    );
  }

  // Find owner explicitly to make sure we have access to team photo
  const highestBidOwner = highestBid
    ? owners.find(o => o._id === highestBid.owner._id || highestBid.owner === o._id)
    : null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-6xl mx-auto" ref={container}>
      <div className="w-full bg-slate-950 border border-slate-800/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row shadow-blue-900/20 relative">

        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Player Profile Section */}
        <div className="animate-in w-full lg:w-5/12 bg-slate-900/60 backdrop-blur-3xl border-r border-slate-800/50 flex flex-col items-center p-12 relative z-10">
          <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest drop-shadow-md">Live Lot</span>
          </div>

          <div className="mt-8 mb-6 relative">
            <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-2xl"></div>
            {activePlayer.photo ? (
              <img
                src={activePlayer.photo}
                alt={activePlayer.name}
                className="w-72 h-72 rounded-full object-cover border-[6px] border-slate-800 shadow-[0_15px_40px_rgba(0,0,0,0.5)] relative z-10"
              />
            ) : (
              <div className="w-72 h-72 rounded-full bg-slate-800 border-[6px] border-slate-700 flex items-center justify-center text-slate-400 text-7xl font-bold shadow-2xl relative z-10">
                {activePlayer.name.charAt(0)}
              </div>
            )}
          </div>

          <h2 className="text-5xl font-extrabold text-center tracking-tight drop-shadow-md mb-4 bg-clip-text text-transparent bg-linear-to-b from-white to-slate-300 px-4">
            {activePlayer.name}
          </h2>

          <div className="px-6 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xl font-semibold text-blue-400 shadow-inner">
            Base: <span className="text-white">₹{activePlayer.basePrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Live Bidding Feed & Top Bid */}
        <div className="w-full lg:w-7/12 flex flex-col bg-slate-950 relative z-10">

          {/* Top Bid Leader Card */}
          <div className="animate-in relative h-64 border-b border-slate-800/60 overflow-hidden flex flex-col justify-center p-8 lg:p-12 text-center lg:text-left">
            {/* Blurred Background Logo specific to the leader */}
            {highestBidOwner && highestBidOwner.photo && (
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 blur-xl scale-110"
                style={{ backgroundImage: `url(${highestBidOwner.photo})` }}
              ></div>
            )}

            {/* Overlay to ensure readability and dynamic tint */}
            <div className="absolute inset-0 bg-linear-to-r from-slate-950/90 via-slate-950/80 to-slate-900/50"></div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 w-full">
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center justify-center lg:justify-start gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span> Highest Bid
                </h3>
                {highestBid ? (
                  <div className="text-[4rem] xl:text-[5rem] leading-none font-mono font-black text-amber-400 tracking-tighter drop-shadow-[0_4px_12px_rgba(251,191,36,0.3)]">
                    ₹{highestBid.amount.toLocaleString()}
                  </div>
                ) : (
                  <div className="text-[3rem] xl:text-[4rem] leading-none font-sans font-bold text-slate-500 tracking-tight">
                    NO BIDS
                  </div>
                )}
              </div>

              {highestBidOwner && (
                <div className="flex flex-col items-center p-4 bg-slate-900/60 backdrop-blur-lg rounded-2xl border border-slate-700/50 shadow-lg shrink-0 w-36">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest mb-3 font-semibold bg-slate-800/50 px-2 py-0.5 rounded-full">Leading</span>
                  {highestBidOwner.photo ? (
                    <img src={highestBidOwner.photo} alt="Team" className="w-16 h-16 rounded-full border-[3px] border-amber-500/60 shadow-[0_0_20px_rgba(251,191,36,0.3)] object-cover bg-white" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-slate-800 border-[3px] border-amber-500/60 flex items-center justify-center text-2xl font-bold text-slate-200">
                      {highestBidOwner.name.charAt(0)}
                    </div>
                  )}
                  <div className="mt-3 font-bold text-slate-200 text-sm truncate w-full text-center">{highestBidOwner.name}</div>
                </div>
              )}
            </div>
          </div>

          {/* Scrolling History Feed */}
          <div className="animate-in flex-1 flex flex-col bg-slate-950/80">
            <div className="px-8 py-4 border-b border-slate-800/40 bg-slate-900/30">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Live Bid Timeline</h3>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[350px] custom-scrollbar p-3">
              {history.length > 0 ? (
                <ul className="space-y-2">
                  {history.map((bid, i) => {
                    const bidOwnerObj = bid.owner && typeof bid.owner === 'object' ? bid.owner : owners.find(o => o._id === bid.owner);
                    const isNewest = i === 0;

                    return (
                      <li key={bid._id} className={`bid-row px-5 py-3.5 flex justify-between items-center bg-slate-900/40 hover:bg-slate-800/60 transition-colors rounded-xl border ${isNewest ? 'border-amber-500/30 bg-amber-900/10' : 'border-slate-800/50'}`}>
                        <div className="flex items-center gap-4">
                          {bidOwnerObj?.photo ? (
                            <img src={bidOwnerObj.photo} className="w-11 h-11 rounded-full border border-slate-700 bg-white object-cover" alt="Logo" />
                          ) : (
                            <div className="w-11 h-11 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 font-bold border border-slate-700 text-lg">
                              {bidOwnerObj?.name?.charAt(0) || '?'}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className={`font-bold text-base ${isNewest ? 'text-slate-200' : 'text-slate-400'}`}>
                              {bidOwnerObj?.name || 'Unknown Team'}
                            </span>
                            <span className="text-[11px] font-medium text-slate-500 font-mono mt-0.5">
                              {new Date(bid.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                          </div>
                        </div>
                        <div className={`font-mono text-2xl font-black tracking-tight ${isNewest ? 'text-amber-400' : 'text-slate-500'}`}>
                          ₹{bid.amount.toLocaleString()}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500/70 italic text-sm pb-8">
                  No bids have been placed yet.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default LiveBidding;
