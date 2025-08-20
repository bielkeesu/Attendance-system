import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getApiUrl } from "../utils/apiConfig";

function Logo({ logoName, logo, className }) {
  const [apiUrl, setApiUrl] = useState("");

  useEffect(() => {
    async function fetchApiUrl() {
      const url = await getApiUrl();
      setApiUrl(url);
    }
    fetchApiUrl();
  }, []);

  if (!apiUrl) return null; // or a loader while fetching

  return (
    <div>
      <Link to="/" className={className}>
        <img
          src={`${apiUrl}/uploads/${logo}`}
          className="w-10 h-10 rounded-full"
          alt="logo"
        />
        <p className="max-w-xs md:max-w-full text-center lg:text-sm text-lg font-sans font-semibold hidden md:block px-4">
          {logoName}
        </p>
      </Link>
    </div>
  );
}

export default Logo;
