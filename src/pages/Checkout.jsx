import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { url } from '../shared';

initMercadoPago('APP_USR-a05e287d-99e8-46d4-b5d8-9b2461d646b7');

const Checkout = () => {
    const navigate = useNavigate('')
    // useEffect(()=>{
    //     if(!carrinho) {navigate('/')}
    // },[])

    const [preferenceId, setPreferenceId] = useState(null);
    const [carregando, setCarregando] = useState(false);

    const carrinho = {
        items: [
            { id: 101, title: 'Curso Completo de Programação', quantity: 1, price: 250.00 },
            { id: 102, title: 'E-book Dominando APIs', quantity: 2, price: 45.00 }
        ]
    };

    const iniciarPagamento = async () => {
        setCarregando(true);
        try {
            const resposta = await axios.post(`${url}api/pagamentos/criar-preferencia/`, carrinho);
      
            setPreferenceId(resposta.data.preference_id);
        } catch (erro) {
            console.error("Erro ao gerar a preferência de checkout:", erro);
            alert("Não foi possível iniciar o pagamento. Tente novamente.");
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center', fontFamily: 'Arial' }}>
            <h2>Resumo do Pedido</h2>

            <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                {carrinho.items.map(item => (
                    <p key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{item.title} (x{item.quantity})</span>
                        <strong>R$ {(item.price * item.quantity).toFixed(2)}</strong>
                    </p>
                ))}
            </div>

            {/* Botão inicial para processar o carrinho no backend */}
            {!preferenceId && (
                <button
                    onClick={iniciarPagamento}
                    disabled={carregando}
                    style={{ padding: '12px 24px', backgroundColor: '#009ee3', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}
                >
                    {carregando ? 'A processar...' : 'Proceder para o Pagamento'}
                </button>
            )}

            {/* Quando o Django retorna o ID, o componente Wallet do SDK assume o controle */}
            {preferenceId && (
                <div style={{ marginTop: '20px' }}>
                    <Wallet
                        initialization={{ preferenceId: preferenceId }}
                        customization={{ texts: { valueProp: 'smart_option' } }}
                    />
                </div>
            )}
        </div>
    );
}

export default Checkout