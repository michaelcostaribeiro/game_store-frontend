import { Link } from "react-router-dom"

const Highlight = ({ title, items }) => {
  return (
    <div className='w-full overflow-hidden xl:px-50'>

      {title && <div className='flex items-center py-5 px-2 w-full'>
        <div className='flex-1 h-0.5 bg-secondary'></div>
        <h1 className='px-2 tracking-widest uppercase md:text-lg'>{title}</h1>
        <div className='flex-1 h-0.5 bg-secondary'></div>

      </div>}
      <ul className='flex w-full overflow-x-scroll snap-x '>
        {items.map((item) => {
          return <li key={item.id} className='
          p-3 min-w-10/12 max-h-55 snap-start overflow-y-hidden 
          md:min-w-5/12 md:max-h-60
          xl:min-w-3/15 xl:max-w-3/15
          '>
            <Link to={`/game/${item.id}`}>
              <img src={item.img_url} alt={item.title} className='rounded-xl h-40 w-full object-cover' />
              <div className='flex justify-between my-2'>
                <p className='font-semibold'>{item.title}</p>
                <p className="min-w-max">R$ {item.price}</p>
              </div>

            </Link>
          </li>
        })}
      </ul>
    </div>
  )
}

export default Highlight