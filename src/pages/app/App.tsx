import { Routes, Route } from 'react-router-dom';
import Header from '../../components/Header';
import Profile from '../../components/Profile';
import Home from '../Home';
import Popup from '../../components/Popup';
import AuthVerify from '../../utils/AuthVerify';

function App() {
    return (
        <>
            <Header />

            <Routes>
                <Route path='/' element={<Home />}></Route>
                <Route path='/profile' element={<Profile />}></Route>
            </Routes>

            <Popup />
            <AuthVerify />
        </>
    );
}

export default App;
