import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import PersonalPortfolio from './components/PersonalPortfolio';
import AcademicPortfolio from './components/AcademicPortfolio';
import ProfessionalPortfolio from './components/ProfessionalPortfolio';
import './App.css';

function App() {
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'portfolios', 'about', 'contact'

  const handleSelectPortfolio = (portfolioId) => {
    setSelectedPortfolio(portfolioId);
    setCurrentView('portfolios');
  };

  const handleBackToLanding = () => {
    setSelectedPortfolio(null);
    setCurrentView('home');
  };

  const handleNavigation = (view) => {
    setCurrentView(view);
    if (view === 'home') {
      setSelectedPortfolio(null);
    }
  };

  const renderPortfolio = () => {
    switch (selectedPortfolio) {
      case 'personal':
        return <PersonalPortfolio onBack={handleBackToLanding} />;
      case 'academic':
        return <AcademicPortfolio onBack={handleBackToLanding} />;
      case 'professional':
        return <ProfessionalPortfolio onBack={handleBackToLanding} />;
      default:
        return <LandingPage 
          onSelectPortfolio={handleSelectPortfolio} 
          currentView={currentView}
          onNavigate={handleNavigation}
        />;
    }
  };

  return (
    <div className="App">
      {renderPortfolio()}
    </div>
  );
}

export default App;
