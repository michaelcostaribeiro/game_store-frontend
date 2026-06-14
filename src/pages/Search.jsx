import React, { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import LoadingScreen from '../components/LoadingScreen';
import ErrorScreen from '../components/ErrorScreen';

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const query = searchParams.get('q');

    const endpoint = `api/gameSearch/${encodeURIComponent(query)}/`

    const {data:gamesResult,loading,error} = useFetch({endpoint})

    console.log(error)

    if (loading) return <LoadingScreen/>

    if (error) return <ErrorScreen message={error} />

    return gamesResult ? (
        <div className='min-h-[70vh] px-2 xl:px-50 flex flex-col justify-center'>
            <h1 className='mx-auto text-2xl my-3 '>Resultado da pesquisa:</h1>
            <div className='grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-4'>
                {gamesResult && gamesResult.map((game) => {
                    return <Link to={`/game/${game.id}`} className='flex flex-col items-center bg-primary/70 overflow-hidden rounded-xl h-45 shadow-lg' key={game.title}>
                        <h2 className='text-white px-1'>{game.title}</h2>
                        <img src={game.img_url} className='min-w-full h-100 object-cover' alt={game.title} />
                    </Link>
                })}
            </div>
        </div>
    ) : <ErrorScreen message={error} />
}

export default Search