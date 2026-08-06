// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartArrowDown, faWrench, faCalendar, faGamepad } from '@fortawesome/free-solid-svg-icons';

// React
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import DataField from '../components/DataField';
import TagsField from '../components/TagsField';

// API URL
import { authHeaders, url } from '../shared'
import useFetch from '../hooks/useFetch';
import LoadingScreen from '../components/LoadingScreen';
import ErrorScreen from '../components/ErrorScreen';

const GameDetail = () => {
    const navigate = useNavigate('')

    const { id } = useParams();

    const gameEndpoint = `api/game/${id}/`

    const [APILoading, setAPILoading] = useState('')
    const [APIError, setAPIError] = useState('')

    const [isAdmin, setIsAdmin] = useState(false)

    const addToCart = async (e) => {
        e.preventDefault()

        if (!localStorage.token) {
            alert('Você precisa estar logado para adicionar itens ao carrinho.')
        } else {

            try {
                setAPILoading(true)
                setAPIError('')
                const addToCartEndpoint = 'api/cart/item/'

                const response = await fetch(`${url + addToCartEndpoint}`, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        'game_item_id': game.id,
                        'quantity': 1
                    })
                })
                if (response.ok) {
                    const data = await response.json();
                    navigate('/cart')
                } else if (response.status === 401) {
                    alert('Tempo de login expirado! Redirecionando para a página inicial...')
                    localStorage.clear()
                    navigate('/')
                } else if (response.status === 403) {
                    const data = await response.json();
                    setAPIError(data.detail)
                }
            }
            catch (e) {
                console.log(e)
            } finally {
                setAPILoading(false)
            }

        }
    }

    useEffect(() => {
        if (localStorage.token) {

            async function checkAdmin() {
                const isAdminEndpoint = 'api/isAdmin/'

                const response = await fetch(url + isAdminEndpoint, {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${localStorage.token}`
                    }
                })
                const data = await response.json();
                setIsAdmin(data.is_admin)
            }
            checkAdmin()
        } else {
            setIsAdmin(false)
        }
    }, [])


    const {
        data: game,
        loading,
        error
    } = useFetch({ endpoint: gameEndpoint })

    if (loading) return <LoadingScreen />
    if (error) return <ErrorScreen message={error} />

    return (
        <article className="">
            <figure className='bg-secondary py-2'>
                <img src={game.img_url} className="mx-auto max-h-[35vh] h-[35vh] object-contain
                xl:max-h-[50vh] xl:h-[50vh] xl:object-cover" alt={game.title} />
            </figure>
            <div className='xl:px-100'>
                <div className="p-3 flex flex-col gap-2">
                    <div className='flex justify-between items-center'>
                        <h1 className="text-2xl font-semibold text-primary">{game.title}</h1>
                        {isAdmin && <Link to={`/edit/${id}`} className='bg-blue-500 text-white p-2 rounded-lg font-semibold transition hover:bg-blue-500/75'>Editar</Link>}
                    </div>
                    <section>
                        <h2 className="subtitle">Descrição:</h2>
                        <p className='text-sm my-2 md:text-base xl:text-lg'>{game.description}</p>
                    </section>
                    <data className="text-2xl font-semibold text-tertiary">R$ {game.price}</data>
                    {APILoading ? <div className='loader mx-auto p-3' /> : <button
                        onClick={(e) => addToCart(e)}
                        className='bg-tertiary text-white p-3 text-[1.25rem] font-semibold rounded-lg cursor-pointer transition hover:bg-tertiary/75'><FontAwesomeIcon icon={faCartArrowDown} aria-hidden='true' /><span className='ml-2'>Adicionar ao carrinho</span></button>}
                    {APIError && <div className='mx-auto text-lg'>{APIError}</div>}
                </div>
                <TagsField tags={game.genres} />
                <h2 className='subtitle p-3'>Sobre este produto</h2>
                <dl className='border-y border-secondary divide-y divide-secondary'>
                    <DataField
                        dataIcon={faCalendar}
                        dataTitle={'Data de lançamento'}
                        dataContent={game.release_date} />
                    <DataField
                        dataIcon={faWrench}
                        dataTitle={'Desenvolvedor'}
                        dataContent={game.developer} />
                    <DataField
                        dataIcon={faGamepad}
                        dataTitle={'Consoles'}
                        dataContent={game.consoles} />
                </dl>
            </div>

        </article>
    )
}

export default GameDetail