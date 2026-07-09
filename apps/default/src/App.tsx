import React from 'react';
import { FullScreenWhatsApp } from './components/FullScreenWhatsApp';

const App: React.FC = () => {
  return (
    <FullScreenWhatsApp 
      isOpen={true} 
      onClose={() => {}} 
    />
  );
};

export default App;