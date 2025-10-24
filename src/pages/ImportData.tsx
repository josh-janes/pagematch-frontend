// src/pages/ImportData.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { importUserData } from '../api/mockService';
import { ArrowUpTrayIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

type ImportStatus = 'idle' | 'importing' | 'success' | 'error';

const ImportData: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [status, setStatus] = useState<ImportStatus>('idle');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
            setStatus('idle');
        }
    };

    const handleImport = async () => {
        if (!selectedFile) return;
        setStatus('importing');
        try {
            await importUserData(selectedFile);
            setStatus('success');
        } catch (error) {
            console.error("Import failed:", error);
            setStatus('error');
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Import Your Data</h1>
            <p className="text-gray-600 mb-8">
                Upload your reading history from services like Goodreads to get better recommendations.
                Please upload a `.csv` file.
            </p>

            <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <ArrowUpTrayIcon className="h-12 w-12 mx-auto text-gray-400" />
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept=".csv"
                        onChange={handleFileChange}
                    />
                    <label
                        htmlFor="file-upload"
                        className="mt-4 inline-block bg-indigo-50 text-indigo-700 font-semibold py-2 px-4 rounded-md cursor-pointer hover:bg-indigo-100 transition-colors"
                    >
                        Choose a file
                    </label>
                    {selectedFile && <p className="mt-4 text-gray-500">Selected: {selectedFile.name}</p>}
                </div>

                <div className="mt-6">
                    <button
                        onClick={handleImport}
                        disabled={!selectedFile || status === 'importing'}
                        className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
                    >
                        {status === 'importing' ? 'Importing...' : 'Start Import'}
                    </button>
                </div>

                {status !== 'idle' && status !== 'importing' && (
                     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                        {status === 'success' && (
                            <div className="flex items-center p-4 bg-green-50 text-green-800 rounded-lg">
                                <CheckCircleIcon className="h-6 w-6 mr-3" />
                                <span>Data imported successfully!</span>
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="flex items-center p-4 bg-red-50 text-red-800 rounded-lg">
                                <XCircleIcon className="h-6 w-6 mr-3" />
                                <span>An error occurred during import. Please try again.</span>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ImportData;