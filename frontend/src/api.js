import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getOwners = () => axios.get(`${API_URL}/owners`).then(res => res.data);
export const createOwner = (data) => axios.post(`${API_URL}/owners`, data).then(res => res.data);

export const getPlayers = () => axios.get(`${API_URL}/players`).then(res => res.data);
export const createPlayer = (data) => axios.post(`${API_URL}/players`, data).then(res => res.data);

export const getGrid = () => axios.get(`${API_URL}/auction/grid`).then(res => res.data);
export const getHistory = (playerId) => axios.get(`${API_URL}/auction/history/${playerId}`).then(res => res.data);

export const startAuction = (playerId) => axios.post(`${API_URL}/auction/start/${playerId}`).then(res => res.data);
export const placeBid = (data) => axios.post(`${API_URL}/auction/bid`, data).then(res => res.data);
export const finalizeAuction = (playerId, status) => axios.post(`${API_URL}/auction/finalize/${playerId}`, { status }).then(res => res.data);
