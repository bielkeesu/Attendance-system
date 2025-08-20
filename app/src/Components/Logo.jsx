import { Link } from "react-router-dom";
import API_BASE_URL from "../utils/apiConfig";

function Logo({logoName, logo, className}) {
  return (
    <div>
      <Link to={'/'}
        className={className}
      >
        <img
          src={`${API_BASE_URL}/uploads/${logo}`}
          className="w-10 h-10 rounded-full"
          alt="logo"
          />
          <p className="max-w-xs md:max-w-full text-center lg:text-sm text-lg font-sans font-semibold hidden md:block px-4">{logoName}</p>
      </Link>
    </div>
  );
} 

export default Logo;
