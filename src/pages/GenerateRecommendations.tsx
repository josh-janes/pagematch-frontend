// src/pages/GenerateRecommendations.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRecommendations, Recommendation } from '../api/mockService';
import { useUserData } from '../context/UserDataContext';
import BookCard from '../components/BookCard';
import ExpandedBookView from '../components/ExpandedBookView';
import { ArrowLeftIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

// A collection of fun "flavor text" to show during loading
const loadingTexts = [
    "Consulting the literary oracle...",
    "Shuffling the virtual library...",
    "Waking the bookworms...",
    "Brewing a fresh pot of recommendations...",
    "Asking the AI what it's reading...",
    "Turning the digital pages...",
    "Finding hidden gems...",
];

// Framer Motion animation variants for the recommendation cards
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // This makes each child animate in sequence
    },
  },
};

const cardVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
};

const GenerateRecommendations: React.FC = () => {
    // State from our persistent context
    const { generationsLeft, decrementGenerations } = useUserData();

    // Local state for this component's UI
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [flavorTextIndex, setFlavorTextIndex] = useState(0);
    const [selectedBookId, setSelectedBookId] = useState<number | null>(null);

    // This effect cycles through the flavor text when loading
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isLoading) {
            interval = setInterval(() => {
                setFlavorTextIndex(prevIndex => (prevIndex + 1) % loadingTexts.length);
            }, 2000); // Change text every 2 seconds
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    const handleGenerate = async () => {
        if (generationsLeft > 0 && !isLoading) {
            setIsLoading(true);
            setRecommendations([]); // Clear previous recommendations to show loading spinner
            try {
                const recs = await getRecommendations(1); // Mock user ID
                setRecommendations(recs);
                decrementGenerations(); // Use the context function to update persistent state
            } catch (error) {
                console.error("Failed to generate recommendations:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleDeleteRecommendation = (bookIdToDelete: number) => {
        setRecommendations(currentRecs => currentRecs.filter(rec => rec.bookId !== bookIdToDelete));
    };

    return (
        <div className="flex flex-col items-center text-center w-full">
            <div className="w-full max-w-5xl">
                <div className="self-start w-full">
                    <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-8 transition-colors">
                        <ArrowLeftIcon className="h-5 w-5" />
                        Back to Home
                    </Link>
                </div>

                <h1 className="text-4xl font-extrabold text-gray-800">Generate Your Reading List</h1>
                <p className="mt-2 text-gray-500">
                    You have <span className="font-bold text-indigo-600">{generationsLeft}</span> generation
                    {generationsLeft !== 1 ? 's' : ''} left today.
                </p>

                <motion.button
                    onClick={handleGenerate}
                    disabled={generationsLeft === 0 || isLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-6 bg-indigo-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all duration-300"
                >
                    {isLoading ? 'Generating...' : 'Get Recommendations'}
                </motion.button>

                <div className="mt-12 min-h-[400px] w-full flex justify-center items-center">
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            >
                                <SparklesIcon className="h-16 w-16 text-indigo-500" />
                            </motion.div>
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={flavorTextIndex}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-gray-600 font-medium"
                                >
                                    {loadingTexts[flavorTextIndex]}
                                </motion.p>
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {!isLoading && recommendations.length > 0 && (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full"
                        >
                            {recommendations.map((rec) => (
                                <motion.div key={rec.bookId} variants={cardVariants}>
                                    <BookCard
                                        book={rec}
                                        layoutId={`book-card-${rec.bookId}`}
                                        onClick={() => setSelectedBookId(rec.bookId)}
                                        onDelete={() => handleDeleteRecommendation(rec.bookId)}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {!isLoading && recommendations.length === 0 && (
                        <div className="text-center text-gray-500">
                            <h3 className="text-xl font-semibold">Ready to discover?</h3>
                            <p>Click the button above to get your personalized recommendations!</p>
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {selectedBookId && (
                    <ExpandedBookView
                        bookId={selectedBookId}
                        layoutId={`book-card-${selectedBookId}`}
                        onClose={() => setSelectedBookId(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default GenerateRecommendations;