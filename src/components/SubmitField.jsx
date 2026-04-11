const SubmitField = ({value}) => {
  return (
      <input type="submit" value={value}
          className="bg-white text-black font-semibold rounded-md px-3 py-1 focus:outline-0 text-2xl" />
  )
}

export default SubmitField