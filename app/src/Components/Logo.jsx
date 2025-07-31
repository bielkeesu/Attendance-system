import { Link } from "react-router-dom";

function Logo({logoName, logo, className}) {
  return (
    <div>
      <Link to={'/'}
        className={className}
      >
        <img
          src={`http://localhost:5000/uploads/${logo}`}
          className="w-10 h-10 rounded-full"
          alt="logo"
          />
          <p className="max-w-xs md:max-w-full text-center lg:text-sm text-lg font-sans font-semibold px-4">{logoName}</p>
      </Link>
    </div>
  );
} 

export default Logo;
