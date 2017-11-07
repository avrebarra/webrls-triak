// src\components\App\test.spec.js

import React from 'react';
import ReactDOM from 'react-dom';
import App from './index.jsx';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});
