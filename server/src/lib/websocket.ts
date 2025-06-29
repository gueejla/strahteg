import { WebSocketServer, WebSocket } from 'ws';

// Global WebSocket server instance
let wss: WebSocketServer | null = null;

// WebSocket message types
export interface WebSocketMessage {
  type: 'connection' | 'echo' | 'broadcast' | 'error' | 'custom';
  data?: any;
  message?: string;
  timestamp: string;
}

// Initialize WebSocket server
export function initializeWebSocketServer(server: any) {
  if (!wss) {
    wss = new WebSocketServer({ server });
    
    wss.on('connection', (ws: WebSocket) => {
      console.log('Client connected');
      
      // Send welcome message
      sendMessage(ws, {
        type: 'connection',
        message: 'Connected to WebSocket server',
        timestamp: new Date().toISOString()
      });
      
      // Handle incoming messages
      ws.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          console.log('Received message:', message);
          
          // Echo the message back to the client
          sendMessage(ws, {
            type: 'echo',
            data: message,
            timestamp: new Date().toISOString()
          });
          
          // Broadcast to all connected clients (optional)
          broadcastMessage({
            type: 'broadcast',
            data: message,
            timestamp: new Date().toISOString()
          }, ws);
        } catch (error) {
          console.error('Error parsing message:', error);
          sendMessage(ws, {
            type: 'error',
            message: 'Invalid JSON format',
            timestamp: new Date().toISOString()
          });
        }
      });
      
      // Handle client disconnection
      ws.on('close', () => {
        console.log('Client disconnected');
      });
      
      // Handle errors
      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });
  }
  return wss;
}

// Send message to a specific WebSocket client
export function sendMessage(ws: WebSocket, message: WebSocketMessage) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

// Broadcast message to all connected clients
export function broadcastMessage(message: WebSocketMessage, excludeWs?: WebSocket) {
  if (!wss) {
    console.warn('WebSocket server not initialized - this is normal when called from API routes');
    return;
  }
  
  let broadcastCount = 0;
  wss.clients.forEach((client) => {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
      broadcastCount++;
    }
  });
  
  console.log(`Broadcasted message to ${broadcastCount} clients`);
}

// Get connected clients count
export function getConnectedClientsCount(): number {
  return wss ? wss.clients.size : 0;
}

// Get WebSocket server instance
export function getWebSocketServer(): WebSocketServer | null {
  return wss;
}

// Cleanup function
export function cleanup() {
  if (wss) {
    wss.close();
    wss = null;
  }
} 