import React, { useState } from 'react';
import AppRouter from 'components/Router';
import { authService } from 'fBase';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  return (
    <>
      <AppRouter isLoggedIn={isLoggedIn} />
      <footer>&copy; Sewitter {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;