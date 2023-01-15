import React from 'react';
import { initialBag } from './features/bag';

function App() {
  return (
    <div className="text-2xl">
     {initialBag().length}
    </div>
  );
}

export default App;
