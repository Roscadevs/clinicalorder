import React from 'react'; // React
import ReactDOM from 'react-dom/client'; // ReactDOM
import { BrowserRouter } from 'react-router-dom';
import App from './App'; // App component
import './index.css'; // Tailwind CSS

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
