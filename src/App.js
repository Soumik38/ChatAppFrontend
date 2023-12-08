import './App.css'
import Form from './modules/Form'
import Dashboard from './modules/Dashboard'
import {Route,Routes,Navigate} from 'react-router-dom'

const protectedRoutes=({children,auth=false})=>{
  const isLoggedIn=localStorage.getItem('user:token')!=null || false
  console.log(isLoggedIn)
  if(!isLoggedIn && auth){
    return <Navigate to={'/users/sign_in'}/>
  }
  else if(isLoggedIn && ['/users/sign_up','/users/sign_in'].includes(window.location.pathname)){
    return <Navigate to={'/'}/>
  }
  return children
}

function App() {
  return (
    <Routes>
      <Route path='/dashboard' element={<protectedRoutes><Dashboard/></protectedRoutes>}/>
      <Route path='/users/sign_in' element={<protectedRoutes auth={true}><Form isSignInPage={true}/></protectedRoutes>}/>
      <Route path='/users/sign_up' element={<protectedRoutes><Form isSignInPage={false}/></protectedRoutes>}/>
    </Routes>
  );
}

export default App;
