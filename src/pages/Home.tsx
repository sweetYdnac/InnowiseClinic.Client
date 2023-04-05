import { FunctionComponent, useState } from 'react';
import Header from '../components/Header';

const Home: FunctionComponent = () => {
    return (
        <div>
            <header>
                <Header />
            </header>
            <div>Hello it's home page!</div>
        </div>
    );
};

export default Home;
