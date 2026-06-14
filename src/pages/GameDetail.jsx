// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartArrowDown, faWrench, faCalendar, faGamepad } from '@fortawesome/free-solid-svg-icons';

// React
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import DataField from '../components/DataField';
import TagsField from '../components/TagsField';

// API URL
import { url } from '../shared'

const GameDetail = () => {
    const [game, setGame] = useState()
    const { id } = useParams()
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`${url}api/game/${id}/`);
            const gameData = await response.json();
            setGame(gameData)

        }
        fetchData()
    }, [id])
    return (
        <article className="my-3">
            {game ?
                <>
                    <figure>
                        <img src={game.img_url} className="mx-auto" alt="" />
                    </figure>
                    <div className="p-3 flex flex-col gap-2">
                        <h1 className="text-2xl font-semibold text-primary">{game.title}</h1>
                        <section>
                            <h2 className="subtitle">Descrição:</h2>
                            <p className='text-sm my-2'>{game.description}</p>
                        </section>
                        <data className="text-2xl font-semibold text-tertiary">R$ {game.price}</data>
                        <button className='bg-tertiary text-white p-3 text-[1.25rem] font-semibold rounded-lg cursor-pointer'><FontAwesomeIcon icon={faCartArrowDown} aria-hidden='true' /><span className='ml-2'>Adicionar ao carrinho</span></button>
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
                </>
                : 'loading...'}
        </article>
    )
}

export default GameDetail