import React, { useEffect, useState } from 'react';
import { getHistory } from '../api';

function BidHistoryModal({ player, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (player) {
      setLoading(true);
      getHistory(player._id)
        .then(data => {
          setHistory(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [player]);

  if (!player) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Bid History: <span className="font-semibold">{player.name}</span>
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-500 transition-colors focus:outline-none"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-0 flex-1 overflow-y-auto bg-gray-50">
          {loading ? (
            <div className="text-center text-sm text-gray-500 py-12">Loading history...</div>
          ) : history.length === 0 ? (
            <div className="text-center text-sm text-gray-500 py-12 bg-white">No bids placed yet.</div>
          ) : (
            <ul className="divide-y divide-gray-100 bg-white">
              {history.map((bid, index) => (
                <li key={bid._id} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {bid.owner ? bid.owner.name : 'Unknown Owner'}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {new Date(bid.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                  </div>
                  <div className="text-base font-mono font-medium text-gray-900">
                    ${bid.amount.toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex justify-end">
           <button onClick={onClose} className="btn-secondary">Close</button>
        </div>
      </div>
    </div>
  );
}

export default BidHistoryModal;
