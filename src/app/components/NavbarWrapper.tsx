import React from 'react';
import Navbar from './Navbar';
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