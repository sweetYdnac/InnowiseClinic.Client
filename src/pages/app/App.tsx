import { Route, Routes } from 'react-router-dom';
import Header from '../../components/Header';
import Popup from '../../components/Popup';
import ProtectedRoute from '../../utils/ProtectedRoute';
import Home from '../Home';
import Profile from '../profile/Profile';

function App() {
    return (
        <>
            <Header />

            <Routes>
                <Route path='/' element={<Home />}></Route>
                <Route
                    path='/profile'
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                ></Route>
            </Routes>

            <Popup />
        </>
    );
}

export default App;
