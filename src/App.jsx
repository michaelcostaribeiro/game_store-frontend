import { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Footer from './components/Footer.jsx'
import Login from './components/Login.jsx'
import { LoginContext } from './contexts/LoginContext.jsx'
import { Route, Routes } from 'react-router-dom'
import PlatformPage from './pages/PlatformPage.jsx'
import GameDetail from './pages/GameDetail.jsx'
import { url } from './shared.jsx'
import Cart from './pages/Cart.jsx'
import Search from './pages/Search.jsx'
import Checkout from './pages/Checkout.jsx'
import CheckoutResult from './pages/CheckoutResult.jsx'
import NotFound from './pages/NotFound.jsx'

function App() {
  const [storeTitle, setStoreTitle] = useState("Neo Gaming");
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));

  async function fetchRefresh() {
    const response = await fetch(`${url}api/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh: localStorage.getItem('refresh'),
      }),
    })
    const data = await response.json();
    localStorage.setItem('token', data.access)
    localStorage.setItem('refresh', data.refresh)
  }

  useEffect(() => {
    const second = 1000
    const minute = second * 60
    setInterval(() => {
      if (localStorage.getItem('refresh')) {
        fetchRefresh()
        setLoggedIn(true)
      }
    }, minute * 60)
  }, [])

  return (
    <div className='flex flex-col min-h-screen'>
      <LoginContext.Provider value={[loggedIn, setLoggedIn]}>
        

        <header className=' bg-primary'>
          <Navbar storeTitle={storeTitle} />
        </header>
        <main className='mt-4 flex-1 flex flex-col'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='platform/:platform' element={<PlatformPage />} />
            <Route path='/game/:id' element={<GameDetail />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/search' element={<Search/>}/>
            <Route path='/checkout' element={<Checkout/>}  />
            <Route path='/sucesso' element={<CheckoutResult result={'sucesso'}/>}/>
            <Route path='/falha' element={<CheckoutResult result={'falha'} />}/>
            <Route path='/pendente' element={<CheckoutResult result={'pendente'} />}/>
            <Route path='*' element={<NotFound/>}/>
             
          </Routes>
        </main>
        <Footer />
      </LoginContext.Provider>
    </div>
  )
}

export default App
