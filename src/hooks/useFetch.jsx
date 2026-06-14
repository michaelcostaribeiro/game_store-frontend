import { useState, useEffect, useContext } from "react";
import { url } from "../shared";
import { LoginContext } from "../contexts/LoginContext";
import { useNavigate } from "react-router-dom";

export default function useFetch({ endpoint, method = 'GET', auth = false }) {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [loggedIn, setLoggedIn] = useContext(LoginContext);

    const navigate = useNavigate('')

    useEffect(() => {


        const fetchData = async () => {
            setLoading(true);

            try {
                const headers = auth ? {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                } : {
                    'Content-type': 'application/json'
                }

                const response = await fetch(url + endpoint, {
                    method,
                    headers,
                })




                if (response.ok) {
                    const result = await response.json();
                    console.log(result)
                    setData(result);
                    setError(null);
                } else {
                    if (response.status === 401) {
                        setError('token inválido')
                        localStorage.clear()
                        setLoggedIn(false)
                        navigate('/')
                    }else if(response.status === 404){
                        setError('Nada encontrado!')
                    }
                }
            } catch (e) {
                console.log(`Fetch falhou: `,e)
                setError('Erro de conexão.')
            } finally {
                setLoading(false)
            }
        };
        fetchData()
    }, [endpoint, method, auth]);

    return { data, loading, error };



}