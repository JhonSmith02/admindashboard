import './App.css'
import { useState } from 'react'
import Userview from './pages/UserView.jsx'

export default function App() {
  // const [user, setUser] = useState(null);

  return (
    <div>
      {/* {!user
        ? <Login setUser={setUser} />
        : <div>Bienvenido, {user.name}</div>
      } */}
      {/* <Dashboard/> */}
      <Userview/>
      {/* <Board/> */}
    </div>
  );
}
