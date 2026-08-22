import React from 'react'; // React
import ReactDOM from 'react-dom/client'; // ReactDOM
import { BrowserRouter } from 'react-router-dom';
import App from './App'; // App component
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css'; // Tailwind CSS

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
