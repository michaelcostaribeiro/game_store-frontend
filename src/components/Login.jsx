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
import useFetch from "../hooks/useFetch";


const Login = ({ storeTitle, onClose }) => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [registerScreen, setRegisterScreen] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const [loggedIn, setLoggedIn] = useContext(LoginContext);

    const [logInLoading, setLogInLoading] = useState(false)
    const [registerLoading, setRegisterLoading] = useState(false)


    async function login(e, admin_login=false) {
        e.preventDefault();
        setLogInLoading(true)

        const currentUsername = admin_login ? import.meta.env.VITE_ADMIN_LOGIN : username;
        const currentPassword = admin_login ? import.meta.env.VITE_ADMIN_PASSWORD : password;


        try {
            const response = await fetch(`${url}api/token/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: currentUsername,
                    password: currentPassword,
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
        } finally {
            setLogInLoading(false)
        }
    }

    async function register(e) {
        e.preventDefault();

        if (password === confirmPassword) {
            setRegisterLoading(true)
            try {
                const response = await fetch(`${url}api/register/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: username,
                        email: email,
                        password: password,
                    }),
                })
                const data = await response.json();
                if (response.status === 201) {
                    await login(e)
                }
            } catch (e) {
                console.log(e)
            } finally {
                setRegisterLoading(false)
            }
        } else {
            setErrorMessage('As senhas não coincidem!')
        }
    }

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset;' }
    }, []);
    return (
        <div className="fixed inset-0 bg-tertiary text-white text-lg z-99 flex items-center justify-center 
        xl:bg-tertiary/50">

            <div className=" 
            bg-tertiary w-full relative
            md:w-3/4
            xl:w-2/8 xl:h-1/2 xl:rounded-2xl xl:px-4 xl:shadow-xl">
                <div className="flex justify-between ml-auto p-3 text-2xl font-bold absolute w-full">
                    <div className="w-4"></div>
                    <h1 className="flex-1 text-center">{storeTitle}</h1>
                    <button className="w-4 cursor-pointer xl:absolute xl:right-8" onClick={onClose}>X</button>
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
                            {registerLoading ?
                                <div className='loader mx-auto' style={{ background: 'radial-gradient(circle closest-side, white 90%, #0000) 0 / calc(100% / 3) 100% space' }} />
                                :
                                <SubmitField value={'Registrar'} />
                            }
                        </form>
                        {errorMessage && <p className=" bg-red-500 p-2 rounded-2xl text-center">{errorMessage}</p>}
                        <div className="flex justify-end items-center">
                            <button className="btn p-2 bg-orange-500 rounded-lg cursor-pointer" onClick={() => setRegisterScreen(false)}>Ja tenho uma conta</button>
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
                                <InputField
                                    type='password'
                                    name='password'
                                    id='password'
                                    placeholder='*********'
                                    value={password} setValue={setPassword} />



                                {logInLoading ?
                                    <div className='loader mx-auto' style={{ background: 'radial-gradient(circle closest-side, white 90%, #0000) 0 / calc(100% / 3) 100% space' }} />
                                    :
                                    <SubmitField value='Entrar' />
                                }


                            </form>

                            <div className="flex justify-between items-center xl:text-sm xl:text-center">
                                <Link to={'/'}>Esqueci a senha</Link>

                                <div className="flex">
                                    <button className="btn p-2 mx-2 bg-green-700/80 rounded-lg cursor-pointer" onClick={(e) => login(e,true)}>Logar como admin</button>
                                    <button className="btn p-2 bg-blue-800 rounded-lg cursor-pointer" onClick={() => setRegisterScreen(true)}>Registrar agora</button>
                                </div>
                            </div>
                        </>}
                </div>
            </div>
        </div>
    )
}

export default Login