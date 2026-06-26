import React, { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import LoadingScreen from '../components/LoadingScreen';
import ErrorScreen from '../components/ErrorScreen';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const query = searchParams.get('q');

    const endpoint = `api/gameSearch/${encodeURIComponent(query)}/`

    const {
        data: gamesResult,
        loading,
        error
    } = useFetch({ endpoint })


    if (loading) return <LoadingScreen />

    if (error) return <ErrorScreen message={error} />

    return gamesResult ? (
        <div className='min-h-[70vh]  flex flex-col pb-2'>
            <h1 className='mx-auto text-2xl my-3 bg-secondary w-full text-center py-2'>Resultado da pesquisa:</h1>
            <div className='grid grid-cols-2 gap-2 px-2 md:grid-cols-3 xl:grid-cols-4 xl:px-50'>
                {gamesResult && gamesResult.map((game) => {
                    return <Link to={`/game/${game.id}`} className='flex flex-col items-center bg-primary/70  rounded-xl h-45 shadow-lg' key={game.title}>
                        <h2 className='text-white px-2 line-clamp-1'>{game.title}</h2>
                        <img src={game.img_url} className='min-w-full max-h-[70%] h-[70%] md:max-h-[72.5%] md:h-[72.5%] flex-1 object-cover' alt={game.title} />
                        <div className='flex w-full items-center justify-between px-1 text-white h-[15%]'>

                            <p className='font-light text-sm'><FontAwesomeIcon icon={faCalendar}  />{game.release_date}</p>
                            <p className='text-right font-semibold text-sm'>R${game.price}</p>
                        </div>
                    </Link>
                })}
            </div>
        </div>
    ) : <ErrorScreen message={error} />
}

export default Search