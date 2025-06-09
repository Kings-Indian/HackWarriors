import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { GameState, Enemy, Obstacle, SAN_FRANCISCO_LOCATIONS } from '../types/game';

type GameAction =
  | { type: 'MOVE_PLAYER_A'; payload: { x: number; y: number } }
  | { type: 'MOVE_PLAYER_B'; payload: { x: number; y: number } }
  | { type: 'SPAWN_ENEMY'; payload: Enemy }
  | { type: 'SPAWN_OBSTACLE'; payload: Obstacle }
  | { type: 'CHECK_COLLISION' }
  | { type: 'START_COMBAT'; payload: { enemy: Enemy; player: 'A' | 'B' } }
  | { type: 'END_COMBAT' }
  | { type: 'ATTACK_ENEMY'; payload: 'A' | 'B' }
  | { type: 'DEFEND'; payload: 'A' | 'B' }
  | { type: 'FLEE'; payload: 'A' | 'B' }
  | { type: 'RESET_GAME' }
  | { type: 'SET_MESSAGE'; payload: string };

const initialState: GameState = {
  currentLocation: 0,
  isInCombat: false,
  isGameOver: false,
  enemies: [],
  obstacles: [],
  playerA: {
    position: { x: 100, y: 100 },
    health: 100,
    attack: 10,
    defense: 5,
    speed: 5,
    score: 0,
    level: 1,
    enemiesDefeated: 0,
    experience: 0,
    isDefending: false
  },
  playerB: {
    position: { x: 200, y: 100 },
    health: 100,
    attack: 10,
    defense: 5,
    speed: 5,
    score: 0,
    level: 1,
    enemiesDefeated: 0,
    experience: 0,
    isDefending: false
  },
  activePlayer: null,
  message: '',
};

const MAX_ENEMIES = 15;

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'MOVE_PLAYER_A':
      if (state.isInCombat) return state;
      const newXA = Math.max(30, Math.min(770, state.playerA.position.x + action.payload.x));
      const newYA = Math.max(30, Math.min(570, state.playerA.position.y + action.payload.y));
      return {
        ...state,
        playerA: {
          ...state.playerA,
          position: { x: newXA, y: newYA }
        }
      };

    case 'MOVE_PLAYER_B':
      if (state.isInCombat) return state;
      const newXB = Math.max(30, Math.min(770, state.playerB.position.x + action.payload.x));
      const newYB = Math.max(30, Math.min(570, state.playerB.position.y + action.payload.y));
      return {
        ...state,
        playerB: {
          ...state.playerB,
          position: { x: newXB, y: newYB }
        }
      };

    case 'SPAWN_ENEMY':
      return {
        ...state,
        enemies: [...state.enemies, action.payload]
      };

    case 'SPAWN_OBSTACLE':
      return {
        ...state,
        obstacles: [...state.obstacles, action.payload]
      };

    case 'CHECK_COLLISION':
      const playerAPos = state.playerA.position;
      const playerBPos = state.playerB.position;

      // Check collisions for both players
      const collidedEnemyA = state.enemies.find(enemy => {
        const dx = playerAPos.x - enemy.position.x;
        const dy = playerAPos.y - enemy.position.y;
        return Math.sqrt(dx * dx + dy * dy) < 50;
      });

      const collidedEnemyB = state.enemies.find(enemy => {
        const dx = playerBPos.x - enemy.position.x;
        const dy = playerBPos.y - enemy.position.y;
        return Math.sqrt(dx * dx + dy * dy) < 50;
      });

      if (collidedEnemyA) {
        return {
          ...state,
          isInCombat: true,
          activePlayer: 'A',
          enemies: state.enemies.filter(e => e !== collidedEnemyA),
          playerA: {
            ...state.playerA,
            health: state.playerA.health - 10
          }
        };
      }

      if (collidedEnemyB) {
        return {
          ...state,
          isInCombat: true,
          activePlayer: 'B',
          enemies: state.enemies.filter(e => e !== collidedEnemyB),
          playerB: {
            ...state.playerB,
            health: state.playerB.health - 10
          }
        };
      }

      return state;

    case 'RESET_GAME':
      return initialState;

    case 'START_COMBAT':
      return {
        ...state,
        isInCombat: true,
        activePlayer: action.payload.player,
        enemies: [...state.enemies, action.payload.enemy]
      };

    case 'END_COMBAT':
      return {
        ...state,
        isInCombat: false,
        activePlayer: null,
        enemies: state.enemies.filter(e => e !== state.enemies[state.enemies.length - 1])
      };

    case 'ATTACK_ENEMY': {
      if (state.enemies.length === 0) return state;
      const enemy = state.enemies[state.enemies.length - 1];
      const activePlayer = action.payload;
      const player = activePlayer === 'A' ? state.playerA : state.playerB;
      
      const damage = Math.max(1, player.attack - enemy.defense);
      const newEnemyHealth = enemy.health - damage;

      let message = `Player ${activePlayer} attacked ${enemy.name} for ${damage} damage!`;
      
      if (newEnemyHealth <= 0) {
        message += `\nPlayer ${activePlayer} defeated ${enemy.name}!`;
        return {
          ...state,
          isInCombat: false,
          activePlayer: null,
          enemies: state.enemies.slice(0, -1),
          [activePlayer === 'A' ? 'playerA' : 'playerB']: {
            ...player,
            score: player.score + 100,
            enemiesDefeated: player.enemiesDefeated + 1,
            experience: player.experience + 50,
            isDefending: false,
          },
          message,
        };
      }

      // Enemy counterattacks
      const playerDefense = player.isDefending ? player.defense * 2 : player.defense;
      const enemyDamage = Math.max(1, enemy.attack - playerDefense);
      const newPlayerHealth = player.health - enemyDamage;

      message += `\n${enemy.name} counterattacked for ${enemyDamage} damage!`;
      
      return {
        ...state,
        [activePlayer === 'A' ? 'playerA' : 'playerB']: {
          ...player,
          health: newPlayerHealth,
          isDefending: false,
        },
        enemies: state.enemies.map((e, i) =>
          i === state.enemies.length - 1 ? { ...e, health: newEnemyHealth } : e
        ),
        isGameOver: newPlayerHealth <= 0,
        message,
      };
    }
      
    case 'DEFEND': {
      const activePlayer = action.payload;
      const player = activePlayer === 'A' ? state.playerA : state.playerB;
      
      return {
        ...state,
        [activePlayer === 'A' ? 'playerA' : 'playerB']: {
          ...player,
          isDefending: true,
        },
        message: `Player ${activePlayer} braces themselves and defends! Incoming damage will be reduced.`,
      };
    }
      
    case 'FLEE': {
      if (state.enemies.length === 0) return state;
      
      const activePlayer = action.payload;
      const player = activePlayer === 'A' ? state.playerA : state.playerB;
      const runDamage = Math.max(0, state.enemies[state.enemies.length - 1].attack - player.defense);
      const playerHealthAfterRun = player.health - runDamage;
      
      if (playerHealthAfterRun <= 0) {
        return {
          ...state,
          isGameOver: true,
          [activePlayer === 'A' ? 'playerA' : 'playerB']: {
            ...player,
            health: 0
          }
        };
      }
      
      return {
        ...state,
        isInCombat: false,
        activePlayer: null,
        [activePlayer === 'A' ? 'playerA' : 'playerB']: {
          ...player,
          health: playerHealthAfterRun
        },
        enemies: state.enemies.filter(e => e !== state.enemies[state.enemies.length - 1])
      };
    }

    case 'SET_MESSAGE':
      return {
        ...state,
        message: action.payload,
      };

    default:
      return state;
  }
};

export const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}>({
  state: initialState,
  dispatch: () => null
});

export const useGame = () => useContext(GameContext);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Debug logging for spawn attempts
  useEffect(() => {
    console.log('Game State:', state);
  }, [state]);

  // Spawn enemies and obstacles
  useEffect(() => {
    console.log('Setting up spawn interval');
    const spawnInterval = setInterval(() => {
      if (!state.isInCombat && !state.isGameOver) {
        console.log('Spawn interval triggered');
        console.log('Current state:', state);
        
        const currentLocation = SAN_FRANCISCO_LOCATIONS[state.currentLocation];
        console.log('Current location:', currentLocation);
        
        // Check if we've reached the enemy limit
        if (state.enemies.length < MAX_ENEMIES) {
          if (Math.random() < 0.7) { // 70% chance to spawn enemy
            const randomEnemy = currentLocation.enemies[Math.floor(Math.random() * currentLocation.enemies.length)];
            console.log('Spawning enemy:', randomEnemy);
            
            dispatch({
              type: 'SPAWN_ENEMY',
              payload: {
                ...randomEnemy,
                position: {
                  x: Math.random() * 800,
                  y: Math.random() * 600
                }
              }
            });
          } else { // 30% chance to spawn obstacle
            const randomObstacle = currentLocation.obstacles[Math.floor(Math.random() * currentLocation.obstacles.length)];
            console.log('Spawning obstacle:', randomObstacle);
            
            dispatch({
              type: 'SPAWN_OBSTACLE',
              payload: {
                ...randomObstacle,
                position: {
                  x: Math.random() * 800,
                  y: Math.random() * 600
                }
              }
            });
          }
        } else {
          console.log('Enemy spawn limit reached!');
        }
      }
    }, 2000);

    const collisionInterval = setInterval(() => {
      if (!state.isInCombat && !state.isGameOver) {
        dispatch({ type: 'CHECK_COLLISION' });
      }
    }, 100);

    return () => {
      console.log('Cleaning up intervals');
      clearInterval(spawnInterval);
      clearInterval(collisionInterval);
    };
  }, [state.isInCombat, state.isGameOver, state.currentLocation, state.enemies.length]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {state.message && (
        <div className="game-message">
          {state.message.split('\n').map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      )}
      {children}
    </GameContext.Provider>
  );
};   