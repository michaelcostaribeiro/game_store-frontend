// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const DataField = ({ dataIcon, dataTitle, dataContent }) => {
    const isArray = Array.isArray(dataContent)
    return (
        <div className='flex px-3 py-5 gap-4 items-center'>
            <FontAwesomeIcon icon={dataIcon} aria-hidden='true' className='-scale-x-100 text-3xl' />
            <div>
                <dt className='font-semibold text-tertiary'>{dataTitle}</dt>
                {isArray ?(<div className='flex flex-wrap gap-x-1'>
                    {dataContent.map((content, i) => {
                        return <dd key={i} className='inline'>
                            {content}
                            {i < dataContent.length-1 && ','}</dd>
                    })}</div>)
                    : <dd>{dataContent}</dd>}
            </div>
        </div>

    )
}

export default DataField