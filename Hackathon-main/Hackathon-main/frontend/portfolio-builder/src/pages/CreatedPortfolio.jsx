import React from 'react';
import { useLocation } from 'react-router-dom';
import Portfolio from './Portfolio';

const CreatedPortfolio = () => {
  const location = useLocation();
  const templateId = location.state?.templateId || 1;

  return (
    <div className="container">
      <div className="section">
        <Portfolio templateId={templateId} />
      </div>
    </div>
  );
};

export default CreatedPortfolio;