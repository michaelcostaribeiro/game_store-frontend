import React, { useState } from 'react'
import useFetch from '../hooks/useFetch'
import { url } from '../shared'
import { Link, useNavigate } from 'react-router-dom'

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartArrowDown } from '@fortawesome/free-solid-svg-icons';
import LoadingScreen from '../components/LoadingScreen';
import ErrorScreen from '../components/ErrorScreen';

// Mercado Pago
import axios from 'axios';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';


initMercadoPago(import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY);


const Cart = () => {
    const navigate = useNavigate('')


    if (localStorage.length == 0) {
        navigate('/')
    }

    const {
        data: cartItems,
        setData: setCartItems,
        loading: cartLoading,
        error
    } = useFetch({ endpoint: 'getCart/', auth: true })


    const [preferenceId, setPreferenceId] = useState(null);
    const [loading, setLoading] = useState(false);

    const deletarDoCart = async (id) => {
        
        const cartItem = `api/cart/item/${id}/`
        try{

            const response = await fetch(url+cartItem,{
                method:'DELETE',
                headers:{
                    'Content-type':'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            })
            if (response.ok){
                setCartItems((prevItems)=> prevItems.filter((item) => item.game_item.id !== id))
            } else{
                alert('Não foi possível remover o item.')
            }
        }catch(e){
            console.log("Erro ao deletar:",e)
        }
    }

    const iniciarPagamento = async () => {
        setLoading(true);
        try {
            const formatedCartItems = cartItems.map((item) => {
                return {
                    id: item.game_item.id,
                    title: item.game_item.title,
                    quantity: item.quantity,
                    price: item.game_item.price
                }
            })
            const carrinho = {
                items: formatedCartItems
            }


            const response = await axios.post(`${url}api/pagamentos/criar-preferencia/`, carrinho);

            setPreferenceId(response.data.preference_id);
        } catch (erro) {
            console.error("Erro ao gerar a preferência de checkout:", erro);
            alert("Não foi possível iniciar o pagamento. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    if (cartLoading) return <LoadingScreen />
    if (error) return <ErrorScreen />

    return <div className='min-h-[70vh] my-5 flex flex-col justify-center items-center gap-2 px-2 md:px-20 xl:px-100'>

        {cartItems.length > 0 && !cartLoading ? <>
            <h1 className='font-semibold text-left w-full text-2xl'>Itens no carrinho:</h1>
            <div className='flex flex-col items-center gap-2 w-full'>
                {cartItems.map((item) => {
                    return <div key={item.id} className='bg-secondary h-25 md:h-40 flex rounded-xl overflow-hidden w-full relative'>
                        <img src={item.game_item.img_url} alt="" className='min-w-3/10 max-w-3/10 h-full xl:min-w-2/10 xl:max-w-2/10' />
                        <div className='p-2 flex flex-col flex-1'>
                            <h2>{item.game_item.title}</h2>
                            <p className='text-sm line-clamp-3'>{item.game_item.description}</p>
                            <div className='flex justify-between flex-1 items-end text-sm'>
                                <p></p>
                                <p>Preço total: R${item.quantity * item.game_item.price}</p>
                            </div>
                        </div>
                        <button 
                        className='absolute right-2 top-2 cursor-pointer flex items-center justify-center bg-white h-5 w-5 rounded-full text-sm'
                        onClick={()=>deletarDoCart(item.game_item.id)}>X</button>

                    </div>
                })}

                {!preferenceId && <button
                    className='text-xl px-5 py-2 bg-green-500 text-white shadow-2xl border border-black/30 rounded-3xl mt-4 cursor-pointer transition hover:bg-green-600'
                    onClick={iniciarPagamento}
                    disabled={loading}>Finalizar compra</button>}
                {preferenceId && <div>
                    <Wallet
                        initialization={{ preferenceId: preferenceId }}
                        customization={{ texts: { valueProp: 'smart_option' } }}
                    />
                </div>}
            </div>
        </> : <></>}

        {cartItems.length == 0 && <>
            <div className='flex flex-col justify-center items-center'>

                <div className='w-18 h-18 flex items-center justify-center bg-primary text-white rounded-full'>
                    <FontAwesomeIcon icon={faCartArrowDown} className='text-4xl' />
                </div>
                <h1 className='text-lg'>Nenhum item encontrado!</h1>
            </div>
            <Link to={'/'} className='bg-green-400 py-2 px-4 text-xl font-semibold rounded-2xl'>Conheça nossos produtos!</Link></>}
    </div>


}

export default Cart