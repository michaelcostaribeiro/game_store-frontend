import { useState, useEffect } from 'react';
import crashImage from '../assets/banner-1-crash.png'
import promotionImage from '../assets/banner-promotion.jpg'
import promotionImageSmall from '../assets/banner-promotion-small.jpg'
import bannerInformatica from '../assets/banner-informatica.jpg'
import tecladoImage from '../assets/teclado.png'
import Highlight from '../components/Highlight'
import LoadingScreen from '../components/LoadingScreen'

import { url } from '../shared'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import ErrorScreen from '../components/ErrorScreen';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';

const Home = () => {
    const [games, setGames] = useState();
    const [lancamentos, setLancamentos] = useState();
    const [maisVendidos, setMaisVendidos] = useState();
    const [retroDestaque, setRetroDestaque] = useState();
    const [pacoteSemanal, setPacoteSemanal] = useState();

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('')

    const highlightedGameID = import.meta.env.VITE_HIGHLIGHT_GAME_ID

    const {
        data: highlightGameData,
        loading: highlightGameLoading,
        error: highlightGameError
    } = useFetch({ endpoint: `api/game/${highlightedGameID}/` })

    const [gamesByGenre, setGamesByGenre] = useState()

    useEffect(() => {
        setLoading(true)
        try {
            fetch(url + 'api/store/')
                .then((response) => response.json())
                .then((data) => {
                    setGames(data.games);

                    let sorted = [...data.games];
                    sorted.sort(function (a, b) {
                        return new Date(b.release_date) - new Date(a.release_date);
                    });
                    sorted.splice(5)
                    setLancamentos(sorted)


                    sorted = [...data.games];
                    sorted.sort(function (a, b) {
                        return b.quantity_sold - a.quantity_sold
                    });
                    sorted.splice(5)
                    setMaisVendidos(sorted)



                    sorted = [...data.games]
                    let index_to_remove = []
                    sorted.forEach((value, index) => {
                        let year = value.release_date.split('-')[0]
                        if (year > 2000) {
                            index_to_remove.unshift(index)
                        }
                    });
                    index_to_remove.forEach((value) => {
                        sorted.splice(value, 1);
                    });
                    sorted.sort(function (a, b) {
                        return a.quantity_sold - b.quantity_sold
                    });
                    sorted.reverse();
                    setRetroDestaque(sorted);

                    sorted = [...data.games];
                    let name = 'Mega Man';
                    name = name.toLowerCase()
                    let filtered = sorted.filter(value => value.title.toLowerCase().includes(name));
                    setPacoteSemanal(filtered);

                    const filteredGames = data.games.filter((game) =>
                        game.genres.includes('RPG') && game.platforms.includes('PC') && game.id != highlightedGameID)
                    setGamesByGenre(filteredGames)
                })

            setLoading(false)
        } catch (e) {
            console.log(e.message)
            setError(e.message)
        }
    }, []);

    if (loading || highlightGameLoading) return <LoadingScreen />
    if (highlightGameError) return <ErrorScreen message={highlightGameError} />
    if (error) return <ErrorScreen message={error} />

    return (lancamentos &&
        maisVendidos &&
        pacoteSemanal ? <>
        <section className=' w-full flex min-h-[60vh] md:min-h-[50vh]'>
            <img src={'https://crashynews.wordpress.com/wp-content/uploads/2016/12/crash-bandicoot-n-sane-trilogy-banner-us-03dec16.jpg'} alt="hero banner" className=' object-cover w-full' />
        </section>


        <div className='w-full bg-primary h-14'></div>


        <section className='lancamentos mt-5'>
            <Highlight
                title={'Lançamentos'}
                items={lancamentos}
            />
            <Highlight
                title={'Mais vendidos'}
                items={maisVendidos}
            />
            <Highlight
                title={'Destaques retro'}
                items={retroDestaque}
            />
        </section>



        <section className='
        pacote flex-col flex justify-center  h-screen text-white gap-2 bg-position-[70%] bg-no-repeat bg-cover
        md:h-[65vh]
        xl:h-[80vh]' style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${promotionImageSmall})`
            }}>
            <div className='
            w-[calc(83.33%+0.5rem)] mx-auto tracking-wider text-md 
            md:w-[70%] md:text-lg
            xl:w-1/4'>
                <h2>Pacote retrô da semana</h2>
                <p className='tracking-widest uppercase'>Megaman Legacy Collection</p>
            </div>
            <div className='
            md:mx-auto md:w-[70%] 
            xl:w-1/4'>
                <img src="https://ssb.wiki.gallery/images/a/a0/Mega_Man.png" alt="Mega Man" className='hidden' />
                <div className='
                flex flex-wrap justify-center gap-2  mx-auto px-5 
                md:px-0
                xl:gap-4'>
                    {pacoteSemanal.map((item, index) => {
                        return <Link to={`/game/${item.id}`} key={item.id} className='w-[48%] h-40'>
                            <img src={item.img_url} alt={item.title} className='h-full w-full rounded-lg' />
                        </Link>
                    })}

                </div>

            </div>
            <div className='
            flex justify-between w-[calc(83.33%+0.5rem)] font-light tracking-widest uppercase text-sm mx-auto 
            md:w-[70%] md:text-lg
            xl:w-1/4'>
                <p>Jogos da semana</p>
                <p>R$ 19,90</p>
            </div>
        </section>

        <section className=''>
            <h2 className='
            uppercase text-white font-bold text-xl h-20 mt-10 flex justify-center items-center mx-3 rounded-2xl text-shadow-lg 
            xl:mx-100' style={{
                    backgroundImage: `url(${bannerInformatica})`
                }}>Conheça nosso destaque para PC</h2>

            <section>
                <div className='md:flex md:px-2 xl:px-100 xl:py-5'>
                    <div className='p-3'>
                        <h3 className='text-lg my-3 md:text-2xl xl:text-3xl'>
                            {highlightGameData.title}
                        </h3>
                        <p className='text-sm md:text-base '>
                            {highlightGameData.description}
                        </p>
                    </div>
                    <div className='border border-gray-500/80 rounded-md flex flex-col justify-center items-center w-10/12 mx-auto my-5
                    md:min-w-[33%]  overflow-hidden
                    '>
                        <div className='flex text-2xl font-light uppercase gap-2 my-2 items-center'>
                            <h2>Premiado por :</h2>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/The_Game_Awards_Logo_2024.svg/1920px-The_Game_Awards_Logo_2024.svg.png" className='max-h-10' alt="Ícone da logo 2024 do The Game Awards" />
                        </div>
                        <img src={highlightGameData.img_url} alt={highlightGameData.title} className='' />
                        {/* <div className='my-2'>
                            {[...Array(5)].map((_, i) => {
                                return <span key={i} className='text-yellow-500 text-xl'><FontAwesomeIcon icon={faStar} /></span>
                            })}
                        </div> */}
                    </div>
                </div>
                {gamesByGenre &&
                    <Highlight
                        title={'Jogos parecidos'}
                        items={gamesByGenre}
                    />
                }
            </section>
        </section>
    </> : <LoadingScreen />
    )
}

export default Home