import Header from './Header'
import Main from '../Components/Main';
import MainAttendanceForm from '../features/main/MainAttendanceForm';


function HomePage() {

  return <div className="min-h-screen bg-slate-100">
    <Header />
    <Main>
      <MainAttendanceForm />
    </Main>
  </div>;
}

export default HomePage;
