import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useGame } from '../context/GameContext';
import { useNavigate } from 'react-router-dom';
import { getBackgroundImage } from '../utils/backgroundUtils';
import { Location, SAN_FRANCISCO_LOCATIONS, Player, Enemy, Obstacle } from '../types/game';
import '../styles/Game.css';

const LEVEL_DESCRIPTIONS = {
  1: "Welcome to San Francisco! Explore the city and defeat enemies to gain XP.",
  2: "The city is getting more dangerous. Watch out for stronger enemies!",
  3: "You've reached the final level. Defeat the boss to win!"
} as const;

// Add proper type definitions
interface GameState {
  player: Player;
  enemies: Enemy[];
  obstacles: Obstacle[];
  isInCombat: boolean;
  isGameOver: boolean;
  currentLocation: number;
  message: string;
}

type GameAction = 
  | { type: 'MOVE_PLAYER'; payload: { x: number; y: number } }
  | { type: 'SPAWN_ENEMY' }
  | { type: 'SPAWN_OBSTACLE' }
  | { type: 'CHECK_COLLISION' }
  | { type: 'START_COMBAT' }
  | { type: 'END_COMBAT' }
  | { type: 'ATTACK_ENEMY' }
  | { type: 'DEFEND' }
  | { type: 'FLEE' }
  | { type: 'RESET_GAME' }
  | { type: 'SET_MESSAGE'; payload: string };

const MultiPlayerGame: React.FC = () => {
  const { state, dispatch } = useGame();
  const { player, enemies, obstacles, isInCombat, isGameOver, currentLocation, message } = state;
  const [isLoading, setIsLoading] = useState(true);
  const backgroundInterval = useRef<NodeJS.Timeout>();
  const navigate = useNavigate();

  // Loading effect
  useEffect(() => {
    const loadGame = async () => {
      try {
        // Load game assets here
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading game:', error);
      }
    };
    loadGame();
  }, []);

  useEffect(() => {
    let currentIndex = currentLocation;

    const changeBackground = () => {
      currentIndex = (currentIndex + 1) % SAN_FRANCISCO_LOCATIONS.length;
      const location = SAN_FRANCISCO_LOCATIONS[currentIndex];
      dispatch({ type: 'SET_MESSAGE', payload: `Entering ${location.name}...` });
    };

    // Clear existing interval
    if (backgroundInterval.current) {
      clearInterval(backgroundInterval.current);
    }

    backgroundInterval.current = setInterval(changeBackground, 10000);
    changeBackground();

    return () => {
      if (backgroundInterval.current) {
        clearInterval(backgroundInterval.current);
      }
    };
  }, [currentLocation, dispatch]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (isGameOver) return;

    const speed = player.speed;
    let dx = 0;
    let dy = 0;

    // Movement controls
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      switch (e.key) {
        case 'ArrowUp':
          dy = -speed;
          break;
        case 'ArrowDown':
          dy = speed;
          break;
        case 'ArrowLeft':
          dx = -speed;
          break;
        case 'ArrowRight':
          dx = speed;
          break;
      }

      dispatch({ type: 'MOVE_PLAYER', payload: { x: dx, y: dy } });
      dispatch({ type: 'CHECK_COLLISION' });
    }

    // Combat controls
    if (isInCombat) {
      switch (e.key) {
        case 'j':
          dispatch({ type: 'ATTACK_ENEMY' });
          break;
        case 'l':
          dispatch({ type: 'DEFEND' });
          break;
        case 'k':
          dispatch({ type: 'FLEE' });
          break;
      }
    }
  }, [isGameOver, isInCombat, dispatch, player.speed]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const handleRestart = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  const handleMainMenu = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <h2>Loading Game...</h2>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div 
        className="game-background"
        style={{ 
          backgroundImage: `url(${getBackgroundImage(SAN_FRANCISCO_LOCATIONS[currentLocation])})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="level-info">
          <h2>Level {player.level}</h2>
          <p>{LEVEL_DESCRIPTIONS[player.level as keyof typeof LEVEL_DESCRIPTIONS]}</p>
          <div className="level-stats">
            <div className="player-stats">
              <h3>Player Stats</h3>
              <div className="stat">Health: {player.health}</div>
              <div className="stat">Attack: {player.attack}</div>
              <div className="stat">Defense: {player.defense}</div>
              <div className="stat">Experience: {player.experience}</div>
              <div className="stat">Score: {player.score}</div>
              <div className="stat">Enemies Defeated: {player.enemiesDefeated}</div>
            </div>
          </div>
        </div>

        <div
          className="player"
          style={{
            left: `${player.position.x}px`,
            top: `${player.position.y}px`
          }}
        >
          🧑
        </div>

        {enemies.map((enemy, index) => (
          <div
            key={`${enemy.type}-${index}`}
            className="enemy"
            style={{
              left: `${enemy.position.x}px`,
              top: `${enemy.position.y}px`
            }}
          >
            {enemy.sprite}
          </div>
        ))}

        {obstacles.map((obstacle, index) => (
          <div
            key={`${obstacle.type}-${index}`}
            className="obstacle"
            style={{
              left: `${obstacle.position.x}px`,
              top: `${obstacle.position.y}px`
            }}
          >
            {obstacle.sprite}
          </div>
        ))}

        {isInCombat && (
          <div className="combat-ui">
            <div className="player-controls">
              <h3>Combat Controls</h3>
              <div className="combat-buttons">
                <button 
                  className="attack-button"
                  onClick={() => dispatch({ type: 'ATTACK_ENEMY' })}
                >
                  Attack (J)
                </button>
                <button 
                  className="defend-button"
                  onClick={() => dispatch({ type: 'DEFEND' })}
                >
                  Defend (L)
                </button>
                <button 
                  className="flee-button"
                  onClick={() => dispatch({ type: 'FLEE' })}
                >
                  Flee (K)
                </button>
              </div>
            </div>
          </div>
        )}

        {isGameOver && (
          <div className="game-over">
            <h2>Game Over!</h2>
            <div className="game-stats">
              <p>Final Score: {player.score}</p>
              <p>Enemies Defeated: {player.enemiesDefeated}</p>
              <p>Level Reached: {player.level}</p>
              <p>Total Experience: {player.experience}</p>
            </div>
            <div className="game-over-buttons">
              <button onClick={handleRestart}>Play Again</button>
              <button onClick={handleMainMenu}>Main Menu</button>
            </div>
          </div>
        )}

        {message && (
          <div className="message-display">
            {message.split('\n').map((line: string, i: number) => (
              <div key={i} className="message-line">{line}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiPlayerGame; 