import React from 'react'

const TagsField = ({ tags }) => {
    console.log(tags)
    return (
        <dl className=' p-3'>
            <dt className='subtitle'>Tags relacionadas</dt>
            <div className='flex gap-2'>
            {tags.map((tag, i) => {
                return <dd key={i} className='inline bg-secondary-light text-tertiary p-1 font-semibold rounded-md'>{tag}</dd>
            })}
            </div>
        </dl>
    )
}

export default TagsField