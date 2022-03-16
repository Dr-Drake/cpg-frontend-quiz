import React from 'react';
import styles from './footer.module.css';
import Image from 'next/image'

const Footer: React.FC<any> = ()=>{

    return(
        <footer className={styles.footer}>
            <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            >
            Powered By{' '}
            <span className={styles.logo}>
                <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
            </span>
            </a>
      </footer>
    )
}

export default Footer;