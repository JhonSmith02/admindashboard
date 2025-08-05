import './App.css'
import { useState } from 'react'
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import MiPrimerBoton from './components/Boton.jsx';
import Galeria from './components/Galeria.jsx';
import Board from './pages/Tresenlinea.jsx';

export default function App() {
  // const [user, setUser] = useState(null);

  return (
    <div>
      {/* {!user
        ? <Login setUser={setUser} />
        : <div>Bienvenido, {user.name}</div>
      } */}
      {/* <Dashboard/> */}
      <Board/>
    </div>
  );
}
