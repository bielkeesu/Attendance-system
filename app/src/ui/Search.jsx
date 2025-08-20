function Search({onChange, filter, value}) {
    return (
        <div className="flex flex-row space-x-2 items-center">
        <input
          type="text"
          placeholder="Search..."
          className="border-b focus:outline-none w-full sm:w-fit"
         value={value}
          onChange={onChange}
        />
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 text-gray-300 duration-200 hover:scale-110"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <circle cx="10" cy="10" r="7" />
            <line x1="21" y1="21" x2="15" y2="15" />
          </svg>
        </button>
      </div>
    )
}

export default Search
