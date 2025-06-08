import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import Game from './components/Game';
import HomeScreen from './components/HomeScreen';
import NotFound from './components/NotFound';
import './styles/App.css';

function App() {
  return (
    <Router>
      <GameProvider>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/game" element={<Game />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </GameProvider>
    </Router>
  );
}

export default App; 