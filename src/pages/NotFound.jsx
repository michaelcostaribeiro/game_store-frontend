// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceFrown } from '@fortawesome/free-solid-svg-icons';


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const NotFound = () => {

    const navigate = useNavigate('')

    const [timer, setTimer] = useState(5)

    
    useEffect(()=>{
        const interval = setInterval(()=>{
            setTimer((prevTimer)=>{
                if (prevTimer <= 1) {
                    clearInterval(interval);
                    navigate('/')
                }
                return prevTimer -1;
            })
        }, 1000);
        return () => clearInterval(interval)
    },[])

    return (
        <div className='flex-grow flex justify-center items-center'>
            <FontAwesomeIcon icon={faFaceFrown} className='text-[8rem]' />
            <div>
                <h1 className='text-2xl'>Página não encontrada!</h1>
                {timer ? <p>Redirecionando para a home em: {timer}</p> : <p>Redirecionando...</p>}
                
            </div>
        </div>
    )
}

export default NotFound