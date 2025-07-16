// Game state type definitions

export interface GameState {
  /** ISO string timestamp when the game started */
  gameStartTime: string;
  /** Player identifier who made the last move */
  lastMoveBy: string;
  /** Last move made by the player */
  lastMoveMade: string;
}

// WebSocket message types for game communication
export interface ConnectionMessage {
  type: 'connection' | 'disconnect';
  message: string;
  timestamp: string;
}

export interface ErrorMessage {
  type: 'error';
  message: string;
  timestamp: string;
}

export interface GameStateMessage {
  type: 'gameStateUpdate';
  data: GameState;
  timestamp: string;
}

// Union type for all WebSocket messages
export type WebSocketGameMessage = ConnectionMessage | ErrorMessage | GameStateMessage; 