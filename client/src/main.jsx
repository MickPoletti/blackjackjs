import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import App from './pages/App';
import Home from './pages/Home';
import Leaderboard from './pages/Leaderboard';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Home/>}/>
          <Route path="app" element={<App/>}/>
          <Route path="leaderboard" element={<Leaderboard/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
