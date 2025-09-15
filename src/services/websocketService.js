import { io } from 'socket.io-client';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  // Initialize WebSocket connection
  connect(url = null) {
    const socketUrl = url || process.env.REACT_APP_WS_URL || 'http://localhost:5000';
    
    try {
      this.socket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
        autoConnect: true
      });

      this.setupEventListeners();
      return true;
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      return false;
    }
  }

  // Setup event listeners
  setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.connected = true;
      this.reconnectAttempts = 0;
      this.emit('connection', { status: 'connected' });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      this.connected = false;
      this.emit('connection', { status: 'disconnected', reason });
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.connected = false;
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        this.emit('connection', { 
          status: 'failed', 
          error: 'Max reconnection attempts reached' 
        });
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('WebSocket reconnected after', attemptNumber, 'attempts');
      this.connected = true;
      this.reconnectAttempts = 0;
      this.emit('connection', { status: 'reconnected', attempts: attemptNumber });
    });

    // Listen for presale-specific events
    this.socket.on('presale:stats', (data) => {
      this.emit('presale:stats', data);
    });

    this.socket.on('presale:phase_changed', (data) => {
      this.emit('presale:phase_changed', data);
    });

    this.socket.on('presale:purchase', (data) => {
      this.emit('presale:purchase', data);
    });

    this.socket.on('user:stats', (data) => {
      this.emit('user:stats', data);
    });

    this.socket.on('transaction:new', (data) => {
      this.emit('transaction:new', data);
    });

    this.socket.on('kyc:status_changed', (data) => {
      this.emit('kyc:status_changed', data);
    });

    this.socket.on('price:update', (data) => {
      this.emit('price:update', data);
    });
  }

  // Disconnect WebSocket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  // Check if connected
  isConnected() {
    return this.connected && this.socket?.connected;
  }

  // Subscribe to events
  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    // Return unsubscribe function
    return () => {
      const eventListeners = this.listeners.get(event);
      if (eventListeners) {
        eventListeners.delete(callback);
        if (eventListeners.size === 0) {
          this.listeners.delete(event);
        }
      }
    };
  }

  // Unsubscribe from events
  unsubscribe(event, callback) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
      if (eventListeners.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  // Emit events to listeners
  emit(event, data) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in WebSocket event listener for ${event}:`, error);
        }
      });
    }
  }

  // Send message to server
  send(event, data) {
    if (this.socket && this.connected) {
      this.socket.emit(event, data);
      return true;
    }
    console.warn('WebSocket not connected, message not sent:', event, data);
    return false;
  }

  // Subscribe to presale updates
  subscribeToPresale() {
    return this.send('subscribe:presale');
  }

  // Subscribe to user-specific updates
  subscribeToUser(userId) {
    return this.send('subscribe:user', { userId });
  }

  // Subscribe to admin updates (admin only)
  subscribeToAdmin() {
    return this.send('subscribe:admin');
  }

  // Join a room
  joinRoom(room) {
    return this.send('join:room', { room });
  }

  // Leave a room
  leaveRoom(room) {
    return this.send('leave:room', { room });
  }

  // Authentication
  authenticate(token) {
    return this.send('auth:token', { token });
  }

  // Ping server
  ping() {
    if (this.socket && this.connected) {
      this.socket.emit('ping', (response) => {
        console.log('WebSocket ping response:', response);
      });
      return true;
    }
    return false;
  }

  // Get connection info
  getConnectionInfo() {
    return {
      connected: this.connected,
      id: this.socket?.id,
      transport: this.socket?.io?.engine?.transport?.name,
      reconnectAttempts: this.reconnectAttempts
    };
  }
}

// Create singleton instance
export const webSocketService = new WebSocketService();

// Note: Use the useWebSocket hook from hooks/useWebSocket.js instead

export default webSocketService;