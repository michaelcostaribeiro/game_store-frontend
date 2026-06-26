// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faUser, faCartArrowDown, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';

// Router
import { Link, Route, Routes, useNavigate, useSearchParams } from 'react-router-dom';
import Login from './Login';
import LoginButton from './LoginButton';
import { useEffect, useRef, useState, useContext } from 'react';

// API URL
import { url } from '../shared'
import { LoginContext } from '../contexts/LoginContext';

const Navbar = ({ storeTitle }) => {
    const [navHeight, setNavHeight] = useState(0);
    const [platforms, setPlatforms] = useState([]);
    const [loggedIn, setLoggedIn] = useContext(LoginContext);

    const [searchParams, setSearchParams] = useSearchParams();
    const [searchString, setSearchString] = useState('');
    const navigate = useNavigate('');


    const navRef = useRef(null);

    function logout () {
        localStorage.clear()
        setLoggedIn(false)
        alert('Você deslogou com sucesso! Vamos te redirecionar para a página inicial.')
        navigate('/')
    }

    function handleSubmit(e){
        e.preventDefault()
        if(searchString){
            navigate(`/search?q=${encodeURIComponent(searchString)}`);
            setSearchString('');
        };

    }

    useEffect(() => {
        if (navRef.current) {
            setNavHeight(navRef.current.offsetHeight);
        }
        fetch(url + 'api/icons')
        .then((response) => response.json())
        .then((data) => {
            setPlatforms(data.platforms)
        })
        
    }, []);
    return <>
        <nav ref={navRef} className='bg-primary text-amber-50 container py-3 fixed z-50 min-w-full xl:px-50'>
            <div className='flex items-center justify-between px-3 gap-2 md:px-8 md:gap-4'>
                <Link to='/' className='flex'><img src="/logo-1.png" alt="image" className='h-10' /></Link>
                <form className='rounded-sm flex-1 flex items-center text-amber-50 ' onSubmit={handleSubmit}>
                    <input type="text" name="" id="" placeholder='Search' className='grow focus:outline-0' value={searchString} onChange={(e)=>setSearchString(e.target.value)} />
                    <button type='submit' className='cursor-pointer'>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                </form>
                <div>
                    {loggedIn ? <button onClick={logout}><FontAwesomeIcon icon={faArrowRightFromBracket} className=' cursor-pointer' /></button> : <LoginButton /> }
                    <Link to={'/cart'} className=' rounded-sm  ml-1'><FontAwesomeIcon icon={faCartArrowDown} /></Link>
                </div>
            </div>
            <div className='w-screen h-px -ml-[50vw] -mr-[50vw] bg-white my-2  relative left-1/2 right-1/2'></div>

            <ul className='flex gap-5 items-center justify-center px-3 py-1'>
                {platforms ? platforms.map((platform) => {
                    return <li key={platform.id}>
                        <Link to={`platform/${platform.platform_name}`} className='text-amber-50 flex items-center gap-0.5 max-h-4 '>
                            <img src={platform.platform_icon} alt={platform.platform_name} className='w-5 h-5 text-white invert' />
                        {platform.platform_name}</Link>
                    </li>
                }):''}
                
            </ul>
        </nav>
        <div className='h-22' />
    </>
};

export default Navbar;

