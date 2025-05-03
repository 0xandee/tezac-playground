'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWallet } from '@/hooks/useWallet';
import PXEStatus from '../PXEStatus';

// Import icons from react-icons
import { FaShoppingCart, FaHome, FaBars } from 'react-icons/fa';
import { FaTrashCan, FaShieldHalved, FaBridge, FaWallet } from 'react-icons/fa6';
import { GiDigDug } from "react-icons/gi";
import { BsFillSendFill } from "react-icons/bs";
import { MdLocalOffer } from "react-icons/md";
import { RiContractFill } from "react-icons/ri";

// Import logo component
import TezacLogo from '../ui/TezacLogo';

// Navigation links with icons
const navLinks = [
    { path: '/', label: 'README', icon: <FaHome size={20} /> },
    { path: '/deploy', label: 'Deploy', icon: <RiContractFill size={20} /> },
    { path: '/mint', label: 'Mint', icon: <GiDigDug size={20} /> },
    { path: '/transfer', label: 'Transfer', icon: <BsFillSendFill size={20} /> },
    { path: '/listing', label: 'Listing', icon: <MdLocalOffer size={20} /> },
    { path: '/cancel-listing', label: 'Cancel Listing', icon: <FaTrashCan size={20} />, className: '' },
    { path: '/buy', label: 'Buy', icon: <FaShoppingCart size={20} /> },
    { path: '/verify-ownership', label: 'Verify', icon: <FaShieldHalved size={20} /> },
    { path: '/bridge', label: 'Bridge (WIP)', icon: <FaBridge size={20} /> },
];

// Custom NavLink component that works like the react-router NavLink
const NavLink = ({
    children,
    href,
    className,
    activeClassName,
    exact = false
}: {
    children: React.ReactNode | (({ isActive }: { isActive: boolean }) => React.ReactNode);
    href: string;
    className: string;
    activeClassName: string;
    exact?: boolean;
}) => {
    const pathname = usePathname();
    const isActive = exact ? pathname === href : pathname.startsWith(href);

    return (
        <Link
            href={href}
            className={`${className} ${isActive ? activeClassName : ''}`}
        >
            {typeof children === 'function' ? children({ isActive }) : children}
        </Link>
    );
};

interface AppLayoutProps {
    children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { isConnected, connecting, connectWallet, disconnectWallet } = useWallet();

    const handleConnectWallet = () => {
        if (isConnected) {
            disconnectWallet();
        } else {
            connectWallet();
        }
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    // Close menu when clicking outside or navigating
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (menuOpen && !target.closest('.sidebar') && !target.closest('.menu-toggle')) {
                setMenuOpen(false);
            }
        };

        const handleResize = () => {
            if (window.innerWidth > 768 && menuOpen) {
                setMenuOpen(false);
            }
        };

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [menuOpen]);

    // Close menu when navigating
    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    return (
        <div className="app-container">
            <button
                className="menu-toggle"
                onClick={toggleMenu}
                aria-label="Toggle navigation menu"
            >
                <FaBars size={24} />
            </button>

            <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
                <div className="logo">
                    <TezacLogo />
                </div>

                <nav className="sidebar-nav">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            href={link.path}
                            className={`nav-item ${link.className || ''}`}
                            activeClassName="active"
                            exact={link.path === '/'}
                        >
                            {({ isActive }: { isActive: boolean }) => (
                                <>
                                    {isActive && <div className="nav-active-indicator"></div>}
                                    <span className="nav-icon">{link.icon}</span>
                                    <span>{link.label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <button
                    className={`wallet-button ${isConnected ? 'connected' : ''} ${connecting ? 'loading' : ''}`}
                    onClick={handleConnectWallet}
                    disabled={connecting}
                >
                    <FaWallet size={20} />
                    <span>{connecting ? 'Connecting...' : isConnected ? 'Connected' : 'Connect Wallet'}</span>
                </button>

                <div className="mt-4 wallet-button">
                    <PXEStatus />
                </div>
            </aside>

            <main className={`content ${scrolled ? 'scrolled' : ''}`}>
                {children}
            </main>
        </div>
    );
};

export default AppLayout; 