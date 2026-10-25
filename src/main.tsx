import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import './utils/api.ts'
import './index.css'
import App from './App.tsx'
import Home from './components/HomePage/Home.tsx';
import NewMovement from './components/NewMovement/NewMovement.tsx';
import Movements from './components/Movements/Movements.tsx';
import Movement from './components/Movement/Movement.tsx';
import Position from './components/Position/Position.tsx';
import BackButton from './components/Shared/BackButton.tsx';
import Friendship from './components/Friendship/Friendship.tsx';
import Category from './components/Category/Category.tsx';
import Subcategory from './components/Subcategory/Subcategory.tsx';
import Income from './components/Income/Income.tsx';
import CategoryIncome from './components/CategoryIncome/CategoryIncome.tsx';
import Menu from './components/Menu.tsx';
import ProtectedRoute from './components/Shared/ProtectedRoute.tsx';
import { AuthProvider } from './context/AuthContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <BackButton />
        <Menu />
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<App />} />

          {/* Rutas privadas protegidas (requieren autenticación) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/movements" element={<Movements />} />
            <Route path="/movement/:id" element={<Movement />} />
            <Route path="/movement/:id/position/:id_position" element={<Position />} />
            <Route path="/new-movement" element={<NewMovement />} />
            <Route path="/income" element={<Income />} />
            <Route path="/income/:id" element={<Income />} />
            <Route path="/category-income" element={<CategoryIncome />} />
            <Route path="/friendships" element={<Friendship />} />
            <Route path="/category" element={<Category />} />
            <Route path="/category/:id_categoria/subcategory" element={<Subcategory />} />
            <Route path="/category/:id_categoria/subcategory/:id_subcategory" element={<Subcategory />} />
          </Route>

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
