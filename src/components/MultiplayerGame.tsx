import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useGame } from '../context/GameContext';
import { useNavigate } from 'react-router-dom';
import { getBackgroundImage } from '../utils/backgroundUtils';
import { GameLocation, SAN_FRANCISCO_LOCATIONS, Player, Enemy } from '../types/game';
import '../styles/Game.css';

const LEVEL_DESCRIPTIONS = {
  1: "Welcome to San Francisco! Explore the city and defeat enemies to gain XP.",
  2: "The city is getting more dangerous. Watch out for stronger enemies!",
  3: "You've reached the final level. Defeat the boss to win!"
} as const;

const MultiPlayerGame: React.FC = () => {
  const { state, dispatch } = useGame();
  const { playerA, playerB, enemies, isInCombat, isGameOver, currentLocation, message } = state;
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

    // Player A controls (Arrow keys)
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      const speed = playerA.speed;
      let dx = 0;
      let dy = 0;

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

      dispatch({ type: 'MOVE_PLAYER_A', payload: { x: dx, y: dy } });
    }

    // Player B controls (WASD)
    if (['w', 'a', 's', 'd'].includes(e.key.toLowerCase())) {
      const speed = playerB.speed;
      let dx = 0;
      let dy = 0;

      switch (e.key.toLowerCase()) {
        case 'w':
          dy = -speed;
          break;
        case 's':
          dy = speed;
          break;
        case 'a':
          dx = -speed;
          break;
        case 'd':
          dx = speed;
          break;
      }

      dispatch({ type: 'MOVE_PLAYER_B', payload: { x: dx, y: dy } });
    }

    // Combat controls
    if (isInCombat) {
      switch (e.key.toLowerCase()) {
        case 'j':
          dispatch({ type: 'ATTACK_ENEMY', payload: state.activePlayer || 'A' });
          break;
        case 'l':
          dispatch({ type: 'DEFEND', payload: state.activePlayer || 'A' });
          break;
        case 'k':
          dispatch({ type: 'FLEE', payload: state.activePlayer || 'A' });
          break;
      }
    }
  }, [isGameOver, isInCombat, dispatch, playerA.speed, playerB.speed, state.activePlayer]);

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
          <h2>Level {playerA.level}</h2>
          <p>{LEVEL_DESCRIPTIONS[playerA.level as keyof typeof LEVEL_DESCRIPTIONS]}</p>
          <div className="level-stats">
            <div className="player-stats">
              <h3>Player A Stats</h3>
              <div className="stat">Health: {playerA.health}</div>
              <div className="stat">Attack: {playerA.attack}</div>
              <div className="stat">Defense: {playerA.defense}</div>
              <div className="stat">Experience: {playerA.experience}</div>
              <div className="stat">Score: {playerA.score}</div>
              <div className="stat">Enemies Defeated: {playerA.enemiesDefeated}</div>
            </div>
            <div className="player-stats">
              <h3>Player B Stats</h3>
              <div className="stat">Health: {playerB.health}</div>
              <div className="stat">Attack: {playerB.attack}</div>
              <div className="stat">Defense: {playerB.defense}</div>
              <div className="stat">Experience: {playerB.experience}</div>
              <div className="stat">Score: {playerB.score}</div>
              <div className="stat">Enemies Defeated: {playerB.enemiesDefeated}</div>
            </div>
          </div>
        </div>

        {/* Player A */}
        <div
          className="player player-a"
          style={{
            left: `${playerA.position.x}px`,
            top: `${playerA.position.y}px`
          }}
        >
          <img src="./src/assets/images/player-a.png" alt="Player A" className="player-sprite" />
        </div>

        {/* Player B */}
        <div
          className="player player-b"
          style={{
            left: `${playerB.position.x}px`,
            top: `${playerB.position.y}px`
          }}
        >
          <img src="./src/assets/images/player-b.png" alt="Player B" className="player-sprite" />
        </div>

        {enemies.map((enemy, index) => (
          <div
            key={`enemy-${index}`}
            className="enemy"
            style={{
              left: `${enemy.position.x}px`,
              top: `${enemy.position.y}px`
            }}
          >
            <img src={enemy.sprite} alt={enemy.name} className="enemy-sprite" />
          </div>
        ))}

        {/* Combat UI */}
        {isInCombat && (
          <div className="combat-ui">
            <div className="player-controls">
              <h3>Combat Controls</h3>
              <button onClick={() => dispatch({ type: 'ATTACK_ENEMY', payload: state.activePlayer || 'A' })}>Attack (J)</button>
              <button onClick={() => dispatch({ type: 'DEFEND', payload: state.activePlayer || 'A' })}>Defend (L)</button>
              <button onClick={() => dispatch({ type: 'FLEE', payload: state.activePlayer || 'A' })}>Flee (K)</button>
            </div>
          </div>
        )}

        {/* Game Over */}
        {isGameOver && (
          <div className="game-over">
            <h2>Game Over!</h2>
            <div className="final-scores">
              <div className="player-score">
                <h3>Player A</h3>
                <p>Score: {playerA.score}</p>
                <p>Enemies Defeated: {playerA.enemiesDefeated}</p>
              </div>
              <div className="player-score">
                <h3>Player B</h3>
                <p>Score: {playerB.score}</p>
                <p>Enemies Defeated: {playerB.enemiesDefeated}</p>
              </div>
            </div>
            <button onClick={handleRestart}>Play Again</button>
            <button onClick={handleMainMenu}>Main Menu</button>
          </div>
        )}

        {/* Message Display */}
        {message && (
          <div className="message-display">
            {message.split('\n').map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiPlayerGame; 