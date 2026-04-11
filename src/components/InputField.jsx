const InputField = ({type,name,id, placeholder, label=''}) => {
  return (
    <>
      {label ?
        <label htmlFor={name} className="text-2xl">{label}</label>
       : ""}
      <input type={type} name={name} id={id} placeholder={placeholder} 
      className='w-full bg-primary border-2 rounded-md px-3 py-1 focus:outline-0 placeholder:font-bold'/>
    </>
  )
}

export default InputField