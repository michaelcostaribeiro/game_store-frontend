import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Highlight from '../components/Highlight'
import useFetch from '../hooks/useFetch'
import LoadingScreen from '../components/LoadingScreen'
import ErrorScreen from '../components/ErrorScreen'
import { url } from '../shared'


const PlatformPage = () => {
  const [games, setGames] = useState()
  const [platformName, setPlatformName] = useState()
  const [consoles, setConsoles] = useState()
  const [imageURL, setImageURL] = useState()
  const [developers, setDevelopers] = useState(null)
  const [developersLoading, setDevelopersLoading] = useState(true)

  const { platform } = useParams();

  const consoleEndpoint = 'api/consoles'
  const gamesByPlatformEndpoint = `api/games_by_platform/${platform}`
  const imageEndpoint = `api/hightlightImage/${platform}/`


  const {
    data: gamesData,
    loading: gamesLoading,
    error: gamesError
  } = useFetch({ endpoint: gamesByPlatformEndpoint })

  const {
    data: consoleData,
    loading: consoleLoading,
    error: consoleError
  } = useFetch({ endpoint: consoleEndpoint })

  const {
    data: imageData,
    loading: imageLoading,
    error: imageError
  } = useFetch({ endpoint: imageEndpoint })


  useEffect(() => {
    if (!gamesData || !consoleData || !imageData) return;

    if (platform.toLowerCase() === 'pc') {
      const allDevelopers = []
      gamesData.games.map((game) => {
        allDevelopers.push(game.developer)
      })
      const uniqueDevelopers = [... new Set(allDevelopers)]
      console.log(uniqueDevelopers)
      setDevelopers(uniqueDevelopers)
    }
    
    setGames(gamesData.games);
    setImageURL(imageData.image);
    const currentConsoleArray = consoleData.consoles.filter((consolePlatform) => consolePlatform.platform.toLowerCase() == platform.toLowerCase())
    setConsoles(currentConsoleArray);
    const capitalize = (value) => String(value).charAt(0).toUpperCase() + String(value).slice(1);
    setPlatformName(capitalize(platform))
    setDevelopersLoading(false)
  }, [gamesData, consoleData, imageData])



  if (gamesLoading || imageLoading || consoleLoading || developersLoading ) return <LoadingScreen />
  if (gamesError) return <ErrorScreen message={gamesError} />
  if (imageError) return <ErrorScreen message={imageError} />
  if (consoleError) return <ErrorScreen message={consoleError} />

  return (
    <>
      {games && <div>
        <div className='h-70 flex justify-center items-center relative xl:h-120'
          style={{ clipPath: 'polygon(0 0, 100% 0%, 100% 90%, 0 100%)' }}>
          <img src={`${imageURL}`} alt="" className='absolute h-full object-cover object-top brightness-50 w-full ' />
          <h1 className='text-white relative font-bold text-shadow-[0_0_35px_rgb(0_0_0_)] text-4xl xl:text-5xl'>{platformName}</h1>


        </div>
        {developers && platform.toLowerCase() === 'pc' ?
          developers.map((currentDeveloper) => {
            const gamesByDeveloper = games.filter((game) => {
              if (game.developer.includes(currentDeveloper)) {
                return game
              }
            })
            return <Highlight
              title={currentDeveloper}
              items={gamesByDeveloper}
              key={currentDeveloper} />
          })
          :

          consoles.map((currentConsole) => {
            let gamesForCurrentConsole = games.filter((game) => {
              if (game.consoles.includes(currentConsole.console_name)) {
                return game
              }
            })
            return <Highlight
              title={currentConsole.console_name}
              items={gamesForCurrentConsole}
              key={currentConsole.id} />
          })}

      </div>}
    </>
  )
}

export default PlatformPage