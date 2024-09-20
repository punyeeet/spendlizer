"use client"
import React, { memo, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import Image from 'next/image'



const Navbar = ({ children }: any) => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: any) => pathname === path;

  return (
    <div>
      {/* Navbar Section */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>
          <div>

          <Image
            src='/logo.jpeg'
            width={150}
            height={100}
            
            alt="Picture of the author"
          />
          </div>
        </div>
        <ul style={styles.navLinks}>
          <li>
            <Link href="/dashboard" passHref>
              <span style={isActive('/dashboard') ? styles.activeLink : styles.link}>Home</span>
            </Link>
          </li>
          <li>
            <Link href="/analysis" passHref>
              <span style={isActive('/analysis') ? styles.activeLink : styles.link}>Analyze</span>
            </Link>
          </li>
          <li>
            <Link href="/profile" passHref>
              <span style={isActive('/profile') ? styles.activeLink : styles.link}>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Render other components passed as children */}
      <div style={styles.content}>{children}</div>
    </div>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    backgroundColor: 'black',
    height: '60px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
  },
  logoText: {
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  navLinks: {
    listStyleType: 'none',
    display: 'flex',
    gap: '20px',
    margin: 0,
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '18px',
    cursor: 'pointer',
  },
  activeLink: {
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    textShadow: '1px 1px 2px white, 0 0 1em blue, 0 0 0.2em blue',
  },
  content: {
    padding: '0px',
  },
};

export default Navbar;

