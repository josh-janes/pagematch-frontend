// src/pages/BrowseBooks.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, getPopularBooks } from '../api/mockService';
import BookCard from '../components/BookCard';
import ExpandedBookView from '../components/ExpandedBookView';
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

const BrowseBooks: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
    const booksPerPage = 6;

    useEffect(() => {
        const fetchBooks = async () => {
            setIsLoading(true);
            try {
                const fetchedBooks = await getPopularBooks();
                setBooks(fetchedBooks);
            } catch (error) {
                console.error("Failed to fetch popular books:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBooks();
    }, []);

    // Pagination logic
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
    const totalPages = Math.ceil(books.length / booksPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div>
            <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6 transition-colors">
                <ArrowLeftIcon className="h-5 w-5" />
                Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Browse Popular Books</h1>

            {isLoading ? (
                <div className="text-center p-10">
                    <p className="text-gray-600">Loading books...</p>
                </div>
            ) : (
                <>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPage} // This makes the grid re-animate on page change
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {currentBooks.map((book) => (
                                <BookCard
                                    key={book.id}
                                    book={book}
                                    layoutId={`browse-card-${book.id}`}
                                    onClick={() => setSelectedBookId(book.id)}
                                    // NOTE: No onDelete prop is passed
                                />
                            ))}
                        </motion.div>
                    </AnimatePresence>
                    
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center mt-8">
                            <button onClick={handlePrevPage} disabled={currentPage === 1} className="p-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                <ChevronLeftIcon className="h-6 w-6" />
                            </button>
                            <span className="mx-4 text-gray-700">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button onClick={handleNextPage} disabled={currentPage === totalPages} className="p-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                <ChevronRightIcon className="h-6 w-6" />
                            </button>
                        </div>
                    )}
                </>
            )}

            <AnimatePresence>
                {selectedBookId && (
                    <ExpandedBookView
                        bookId={selectedBookId}
                        layoutId={`browse-card-${selectedBookId}`}
                        onClose={() => setSelectedBookId(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default BrowseBooks;