// import API_BASE_URL from "../utils/apiConfig";
const API_BASE_URL = "https://attendance-system-p8yd.onrender.com";


function Image() {
  return (
    <img
      src={`${API_BASE_URL}/uploads/`}
      alt="UserProfile"
      className="mx-auto my-3 h-24 w-24"
    />
  );
}

export default Image;
