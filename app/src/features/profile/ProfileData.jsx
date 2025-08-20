import ProfileBox from './ProfileBox';

function ProfileData({ details }) {
  return (
    <>
    <ProfileBox>
      <p className="text-slate-500">ID</p>
      <span id="profileId" className="font-semibold text-slate-700">
        {details.staffId}
      </span>
    </ProfileBox>
    <ProfileBox>
      <p className="text-slate-500">full Name</p>
      <span id="profileId" className="font-semibold text-slate-700">
        {details.fullname}
      </span>
    </ProfileBox>
    <ProfileBox>
      <p className="text-slate-500">Office No.</p>
      <span id="profileId" className="font-semibold text-slate-700">
        {details.officeNo}
      </span>
    </ProfileBox>
    <ProfileBox>
      <p className="text-slate-500">Phone No.</p>
      <span id="profileId" className="font-semibold text-slate-700">
        {details.phoneNo}
      </span>
    </ProfileBox>
    <ProfileBox>
      <p className="text-slate-500">Office No.</p>
      <span id="profileId" className="font-semibold text-slate-700">
        {details.officeNo}
      </span>
    </ProfileBox>
    </>
  );
}

export default ProfileData;
