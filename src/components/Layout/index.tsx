import React from 'react';
import Footer from '../Footer';
import NavigationBar from '../NavigationBar';
import styles from './layout.module.css';

export interface LayoutProps{
    children: React.ReactNode;
    showHeader?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children })=>{
    return(
        <div className={styles.container}>
            
            {/* Aligned to the top */}
            <div className="flex-grow-1">
                <NavigationBar/>
                <div>{children}</div>
            </div>

            {/* Aligned to the bottom */}
            <Footer/>
        </div>
    )
}

export default Layout;