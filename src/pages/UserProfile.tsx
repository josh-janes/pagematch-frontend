// src/pages/UserProfile.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { updateUserProfile, deleteUserData } from '../api/mockService';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const UserProfile: React.FC = () => {
    const [name, setName] = useState('Jane Doe');
    const [email, setEmail] = useState('jane.doe@example.com');
    const [isSaving, setIsSaving] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateUserProfile({ name, email });
            // Here you might show a success toast/message
            alert("Profile saved successfully!");
        } catch (error) {
            console.error("Failed to save profile:", error);
            alert("Failed to save profile.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteData = async () => {
        try {
            await deleteUserData(1); // Mock user ID
            alert("Your data has been permanently deleted.");
            setShowDeleteModal(false);
        } catch (error) {
            console.error("Failed to delete user data:", error);
            alert("Failed to delete data.");
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">User Profile</h1>

                {/* Profile Form */}
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-6">Personal Information</h2>
                    <form onSubmit={handleSaveProfile}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-600">Full Name</label>
                                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email Address</label>
                                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                            </div>
                        </div>
                        <div className="mt-6 text-right">
                            <button type="submit" disabled={isSaving} className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors">
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Data Management Section */}
                <div className="bg-white p-8 rounded-lg shadow-md mt-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Data Management</h2>
                    <div className="p-4 border border-red-200 bg-red-50 rounded-lg flex items-start justify-between">
                        <div>
                            <h3 className="font-semibold text-red-800">Delete Your Account & Data</h3>
                            <p className="text-red-700 mt-1">This action is irreversible. All your data, including recommendations and imported history, will be permanently deleted.</p>
                        </div>
                        <button onClick={() => setShowDeleteModal(true)} className="bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition-colors flex-shrink-0 ml-4">
                            Delete My Data
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full"
                    >
                        <div className="flex items-start">
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Account Data</h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        Are you sure you want to delete all your data? This action cannot be undone.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                            <button
                                type="button"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={handleDeleteData}
                            >
                                Confirm Delete
                            </button>
                            <button
                                type="button"
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </>
    );
};

export default UserProfile;