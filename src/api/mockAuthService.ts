// src/api/mockAuthService.ts
console.log("Initializing mock authentication service...");

export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
}

const MOCK_USER: User = {
    id: '1',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=jane.doe@example.com'
};

/**
 * Simulates an OAuth2.0 login flow.
 * In a real app, this would redirect the user. Here, it just waits and returns a mock user.
 */
export const loginWithProvider = async (provider: 'google' | 'github'): Promise<User> => {
    console.log(`API CALL: loginWithProvider (${provider})`);
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("API RESPONSE: loginWithProvider", MOCK_USER);
            // In a real app, you'd save the token/session info here
            localStorage.setItem('mock_user', JSON.stringify(MOCK_USER));
            resolve(MOCK_USER);
        }, 1500); // Simulate network delay and provider redirect
    });
};

/**
 * Simulates logging the user out.
 */
export const logout = async (): Promise<void> => {
    console.log("API CALL: logout");
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("API RESPONSE: logout successful");
            localStorage.removeItem('mock_user');
            resolve();
        }, 500);
    });
};

/**
 * Checks if a user session exists (e.g., on page load).
 */
export const checkAuthStatus = async (): Promise<User | null> => {
    console.log("API CALL: checkAuthStatus");
    return new Promise((resolve) => {
        setTimeout(() => {
            const storedUser = localStorage.getItem('mock_user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                console.log("API RESPONSE: checkAuthStatus (user found)", user);
                resolve(user);
            } else {
                console.log("API RESPONSE: checkAuthStatus (no user found)");
                resolve(null);
            }
        }, 300);
    });
};