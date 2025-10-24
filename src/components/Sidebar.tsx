// src/components/Sidebar.tsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
    HomeIcon,
    UserIcon,
    BookOpenIcon,
    ArrowUpOnSquareIcon,
    ArrowLeftOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
    GiftIcon, // <-- IMPORT THE NEW ICON
} from '@heroicons/react/24/outline';

interface SidebarProps {
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
}

// --- UPDATED NAV ITEMS ARRAY ---
const navItems = [
    { to: "/", icon: HomeIcon, label: "Home" },
    { to: "/my-recommendations", icon: BookOpenIcon, label: "My Library" },
    { to: "/import-data", icon: ArrowUpOnSquareIcon, label: "Import Data" },
    { to: "/user-profile", icon: UserIcon, label: "User Profile" },
    { to: "/tip-jar", icon: GiftIcon, label: "Tip Jar" }, // <-- ADDED THE NEW LINK
];
// --- END UPDATE ---

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setOpen }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const sidebarVariants = {
        open: { width: '240px', transition: { type: "spring", stiffness: 300, damping: 30 } },
        closed: { width: '80px', transition: { type: "spring", stiffness: 300, damping: 30 } },
    };

    const textVariants = {
        open: { opacity: 1, x: 0, transition: { delay: 0.1, duration: 0.2 } },
        closed: { opacity: 0, x: -10, transition: { duration: 0.1 } },
    };

    const getLinkClass = ({ isActive }: { isActive: boolean }) =>
      `flex items-center p-3 my-2 rounded-lg transition-colors duration-200 ${
        isActive ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
      }`;

    return (
        <motion.div
            animate={isOpen ? "open" : "closed"}
            variants={sidebarVariants}
            className="relative bg-gray-900 text-white flex flex-col h-full shadow-lg"
        >
            {/* Header */}
            <div className={`flex items-center p-4 border-b border-gray-700 ${isOpen ? 'justify-between' : 'justify-center'}`}>
                 {isOpen && <motion.span variants={textVariants} className="text-xl font-bold whitespace-nowrap">PageMatch</motion.span>}
                <button onClick={() => setOpen(!isOpen)} className="p-2 rounded-full hover:bg-gray-700 focus:outline-none">
                    {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-4 py-4">
                {navItems.map(item => (
                    <NavLink to={item.to} key={item.label} className={getLinkClass} end>
                        <item.icon className="h-6 w-6 flex-shrink-0" />
                        <motion.span variants={textVariants} className="ml-4 whitespace-nowrap">
                            {item.label}
                        </motion.span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer / User Profile Area */}
            <div className="px-4 py-4 border-t border-gray-700">
                <div className="flex items-center mb-4">
                    <img
                        className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                        src={user?.avatarUrl || 'https://via.placeholder.com/150'}
                        alt="User avatar"
                    />
                    <motion.div variants={textVariants} className="ml-3 whitespace-nowrap">
                        <p className="text-sm font-medium text-white">{user?.name}</p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                    </motion.div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full p-3 rounded-lg text-gray-400 hover:bg-red-800 hover:text-white transition-colors duration-200"
                >
                    <ArrowLeftOnRectangleIcon className="h-6 w-6 flex-shrink-0" />
                    <motion.span variants={textVariants} className="ml-4 whitespace-nowrap">
                        Logout
                    </motion.span>
                </button>
            </div>
        </motion.div>
    );
};

export default Sidebar;