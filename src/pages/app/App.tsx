import { Routes, Route } from 'react-router-dom';
import Header from '../../components/Header';
import Profile from '../profile/Profile';
import Home from '../Home';
import Popup from '../../components/Popup';
import ProtectedRoute from '../../utils/ProtectedRoute';

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
