import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'
import { BrowserRouter, Route, Routes } from 'react-router';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Admin from './pages/Admin.jsx';
import ItemAdmin from './pages/ItemAdmin.jsx';
import AdminHome from './pages/AdminHome.jsx';
import Movimientos from './pages/Movimientos.jsx';
import PokemonAdmin from './pages/PokemonAdmin.jsx';
import EquiposAdmin from './pages/equiposAdmin.jsx';
import EquipoEdit from './pages/EquipoEdit.jsx';
import PokemonDetails from './pages/PokemonDetails.jsx';
import { AppProvider } from './context/AppContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/item" element={<ItemAdmin />} />
          <Route path="/AdminHome" element={<AdminHome />} />
          <Route path="/movimientos" element={<Movimientos />} />
          <Route path="/pokemones" element={<PokemonAdmin />} />
          <Route path="/equipos" element={<EquiposAdmin />} />
          <Route path="/equipos/:id" element={<EquipoEdit />} />
          <Route path="/equipos/:id/pokemon/:pokemonId" element={<PokemonDetails />} />
          <Route path="/pokemonEquipos/:id/details" element={<PokemonDetails />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  </StrictMode>,
)
