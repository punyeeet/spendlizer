import React from 'react';
import { Navbar } from './Menu'; "@/components/Menu";
import '../styles/font.css'

const Layout = ({ children }:any) => {
    return (
        <div className='roboto-regular'>
            <Navbar/>
            <main>{children}</main>
        </div>
    );
};

export default Layout;