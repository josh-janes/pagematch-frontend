// src/api/mockService.ts
console.log("Initializing mock service...");

// --- DATA INTERFACES (Corrected for optional images) ---
export interface Recommendation {
  bookId: number;
  title: string;
  author: string;
  image_url: string | null;
  reason: string;
}

export interface Book {
    id: number;
    title: string;
    author: string;
    genre: string;
    averageRating: number;
    synopsis: string;
    coverImageUrl: string | null;
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
}


// --- MASTER DATA SOURCE (Defined at the top level) ---
const ALL_BOOKS: Book[] = [
    // These books are used for Recommendations
    { id: 101, title: "Project Hail Mary", author: "Andy Weir", genre: "Science Fiction", averageRating: 4.65, synopsis: "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish. Except that right now, he doesn't know that. He can't even remember his own name, let alone the nature of his assignment or how to complete it.", coverImageUrl: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1597882465l/54493401.jpg" },
    { id: 102, title: "Dune", author: "Frank Herbert", genre: "Science Fiction", averageRating: 4.26, synopsis: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atrides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the 'spice' melange, a drug capable of extending life and enhancing consciousness.", coverImageUrl: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1434908555l/234225.jpg" },
    { id: 103, title: "The Silent Patient", author: "Alex Michaelides", genre: "Thriller", averageRating: 4.18, synopsis: "Alicia Berenson’s life is seemingly perfect. A famous painter married to an in-demand fashion photographer, she lives in a grand house with big windows overlooking a park in one of London’s most desirable areas. One evening her husband Gabriel returns home late from a fashion shoot, and Alicia shoots him five times in the face, and then never speaks another word.", coverImageUrl: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1582212232l/40097951._SY475_.jpg" },
    { id: 104, title: "Atomic Habits", author: "James Clear", genre: "Self Help", averageRating: 4.38, synopsis: "No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear, one of the world's leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.", coverImageUrl: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1535115320l/40121378._SY475_.jpg" },

    // These books are used for the "Browse Books" page
    { id: 201, title: "The Lord of the Rings", author: "J.R.R. Tolkien", genre: "Fantasy", averageRating: 4.5, synopsis: "The future of civilization rests in the fate of the One Ring, which has been lost for centuries. Powerful forces are unrelenting in their search for it. But fate has placed it in the hands of a young Hobbit named Frodo Baggins...", coverImageUrl: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1566425108l/33.jpg" },
    { id: 202, title: "1984", author: "George Orwell", genre: "Dystopian", averageRating: 4.17, synopsis: "The story of Winston Smith, a lowly member of the ruling Party in near-future London, who is struggling with his desires for truth and individuality in a world where independent thought is a crime.", coverImageUrl: null },
    { id: 203, title: "The Hitchhiker's Guide to the Galaxy", author: "Douglas Adams", genre: "Sci-Fi Comedy", averageRating: 4.22, synopsis: "Seconds before the Earth is demolished to make way for a galactic freeway, Arthur Dent is plucked off the planet by his friend Ford Prefect, a researcher for the revised edition of The Hitchhiker's Guide to the Galaxy.", coverImageUrl: "https://example.com/broken-image.jpg" },
    { id: 204, title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Classic", averageRating: 4.27, synopsis: "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it, To Kill A Mockingbird became both an instant bestseller and a critical success when it was first published in 1960.", coverImageUrl: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1553383690l/2657.jpg" },
];

const mockRecommendations: Recommendation[] = [
    { bookId: 101, title: "Project Hail Mary", author: "Andy Weir", image_url: ALL_BOOKS[0].coverImageUrl, reason: "A gripping sci-fi novel with a compelling mystery and unforgettable characters." },
    { bookId: 102, title: "Dune", author: "Frank Herbert", image_url: ALL_BOOKS[1].coverImageUrl, reason: "An epic masterpiece of science fiction that explores politics, religion, and ecology." },
    { bookId: 103, title: "The Silent Patient", author: "Alex Michaelides", image_url: ALL_BOOKS[2].coverImageUrl, reason: "A shocking psychological thriller with a twist you won't see coming." },
    { bookId: 104, title: "Atomic Habits", author: "James Clear", image_url: ALL_BOOKS[3].coverImageUrl, reason: "A practical guide to building good habits and breaking bad ones." },
];

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- MOCK API FUNCTIONS ---

export const getPopularBooks = async (): Promise<Book[]> => {
    console.log("API CALL: getPopularBooks");
    await delay(500);
    const popularBooks = ALL_BOOKS.filter(book => book.id >= 201);
    console.log("API RESPONSE: getPopularBooks", popularBooks);
    return popularBooks;
};

export const getRecommendations = async (userId: number): Promise<Recommendation[]> => {
    console.log(`API CALL: getRecommendations for userId: ${userId}`);
    await delay(700);
    const recommendations = [...mockRecommendations].sort(() => 0.5 - Math.random()).slice(0, 2);
    console.log(`API RESPONSE: getRecommendations for userId: ${userId}`, recommendations);
    return recommendations;
};

export const getBookDetails = async (bookId: number): Promise<Book | null> => {
    console.log(`API CALL: getBookDetails for bookId: ${bookId}`);
    await delay(600);
    const book = ALL_BOOKS.find(b => b.id === bookId) || null;
    console.log("API RESPONSE: getBookDetails", book);
    return book;
};

export const saveToMyRecommendations = async (bookId: number): Promise<{ status: string }> => {
    console.log(`API CALL: saveToMyRecommendations for bookId: ${bookId}`);
    await delay(400);
    console.log("API RESPONSE: saveToMyRecommendations", "Success");
    return { status: "Success" };
};

export const getRecentRecommendations = async (): Promise<Recommendation[]> => {
    console.log("API CALL: getRecentRecommendations");
    await delay(500);
    const recent = mockRecommendations.slice(0, 10);
    console.log("API RESPONSE: getRecentRecommendations", recent);
    return recent;
};

export const rateRecommendation = async (recommendation: Omit<Recommendation, 'reason'>): Promise<string> => {
    console.log("API CALL: rateRecommendation", recommendation);
    await delay(300);
    console.log("API RESPONSE: rateRecommendation", "Success");
    return "Success";
};

export const getPopularRecommendations = async (): Promise<Recommendation[]> => {
    console.log("API CALL: getPopularRecommendations");
    await delay(500);
    console.log("API RESPONSE: getPopularRecommendations", mockRecommendations);
    return mockRecommendations;
};

export const getAllRecommendationHistory = async (userId: number): Promise<Recommendation[]> => {
    console.log(`API CALL: getAllRecommendationHistory for userId: ${userId}`);
    await delay(800);
    
    // Because ALL_BOOKS is a Book[], TypeScript now correctly infers 'book' as type Book.
    const history: Recommendation[] = ALL_BOOKS.map(book => ({
        bookId: book.id,
        title: book.title,
        author: book.author,
        image_url: book.coverImageUrl,
        reason: `You were recommended this because of its popularity in the ${book.genre} genre.`
    }));

    mockRecommendations.forEach(rec => {
        if (!history.find(h => h.bookId === rec.bookId)) {
            history.push(rec);
        }
    });

    console.log("API RESPONSE: getAllRecommendationHistory", history);
    return history;
};

// --- MOCK USER DATA FUNCTIONS ---

export const updateUserProfile = async (profileData: any): Promise<string> => {
    console.log("API CALL: updateUserProfile", profileData);
    await delay(400);
    console.log("API RESPONSE: updateUserProfile", "Profile updated successfully.");
    return "Profile updated successfully.";
};

export const importUserData = async (data: any): Promise<string> => {
    console.log("API CALL: importUserData", data);
    await delay(1000);
    console.log("API RESPONSE: importUserData", "Data imported successfully.");
    return "Data imported successfully.";
};

export const deleteUserData = async (userId: number): Promise<string> => {
    console.log(`API CALL: deleteUserData for userId: ${userId}`);
    await delay(800);
    console.log("API RESPONSE: deleteUserData", "User data deleted.");
    return "User data deleted.";
};


// --- MOCK AUTHENTICATION SERVICE ---

const MOCK_USER: User = {
    id: '1',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=jane.doe@example.com'
};

export const loginWithProvider = async (provider: 'google' | 'github'): Promise<User> => {
    console.log(`API CALL: loginWithProvider (${provider})`);
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("API RESPONSE: loginWithProvider", MOCK_USER);
            localStorage.setItem('mock_user', JSON.stringify(MOCK_USER));
            resolve(MOCK_USER);
        }, 1500);
    });
};

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