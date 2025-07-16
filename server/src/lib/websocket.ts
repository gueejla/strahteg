import { WebSocketServer, WebSocket } from 'ws';
import { WebSocketGameMessage, ConnectionMessage, ErrorMessage, GameStateMessage, GameState } from './types';

// Global WebSocket server instance
let wss: WebSocketServer | null = null;

// Initialize WebSocket server
export function initializeWebSocketServer(server: any) {
  if (!wss) {
    wss = new WebSocketServer({ server });
    
    wss.on('connection', (ws: WebSocket) => {
      console.log('Client connected');
      
      // Send welcome message
      const connectionMessage: ConnectionMessage = {
        type: 'connection',
        message: 'Connected to WebSocket server',
        timestamp: new Date().toISOString()
      };
      broadcastMessage(connectionMessage, ws);
      
      // Handle incoming messages
      ws.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          console.log('Received message:', message);
          
          // Handle game state update requests
          if (message.type === 'gameStateUpdate') {
            const gameState: GameState = {
              gameStartTime: new Date().toISOString(),
              lastMoveBy: 'server',
              lastMoveMade: 'Hello World!'
            };
            
            const gameStateMessage: GameStateMessage = {
              type: 'gameStateUpdate',
              data: gameState,
              timestamp: new Date().toISOString()
            };
            
          broadcastMessage(gameStateMessage, ws);
          } else {
            // Send error for unknown message types
            const errorMessage: ErrorMessage = {
              type: 'error',
              message: 'Unknown message type',
              timestamp: new Date().toISOString()
            };
            broadcastMessage(errorMessage, ws);
          }
        } catch (error) {
          console.error('Error parsing message:', error);
          const errorMessage: ErrorMessage = {
            type: 'error',
            message: 'Invalid JSON format',
            timestamp: new Date().toISOString()
          };
          broadcastMessage(errorMessage, ws);
        }
      });
      
      // Handle client disconnection
      ws.on('close', () => {
        console.log('Client disconnected');
        // Broadcast disconnect message to other clients
        const disconnectMessage: ConnectionMessage = {
          type: 'disconnect',
          message: 'A client has disconnected',
          timestamp: new Date().toISOString()
        };
        broadcastMessage(disconnectMessage, ws);
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
export function sendMessage(ws: WebSocket, message: WebSocketGameMessage) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

// Broadcast message to all connected clients
export function broadcastMessage(message: WebSocketGameMessage, excludeWs?: WebSocket) {
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

// Cleanup function
export function cleanup() {
  if (wss) {
    wss.close();
    wss = null;
  }
} 