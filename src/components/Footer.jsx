// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-tertiary text-white w-full">
      <div className="max-w-7xl mx-auto p-3 md:flex md:justify-between md:*:px-4 md:*:py-0 xl:*:py-10">

        <div className="border-b border-secondary py-3 md:border-b-0 md:border-r xl:border-0">
          <h2 className="font-semibold">Atendimento</h2>
          <p className="font-semibold">(99) 99999-9999</p>
          <p>Aberto no horário comercial</p>
        </div>

        <div className="border-b border-secondary py-3 md:border-b-0 md:border-r xl:border-l">
          <h2 className="font-semibold">Sobre</h2>
          <p>Sua melhor parceira para explorar o mundo com segurança e criar roteiros inesquecíveis.</p>
        </div>

        <div className="py-3">
          <h2 className="font-semibold">Junte-se à nossa comunidade</h2>
          <div className='flex gap-1 
          *:h-7 *:w-7 md:*:h-8.5 md:*:w-8.5 *:bg-white *:p-1 md:*:p-1.25 *:rounded-full *:flex *:items-center *:justify-center'>
            <a href='https://x.com/?lang=pt' target='_blank'><img src="https://raw.githubusercontent.com/ant-design/ant-design-icons/6c18c63fbcfcf71dae09cd6bd6d63a48f8b688f1/packages/icons-svg/svg/filled/x.svg" alt="X Icon" /></a>
            <a href='https://bsky.app/' target='_blank'><img src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Bluesky_Logo.svg" alt="Bluesky Icon" /></a>
            <a href='https://www.linkedin.com/' target='_blank'><img src="https://upload.wikimedia.org/wikipedia/commons/8/81/LinkedIn_icon.svg" alt="Linkedin Icon" /></a>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer