// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className='bg-tertiary text-white p-3'>
        <div className='border-b border-secondary py-3'>
              <h2 className='font-semibold'>Atendimento</h2>
              <p className='font-semibold'>(99) 99999-9999</p>
              <p>Aberto nos horário comercial</p>
        </div>
          <div className='border-b border-secondary py-3'>
              <h2 className='font-semibold'>Sobre</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sit amet pharetra nibh.</p>
        </div>
        <div className='py-3'>
              <h2 className='font-semibold'>Junte-se a nossa comunidade</h2>
              {[...Array(5)].map((_,i)=>{
                
                  return <Link to='/' key={i} ><FontAwesomeIcon icon={faFacebook} /></Link>
              })}
        </div>
    </footer>
  )
}

export default Footer