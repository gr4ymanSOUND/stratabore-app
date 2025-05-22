import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './components/App';

import './style/app.css';
import './style/header.css';
import './style/database.css';
import './style/calendar.css';
import './style/jobForm.css';
import './style/login.css';
import './style/adminTools.css';
import './style/mapView.css';
import './style/selfForm.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <App />
);