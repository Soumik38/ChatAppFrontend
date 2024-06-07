import './App.css'
import Form from './pages/Form'
import Dashboard from './pages/Dashboard'
import {Route,Routes,Navigate} from 'react-router-dom'

const protectedRoutes=({children,auth=false})=>{
  const isLoggedIn=localStorage.getItem('user:token')!=null || false
  console.log(isLoggedIn)
  if(!isLoggedIn && auth){
    return <Navigate to={'/sign_in'}/>
  }
  else if(isLoggedIn && ['/sign_up','/sign_in'].includes(window.location.pathname)){
    return <Navigate to={'/'}/>
  }
  return children
}

function App() {
  return (
    <Routes>
      <Route path='/' element={<protectedRoutes><Dashboard/></protectedRoutes>}/>
      <Route path='/signin' element={<protectedRoutes auth={true}><Form isSignInPage={true}/></protectedRoutes>}/>
      <Route path='/signup' element={<protectedRoutes><Form isSignInPage={false}/></protectedRoutes>}/>
    </Routes>
  );
}

export default App;
