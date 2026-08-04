import React from 'react'
import useFetch from '../hooks/useFetch'
import { useState } from 'react'
import SubmitField from '../components/SubmitField'
import { url } from '../shared'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const AddItem = () => {
    const navigate = useNavigate('')

    const gamesModelsEndpoint = 'api/games/model/'
    const {
        data: gameModelsData,
        loading,
        error
    } = useFetch({ endpoint: gamesModelsEndpoint })

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [selectedGenres, setSelectedGenres] = useState([])
    const [developer, setDeveloper] = useState('')
    const [date, setDate] = useState()
    const [selectedPlatforms, setSelectedPlatforms] = useState([])
    const [selectedConsoles, setSelectedConsoles] = useState([])
    const [coverURL, setCoverURL] = useState('')
    const [price, setPrice] = useState(0)
    const [sold, setSold] = useState(0)

    const [formError, setFormError] = useState('')

    const [isAdmin, setIsAdmin] = useState(false)

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
                if (data.is_admin === false) {
                    navigate('/')
                }
            }
            checkAdmin()
        } else {
            setIsAdmin(false)
            navigate('/')
        }
    }, [])

    async function handleForm(e) {
        e.preventDefault()
        if (selectedGenres.length === 0 || selectedConsoles.length === 0 || selectedPlatforms.length === 0) {
            setFormError('O formulário precisa ser totalmente preenchido.')
            return
        }
        const newGame = {
            'title': name,
            'description': description,
            'genres': selectedGenres,
            'developer': developer,
            'release_date': date,
            'platforms': selectedPlatforms,
            'consoles': selectedConsoles,
            'img_url': coverURL,
            'price': price,
            'quantity_sold': sold
        }

        const createGameEndpoint = 'api/game/'
        const response = await fetch(url + createGameEndpoint, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${localStorage.token}`
            },
            body: JSON.stringify(newGame)
        })
        setFormError('')
        const data = await response.json();
        if (response.status === 201) {
            navigate(`/game/${data.id}`)
        }

    }

    function handleCheckboxChange(e, currentState, setState) {
        const value = e.target.value;
        const isChecked = e.target.checked;

        if (isChecked) {
            setState([...currentState, value])
        } else {
            setState(currentState.filter((genre) => genre !== value))
        }
    }


    return (
        <div className='flex items-center justify-center h-full flex-1'>
            {gameModelsData && <form className='flex flex-col w-120 mx-auto gap-2 p-4 bg-secondary/75 rounded-lg my-2' onSubmit={(e) => handleForm(e)}>
                <fieldset>
                    <legend className='mx-auto text-lg font-semibold text-tertiary'>Adicionar jogo</legend>
                </fieldset>
                {/* Nome */}
                <div>
                    <label htmlFor="nome">Nome do jogo</label>
                    <input
                        required
                        type="text"
                        name="nome"
                        id="nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='border rounded-sm w-full p-0.5' />
                </div>


                {/* Descrição */}
                <div>
                    <label htmlFor="descricao">Descrição</label>
                    <input
                        required
                        type="text"
                        name="descricao"
                        id="descricao"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className='border rounded-sm w-full p-0.5' />
                </div>


                {/* Gêneros */}
                <fieldset>
                    <legend>Gêneros</legend>
                    {gameModelsData && gameModelsData.genres.map((genre) => {
                        return <div className='flex gap-1' key={genre}>
                            <input
                                type="checkbox"
                                id={genre}
                                name='genres'
                                value={genre}
                                onChange={(e) => handleCheckboxChange(e, selectedGenres, setSelectedGenres)}
                                checked={selectedGenres.includes(genre)} />
                            <label htmlFor={genre}>{genre}</label>
                        </div>
                    })}
                </fieldset>


                {/* Desenvolvedor */}
                <div>
                    <label htmlFor="desenvolvedor">Desenvolvedor</label>
                    <input
                        required
                        type="text"
                        name="desenvolvedor"
                        id="desenvolvedor"
                        value={developer}
                        onChange={(e) => setDeveloper(e.target.value)}
                        className='border rounded-sm w-full p-0.5' />
                </div>



                {/* Data de lançamento */}
                <div>
                    <label htmlFor="release">Data de lançamento</label>
                    <input
                        required
                        type="date"
                        name="release"
                        id="release"
                        className='border rounded-sm w-full'
                        value={date}
                        onChange={(e) => setDate(e.target.value)} />
                </div>


                {/* Plataformas */}
                <fieldset>
                    <legend>Plataformas</legend>
                    {gameModelsData && gameModelsData.platforms.map((platform) => {
                        return <div className='flex gap-1' key={platform}>
                            <input
                                type="checkbox"
                                id={platform}
                                name='platforms'
                                value={platform}
                                onChange={(e) => handleCheckboxChange(e, selectedPlatforms, setSelectedPlatforms)}
                                checked={selectedPlatforms.includes(platform)}
                            />
                            <label htmlFor={platform}>{platform}</label>
                        </div>
                    })}
                </fieldset>



                {/* Consoles */}
                <fieldset>
                    <legend>Consoles</legend>
                    {gameModelsData && gameModelsData.consoles.map((console) => {
                        return <div className='flex gap-1' key={console}>
                            <input
                                type="checkbox"
                                id={console}
                                name='consoles'
                                value={console}
                                onChange={(e) => handleCheckboxChange(e, selectedConsoles, setSelectedConsoles)}
                                checked={selectedConsoles.includes(console)}
                            />
                            <label htmlFor={console}>{console}</label>
                        </div>
                    })}
                </fieldset>



                {/* Cover */}
                <div>
                    <label htmlFor="capa">Imagem de capa</label>
                    <input
                        required
                        type="url"
                        name="capa"
                        id="capa"
                        value={coverURL}
                        onChange={(e) => setCoverURL(e.target.value)}
                        className='border rounded-sm w-full p-0.5' />
                </div>



                {/* Preço */}
                <div>
                    <label htmlFor="preco">Preço</label>
                    <input
                        required
                        type="number"
                        name="preco"
                        id="preco"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className='border rounded-sm w-full p-0.5' />
                </div>



                {/* Quantidade vendida */}
                <div>
                    <label htmlFor="vendidos">Quantidade vendida</label>
                    <input
                        required
                        type="number"
                        name="vendidos"
                        id="vendidos"
                        value={sold}
                        onChange={(e) => setSold(e.target.value)}
                        className='border rounded-sm w-full p-0.5' />
                </div>
                {formError && <div className='w-fit py-1 px-3 mx-auto bg-red-600/85 text-center text-lg text-white border border-black rounded-lg'>{formError}</div>}
                <SubmitField value={'Adicionar jogo'} />
            </form>}
        </div>

    )
}

export default AddItem