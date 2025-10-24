// src/components/BookCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Book, Recommendation } from '../api/mockService';
import { XMarkIcon, StarIcon, LightBulbIcon } from '@heroicons/react/24/solid';
import BookCover from './BookCover'; // The new component for handling images

// This is a "type guard" that helps TypeScript know which type we're dealing with at runtime.
const isRecommendation = (book: Book | Recommendation): book is Recommendation => {
    return 'reason' in book;
};

type BookCardProps = {
    book: Book | Recommendation;
    // Interactive props are optional, making the card reusable for different contexts.
    onClick?: () => void;
    onDelete?: () => void;
    layoutId?: string;
};

const BookCard: React.FC<BookCardProps> = ({ book, onClick, onDelete, layoutId }) => {

    const handleDelete = (e: React.MouseEvent) => {
        // Stop the click from propagating to the card's onClick handler
        e.stopPropagation();
        if (onDelete) {
            onDelete();
        }
    };

    // The main JSX for the card's content
    const cardContent = (
        <div className="bg-white rounded-lg overflow-hidden flex flex-col h-full shadow-md hover:shadow-xl transition-shadow duration-300 group">
            <div className="relative">
                {/* Use the new BookCover component instead of a simple <img> tag */}
                <BookCover
                    title={book.title}
                    author={book.author}
                    imageUrl={isRecommendation(book) ? book.image_url : book.coverImageUrl}
                    className="w-full h-56"
                />
                
                {/* Conditionally render the delete button only if the handler is provided */}
                {onDelete && (
                    <button
                        onClick={handleDelete}
                        className="absolute top-2 right-2 p-1 bg-black bg-opacity-40 rounded-full text-white opacity-0 group-hover:opacity-100 hover:bg-opacity-70 transition-opacity"
                        aria-label="Delete recommendation"
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                )}
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-gray-800 truncate" title={book.title}>
                    {book.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{book.author}</p>

                {/* Conditionally render the bottom part of the card based on the book type */}
                <div className="mt-auto pt-3 border-t border-gray-100">
                    {isRecommendation(book) ? (
                        <div className="flex items-start text-xs text-gray-600">
                            <LightBulbIcon className="h-4 w-4 text-indigo-500 mr-2 flex-shrink-0 mt-0.5" />
                            <p className="italic">"{book.reason}"</p>
                        </div>
                    ) : (
                        <div className="flex items-center text-gray-600">
                            <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
                            <span className="font-semibold">{book.averageRating}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    // If an onClick handler and layoutId are provided, wrap the card in a clickable, animated container.
    // This enables the "magic motion" transition.
    if (onClick && layoutId) {
        return (
            <motion.div layoutId={layoutId} onClick={onClick} className="cursor-pointer">
                {cardContent}
            </motion.div>
        );
    }

    // Otherwise, just render the static, non-clickable content.
    return cardContent;
};

export default BookCard;