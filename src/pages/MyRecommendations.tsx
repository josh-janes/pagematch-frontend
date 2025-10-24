// src/pages/MyRecommendations.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Recommendation, getAllRecommendationHistory } from '../api/mockService';
import { useUserData } from '../context/UserDataContext';
import BookCard from '../components/BookCard';
import ExpandedBookView from '../components/ExpandedBookView';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

// Animation variants for the book grids
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120 } },
};

const MyRecommendations: React.FC = () => {
    const [allRecs, setAllRecs] = useState<Recommendation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
    const [isIgnoredSectionOpen, setIsIgnoredSectionOpen] = useState(false); // Collapsed by default

    const { bookmarkedIds, ratedBooks } = useUserData();

    useEffect(() => {
        const fetchHistory = async () => {
            setIsLoading(true);
            try {
                const history = await getAllRecommendationHistory(1); // Mock user ID
                setAllRecs(history);
            } catch (error) {
                console.error("Failed to fetch recommendation history:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);

    // useMemo will efficiently re-calculate these lists only when the underlying data changes
    const { savedBooks, ignoredBooks, recommendationHistory } = useMemo(() => {
        const ignoredBookIds = Object.entries(ratedBooks)
            .filter(([, rating]) => rating === 'bad')
            .map(([bookId]) => Number(bookId));

        const saved = allRecs.filter(rec => bookmarkedIds.includes(rec.bookId));
        const ignored = allRecs.filter(rec => ignoredBookIds.includes(rec.bookId));

        const history = allRecs.filter(rec => 
            !bookmarkedIds.includes(rec.bookId) && 
            !ignoredBookIds.includes(rec.bookId)
        );

        return { savedBooks: saved, ignoredBooks: ignored, recommendationHistory: history };
    }, [allRecs, bookmarkedIds, ratedBooks]);
    
    // This allows removing a book from the view locally if the user "deletes" it
    const handleDeleteRecommendation = (bookIdToDelete: number) => {
        setAllRecs(currentRecs => currentRecs.filter(rec => rec.bookId !== bookIdToDelete));
    };

    const renderBookGrid = (books: Recommendation[], layoutPrefix: string) => (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
            {books.map((rec) => (
                <motion.div key={`${layoutPrefix}-${rec.bookId}`} variants={cardVariants}>
                    <BookCard
                        book={rec}
                        layoutId={`${layoutPrefix}-${rec.bookId}`}
                        onClick={() => setSelectedBookId(rec.bookId)}
                        onDelete={() => handleDeleteRecommendation(rec.bookId)}
                    />
                </motion.div>
            ))}
        </motion.div>
    );

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">My Library</h1>

            {isLoading ? (
                <div className="text-center p-10"><p className="text-gray-600">Loading your library...</p></div>
            ) : (
                <div className="space-y-12">
                    {/* Section 1: Saved Books */}
                    {savedBooks.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-6">Saved Books</h2>
                            {renderBookGrid(savedBooks, 'saved')}
                        </section>
                    )}

                    {/* Section 2: All Previous Recommendations */}
                    {recommendationHistory.length > 0 && (
                         <section>
                            <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-6">Recommendation History</h2>
                            {renderBookGrid(recommendationHistory, 'history')}
                        </section>
                    )}

                    {/* Section 3: Ignored Books (Collapsible) */}
                    {ignoredBooks.length > 0 && (
                        <section>
                            <div
                                className="flex justify-between items-center cursor-pointer border-b pb-2 mb-6"
                                onClick={() => setIsIgnoredSectionOpen(!isIgnoredSectionOpen)}
                            >
                                <h2 className="text-2xl font-semibold text-gray-700">Ignored Books</h2>
                                <motion.div animate={{ rotate: isIgnoredSectionOpen ? 180 : 0 }}>
                                    <ChevronDownIcon className="h-6 w-6 text-gray-600" />
                                </motion.div>
                            </div>
                            <AnimatePresence>
                                {isIgnoredSectionOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        {renderBookGrid(ignoredBooks, 'ignored')}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </section>
                    )}
                    
                    {/* Empty State Message */}
                    {savedBooks.length === 0 && recommendationHistory.length === 0 && ignoredBooks.length === 0 && (
                         <div className="text-center bg-white p-12 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-gray-700">Your Library is Empty</h3>
                            <p className="text-gray-500 mt-2">
                                Generate some recommendations to start building your library!
                            </p>
                        </div>
                    )}
                </div>
            )}

            <AnimatePresence>
                {selectedBookId && (
                    <ExpandedBookView
                        bookId={selectedBookId}
                        // We need to find which prefix to use for the layoutId
                        layoutId={
                            savedBooks.find(b => b.bookId === selectedBookId) ? `saved-${selectedBookId}` :
                            ignoredBooks.find(b => b.bookId === selectedBookId) ? `ignored-${selectedBookId}` :
                            `history-${selectedBookId}`
                        }
                        onClose={() => setSelectedBookId(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyRecommendations;