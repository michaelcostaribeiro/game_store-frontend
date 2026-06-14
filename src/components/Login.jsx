import { Link } from "react-router-dom"

import InputField from "./InputField"
import SubmitField from "./SubmitField"

// React
import { useEffect, useState, useContext } from "react";
import { LoginContext } from "../contexts/LoginContext";

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faUser, faCartArrowDown } from '@fortawesome/free-solid-svg-icons';

// API URL
import { url } from '../shared'


const Login = ({ storeTitle, onClose }) => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [registerScreen, setRegisterScreen] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const [loggedIn, setLoggedIn] = useContext(LoginContext);

    async function login(e) {
        e.preventDefault();
        try {
            const response = await fetch(`${url}api/token/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            })
            const data = await response.json();
            if (response.status === 200) {
                localStorage.setItem('token', data.access)
                localStorage.setItem('refresh', data.refresh)

                if (!!localStorage.getItem('token')) {
                    setLoggedIn(true)
                }
                onClose()
            }
        } catch (e) {
            console.log(e)
        }
    }

    async function register(e) {
        e.preventDefault();
        if (password === confirmPassword) {
            try {
                const response = await fetch(`${url}api/register/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: username,
                        email:email,
                        password: password,
                    }),
                })
                const data = await response.json();
                if (response.status === 201) {
                    await login(e)
                }
            } catch (e) {
                console.log(e)
            }
        }else{
            setErrorMessage('As senhas não coincidem!')
        }
    }

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset;' }
    }, []);
    return (
        <div className="fixed inset-0 bg-tertiary text-white text-lg z-99">

            <div className="flex justify-between ml-auto p-3 text-2xl font-bold absolute w-full">
                <div className="w-4"></div>
                <h1 className="flex-1 text-center">{storeTitle}</h1>
                <button className="w-4" onClick={onClose}>X</button>
            </div>
            <div className="p-3 flex flex-col  gap-3 h-full justify-center ">
                {registerScreen ? <>
                    {/* Register Form */}
                    <form onSubmit={register} className="flex flex-col gap-3">
                        <InputField
                            type='text'
                            name='username'
                            id='username'
                            placeholder='Nome'
                            label="Criar conta"
                            value={username} setValue={setUsername} />
                        <InputField
                            type='text'
                            name='email'
                            id='email'
                            placeholder='E-mail'
                            value={email} setValue={setEmail} />
                        <InputField type='password'
                            name='password'
                            id='password'
                            placeholder='Senha'
                            value={password} setValue={setPassword} />
                        <InputField type='password'
                            name='confirmPassword'
                            id='confirmPassword'
                            placeholder='Confirmar senha'
                            value={confirmPassword} setValue={setConfirmPassword} />
                        <SubmitField value='Entrar' />
                    </form>
                    <div className="flex justify-end items-center">
                        <button className="btn p-2 bg-orange-500 rounded-lg " onClick={() => setRegisterScreen(false)}>Ja tenho uma conta</button>
                    </div>
                </> :

                    <>
                        {/* Login Form */}
                        <form onSubmit={login} className="flex flex-col gap-3">
                            <InputField
                                type='text'
                                name='email'
                                id='email'
                                placeholder='Nome'
                                label="Iniciar sessão"
                                value={username} setValue={setUsername} />
                            <InputField type='password'
                                name='password'
                                id='password'
                                placeholder='*********'
                                value={password} setValue={setPassword} />
                            <SubmitField value='Entrar' />
                        </form>
                        <div className="flex justify-between items-center">
                            <Link to={'/'}>Esqueci a senha</Link>
                            <button className="btn p-2 bg-blue-800 rounded-lg " onClick={() => setRegisterScreen(true)}>Registrar agora</button>
                        </div>
                        <div className="w-full bg-secondary h-0.5"></div>
                        <button >Entrar com Google</button>
                    </>}
                    {errorMessage && <p className=" bg-red-500 p-2 rounded-2xl text-center">{errorMessage}</p>}

            </div>
        </div>
    )
}

export default Login