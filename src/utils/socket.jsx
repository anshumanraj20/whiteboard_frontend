
import { io } from 'socket.io-client';
const apiUrl = import.meta.env.VITE_API_URL;
let socket;

export const initSocket = (token) => {
  if (!socket) {
    socket = io(`${apiUrl}`, {
      extraHeaders: { Authorization: `Bearer ${token}`,
           "ngrok-skip-browser-warning": 'any-value' },
    });
  }
  return socket;
};

export const getSocket = () => socket;
