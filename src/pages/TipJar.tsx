// src/pages/TipJar.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';

const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            delayChildren: 0.2,
            staggerChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 120 } },
};

// A helper component for the crypto address buttons
const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    };

    return (
        <button
            onClick={handleCopy}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 font-mono text-sm px-3 py-1 rounded-md hover:bg-gray-200 transition"
        >
            {copied ? (
                <>
                    <CheckIcon className="h-4 w-4 text-green-500" />
                    Copied!
                </>
            ) : (
                <>
                    <ClipboardDocumentIcon className="h-4 w-4" />
                    Copy
                </>
            )}
        </button>
    );
};


const TipJar: React.FC = () => {
    const btcAddress = "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh";
    const ethAddress = "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe";

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl mx-auto text-center"
        >
            <motion.div variants={itemVariants}>
                <h1 className="text-4xl font-extrabold text-gray-800">Enjoying PageMatch?</h1>
                <p className="mt-4 text-lg text-gray-600">
                    This project is a labor of love, developed and maintained in my free time. If you find it useful and want to support its future development, server costs, and my coffee habit, a small tip would be greatly appreciated!
                </p>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-12">
                <a
                    href="https://www.buymeacoffee.com/placeholder" // Replace with your actual link
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-yellow-400 text-gray-900 font-bold py-4 px-8 rounded-full shadow-lg hover:bg-yellow-500 transform hover:scale-105 transition-all duration-300"
                >
                    Buy Me a Coffee ☕
                </a>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-12">
                <h2 className="text-2xl font-bold text-gray-700">Or use Cryptocurrency</h2>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Bitcoin */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-800">Bitcoin (BTC)</h3>
                        <p className="mt-2 text-gray-500 font-mono break-all text-sm">{btcAddress}</p>
                        <div className="mt-4">
                            <CopyButton textToCopy={btcAddress} />
                        </div>
                    </div>
                    {/* Ethereum */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-800">Ethereum (ETH)</h3>
                        <p className="mt-2 text-gray-500 font-mono break-all text-sm">{ethAddress}</p>
                        <div className="mt-4">
                            <CopyButton textToCopy={ethAddress} />
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default TipJar;