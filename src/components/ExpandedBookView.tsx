// src/components/ExpandedBookView.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getBookDetails, Book, rateRecommendation } from '../api/mockService';
import { useUserData } from '../context/UserDataContext';
import BookCover from './BookCover';
import {
    XMarkIcon,
    BookmarkIcon as BookmarkSolidIcon,
    StarIcon,
    HandThumbUpIcon,
    HandThumbDownIcon,
    ArrowTopRightOnSquareIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/solid';
import { BookmarkIcon as BookmarkOutlineIcon } from '@heroicons/react/24/outline';

interface ExpandedBookViewProps {
    bookId: number;
    layoutId: string;
    onClose: () => void;
}

const ExpandedBookView: React.FC<ExpandedBookViewProps> = ({ bookId, layoutId, onClose }) => {
    // Local state for fetching book data
    const [book, setBook] = useState<Book | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Persistent state from our global context
    const { bookmarkedIds, ratedBooks, toggleBookmark, rateBook } = useUserData();

    // State that is "derived" from the context, not stored locally.
    const isBookmarked = bookmarkedIds.includes(bookId);
    const currentRating = ratedBooks[bookId];

    useEffect(() => {
        const fetchDetails = async () => {
            setIsLoading(true);
            const details = await getBookDetails(bookId);
            setBook(details);
            setIsLoading(false);
        };
        fetchDetails();
    }, [bookId]);

    const handleBookmark = () => {
        toggleBookmark(bookId); // Use context function to update persistent state
    };

    const handleRate = (newRating: 'good' | 'bad') => {
        rateBook(bookId, newRating); // Use context function
        if (book) {
            // Correctly calling rateRecommendation without the 'reason' property
            rateRecommendation({
                bookId: book.id,
                title: book.title,
                author: book.author,
                image_url: book.coverImageUrl,
            });
        }
    };

    const createAmazonLink = (title: string, author: string) => {
        const query = encodeURIComponent(`${title} ${author}`);
        return `https://www.amazon.com/s?k=${query}`;
    };

    const renderContent = () => {
        if (isLoading) {
            return <div className="w-full h-96 flex items-center justify-center text-gray-500">Loading details...</div>;
        }

        if (!book) {
            return (
                <div className="w-full h-96 flex flex-col items-center justify-center text-red-700 p-8">
                    <ExclamationTriangleIcon className="h-12 w-12 mb-4" />
                    <h2 className="text-2xl font-bold">Error</h2>
                    <p>Could not find details for this book.</p>
                </div>
            );
        }

        return (
            <>
                <BookCover
                    title={book.title}
                    author={book.author}
                    imageUrl={book.coverImageUrl}
                    className="w-full md:w-1/3 h-64 md:h-auto"
                />
                <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                    <h2 className="text-3xl font-bold text-gray-900">{book.title}</h2>
                    <p className="text-lg text-gray-600 mt-1">by {book.author}</p>
                    <div className="flex items-center gap-4 my-4 text-sm">
                        <span className="bg-indigo-100 text-indigo-800 font-semibold px-3 py-1 rounded-full">{book.genre}</span>
                        <div className="flex items-center gap-1">
                            <StarIcon className="h-5 w-5 text-yellow-400" />
                            <span className="font-bold">{book.averageRating}</span>
                            <span className="text-gray-500">/ 5.0</span>
                        </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{book.synopsis}</p>
                    
                    <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap items-center gap-4">
                        <button onClick={handleBookmark} className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
                            {isBookmarked ? <BookmarkSolidIcon className="h-6 w-6 text-indigo-600" /> : <BookmarkOutlineIcon className="h-6 w-6 text-gray-600" />}
                            <span className={isBookmarked ? 'font-bold text-indigo-600' : ''}>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                        </button>
                        
                        <a
                            href={createAmazonLink(book.title, book.author)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-yellow-400 text-gray-900 font-semibold px-4 py-2 rounded-lg hover:bg-yellow-500 transition"
                        >
                            <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                            Buy on Amazon
                        </a>
                    </div>
                    
                    <div className="mt-4 flex items-center gap-2">
                        <p className="text-sm text-gray-600">Rate this recommendation:</p>
                        <button onClick={() => handleRate('good')} className={`p-2 rounded-full transition ${currentRating === 'good' ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100'}`}>
                            <HandThumbUpIcon className="h-6 w-6" />
                        </button>
                        <button onClick={() => handleRate('bad')} className={`p-2 rounded-full transition ${currentRating === 'bad' ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100'}`}>
                            <HandThumbDownIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <motion.div
                layoutId={layoutId}
                onClick={(e) => e.stopPropagation()}
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden"
            >
                {renderContent()}
                <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-800 bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition">
                    <XMarkIcon className="h-6 w-6" />
                </button>
            </motion.div>
        </div>
    );
};

export default ExpandedBookView;