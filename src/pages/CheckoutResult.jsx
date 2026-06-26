// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faRobot, faHourglass } from '@fortawesome/free-solid-svg-icons';

import { Link, useNavigate } from 'react-router-dom';


const CheckoutResult = ({ result }) => {
    const navigate = useNavigate('')
    
    if(localStorage.length > 0) navigate('/')

    if (result == 'sucesso') {
        return <div className='flex-grow flex flex-col justify-center items-center gap-2'>
            <div className='bg-primary h-30 w-30 flex items-center justify-center rounded-full'>
                <FontAwesomeIcon icon={faCheck} className='text-[5rem] text-green-400' />
            </div>
            <h1 className='text-3xl'>Obrigado pela sua compra!</h1>
            <Link
                to={'/'}
                className='bg-primary text-white px-2 py-1 rounded-xl cursor-pointer transition hover:bg-primary/50'>Retornar ao início
            </Link>
        </div>
    } else if (result == 'falha') {
        return <div className='flex-grow flex flex-col justify-center items-center gap-2'>
            <div className='bg-primary h-30 w-30 flex items-center justify-center rounded-full'>
                <FontAwesomeIcon icon={faRobot} className='text-[5rem] text-white' />
            </div>
            <h1 className='text-3xl'>Ops! Algo deu errado com a compra.</h1>
            <Link
                to={'/'}
                className='bg-primary text-white px-2 py-1 rounded-xl cursor-pointer transition hover:bg-primary/50'>Retornar ao início
            </Link>
        </div>
    } else if (result == 'pendente') {
        return <div className='flex-grow flex flex-col justify-center items-center gap-2'>
            <div className='bg-primary h-30 w-30 flex items-center justify-center rounded-full'>
                <FontAwesomeIcon icon={faHourglass} className='text-[4rem] text-white' />
            </div>
            <h1 className='text-3xl'>Aguardando o pagamento...</h1>
            <Link
                to={'/cart'}
                className='bg-primary text-white px-2 py-1 rounded-xl cursor-pointer transition hover:bg-primary/50'>Retornar ao carrinho
            </Link>
        </div>
    } else {
        navigate('/')
    }
}

export default CheckoutResult