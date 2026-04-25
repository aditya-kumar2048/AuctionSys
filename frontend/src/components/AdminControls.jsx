import React, { useState } from 'react';
import { startAuction, placeBid, finalizeAuction, createOwner, createPlayer } from '../api';

function AdminControls({ owners, players, activePlayer, onUpdate }) {
  const [selectedPlayerId, setSelectedPlayerId] = useState('');

  const [bidOwnerId, setBidOwnerId] = useState('');
  const [bidAmount, setBidAmount] = useState('');

  const [newOwnerName, setNewOwnerName] = useState('');
  const [newOwnerBudget, setNewOwnerBudget] = useState('');

  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerBasePrice, setNewPlayerBasePrice] = useState('');
  const [newPlayerPhoto, setNewPlayerPhoto] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  const handleError = (err) => {
    setErrorMsg(err.response?.data?.error || err.message);
    setTimeout(() => setErrorMsg(''), 5000);
  };

  const handleStartAuction = async () => {
    if (!selectedPlayerId) return setErrorMsg('Select a player first');
    try {
      await startAuction(selectedPlayerId);
      onUpdate();
    } catch (err) {
      handleError(err);
    }
  };

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    if (!activePlayer || !bidOwnerId || !bidAmount) return;

    try {
      await placeBid({
        playerId: activePlayer._id,
        ownerId: bidOwnerId,
        amount: Number(bidAmount)
      });
      setBidAmount('');
      onUpdate();
    } catch (err) {
      handleError(err);
    }
  };

  const handleFinalize = async (status) => {
    if (!activePlayer) return;
    if (status === 'Sold' && !window.confirm(`Are you sure you want to sell ${activePlayer.name}?`)) return;

    try {
      await finalizeAuction(activePlayer._id, status);
      onUpdate();
    } catch (err) {
      handleError(err);
    }
  };

  const handleCreateOwner = async (e) => {
    e.preventDefault();
    if (!newOwnerName || !newOwnerBudget) return;
    try {
      await createOwner({ name: newOwnerName, totalBudget: Number(newOwnerBudget) });
      setNewOwnerName('');
      setNewOwnerBudget('');
      onUpdate();
    } catch (err) {
      handleError(err);
    }
  };

  const handleCreatePlayer = async (e) => {
    e.preventDefault();
    if (!newPlayerName || !newPlayerBasePrice) return;
    try {
      await createPlayer({ name: newPlayerName, basePrice: Number(newPlayerBasePrice), photo: newPlayerPhoto || null });
      setNewPlayerName('');
      setNewPlayerBasePrice('');
      setNewPlayerPhoto('');
      onUpdate();
    } catch (err) {
      handleError(err);
    }
  };

  const notStartedPlayers = players.filter(p => p.status === 'Not Started');

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">

      {/* Main Auction Controller */}
      <div className="flex-1 w-full space-y-4">
        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm font-medium">
            {errorMsg}
          </div>
        )}

        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-100 pb-2">Active Auction</h3>

          {!activePlayer ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                className="input-field flex-1"
                value={selectedPlayerId}
                onChange={(e) => setSelectedPlayerId(e.target.value)}
              >
                <option value="">Select a player to start...</option>
                {notStartedPlayers.map(p => (
                  <option key={p._id} value={p._id}>{p.name} (Base: ${p.basePrice})</option>
                ))}
              </select>
              <button onClick={handleStartAuction} className="btn-primary whitespace-nowrap">
                Start Auction
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-end bg-gray-50 p-4 rounded-md border border-gray-200">
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block">Current Player</span>
                  <span className="text-xl font-bold text-gray-900">{activePlayer.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block">Base Price</span>
                  <span className="text-lg font-mono font-medium text-gray-900">${activePlayer.basePrice}</span>
                </div>
              </div>

              <form onSubmit={handlePlaceBid} className="flex flex-col sm:flex-row gap-3 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Select Team</label>
                  <select
                    className="input-field"
                    value={bidOwnerId}
                    onChange={(e) => setBidOwnerId(e.target.value)}
                    required
                  >
                    <option value="">Choose...</option>
                    {owners.map(o => (
                      <option key={o._id} value={o._id}>{o.name} (${o.remainingBudget} available)</option>
                    ))}
                  </select>
                </div>
                <div className="w-full sm:w-40">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Bid Amount ($)</label>
                  <input
                    type="number"
                    className="input-field font-mono"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="e.g. 500"
                    required
                  />
                </div>
                <button type="submit" className="btn-primary outline outline-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white  cursor-pointer w-full sm:w-auto">
                  Place Bid
                </button>
              </form>

              <div className="pt-4 border-t border-gray-100 flex gap-3">
                <button onClick={() => handleFinalize('Sold')} className="btn-primary flex-1">
                  Finalize & Sell
                </button>
                <button onClick={() => handleFinalize('Unsold')} className="btn-secondary flex-1">
                  Mark Unsold
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Entity Setup Forms */}
      <div className="w-full md:w-80 flex flex-col gap-4">
        <div className="card p-5">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 border-b border-gray-100 pb-2">Add New Team</h4>
          <form onSubmit={handleCreateOwner} className="space-y-3">
            <div>
              <input type="text" placeholder="Team Name" required className="input-field" value={newOwnerName} onChange={e => setNewOwnerName(e.target.value)} />
            </div>
            <div>
              <input type="number" placeholder="Total Budget ($)" required className="input-field font-mono" value={newOwnerBudget} onChange={e => setNewOwnerBudget(e.target.value)} />
            </div>
            <button type="submit" className="btn-secondary w-full text-xs py-1.5">Create Team</button>
          </form>
        </div>

        <div className="card p-5">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 border-b border-gray-100 pb-2">Add New Player</h4>
          <form onSubmit={handleCreatePlayer} className="space-y-3">
            <div>
              <input type="text" placeholder="Player Name" required className="input-field" value={newPlayerName} onChange={e => setNewPlayerName(e.target.value)} />
            </div>
            <div>
              <input type="number" placeholder="Base Price ($)" required className="input-field font-mono" value={newPlayerBasePrice} onChange={e => setNewPlayerBasePrice(e.target.value)} />
            </div>
            <div>
              <input type="url" placeholder="Photo URL (Optional)" className="input-field" value={newPlayerPhoto} onChange={e => setNewPlayerPhoto(e.target.value)} />
            </div>
            <button type="submit" className="btn-secondary w-full text-xs py-1.5">Create Player</button>
          </form>
        </div>
      </div>

    </div>
  );
}

export default AdminControls;
