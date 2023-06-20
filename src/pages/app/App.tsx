import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../../utils/ProtectedRoute';
import AppointmentResult from '../appointments/AppointmentResult';
import DoctorInformation from '../doctors/DoctorInformation';
import Doctors from '../doctors/Doctors';
import Home from '../home/Home';
import Layout from '../layout/Layout';
import PatientProfile from '../profile/PatientProfile';
import Services from '../services/Services';

function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path='/' element={<Home />}></Route>
                <Route
                    path='/profile'
                    element={
                        <ProtectedRoute>
                            <PatientProfile />
                        </ProtectedRoute>
                    }
                ></Route>
                <Route
                    path='/doctors/:page?'
                    element={
                        <ProtectedRoute>
                            <Doctors />
                        </ProtectedRoute>
                    }
                ></Route>
                <Route
                    path='/doctor/:id'
                    element={
                        <ProtectedRoute>
                            <DoctorInformation />
                        </ProtectedRoute>
                    }
                ></Route>
                <Route
                    path='/services'
                    element={
                        <ProtectedRoute>
                            <Services />
                        </ProtectedRoute>
                    }
                ></Route>
                <Route
                    path='/appointments/results/:id'
                    element={
                        <ProtectedRoute>
                            <AppointmentResult />
                        </ProtectedRoute>
                    }
                ></Route>
            </Route>
        </Routes>
    );
}

export default App;
