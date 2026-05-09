import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers/index.js';
import thunk from 'redux-thunk';

export const store = createStore(rootReducer,applyMiddleware(thunk));

const root = createRoot(document.getElementById('root'));
root.render(<Provider store={store}><App /></Provider>);
