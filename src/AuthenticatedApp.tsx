import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import UserMenu from "./components/UserMenu";
import { useAuthContext } from "./contexts/auth-context";
import PatientDetail from "./pages/patient-detail";
import PatientsList from './pages/patients-list';

export default function AuthenticatedApp() {
  const { user } = useAuthContext();

  return (
    <>
      <div className="flex justify-between">
        <NavLink
          to="/patients"
          className={(isActive) => {return isActive? "text-green-500 text-lg": "text-lg"}}
        >
          Patients
        </NavLink>
        <UserMenu user={user} />
      </div>

      <main>
        <Routes>
          <Route path={"/patients"} element={<PatientsList />} />
          <Route path={"/patients/:patientId"} element={<PatientDetail />} />
        </Routes>
      </main>
    </>
  )
}
