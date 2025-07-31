import { BrowserRouter, Navigate,  Route, Routes } from 'react-router-dom';
import HomePage from './ui/HomePage';
import Dashboard from './Components/Dashboard';
import LoginPage from './Components/LoginPage';
import DashBoardLayout from './features/dashboard/DashboardLayout';
import Staffs from './Components/Staffs';
import Attendance from './Components/Attendance';
import SettingsPage from './features/settings/SettingsPage';
import ProfileCard from './Components/ProfileCard';
import { StaffProvider } from './context/staffContext';
import { SettingsProvider } from './context/settingsContext';
import { AttendanceProvider } from './context/AttendanceContext';
import { NotificationProvider } from './context/NotificationProvider';
import ProtectedRoute from './features/authentication/ProtectedRoute';

function App() {

  return (
    <SettingsProvider>
    <NotificationProvider>
    <AttendanceProvider>
    <StaffProvider>

   <BrowserRouter future={{
     v7_relativeSplatPath: true,
     v7_startTransition: true,
    }}>
    <Routes>
      <Route index element={<HomePage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path="/admin" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute> } >
        <Route index element={<Navigate replace to="dashboard" />} />
        <Route path='dashboard' element={<DashBoardLayout />} />
        <Route path='staff' element={<Staffs />} />
        <Route path='attendance' element={<Attendance />} />
        <Route path='profile' element={<ProfileCard />} />
        <Route path='settings' element={<SettingsPage />} />
        <Route path='logout' element={<HomePage />}  />
      </Route>
      <Route path="*" element={<p>Page Not found</p>} />
    </Routes>
   </BrowserRouter>
    </StaffProvider>
      </AttendanceProvider>
    </NotificationProvider>
      </SettingsProvider>
  );
}

export default App;
