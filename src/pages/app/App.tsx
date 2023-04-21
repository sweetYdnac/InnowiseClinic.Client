import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../../utils/ProtectedRoute';
import Home from '../home/Home';
import Layout from '../layout/Layout';
import Profile from '../profile/Profile';
import Doctors from '../doctors/Doctors';
import DoctorInformation from '../doctors/DoctorInformation';
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
                            <Profile />
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
                    path='/doctor/:id?'
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
            </Route>
        </Routes>
    );
}

export default App;
