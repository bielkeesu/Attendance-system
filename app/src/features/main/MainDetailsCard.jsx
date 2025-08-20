import API_BASE_URL from "../../utils/apiConfig";
import ProfileData from "../profile/ProfileData";
import ProfileDetails from "../profile/ProfileDetails";

function MainDetailsCard({staffDetails}) {
const profileDetails = [
  staffDetails.staff
];

  return (
    <div className="w-[40rem]">
      <div className="flex items-center justify-center bg-slate-100 rounded-xl">
      <div className="w-1/2 rounded-xl bg-white p-6 shadow-xl">
      <img
              src={`${API_BASE_URL}/uploads/${staffDetails.staff.imageUrl}`}
              alt="aman"
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
