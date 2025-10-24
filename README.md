# bookrecAI - Frontend

This is the official frontend for **bookrecAI**, a modern, stylish, and snappy book recommendation engine. This application is built with React, TypeScript, and styled with Tailwind CSS to provide a rich user experience.

## Features

-   **Modern UI**: Clean and intuitive interface.
-   **Responsive Design**: Works beautifully on all screen sizes.
-   **Smooth Animations**: Fluid transitions and interactions powered by Framer Motion.
-   **Typed Codebase**: Built with TypeScript for robust and maintainable code.
-   **Mock API Integration**: Includes a mock service layer to simulate backend calls for easy development and testing.

## Tech Stack

-   **React 18**
-   **TypeScript**
-   **React Router v6** for client-side routing.
-   **Tailwind CSS** for utility-first styling.
-   **Framer Motion** for animations.
-   **Heroicons** for a beautiful icon set.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

-   [Node.js](https://nodejs.org/) (v16 or later recommended)
-   [npm](https://www.npmjs.com/) (Node Package Manager) or [Yarn](https://yarnpkg.com/)

## Getting Started

Follow these steps to set up and run the project locally.

### 1. Clone the Repository

First, clone this repository to your local machine.

```bash
git clone <your-repository-url>
cd bookrecai-frontend2. Install Dependencies
```

Navigate to the project's root directory in your terminal and run the following command to install all the necessary packages defined in package.json.

Using npm:
```bash
npm install
```
  

Or using Yarn:
```bash
yarn install
```
  

This will create a node_modules directory with all the project dependencies.
### 3. Run the Development Server

Once the dependencies are installed, you can start the local development server.

Using npm:
```bash
npm start
```
  

Or using Yarn:
```bash
yarn start
```
  

This command runs the app in development mode. The application will automatically open in your default web browser at http://localhost:3000.

The page will reload automatically if you make edits to the source code. You will also see any build errors or lint warnings in the console.

## Local Testing

The application is configured with a mock service worker located at src/api/mockService.ts. This service intercepts API calls and returns mock data, allowing you to test the full functionality of the frontend without needing a live backend.

To test the application:

1. Launch the app using npm start.

2. Open your browser's developer tools (usually by pressing F12 or Ctrl+Shift+I).

3. Navigate through the application:

4. Click on "Generate Recommendations", "Recent Generations", or "Browse Books".

5. Use the sidebar to go to "Import Data", "User Profile", etc.

    Check the console logs: The mock service logs every API call it simulates, including the function name, any parameters passed, and the mock data it returns. This is useful for verifying that components are calling the correct API endpoints with the expected data.

Example console output:
```bash
Initializing mock service...
API CALL: getPopularBooks
API RESPONSE: getPopularBooks [Array of book objects]
```
  