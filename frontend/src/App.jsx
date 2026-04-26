import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { getOwners, getPlayers, getGrid, deleteOwner, deletePlayer } from './api';
import AuctionGrid from './components/AuctionGrid';
import Leaderboard from './components/Leaderboard';
import AdminControls from './components/AdminControls';
import BidHistoryModal from './components/BidHistoryModal';
import { Trash2 } from 'lucide-react';

import LiveBidding from './components/LiveBidding';

function TopNav() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';
  const isLive = location.pathname === '/live';

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <img src="/logo.png" alt="Logo" className="h-8 w-auto mr-2" />
            <h1 className="text-xl font-bold text-blue-600  tracking-tight">
              RIT <span className="text-gray-900 font-medium">Auction Simulation</span>
            </h1>
          </div>
          <nav className="flex items-center space-x-4">
            <Link
              to="/live"
              className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${isLive ? 'bg-red-50 text-red-600 border border-red-100' : 'text-gray-600 hover:bg-red-50 hover:text-red-600 border border-transparent'}`}
            >
              <span className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></span>
                Go Live
              </span>
            </Link>
            <div className="w-px h-6 bg-gray-200 mx-1"></div>
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${!isAdmin && !isLive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              Dashboard
            </Link>
            <Link
              to="/admin"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isAdmin ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              Admin Controls
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

function App() {
  const [owners, setOwners] = useState([]);
  const [players, setPlayers] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [activePlayer, setActivePlayer] = useState(null);
  const [historyModalPlayer, setHistoryModalPlayer] = useState(null);

  const fetchData = async () => {
    try {
      const [ownersData, playersData, gridDataRes] = await Promise.all([
        getOwners(),
        getPlayers(),
        getGrid()
      ]);
      setOwners(ownersData);
      setPlayers(playersData);
      setGridData(gridDataRes);

      const active = playersData.find(p => p.status === 'Active');
      setActivePlayer(active || null);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDeleteOwner = async (ownerId) => {
    try {
      await deleteOwner(ownerId);
      fetchData();
    } catch (error) {
      console.error("Error deleting owner:", error);
    }
  }

  const handleDeletePlayer = async (playerId) => {
    try {
      await deletePlayer(playerId);
      fetchData();
    } catch (error) {
      console.error("Error deleting player:", error);
    }
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100 flex flex-col">
        <TopNav />

        <main className="flex-1  min-w-screen max-w-screen-2xl w-full  px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            {/* Live Presentation Route */}
            <Route path="/live" element={
              <LiveBidding activePlayer={activePlayer} gridData={gridData} owners={owners} />
            } />

            {/* Dashboard / Leaderboard Route */}
            <Route path="/" element={
              <div className="flex flex-col lg:flex-row gap-3 h-[calc(100vh-8rem)]">
                <div className="flex-2 flex flex-col min-w-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-medium text-gray-900">Live Grid</h2>
                      <button
                        onClick={() => {
                          const elem = document.getElementById('live-grid-container');
                          if (!document.fullscreenElement) {
                            elem.requestFullscreen().catch(err => console.error(err));
                          } else {
                            document.exitFullscreen();
                          }
                        }}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                        title="Toggle Fullscreen"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                      </button>
                    </div>
                    {activePlayer && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                        </span>
                        <span>Active: <strong className="font-medium text-gray-900">{activePlayer.name}</strong></span>
                      </div>
                    )}
                  </div>
                  <div id="live-grid-container" className=" flex-1 overflow-hidden p-0 bg-white">
                    <AuctionGrid owners={owners} players={players} gridData={gridData} onViewHistory={setHistoryModalPlayer} />
                  </div>
                </div>

                <div className="w-full lg:w-80 flex flex-col shrink-0">
                  <div className="mb-4">
                    <h2 className="text-lg font-medium text-gray-900 mb-2">Standings</h2>
                  </div>
                  <div className="card flex-1 overflow-hidden">
                    <Leaderboard owners={owners} players={players} />
                  </div>
                </div>
              </div>
            } />

            {/* Admin Route */}
            <Route path="/admin" element={
              <div className="flex flex-col gap-6">
                <div className="mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">Admin Controls</h2>
                  <p className="text-sm text-gray-500">Manage auction state, teams, and players.</p>
                </div>

                <AdminControls
                  owners={owners}
                  players={players}
                  activePlayer={activePlayer}
                  onUpdate={fetchData}
                />

                <h1 className='text-2xl font-bold text-gray-900'> Manage Teams and Players </h1>
                <div className=' w-full justify-center flex grow gap-5'>
                  <div className='flex flex-col w-200 gap-5 rouned-xl bg-white border border-gray-400 rounded'>
                    <div className=' flex py-2 px-2 flex-col gap-3 rounded ' >
                      {owners.map((owner) => {
                        return (
                          <div key={owner._id} className=' py-2 px-3 bg-[#f9fafb] border border-gray-300 rounded-lg w-full flex justify-between hover:bg-gray-300 hover:text-white transition-all duration-300   '>
                            <div className=' w-1/2 flex  item-center gap-3'>
                              <div className='w-10 h-10 font-bold text-gray-500 flex justify-center items-center border rounded-full overflow-hidden'>
                                {
                                  owner.photo ? (<img src={owner.photo} alt="" />) :
                                    (
                                      owner.name.charAt(0).toUpperCase()
                                    )
                                }
                              </div>
                              <div className='flex items-center gap-5'>
                                <p className='text-gray-800 font-bold'> Team :  <span className='text-gray-500 font-medium'>{owner.name}</span></p>
                                <p className='text-gray-800 font-bold'> Budget :  <span className='text-gray-500 font-medium'>{`₹${owner.remainingBudget}`}</span></p>
                              </div> </div>
                            <div className='  flex justify-center items-center gap-1  
                            text-red-500  font-semibold hover:text-red-700 hover:bg-red-100 hover:border-red-300 hover:border rounded-lg px-2 py-1 transition-all duration-300
                          '
                              onClick={() => handleDeleteOwner(owner._id)}

                            >

                              <Trash2 />

                            </div>

                          </div>
                        )
                      })
                      }
                    </div>

                    <div>

                    </div>

                  </div>
                  <div className='flex flex-col w-200 gap-5 rouned-xl bg-white border border-gray-400 rounded'>
                    <div className=' flex py-2 px-2 flex-col gap-3 rounded ' >
                      {players.map((player) => {
                        return (
                          <div key={player._id} className=' py-2 px-3 bg-[#f9fafb] border border-gray-300 rounded-lg w-full flex justify-between hover:bg-gray-300 hover:text-white transition-all duration-300   '>
                            <div className='  flex  item-center gap-3'>
                              <div className='w-10 h-10 font-bold text-gray-500 flex justify-center items-center border rounded-full overflow-hidden'>
                                {
                                  player.photo ? (<img src={player.photo} alt="" />) :
                                    (
                                      player.name.charAt(0).toUpperCase()
                                    )
                                }
                              </div>
                              <div className='flex items-center gap-5'>
                                <p className=' text-start text-gray-800 font-bold'> Name :  <span className='text-gray-500 font-medium'>{player.name}</span></p>
                                <p className='text-gray-800 font-bold'> Base Price :  <span className='text-gray-500 font-medium'>{`₹${player.basePrice}`}</span></p>
                              </div> </div>
                            <div className='  flex justify-center items-center gap-1  
                            text-red-500  font-semibold hover:text-red-700 hover:bg-red-100 hover:border-red-300 hover:border rounded-lg px-2 py-1 transition-all duration-300
                          '
                              onClick={() => handleDeletePlayer(player._id)}

                            >

                              <Trash2 />

                            </div>

                          </div>
                        )
                      })
                      }
                    </div>

                    <div>

                    </div>

                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Grid Preview</h3>
                  <div className="card max-h-[600px] overflow-hidden">
                    <AuctionGrid owners={owners} players={players} gridData={gridData} onViewHistory={setHistoryModalPlayer} />
                  </div>
                </div>
              </div>
            } />
          </Routes>
        </main>

        <BidHistoryModal player={historyModalPlayer} onClose={() => setHistoryModalPlayer(null)} />
      </div>
    </Router>
  );
}

export default App;
