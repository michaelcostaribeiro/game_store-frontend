import { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Footer from './components/Footer.jsx'
import Login from './components/Login.jsx'
import { LoginContext } from './contexts/LoginContext.jsx'
import { Route, Routes } from 'react-router-dom'
import PlatformPage from './pages/PlatformPage.jsx'
import GameDetail from './pages/GameDetail.jsx'

function App() {
  const [storeTitle, setStoreTitle] = useState("Neo Gaming");
  const [loginScreen, setLoginScreen] = useState();
  
  return (
    <>
      <LoginContext.Provider value={{ loginScreen, setLoginScreen}}>

      <header className=' bg-primary'>
        <Navbar storeTitle={storeTitle} />
      </header>
      <main className='md:max-w-screen-sm xl:max-w-screen-xl'>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/:platform' element={<PlatformPage/>} />
            <Route path='/game/:id' element={<GameDetail/>} />
        </Routes>
      </main>
      <Footer/>
    </LoginContext.Provider>
    </>
  )
}

export default App
