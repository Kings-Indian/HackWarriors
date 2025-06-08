import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NotFound.css';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Add animation class after component mounts
    setIsAnimating(true);
  }, []);

  const handleReturnHome = () => {
    setIsAnimating(false);
    setTimeout(() => {
      navigate('/');
    }, 500);
  };

  return (
    <div className={`not-found crt ${isAnimating ? 'animate' : ''}`}>
      <div className="error-container">
        <h1 className="error-code">404</h1>
        <div className="error-message">Page Not Found</div>
        <p className="error-description">
          Oops! Looks like you've wandered into the wrong shower.
        </p>
        <button 
          className="return-button"
          onClick={handleReturnHome}
        >
          Return to Home
        </button>
      </div>
      
      <div className="decorative-elements">
        <div className="bubble bubble-1">🎮</div>
        <div className="bubble bubble-2">🎲</div>
        <div className="bubble bubble-3">🎯</div>
        <div className="bubble bubble-4">🎪</div>
      </div>
    </div>
  );
};

export default NotFound; 