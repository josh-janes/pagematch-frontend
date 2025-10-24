// src/components/BookCover.tsx
import React, { useState, useMemo, useEffect } from 'react';
import {
    AcademicCapIcon,
    GlobeAltIcon,
    SparklesIcon,
    BeakerIcon,
    HeartIcon,
    EyeIcon,
    SunIcon,
    BoltIcon
} from '@heroicons/react/24/solid';

interface BookCoverProps {
    imageUrl?: string | null;
    title: string;
    author: string;
    className?: string; // To pass sizing and other utility classes
}

// A curated palette of complementary Tailwind CSS background colors
const colorPalette = [
    'bg-red-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-teal-500',
    'bg-pink-500',
    'bg-orange-500',
    'bg-purple-500',
    'bg-sky-500',
];

// A curated list of Heroicons
const iconComponents = [
    AcademicCapIcon,
    GlobeAltIcon,
    SparklesIcon,
    BeakerIcon,
    HeartIcon,
    EyeIcon,
    SunIcon,
    BoltIcon,
];

/**
 * A simple hashing function to convert a string into a number.
 * This ensures that the same title always produces the same hash.
 */
const simpleStringHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

const BookCover: React.FC<BookCoverProps> = ({ imageUrl, title, author, className }) => {
    // State to track if the provided imageUrl has failed to load.
    const [imageError, setImageError] = useState(false);

    // This effect resets the error state whenever the image URL changes.
    // This is important for when the component is reused for different books.
    useEffect(() => {
        setImageError(false);
    }, [imageUrl]);

    // useMemo ensures that the color and icon are chosen deterministically based on the title.
    // This calculation only re-runs if the 'title' prop changes.
    const { deterministicColor, DeterministicIcon } = useMemo(() => {
        const hash = simpleStringHash(title);
        const colorIndex = hash % colorPalette.length;
        const iconIndex = hash % iconComponents.length;
        return {
            deterministicColor: colorPalette[colorIndex],
            DeterministicIcon: iconComponents[iconIndex],
        };
    }, [title]);

    // Determine if we should show the fallback cover.
    // This is true if there's no URL, or if the provided URL failed to load.
    const showFallback = !imageUrl || imageError;

    if (showFallback) {
        // Render our generated fallback cover.
        return (
            <div
                className={`${className} ${deterministicColor} flex flex-col items-center justify-center p-4 text-white text-center overflow-hidden`}
            >
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                    <DeterministicIcon className="absolute w-2/3 h-2/3 text-white opacity-10" />
                    <div className="z-10">
                        <h3 className="font-bold text-lg leading-tight drop-shadow-md">
                            {title}
                        </h3>
                        <p className="text-sm mt-2 opacity-80 drop-shadow-sm">
                            by {author}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // If we have an imageUrl and it hasn't failed, try to render the image.
    // The onError handler will trigger our fallback if the image link is broken.
    return (
        <img
            src={imageUrl}
            alt={`Cover of ${title}`}
            className={`${className} object-cover`}
            onError={() => setImageError(true)}
        />
    );
};

export default BookCover;