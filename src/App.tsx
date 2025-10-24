// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// --- Auth ---
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserDataProvider } from './context/UserDataContext'; // <-- IMPORT THIS

import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

// --- Layout & Sidebar ---
import Sidebar from './components/Sidebar';

// --- Page Components ---
import Home from './pages/Home';
import GenerateRecommendations from './pages/GenerateRecommendations';
import RecentGenerations from './pages/RecentGenerations';
import BrowseBooks from './pages/BrowseBooks';
import ImportData from './pages/ImportData';
import UserProfile from './pages/UserProfile';
import MyRecommendations from './pages/MyRecommendations';
import TipJar from './pages/TipJar';

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      {children}
    </motion.div>
);

// This component contains the main app layout with the sidebar
const MainAppLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <Sidebar isOpen={isSidebarOpen} setOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-x-hidden overflow-y-auto">
                    <div className="container mx-auto px-6 py-8">
                        <AnimatePresence mode="wait">
                            <Routes location={location} key={location.pathname}>
                                <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
                                <Route path="/generate-recommendations" element={<PageWrapper><GenerateRecommendations /></PageWrapper>} />
                                <Route path="/recent-generations" element={<PageWrapper><RecentGenerations /></PageWrapper>} />
                                <Route path="/browse-books" element={<PageWrapper><BrowseBooks /></PageWrapper>} />
                                <Route path="/import-data" element={<PageWrapper><ImportData /></PageWrapper>} />
                                <Route path="/user-profile" element={<PageWrapper><UserProfile /></PageWrapper>} />
                                <Route path="/my-recommendations" element={<PageWrapper><MyRecommendations /></PageWrapper>} />
                                <Route path="/tip-jar" element={<PageWrapper><TipJar /></PageWrapper>} />
                            </Routes>
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div>
    );
}

const App: React.FC = () => {
    return (
        <AuthProvider>
            <UserDataProvider>
                <Router>
                    <Routes>
                        {/* Public Route */}
                        <Route path="/login" element={<LoginPage />} />

                        {/* Protected Routes */}
                        <Route
                            path="/*"
                            element={
                                <ProtectedRoute>
                                    <MainAppLayout />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </Router>
            </UserDataProvider>
        </AuthProvider>
    );
};

export default App;