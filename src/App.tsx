import React from 'react';
import { GameProvider } from './context/GameContext';
import Game from './components/Game';
import './styles/index.css';

function App() {
  console.log('App component rendering');
  
  return (
    <GameProvider>
      <div className="app">
        <header>
          <h1>HackWarriors: The Hygiene Escape</h1>
          <p>Navigate through San Francisco while avoiding hygiene products!</p>
        </header>
        <main>
          <Game />
        </main>
        <footer>
          <p>Use WASD or Arrow Keys to move around. Press Space to interact with NPCs and items.</p>
          <p>Battle wild creatures to gain experience and level up. Visit different locations in San Francisco!</p>
        </footer>
      </div>
    </GameProvider>
  );
}

export default App; 