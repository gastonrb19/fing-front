import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
import App from './App.tsx'
import Home from './components/HomePage/Home.tsx';
import Index from './components/IndexPage/Index.tsx';
import Transaction from './components/Transaction/Transaction.tsx';
import Movements from './components/Movements/Movements.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>	
    	<Routes>
	   <Route path="/login" element={<App/>}/>	
	   <Route path="/movements" element={<Movements/>}/>	
	   <Route path="/transactions" element={<Transaction/>}/>	
	   <Route path="/home" element={<Home/>}/>	
	   <Route index element={<Index/>}/>
    	</Routes>
    </BrowserRouter>	
  </StrictMode>,
)
