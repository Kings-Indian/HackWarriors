import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { useNavigate } from 'react-router-dom';
import { SAN_FRANCISCO_LOCATIONS } from '../types/game';
import '../styles/Game.css';

const Game: React.FC = () => {
  const { state, dispatch } = useGame();
  const [background, setBackground] = useState<string>('');

  useEffect(() => {
    const getRandomBackground = () => {
      const location = SAN_FRANCISCO_LOCATIONS[state.currentLocation];
      return location.background;
    };

    setBackground(getRandomBackground());
    const interval = setInterval(() => {
      setBackground(getRandomBackground());
    }, 5000);

    return () => clearInterval(interval);
  }, [state.currentLocation]);

  useEffect(() => {
    console.log('Game state updated:', state);
  }, [state]);

  // Handle player movement for both players
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state.isInCombat || state.isGameOver) return;

      const speed = 10;

      // Player A controls (Arrow keys)
      switch(e.key.toLowerCase()) {
        case 'arrowup':
          dispatch({ type: 'MOVE_PLAYER_A', payload: { x: 0, y: -speed } });
          break;
        case 'arrowdown':
          dispatch({ type: 'MOVE_PLAYER_A', payload: { x: 0, y: speed } });
          break;
        case 'arrowleft':
          dispatch({ type: 'MOVE_PLAYER_A', payload: { x: -speed, y: 0 } });
          break;
        case 'arrowright':
          dispatch({ type: 'MOVE_PLAYER_A', payload: { x: speed, y: 0 } });
          break;
        case 'enter': // Player A attack/interact
          if (!state.isInCombat) {
            const nearbyEnemy = state.enemies.find(enemy => {
              const dx = enemy.position.x - state.playerA.position.x;
              const dy = enemy.position.y - state.playerA.position.y;
              return Math.sqrt(dx * dx + dy * dy) < 100;
            });
            if (nearbyEnemy) {
              dispatch({ type: 'START_COMBAT', payload: { enemy: nearbyEnemy, player: 'A' } });
            }
          }
          break;
      }

      // Player B controls (WASD)
      switch(e.key.toLowerCase()) {
        case 'w':
          dispatch({ type: 'MOVE_PLAYER_B', payload: { x: 0, y: -speed } });
          break;
        case 's':
          dispatch({ type: 'MOVE_PLAYER_B', payload: { x: 0, y: speed } });
          break;
        case 'a':
          dispatch({ type: 'MOVE_PLAYER_B', payload: { x: -speed, y: 0 } });
          break;
        case 'd':
          dispatch({ type: 'MOVE_PLAYER_B', payload: { x: speed, y: 0 } });
          break;
        case ' ': // Player B attack/interact (spacebar)
          if (!state.isInCombat) {
            const nearbyEnemy = state.enemies.find(enemy => {
              const dx = enemy.position.x - state.playerB.position.x;
              const dy = enemy.position.y - state.playerB.position.y;
              return Math.sqrt(dx * dx + dy * dy) < 100;
            });
            if (nearbyEnemy) {
              dispatch({ type: 'START_COMBAT', payload: { enemy: nearbyEnemy, player: 'B' } });
            }
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.isInCombat, state.isGameOver, state.enemies, state.playerA.position, state.playerB.position, dispatch]);

  // Handle combat actions for both players
  useEffect(() => {
    const handleCombatKeyDown = (e: KeyboardEvent) => {
      if (!state.isInCombat) return;

      // Player A combat controls (Arrow keys + Enter)
      if (e.key === 'Enter' && state.activePlayer === 'A') {
        dispatch({ type: 'ATTACK_ENEMY', payload: 'A' });
      }

      // Player B combat controls (WASD + Space)
      if (e.key === ' ' && state.activePlayer === 'B') {
        dispatch({ type: 'ATTACK_ENEMY', payload: 'B' });
      }

      // Both players can flee with Escape
      if (e.key === 'Escape') {
        dispatch({ type: 'FLEE', payload: state.activePlayer || 'A' });
      }
    };

    window.addEventListener('keydown', handleCombatKeyDown);
    return () => window.removeEventListener('keydown', handleCombatKeyDown);
  }, [state.isInCombat, state.activePlayer, dispatch]);

  return (
    <>
      <div className="deep-background"></div>
      <div className="game-container crt">
        <div 
          className="game-background"
          style={{
            backgroundImage: `url(${background})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            height: '100%',
            position: 'relative'
          }}
        >
          {/* Player A */}
          <div
            className="player player-a"
            style={{
              position: 'absolute',
              left: state.playerA.position.x,
              top: state.playerA.position.y,
              width: '50px',
              height: '50px',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              transition: 'all 0.1s ease-in-out'
            }}
          >
            👤
          </div>

          {/* Player B */}
          <div
            className="player player-b"
            style={{
              position: 'absolute',
              left: state.playerB.position.x,
              top: state.playerB.position.y,
              width: '50px',
              height: '50px',
              backgroundColor: 'rgba(0, 255, 255, 0.8)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              transition: 'all 0.1s ease-in-out'
            }}
          >
            👤
          </div>

          {/* Enemies */}
          {state.enemies.map((enemy, index) => (
            <div
              key={`enemy-${index}`}
              style={{
                position: 'absolute',
                left: enemy.position.x,
                top: enemy.position.y,
                width: '50px',
                height: '50px',
                backgroundColor: 'rgba(255, 0, 0, 0.8)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                transition: 'all 0.1s ease-in-out'
              }}
            >
              {enemy.sprite}
            </div>
          ))}

          {/* Obstacles */}
          {state.obstacles.map((obstacle, index) => (
            <div
              key={`obstacle-${index}`}
              style={{
                position: 'absolute',
                left: obstacle.position.x,
                top: obstacle.position.y,
                width: '50px',
                height: '50px',
                backgroundColor: 'rgba(255, 165, 0, 0.8)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                transition: 'all 0.1s ease-in-out'
              }}
            >
              {obstacle.sprite}
            </div>
          ))}

          {/* Player Stats */}
          <div className="player-stats">
            <div className="player-a-stats">
              <h3>Player A (Arrows + Enter)</h3>
              <div>Health: {state.playerA.health}</div>
              <div>Score: {state.playerA.score}</div>
              <div>Enemies Defeated: {state.playerA.enemiesDefeated}</div>
            </div>
            <div className="player-b-stats">
              <h3>Player B (WASD + Space)</h3>
              <div>Health: {state.playerB.health}</div>
              <div>Score: {state.playerB.score}</div>
              <div>Enemies Defeated: {state.playerB.enemiesDefeated}</div>
            </div>
          </div>

          {/* Combat UI */}
          {state.isInCombat && state.enemies.length > 0 && (
            <div className="combat-ui">
              <h2>Combat with {state.enemies[state.enemies.length - 1].name}</h2>
              <div className="combat-actions">
                <div className="player-a-controls">
                  <h3>Player A Controls:</h3>
                  <p>Press Enter to Attack</p>
                </div>
                <div className="player-b-controls">
                  <h3>Player B Controls:</h3>
                  <p>Press Space to Attack</p>
                </div>
                <p className="flee-controls">Press Escape to Flee</p>
              </div>
            </div>
          )}

          {/* Game Over UI */}
          {state.isGameOver && (
            <div className="game-over">
              <h2>Game Over</h2>
              <div className="final-scores">
                <div>Player A Score: {state.playerA.score}</div>
                <div>Player B Score: {state.playerB.score}</div>
              </div>
              <button onClick={() => dispatch({ type: 'RESET_GAME' })}>Play Again</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Game; 