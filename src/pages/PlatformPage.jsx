import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Highlight from '../components/Highlight'


const PlatformPage = () => {
    const [games, setGames] = useState()
    const [platformName, setPlatformName] = useState()
    const [consoles, setConsoles] = useState()
    const [imageURL, setImageURL] = useState()
    const {platform} = useParams();
    useEffect(()=> {
      const fetchData = async () => {

      
        try{

          const [consolesRes, gamesRes, imageRes] = await Promise.all([
            fetch('http://127.0.0.1:8000/api/consoles'),
            fetch(`http://127.0.0.1:8000/api/games_by_platform/${platform}`),
            fetch(`http://127.0.0.1:8000/api/hightlightImage/${platform}/`)
          ]);

          const consolesData = await consolesRes.json();
          const gamesData = await gamesRes.json();
          const imageData = await imageRes.json();

          setGames(gamesData.games);
          setImageURL(imageData.image);
          const currentConsoleArray = consolesData.consoles.filter((consolePlatform)=> consolePlatform.platform.toLowerCase() == platform.toLowerCase())          
          
          setConsoles(currentConsoleArray);
        }catch(error){
          console.error("Erro ao carregar dados: ", error);
        }
      }
      if(platform){
        fetchData()
        const capitalize = (value) => String(value).charAt(0).toUpperCase() + String(value).slice(1);
        setPlatformName(capitalize(platform))
      }
    }, [platform])
  return (
    <>
          {games && <div>
        <div className={'h-70 flex justify-center items-center relative xl:h-120'} 
        style={{ clipPath: 'polygon(0 0, 100% 0%, 100% 90%, 0 100%)'}}>
          <img src={`${imageURL}`} alt=""  className='absolute h-full object-cover object-top brightness-50 w-full '/>
          <h1 className='text-lg text-white relative font-bold'>Games for: {platformName}</h1>
              
              
            </div>
            {consoles.map((currentConsole)=>{
              let gamesForCurrentConsole = games.filter((game)=>{
                if(game.consoles.includes(currentConsole.console_name)){
                  return game
                }
              })
              return <Highlight
                title={currentConsole.console_name}
                items={gamesForCurrentConsole} 
                key={currentConsole.id}/>
            })}
            
            </div>}
    </>
  )
}

export default PlatformPage