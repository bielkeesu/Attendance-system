<<<<<<< HEAD
import API_BASE_URL from "../utils/apiConfig";

function Image() {
  return (
    <img
      src={`${API_BASE_URL}/uploads/`}
=======
function Image() {
  return (
    <img
      src={`http://localhost:5000/uploads/`}
>>>>>>> 791259eeeb0efb2fdf9e8ddde3dde4f598f909e5
      alt="UserProfile"
      className="mx-auto my-3 h-24 w-24"
    />
  );
}

export default Image;
