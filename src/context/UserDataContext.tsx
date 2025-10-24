// src/context/UserDataContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define the shape of our stored data
interface UserDataContextType {
    generationsLeft: number;
    bookmarkedIds: number[];
    ratedBooks: Record<number, 'good' | 'bad'>; // e.g., { 101: 'good', 102: 'bad' }
    decrementGenerations: () => void;
    toggleBookmark: (bookId: number) => void;
    rateBook: (bookId: number, rating: 'good' | 'bad') => void;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

// Helper functions to interact with localStorage
const getStoredData = <T,>(key: string, defaultValue: T): T => {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
        return JSON.parse(storedValue) as T;
    }
    return defaultValue;
};

export const UserDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Initialize state from localStorage or use default values
    const [generationsLeft, setGenerationsLeft] = useState<number>(() => getStoredData('bookrec-generations', 3));
    const [bookmarkedIds, setBookmarkedIds] = useState<number[]>(() => getStoredData('bookrec-bookmarks', []));
    const [ratedBooks, setRatedBooks] = useState<Record<number, 'good' | 'bad'>>(() => getStoredData('bookrec-ratings', {}));

    // --- Effects to save state changes to localStorage ---
    useEffect(() => {
        localStorage.setItem('bookrec-generations', JSON.stringify(generationsLeft));
    }, [generationsLeft]);

    useEffect(() => {
        localStorage.setItem('bookrec-bookmarks', JSON.stringify(bookmarkedIds));
    }, [bookmarkedIds]);

    useEffect(() => {
        localStorage.setItem('bookrec-ratings', JSON.stringify(ratedBooks));
    }, [ratedBooks]);

    // --- Action Functions ---
    const decrementGenerations = () => {
        setGenerationsLeft(prev => Math.max(0, prev - 1));
    };

    const toggleBookmark = (bookId: number) => {
        setBookmarkedIds(prevIds => 
            prevIds.includes(bookId)
                ? prevIds.filter(id => id !== bookId) // Remove bookmark
                : [...prevIds, bookId] // Add bookmark
        );
    };

    const rateBook = (bookId: number, rating: 'good' | 'bad') => {
        setRatedBooks(prevRatings => ({
            ...prevRatings,
            [bookId]: rating,
        }));
    };

    const value = {
        generationsLeft,
        bookmarkedIds,
        ratedBooks,
        decrementGenerations,
        toggleBookmark,
        rateBook,
    };

    return (
        <UserDataContext.Provider value={value}>
            {children}
        </UserDataContext.Provider>
    );
};

export const useUserData = () => {
    const context = useContext(UserDataContext);
    if (context === undefined) {
        throw new Error('useUserData must be used within a UserDataProvider');
    }
    return context;
};