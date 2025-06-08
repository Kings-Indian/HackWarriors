import React, { useEffect, useRef, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { getBackgroundImage } from '../utils/backgroundUtils';
import { Location, SAN_FRANCISCO_LOCATIONS } from '../types/game';
import '../styles/Game.css';

const LEVEL_DESCRIPTIONS = {
  1: "Welcome to San Francisco! Explore the city and defeat enemies to gain XP.",
  2: "The city is getting more dangerous. Watch out for stronger enemies!",
  3: "You've reached the final level. Defeat the boss to win!"
} as const;

const SinglePlayerGame: React.FC = () => {
  const { state, dispatch } = useGame();
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const backgroundIntervalRef = useRef<NodeJS.Timeout>();

  // Handle background changes
  useEffect(() => {
    let currentIndex = state.currentLocation;

    const changeBackground = () => {
      currentIndex = (currentIndex + 1) % SAN_FRANCISCO_LOCATIONS.length;
      const location = SAN_FRANCISCO_LOCATIONS[currentIndex];
      dispatch({ type: 'SET_MESSAGE', payload: `Entering ${location.name}...` });
    };

    backgroundIntervalRef.current = setInterval(changeBackground, 10000);
    changeBackground();

    return () => {
      if (backgroundIntervalRef.current) {
        clearInterval(backgroundIntervalRef.current);
      }
    };
  }, [state.currentLocation, dispatch]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (state.isInCombat || state.isGameOver) return;

    const speed = 5;
    const movePlayer = (x: number, y: number) => {
      const newPosition = {
        x: Math.max(0, Math.min(window.innerWidth - 50, state.player.position.x + x)),
        y: Math.max(0, Math.min(window.innerHeight - 50, state.player.position.y + y))
      };

      dispatch({
        type: 'MOVE_PLAYER',
        payload: { x, y }
      });
    };

    // Player controls (Arrow keys)
    switch (event.key) {
      case 'ArrowUp':
        movePlayer(0, -speed);
        break;
      case 'ArrowDown':
        movePlayer(0, speed);
        break;
      case 'ArrowLeft':
        movePlayer(-speed, 0);
        break;
      case 'ArrowRight':
        movePlayer(speed, 0);
        break;
    }

    // Combat controls
    if (state.isInCombat) {
      switch (event.key.toLowerCase()) {
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
  }, [state.isInCombat, state.isGameOver, state.player.position, dispatch]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="game-container">
      <div 
        ref={gameAreaRef}
        className="game-background"
        style={{
          backgroundImage: `url(${getBackgroundImage(SAN_FRANCISCO_LOCATIONS[state.currentLocation])})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Player */}
        <div
          className="player"
          style={{
            left: `${state.player.position.x}px`,
            top: `${state.player.position.y}px`
          }}
        >
          {state.player.sprite}
        </div>

        {/* Enemies */}
        {state.enemies.map((enemy, index) => (
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

        {/* Obstacles */}
        {state.obstacles.map((obstacle, index) => (
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

        {/* Game UI */}
        <div className="level-info">
          <h2>Level {state.player.level}</h2>
          <p>{LEVEL_DESCRIPTIONS[state.player.level as keyof typeof LEVEL_DESCRIPTIONS]}</p>
          <div className="player-stats">
            <h3>Player Stats</h3>
            <div className="stat">Level: {state.player.level}</div>
            <div className="stat">XP: {state.player.xp}</div>
            <div className="stat">Health: {state.player.health}</div>
            <div className="stat">Attack: {state.player.attack}</div>
            <div className="stat">Defense: {state.player.defense}</div>
            <div className="stat">Score: {state.player.score}</div>
            <div className="stat">Enemies Defeated: {state.player.enemiesDefeated}</div>
          </div>
        </div>

        {/* Combat UI */}
        {state.isInCombat && (
          <div className="combat-ui">
            <div className="player-controls">
              <h3>Combat Controls</h3>
              <button onClick={() => dispatch({ type: 'ATTACK_ENEMY' })}>Attack (J)</button>
              <button onClick={() => dispatch({ type: 'DEFEND' })}>Defend (L)</button>
              <button onClick={() => dispatch({ type: 'FLEE' })}>Flee (K)</button>
            </div>
          </div>
        )}

        {/* Game Over */}
        {state.isGameOver && (
          <div className="game-over">
            <h2>Game Over!</h2>
            <p>Final Score: {state.player.score}</p>
            <p>Enemies Defeated: {state.player.enemiesDefeated}</p>
            <button onClick={() => dispatch({ type: 'RESET_GAME' })}>Play Again</button>
          </div>
        )}

        {/* Message Display */}
        {state.message && (
          <div className="message-display">
            {state.message.split('\n').map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SinglePlayerGame; 