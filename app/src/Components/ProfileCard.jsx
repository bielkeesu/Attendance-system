import ProfileBox from '../features/profile/ProfileBox';
import Headings from '../ui/Headings';


const adminDetail = 
  {
    roll: "Admin",
    username: 'admin@wxample.com',
    officeNo: '090xxxxx77',
  }
;

function ProfileCard() {
  return (
    <div className="flex items-center justify-center bg-slate-100 h-full rounded-xl">
      <div className="w-1/2 rounded-xl bg-white p-6 shadow-xl">
      <img
              src="/images/profile-1.jpg"
              alt="aman"
              className="rounded-full"
            />
        <Headings className="mx-auto max-w-[200px] text-center text-xl font-bold text-slate-600 lg:max-w-full">
        </Headings>
    <div className="my-6 mx-auto flex max-w-lg flex-col space-y-2">


        <ProfileBox>
      <p className="text-slate-500">Roll</p>
      <span id="profileId" className="font-semibold text-slate-700">
        {adminDetail.roll}
      </span>
    </ProfileBox>
    <ProfileBox>
      <p className="text-slate-500">Username</p>
      <span id="profileId" className="font-semibold text-slate-700">
        {adminDetail.username}
      </span>
    </ProfileBox>
    <ProfileBox>
      <p className="text-slate-500">Phone No.</p>
      <span id="profileId" className="font-semibold text-slate-700">
        {adminDetail.officeNo}
      </span>
    </ProfileBox>
    </div>
      </div>
    </div>
  );
}

export default ProfileCard;
