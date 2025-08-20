import { useState, useEffect } from "react";
import { getApiUrl } from "../../utils/apiConfig";
import ProfileData from "../profile/ProfileData";
import ProfileDetails from "../profile/ProfileDetails";

function MainDetailsCard({ staffDetails }) {
  const [apiUrl, setApiUrl] = useState("");

  const profileDetails = [staffDetails.staff];

  useEffect(() => {
    async function fetchApiUrl() {
      const url = await getApiUrl();
      setApiUrl(url);
    }
    fetchApiUrl();
  }, []);

  if (!apiUrl) return null; // or a loader while fetching

  return (
    <div className="w-[40rem]">
      <div className="flex items-center justify-center bg-slate-100 rounded-xl">
        <div className="w-1/2 rounded-xl bg-white p-6 shadow-xl">
          <img
            src={`${apiUrl}/uploads/${staffDetails.staff.imageUrl}`}
            alt={staffDetails.staff.fullname}
            className="rounded-full w-20 h-20"
          />
          <ProfileDetails>
            {profileDetails.map((details) => (
              <ProfileData details={details} key={details.id} />
            ))}
          </ProfileDetails>
        </div>
      </div>
    </div>
  );
}

export default MainDetailsCard;
