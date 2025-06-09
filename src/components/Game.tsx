import React, { useEffect, useRef, useState } from 'react';
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

  // Handle player movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state.isInCombat || state.isGameOver) return;

      const speed = 10;
      switch(e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          dispatch({ type: 'MOVE_PLAYER', payload: { x: 0, y: -speed } });
          break;
        case 's':
        case 'arrowdown':
          dispatch({ type: 'MOVE_PLAYER', payload: { x: 0, y: speed } });
          break;
        case 'a':
        case 'arrowleft':
          dispatch({ type: 'MOVE_PLAYER', payload: { x: -speed, y: 0 } });
          break;
        case 'd':
        case 'arrowright':
          dispatch({ type: 'MOVE_PLAYER', payload: { x: speed, y: 0 } });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, state.isInCombat, state.isGameOver]);

  return (
    <div className="game-container">
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
        {/* Player */}
        <div
          style={{
            position: 'absolute',
            left: state.player.position.x,
            top: state.player.position.y,
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

        {/* Combat UI */}
        {state.isInCombat && state.enemies.length > 0 && (
          <div className="combat-ui">
            <h2>Combat with {state.enemies[state.enemies.length - 1].name}</h2>
            <div className="combat-actions">
              <button onClick={() => dispatch({ type: 'ATTACK_ENEMY' })}>Attack</button>
              <button onClick={() => dispatch({ type: 'DEFEND' })}>Defend</button>
              <button onClick={() => dispatch({ type: 'FLEE' })}>Flee</button>
            </div>
          </div>
        )}

        {/* Game Over UI */}
        {state.isGameOver && (
          <div className="game-over">
            <h2>Game Over</h2>
            <button onClick={() => dispatch({ type: 'RESET_GAME' })}>Play Again</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game; 