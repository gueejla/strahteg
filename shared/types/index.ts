// Shared type definitions for the entire application

// ===== GAME STATE TYPES =====

export interface GridCell {
  player: string | null;
  value: number | null; // null for empty, or player identifier
}

export interface GameState {
  id: string;
  grid: GridCell[][];
  players: string[];
  currentPlayer: string | null;
  gameStatus: 'waiting' | 'active' | 'finished';
  createdAt: string;
  lastUpdated: string;
}

export interface GameMove {
  player: string;
  x: number;
  y: number;
  value: string;
  timestamp: string;
}

// ===== WEBSOCKET MESSAGE TYPES =====

export interface GameUpdate {
  /** Player identifier who made the last move */
  player: string;
  /** Last move made by the player */
  move: string;
}

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

export interface GameUpdateMessage {
  type: 'gameUpdate';
  data: GameUpdate;
  timestamp: string;
}

// Union type for all WebSocket messages
export type WebSocketGameMessage = ConnectionMessage | ErrorMessage | GameUpdateMessage;

// ===== API RESPONSE TYPES =====

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface GameStats {
  totalCells: number;
  filledCells: number;
  emptyCells: number;
  playerMoves: Record<string, number>;
}

export interface MoveResult {
  success: boolean;
  newState: GameState;
  error?: string;
} 