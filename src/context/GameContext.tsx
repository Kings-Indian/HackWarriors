import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { GameState, Player, Obstacle, Enemy, SAN_FRANCISCO_LOCATIONS } from '../types/game';

type GameAction =
  | { type: 'MOVE_PLAYER'; payload: { x: number; y: number } }
  | { type: 'SPAWN_OBSTACLE' }
  | { type: 'SPAWN_ENEMY' }
  | { type: 'CHECK_COLLISION' }
  | { type: 'INCREMENT_SCORE' }
  | { type: 'GAME_OVER' }
  | { type: 'RESET_GAME' }
  | { type: 'START_COMBAT'; payload: Enemy }
  | { type: 'END_COMBAT' }
  | { type: 'ATTACK_ENEMY' }
  | { type: 'DEFEND' }
  | { type: 'RUN_FROM_COMBAT' }
  | { type: 'CHANGE_LOCATION' };

const initialGameState: GameState = {
  player: {
    position: { x: 400, y: 300 },
    type: 'player',
    health: 100,
    attack: 10,
    defense: 5,
    speed: 5,
    experience: 0,
    enemiesDefeated: 0
  },
  obstacles: [],
  score: 0,
  level: 1,
  isGameOver: false,
  isInCombat: false,
  currentEnemy: null,
  currentLocation: 'fishermans-wharf'
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'MOVE_PLAYER':
      if (state.isInCombat) return state;
      const newX = Math.max(30, Math.min(770, state.player.position.x + action.payload.x));
      const newY = Math.max(30, Math.min(570, state.player.position.y + action.payload.y));
      return {
        ...state,
        player: {
          ...state.player,
          position: { x: newX, y: newY }
        }
      };

    case 'SPAWN_OBSTACLE':
      const currentLocation = SAN_FRANCISCO_LOCATIONS.find(loc => loc.name.toLowerCase().replace(' ', '-') === state.currentLocation);
      if (!currentLocation) return state;
      
      const randomObstacle = currentLocation.obstacles[Math.floor(Math.random() * currentLocation.obstacles.length)];
      const obstaclePosition = {
        x: Math.random() * 700 + 50,
        y: Math.random() * 500 + 50
      };
      return {
        ...state,
        obstacles: [...state.obstacles, { ...randomObstacle, position: obstaclePosition }]
      };

    case 'SPAWN_ENEMY':
      const location = SAN_FRANCISCO_LOCATIONS.find(loc => loc.name.toLowerCase().replace(' ', '-') === state.currentLocation);
      if (!location) return state;
      
      const randomEnemy = location.enemies[Math.floor(Math.random() * location.enemies.length)];
      const enemyPosition = {
        x: Math.random() * 700 + 50,
        y: Math.random() * 500 + 50
      };
      return {
        ...state,
        obstacles: [...state.obstacles, { ...randomEnemy, position: enemyPosition, type: 'enemy' }]
      };

    case 'CHECK_COLLISION':
      const playerPos = state.player.position;
      const collidedObstacle = state.obstacles.find(obstacle => {
        const dx = playerPos.x - obstacle.position.x;
        const dy = playerPos.y - obstacle.position.y;
        return Math.sqrt(dx * dx + dy * dy) < 30;
      });

      if (collidedObstacle) {
        if (collidedObstacle.type === 'enemy') {
          return {
            ...state,
            isInCombat: true,
            currentEnemy: collidedObstacle as Enemy,
            obstacles: state.obstacles.filter(o => o !== collidedObstacle)
          };
        }
        return {
          ...state,
          isGameOver: true
        };
      }
      return state;

    case 'INCREMENT_SCORE':
      const newScore = state.score + 10;
      const newLevel = Math.floor(newScore / 100) + 1;
      return {
        ...state,
        score: newScore,
        level: newLevel
      };

    case 'GAME_OVER':
      return {
        ...state,
        isGameOver: true
      };

    case 'RESET_GAME':
      return initialGameState;

    case 'START_COMBAT':
      return {
        ...state,
        isInCombat: true,
        currentEnemy: action.payload
      };

    case 'END_COMBAT':
      return {
        ...state,
        isInCombat: false,
        currentEnemy: null
      };

    case 'ATTACK_ENEMY':
      if (!state.currentEnemy) return state;
      
      const enemyDamage = Math.max(0, state.player.attack - state.currentEnemy.defense);
      const newEnemyHealth = state.currentEnemy.health - enemyDamage;
      
      if (newEnemyHealth <= 0) {
        const newEnemiesDefeated = state.player.enemiesDefeated + 1;
        const currentLocationIndex = SAN_FRANCISCO_LOCATIONS.findIndex(
          loc => loc.name.toLowerCase().replace(' ', '-') === state.currentLocation
        );
        
        // Check if player can advance to next location
        if (currentLocationIndex < SAN_FRANCISCO_LOCATIONS.length - 1 &&
            newEnemiesDefeated >= SAN_FRANCISCO_LOCATIONS[currentLocationIndex + 1].requiredEnemiesDefeated) {
          return {
            ...state,
            player: {
              ...state.player,
              enemiesDefeated: newEnemiesDefeated,
              experience: state.player.experience + 50
            },
            isInCombat: false,
            currentEnemy: null,
            currentLocation: SAN_FRANCISCO_LOCATIONS[currentLocationIndex + 1].name.toLowerCase().replace(' ', '-')
          };
        }
        
        return {
          ...state,
          player: {
            ...state.player,
            enemiesDefeated: newEnemiesDefeated,
            experience: state.player.experience + 50
          },
          isInCombat: false,
          currentEnemy: null
        };
      }
      
      const playerDamage = Math.max(0, state.currentEnemy.attack - state.player.defense);
      const newPlayerHealth = state.player.health - playerDamage;
      
      if (newPlayerHealth <= 0) {
        return {
          ...state,
          isGameOver: true
        };
      }
      
      return {
        ...state,
        player: {
          ...state.player,
          health: newPlayerHealth
        },
        currentEnemy: {
          ...state.currentEnemy,
          health: newEnemyHealth
        }
      };

    case 'DEFEND':
      if (!state.currentEnemy) return state;
      
      const reducedDamage = Math.max(0, state.currentEnemy.attack - state.player.defense * 2);
      const playerHealthAfterDefend = state.player.health - reducedDamage;
      
      if (playerHealthAfterDefend <= 0) {
        return {
          ...state,
          isGameOver: true
        };
      }
      
      return {
        ...state,
        player: {
          ...state.player,
          health: playerHealthAfterDefend
        }
      };

    case 'RUN_FROM_COMBAT':
      const runChance = Math.random();
      if (runChance > 0.5) {
        return {
          ...state,
          isInCombat: false,
          currentEnemy: null
        };
      }
      
      if (!state.currentEnemy) return state;
      
      const runDamage = Math.max(0, state.currentEnemy.attack - state.player.defense);
      const playerHealthAfterRun = state.player.health - runDamage;
      
      if (playerHealthAfterRun <= 0) {
        return {
          ...state,
          isGameOver: true
        };
      }
      
      return {
        ...state,
        player: {
          ...state.player,
          health: playerHealthAfterRun
        }
      };

    case 'CHANGE_LOCATION':
      const nextLocationIndex = SAN_FRANCISCO_LOCATIONS.findIndex(
        loc => loc.name.toLowerCase().replace(' ', '-') === state.currentLocation
      ) + 1;
      
      if (nextLocationIndex >= SAN_FRANCISCO_LOCATIONS.length) return state;
      
      return {
        ...state,
        currentLocation: SAN_FRANCISCO_LOCATIONS[nextLocationIndex].name.toLowerCase().replace(' ', '-'),
        obstacles: []
      };

    default:
      return state;
  }
};

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  // Debug logging for spawn attempts
  useEffect(() => {
    console.log('Game state:', {
      isInCombat: state.isInCombat,
      isGameOver: state.isGameOver,
      currentLocation: state.currentLocation,
      obstacles: state.obstacles
    });
  }, [state]);

  useEffect(() => {
    // Spawn enemies more frequently
    const spawnInterval = setInterval(() => {
      if (!state.isInCombat && !state.isGameOver) {
        // Increase spawn chance to 70%
        if (Math.random() < 0.7) {
          console.log('Attempting to spawn enemy...');
          dispatch({ type: 'SPAWN_ENEMY' });
        } else {
          console.log('Attempting to spawn obstacle...');
          dispatch({ type: 'SPAWN_OBSTACLE' });
        }
      }
    }, 2000); // Reduced interval to 2 seconds

    const collisionInterval = setInterval(() => {
      if (!state.isInCombat && !state.isGameOver) {
        dispatch({ type: 'CHECK_COLLISION' });
      }
    }, 100);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(collisionInterval);
    };
  }, [state.isInCombat, state.isGameOver]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}; 