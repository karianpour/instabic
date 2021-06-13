import React from 'react';
import './App.css';
import Home from './pages/Home';
import ImageFilter from './pages/ImageFilter';

function App() {
  const [started, setStarted] = React.useState(false);

  const handleStart = () => {
    setStarted(true);
  }

  const handleClose = () => {
    setStarted(false);
  }

  return (
    <div className="App flex-col">
      {!started && <Home handleStart={handleStart}/>}
      {started && <ImageFilter onClose={handleClose}/>}
    </div>
  );
}

export default App;
