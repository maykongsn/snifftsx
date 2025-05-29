import './global.css';
import { createRoot } from 'react-dom/client';
import { App } from './app';

const container = document.getElementById('app');

if (container) {
  createRoot(container).render(<App />);
} else {
  console.error('app id not found.');
}
