// Game state management for 10x10 grid
import { GridCell, GameState, GameMove, MoveResult, GameStats } from '@/shared/types';

/**
 * Initialize a new 10x10 game grid
 */
export function initializeGameState(gameId: string, players: string[]): GameState {
  const grid: GridCell[][] = [];
  
  // Create 10x10 grid with empty cells
  for (let y = 0; y < 10; y++) {
    grid[y] = [];
    for (let x = 0; x < 10; x++) {
      grid[y][x] = {
        player: null,
        value: null
      };
    }
  }

  const now = new Date().toISOString();
  
  return {
    id: gameId,
    grid,
    players,
    currentPlayer: players.length > 0 ? players[0] : null,
    gameStatus: 'waiting',
    createdAt: now,
    lastUpdated: now
  };
}

/**
 * Make a move on the game grid
 */
export function makeMove(gameState: GameState, move: GameMove): MoveResult {
  const { x, y, player, value } = move;
  
  // Validate coordinates
  if (x < 0 || x >= 10 || y < 0 || y >= 10) {
    return {
      success: false,
      newState: gameState,
      error: 'Invalid coordinates: must be between 0 and 9'
    };
  }
  
  // Check if cell is already occupied
  if (gameState.grid[y][x].value !== null) {
    return {
      success: false,
      newState: gameState,
      error: 'Cell is already occupied'
    };
  }
  
  // Check if it's the players turn
  if (gameState.currentPlayer !== player) {
    return {
      success: false,
      newState: gameState,
      error: 'Not your turn'
    };
  }
  
  // Create new game state with the move
  const newGrid = gameState.grid.map(row => [...row]);
  newGrid[y][x] = {
    player: player,
    value: parseInt(value)
  };
  
  // Determine next player
  const currentPlayerIndex = gameState.players.indexOf(player);
  const nextPlayerIndex = (currentPlayerIndex + 1) % gameState.players.length;
  const nextPlayer = gameState.players[nextPlayerIndex];
  
  const newState: GameState = {
    ...gameState,
    grid: newGrid,
    currentPlayer: nextPlayer,
    lastUpdated: move.timestamp
  };
  
  return {
    success: true,
    newState
  };
}

/**
 * Get the current state of a specific cell
 */
export function getCell(gameState: GameState, x: number, y: number): GridCell | null {
  if (x < 0 || x >= 10 || y < 0 || y >= 10) {
    return null;
  }
  return gameState.grid[y][x];
}

/**
 * Get all cells in the grid
 */
export function getAllCells(gameState: GameState): GridCell[] {
  return gameState.grid.flat();
}

/**
 * Check if the game is finished (all cells filled)
 */
export function isGameFinished(gameState: GameState): boolean {
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      if (gameState.grid[y][x].value === null) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Get game statistics
 */
export function getGameStats(gameState: GameState): GameStats {
  const totalCells = 10 * 10;
  let filledCells = 0;
  const playerMoves: Record<string, number> = {};
  
  // Initialize player move counts
  gameState.players.forEach(player => {
    playerMoves[player] = 0;
  });
  
  // Count filled cells and player moves
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = gameState.grid[y][x];
      if (cell.value !== null) {
        filledCells++;
        if (cell.player !== null && playerMoves[cell.player.toString()] !== undefined) {
          playerMoves[cell.player.toString()]++;
        }
      }
    }
  }
  
  return {
    totalCells,
    filledCells,
    emptyCells: totalCells - filledCells,
    playerMoves
  };
} 