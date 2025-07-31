function Error({error}) {
    return (
      <div className="fixed top-10 bg-orange-500 text-white px-4 py-2 rounded shadow transition-all duration-300 z-50">
      ⚠️ Warning! {error} 
    </div>
    )
}



export default Error
