import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomeScreen.css';

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const menuOptions = [
    { id: 'start', label: 'Start Game', icon: '🎮' },
    { id: 'options', label: 'Options', icon: '⚙️' },
    { id: 'credits', label: 'Credits', icon: '👥' }
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating) return;

      switch (e.key) {
        case 'ArrowUp':
          setSelectedOption(prev => (prev > 0 ? prev - 1 : menuOptions.length - 1));
          break;
        case 'ArrowDown':
          setSelectedOption(prev => (prev < menuOptions.length - 1 ? prev + 1 : 0));
          break;
        case 'Enter':
          handleSelect();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedOption, isAnimating]);

  const handleSelect = () => {
    setIsAnimating(true);
    const selected = menuOptions[selectedOption];

    switch (selected.id) {
      case 'start':
        // Add Nintendo-style transition animation
        setTimeout(() => {
          navigate('/game');
        }, 500);
        break;
      case 'options':
        // Handle options
        break;
      case 'credits':
        // Handle credits
        break;
    }
  };

  return (
    <div className="home-screen crt">
      <div className="title-container">
        <h1 className="game-title">HackWarriors</h1>
        <p className="subtitle">The Hygiene Escape</p>
      </div>

      <div className="menu-container">
        {menuOptions.map((option, index) => (
          <div
            key={option.id}
            className={`menu-option ${selectedOption === index ? 'selected' : ''}`}
            onClick={() => {
              setSelectedOption(index);
              handleSelect();
            }}
          >
            <span className="option-icon">{option.icon}</span>
            <span className="option-label">{option.label}</span>
          </div>
        ))}
      </div>

      <div className="footer">
        <div className="controls-hint">
          Use ↑↓ to select, Enter to confirm
        </div>
      </div>

      {/* Decorative elements */}
      <div className="decorative-elements">
        <div className="bubble bubble-1">🧼</div>
        <div className="bubble bubble-2">🚿</div>
        <div className="bubble bubble-3">🧴</div>
        <div className="bubble bubble-4">🪥</div>
      </div>
    </div>
  );
};

export default HomeScreen; 