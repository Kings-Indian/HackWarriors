import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { GameState, Enemy, Obstacle, SAN_FRANCISCO_LOCATIONS } from '../types/game';

const MAX_ENEMIES = 15;

type GameAction =
  | { type: 'MOVE_PLAYER'; payload: { x: number; y: number } }
  | { type: 'SPAWN_ENEMY'; payload: Enemy }
  | { type: 'SPAWN_OBSTACLE'; payload: Obstacle }
  | { type: 'CHECK_COLLISION' }
  | { type: 'START_COMBAT'; payload: Enemy }
  | { type: 'END_COMBAT' }
  | { type: 'ATTACK_ENEMY' }
  | { type: 'DEFEND' }
  | { type: 'FLEE' }
  | { type: 'RESET_GAME' }
  | { type: 'COMBAT_ACTION'; payload: 'attack' | 'defend' | 'flee' }
  | { type: 'COMBAT_REWARD'; payload: any }
  | { type: 'SET_MESSAGE'; payload: string };

const initialState: GameState = {
  currentLocation: 0,
  isInCombat: false,
  isGameOver: false,
  enemies: [],
  obstacles: [],
  player: {
    position: { x: 400, y: 300 },
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
  message: ''
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

    case 'SPAWN_ENEMY':
      if (state.enemies.length >= MAX_ENEMIES) {
        return state;
      }
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
      const playerPos = state.player.position;
      const collidedObstacle = state.obstacles.find(obstacle => {
        const dx = playerPos.x - obstacle.position.x;
        const dy = playerPos.y - obstacle.position.y;
        return Math.sqrt(dx * dx + dy * dy) < 50;
      });

      if (collidedObstacle) {
        return {
          ...state,
          isInCombat: true,
          obstacles: state.obstacles.filter(o => o !== collidedObstacle),
          player: {
            ...state.player,
            health: state.player.health - 10
          }
        };
      }

      const collidedEnemy = state.enemies.find(enemy => {
        const dx = playerPos.x - enemy.position.x;
        const dy = playerPos.y - enemy.position.y;
        return Math.sqrt(dx * dx + dy * dy) < 50;
      });

      if (collidedEnemy) {
        return {
          ...state,
          isInCombat: true,
          enemies: state.enemies.filter(e => e !== collidedEnemy),
          player: {
            ...state.player,
            health: state.player.health - 10
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
        enemies: [...state.enemies, action.payload]
      };

    case 'END_COMBAT':
      return {
        ...state,
        isInCombat: false,
        enemies: state.enemies.filter(e => e !== state.enemies[state.enemies.length - 1])
      };

    case 'ATTACK_ENEMY': {
      if (state.enemies.length === 0) return state;
      const enemy = state.enemies[state.enemies.length - 1];
      const damage = Math.max(1, state.player.attack - enemy.defense);
      const newEnemyHealth = enemy.health - damage;

      let message = `You attacked ${enemy.name} for ${damage} damage!`;

      if (newEnemyHealth <= 0) {
        message += `\nYou defeated ${enemy.name}!`;
        return {
          ...state,
          isInCombat: false,
          enemies: state.enemies.slice(0, -1),
          player: {
            ...state.player,
            score: state.player.score + 100,
            enemiesDefeated: state.player.enemiesDefeated + 1,
            experience: state.player.experience + 50,
            isDefending: false,
          },
          message,
        };
      }

      // Enemy counterattacks
      const playerDefense = state.player.isDefending ? state.player.defense * 2 : state.player.defense;
      const enemyDamage = Math.max(1, enemy.attack - playerDefense);
      const newPlayerHealth = state.player.health - enemyDamage;

      message += `\n${enemy.name} counterattacked for ${enemyDamage} damage!`;

      return {
        ...state,
        player: {
          ...state.player,
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
      return {
        ...state,
        player: {
          ...state.player,
          isDefending: true,
        },
        message: 'You brace yourself and defend! Incoming damage will be reduced.',
      };
    }

    case 'FLEE':
      if (state.enemies.length === 0) return state;
      
      const runDamage = Math.max(0, state.enemies[state.enemies.length - 1].attack - state.player.defense);
      const playerHealthAfterRun = state.player.health - runDamage;
      
      if (playerHealthAfterRun <= 0) {
        return {
          ...state,
          isGameOver: true,
          player: {
            ...state.player,
            health: 0
          }
        };
      }
      
      return {
        ...state,
        isInCombat: false,
        player: {
          ...state.player,
          health: playerHealthAfterRun
        },
        enemies: state.enemies.filter(e => e !== state.enemies[state.enemies.length - 1])
      };

    case 'COMBAT_ACTION':
      if (state.enemies.length === 0) return state;
      return {
        ...state,
        isInCombat: false,
        enemies: state.enemies.filter(e => e !== state.enemies[state.enemies.length - 1])
      };

    case 'SET_MESSAGE':
      return {
        ...state,
        message: action.payload
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
        console.log('Current enemy count:', state.enemies.length);
        
        const currentLocation = SAN_FRANCISCO_LOCATIONS[state.currentLocation];
        console.log('Current location:', currentLocation);
        
        // Check if we've reached the enemy limit
        if (state.enemies.length >= MAX_ENEMIES) {
          console.log('Enemy spawn limit reached!');
          dispatch({ type: 'SET_MESSAGE', payload: 'Enemy spawn limit reached!' });
          return;
        }
        
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

  const movePlayer = (x: number, y: number) => {
    dispatch({ type: 'MOVE_PLAYER', payload: { x, y } });
  };

  const startCombat = (enemy: Enemy) => {
    dispatch({ type: 'START_COMBAT', payload: enemy });
  };

  const endCombat = () => {
    dispatch({ type: 'END_COMBAT' });
  };

  const handleCombatAction = (action: 'attack' | 'defend' | 'flee') => {
    dispatch({ type: 'COMBAT_ACTION', payload: action });
  };

  const handleCombatChoice = (choice: 'attack' | 'defend' | 'flee') => {
    switch (choice) {
      case 'attack':
        dispatch({ type: 'ATTACK_ENEMY' });
        break;
      case 'defend':
        dispatch({ type: 'DEFEND' });
        break;
      case 'flee':
        dispatch({ type: 'FLEE' });
        break;
    }
  };

  const handleCombatReward = (reward: any) => {
    dispatch({ type: 'COMBAT_REWARD', payload: reward });
  };

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