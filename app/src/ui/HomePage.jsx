import Header from './Header'
import Main from '../Components/Main';
import MainAttendanceForm from '../features/main/MainAttendanceForm';
import useApiHealth from '../hooks/useApiHealth';


function HomePage() {
  const { error, loading } = useApiHealth();

  return <div className="min-h-screen bg-slate-100">
    <Header />
    {loading && <p className='text-center my-32 text-lg'>🔄 Checking backend connection...</p>}
    {error && (
        <div className="flex justify-center items-center h-[80vh]">
          <div className="text-center text-red-600 text-xl font-semibold">
            ⚠️ {error}
          </div>
        </div>
      ) 
}
    <Main>
      <MainAttendanceForm />
    </Main>
  </div>;
}

export default HomePage;