import { useState, useEffect } from 'react';
import webSocketService from '../services/websocketService';

export const useWebSocket = () => {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  
  useEffect(() => {
    // Connect to WebSocket
    webSocketService.connect();
    
    // Subscribe to connection events
    const unsubscribe = webSocketService.subscribe('connection', (data) => {
      setConnectionStatus(data.status);
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
      webSocketService.disconnect();
    };
  }, []);

  return {
    connectionStatus,
    isConnected: webSocketService.isConnected(),
    subscribe: webSocketService.subscribe.bind(webSocketService),
    unsubscribe: webSocketService.unsubscribe.bind(webSocketService),
    send: webSocketService.send.bind(webSocketService),
    subscribeToPresale: webSocketService.subscribeToPresale.bind(webSocketService),
    subscribeToUser: webSocketService.subscribeToUser.bind(webSocketService),
    ping: webSocketService.ping.bind(webSocketService)
  };
};