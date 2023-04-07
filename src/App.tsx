import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import CreatePatient from './pages/Profiles/CreatePatient';
import Home from './pages/Home';

function App() {
    return (
        <>
            <Header />

            <Routes>
                <Route path='/' element={<Home />}></Route>
                <Route
                    path='/profiles/patients/create'
                    element={<CreatePatient />}
                ></Route>
            </Routes>
        </>
    );
}

export default App;
