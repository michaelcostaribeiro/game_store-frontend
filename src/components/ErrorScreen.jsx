// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';


import React from 'react'

const ErrorScreen = ({ message }) => {
  return (
    <div className='min-h-[70vh]  flex flex-col items-center justify-center text-[2rem]'>
      <FontAwesomeIcon icon={faCircleXmark}  className='text-[3rem]'/>
      {message || "Ocorreu um erro inesperado."}
    </div>
  )
}

export default ErrorScreen