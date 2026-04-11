// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faUser, faCartArrowDown } from '@fortawesome/free-solid-svg-icons';

// Router
import { Link, Route, Routes } from 'react-router-dom';
import Login from './Login';
import LoginButton from './LoginButton';
import { useEffect, useRef, useState } from 'react';

const Navbar = ({ storeTitle }) => {
    const consoles = [
        { id: 1, text: 'Nintendo' },
        { id: 2, text: 'Playstation' },
        { id: 3, text: 'Xbox' },
    ]
    const [navHeight, setNavHeight] = useState(0);
    const [platforms, setPlatforms] = useState([]);
    const navRef = useRef(null);

    useEffect(() => {
        if (navRef.current) {
            setNavHeight(navRef.current.offsetHeight);
        }
        fetch('http://127.0.0.1:8000/api/icons')
        .then((response) => response.json())
        .then((data) => {
            setPlatforms(data.platforms)
        })
        
    }, []);
    return <>
        <nav ref={navRef} className='bg-primary text-amber-50 container mx-xl m-auto py-3 fixed z-50'>
            <div className='flex items-center justify-between px-3'>
                <Link to='/'>{storeTitle}</Link>
                <form className=' rounded-sm flex items-center text-amber-50 '>
                    <input type="text" name="" id="" placeholder='Search' className='grow focus:outline-0' />
                    <button type='submit'>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                </form>
                <div>
                    <LoginButton />
                    <Link href="#" className=' rounded-sm  ml-1'><FontAwesomeIcon icon={faCartArrowDown} /></Link>
                </div>
            </div>
            <div className='w-screen h-px -ml-[50vw] -mr-[50vw] bg-white my-2  relative left-1/2 right-1/2'></div>

            <ul className='flex gap-5 items-center justify-center px-3 py-1'>
                {platforms ? platforms.map((platform) => {
                    return <li key={platform.id}>
                        <Link to={`/${platform.platform_name}`} className='text-amber-50 flex items-center gap-0.5 max-h-4 '>
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

