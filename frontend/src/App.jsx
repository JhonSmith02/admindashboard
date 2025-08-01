import './App.css'
import { useState } from 'react'
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      {/* {!user
        ? <Login setUser={setUser} />
        : <div>Bienvenido, {user.name}</div>
      } */}

      <Dashboard/>
    </>
  );
}
