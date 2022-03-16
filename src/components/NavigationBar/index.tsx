import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import Link from 'next/link';
import styles from './navbar.module.css';
import { useRouter } from 'next/router';

const NavigationBar: React.FC<any> = ()=>{

    // Hooks
    const router = useRouter();

    return(
        <nav className={styles.navbar}>
            {/** Branding */}
            <div className={styles.brand}>
                <Link href='/'>
                    <a>
                        <HomeIcon/>
                    </a>
                </Link>
            </div>

            {/** Main menu */}
            <div className={styles.menu}>
                <Link href='/sessions'>
                    <a className={router.pathname === '/sessions' ? `${styles.active}`: undefined}>
                        Ongoing Sessions
                    </a>
                </Link>
                <Link href='/edit'>
                    <a className={router.pathname === '/edit' ? `${styles.active}`: undefined}>
                        Edit Questions
                    </a>
                </Link>
                <Link href='/'>
                    <a>
                        Scores
                    </a>
                </Link>
            </div>
        </nav>
    )
}

export default NavigationBar;