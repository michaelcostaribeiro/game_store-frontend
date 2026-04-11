import { Link } from "react-router-dom"

import InputField from "./InputField"
import SubmitField from "./SubmitField"

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faUser, faCartArrowDown } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from "react";


const Login = ({ storeTitle, onClose }) => {
    useEffect(()=>{
        document.body.style.overflow = 'hidden';
        return () => {document.body.style.overflow = 'unset;'}
    },[]);
    return (
        <div className="fixed inset-0 bg-tertiary text-white text-lg z-99">

            <div className="flex justify-between ml-auto p-3 text-2xl font-bold absolute w-full">
                <div className="w-4"></div>
                <h1 className="flex-1 text-center">{storeTitle}</h1>
                <button className="w-4" onClick={onClose}>X</button>
            </div>
            <div className="p-3 flex flex-col  gap-3 h-full justify-center ">
                <form action="POST" className="flex flex-col  gap-3">
                    <InputField type='text' name='email' id='email' placeholder='E-mail' label="Iniciar sessão" />
                    <InputField type='password' name='password' id='password' placeholder='*********' />
                    <SubmitField value='Entrar' />
                </form>
                <Link to={'/'}>Esqueci a senha</Link>
                <div className="w-full bg-secondary h-0.5"></div>
                <button>Entrar com Google</button>
            </div>
        </div>
    )
}

export default Login