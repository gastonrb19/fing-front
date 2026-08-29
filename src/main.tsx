import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
import App from './App.tsx'
import Home from './components/HomePage/Home.tsx';
import NewMovement from './components/NewMovement/NewMovement.tsx';
import Movements from './components/Movements/Movements.tsx';
import Movement from './components/Movement/Movement.tsx';
import Position from './components/Position/Position.tsx';
import BackButton from './components/Shared/BackButton.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <BackButton />
      <Routes>
	   <Route path="/login" element={<App/>}/>	
	   <Route path="/movements" element={<Movements/>}/>	
	   <Route path="/movement/:id" element={<Movement/>}/>	
	   <Route path="/movement/:id/position/:id_position" element={<Position/>}/>	
	   <Route path="/new-movement" element={<NewMovement/>}/>	
	   <Route path="/" element={<Home/>}/>	
    	</Routes>
    </BrowserRouter>	
  </StrictMode>,
)
