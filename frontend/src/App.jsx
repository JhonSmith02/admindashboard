
import { useState, useEffect} from 'react'

import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Userview from './pages/UserView.jsx'

export default function App() {
  const [user, setUser] = useState(null);

  useEffect( () => {
    //Revisamos si existe una sesion guardada
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  if (!user){
    return <Login setUser={ setUser }/>
  }

  if (user.role === 'admin'){
    return <Dashboard user={user} setUser={setUser} />;
  }
  
  return <Userview user={user} setUser={setUser}/>;
}
