import React from 'react'
import { Header } from '../front/inc/Header';
import Footer from '../front/inc/Footer';
const FrontLayout = ({ cmp }) => {
    const Component = cmp;
    return (
        <>
            <Header />
            <Component />
            <Footer />
        </>
    )
}

export default FrontLayout