import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { Player, Enemy, Obstacle } from '../types/game';
import { SAN_FRANCISCO_LOCATIONS } from '../types/game';
import { locationImages } from '../assets/locations';
import Combat from './Combat';

type LocationKey = 'fishermans-wharf' | 'pier-39' | 'chinatown' | 'golden-gate-park' | 'haight-ashbury';

const Game: React.FC = () => {
  const { state, dispatch } = useGame();
  const { player, obstacles, score, level, isGameOver, isInCombat, currentEnemy, currentLocation } = state;
  const [randomBackground, setRandomBackground] = useState<LocationKey>('fishermans-wharf');

  // Function to get random background
  const getRandomBackground = () => {
    const locations: LocationKey[] = [
      'fishermans-wharf',
      'pier-39',
      'chinatown',
      'golden-gate-park',
      'haight-ashbury'
    ];
    const randomIndex = Math.floor(Math.random() * locations.length);
    return locations[randomIndex];
  };

  // Change background every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRandomBackground(getRandomBackground());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isInCombat) return;

      const moveDistance = 10;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          dispatch({ type: 'MOVE_PLAYER', payload: { x: 0, y: -moveDistance } });
          break;
        case 'ArrowDown':
        case 's':
          dispatch({ type: 'MOVE_PLAYER', payload: { x: 0, y: moveDistance } });
          break;
        case 'ArrowLeft':
        case 'a':
          dispatch({ type: 'MOVE_PLAYER', payload: { x: -moveDistance, y: 0 } });
          break;
        case 'ArrowRight':
        case 'd':
          dispatch({ type: 'MOVE_PLAYER', payload: { x: moveDistance, y: 0 } });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [dispatch, isInCombat]);

  const currentLocationData = SAN_FRANCISCO_LOCATIONS.find(
    loc => loc.name.toLowerCase().replace(/\s+/g, '-') === currentLocation
  );

  // Debug logging
  useEffect(() => {
    console.log('Current Location:', currentLocation);
    console.log('Location Data:', currentLocationData);
    console.log('Location Images:', locationImages);
    console.log('Background Image URL:', locationImages[randomBackground]);
    console.log('Obstacles:', obstacles);
    console.log('Player Position:', player.position);
  }, [currentLocation, currentLocationData, obstacles, player.position, randomBackground]);

  const formatLocationName = (name: string) => {
    return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (isGameOver) {
    return (
      <div className="game-over">
        <h2>Game Over!</h2>
        <p>Final Score: {score}</p>
        <button onClick={() => dispatch({ type: 'RESET_GAME' })}>Play Again</button>
      </div>
    );
  }

  const backgroundImageUrl = locationImages[randomBackground];
  console.log('Rendering with background:', backgroundImageUrl);

  return (
    <div className="game-container">
      <div 
        className="game-area"
        style={{
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          width: '800px',
          height: '600px',
          border: '2px solid #333',
          overflow: 'hidden',
          transition: 'background-image 1s ease-in-out'
        }}
      >
        <div
          className="player"
          style={{
            position: 'absolute',
            left: `${player.position.x}px`,
            top: `${player.position.y}px`,
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            zIndex: 2
          }}
        >
          🧼
        </div>
        {obstacles.map((obstacle, index) => (
          <div
            key={index}
            className={`obstacle ${obstacle.type}`}
            style={{
              position: 'absolute',
              left: `${obstacle.position.x}px`,
              top: `${obstacle.position.y}px`,
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              zIndex: 1
            }}
          >
            {obstacle.type === 'enemy' ? (obstacle as Enemy).sprite : obstacle.sprite || '🚧'}
          </div>
        ))}
      </div>

      {isInCombat && currentEnemy && (
        <Combat
          player={player}
          enemy={currentEnemy}
          onAttack={() => dispatch({ type: 'ATTACK_ENEMY' })}
          onDefend={() => dispatch({ type: 'DEFEND' })}
          onRun={() => dispatch({ type: 'RUN_FROM_COMBAT' })}
        />
      )}

      <div className="game-stats">
        <div className="stat">
          <span>Location:</span>
          <span>{formatLocationName(currentLocation)}</span>
        </div>
        <div className="stat">
          <span>Score:</span>
          <span>{score}</span>
        </div>
        <div className="stat">
          <span>Level:</span>
          <span>{level}</span>
        </div>
        <div className="stat">
          <span>Health:</span>
          <div className="health-bar">
            <div
              className="health-fill"
              style={{ width: `${(player.health / 100) * 100}%` }}
            />
          </div>
        </div>
        <div className="stat">
          <span>Experience:</span>
          <div className="experience-bar">
            <div
              className="experience-fill"
              style={{ width: `${(player.experience / 100) * 100}%` }}
            />
          </div>
        </div>
        <div className="stat">
          <span>Enemies Defeated:</span>
          <span>{player.enemiesDefeated}</span>
        </div>
      </div>
    </div>
  );
};

export default Game; 