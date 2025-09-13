

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

Core Technologies
React: The entire user interface is built as a single-page application (SPA) using React. This is evident from the .tsx files, the use of React Hooks (useState, useEffect, useContext), and the component-based architecture.
TypeScript: The project uses TypeScript for static typing, which helps in writing more robust and maintainable code. This is clear from the .ts and .tsx file extensions and the use of type definitions like interface and enum in types.ts.
HTML5: The foundation of the web application. The native <video> element is used for playing direct URL and uploaded video files.
CSS3: Used for styling, particularly the custom keyframe animations for the floating emoji reactions.
Styling
Tailwind CSS: This is the primary utility-first CSS framework used for styling the components. It's loaded directly via a CDN in index.html and its class names (flex, bg-gray-800, rounded-lg, etc.) are used extensively throughout the application.
Libraries & Packages
React Router (react-router-dom): Manages all client-side routing, enabling navigation between the HomePage and the RoomPage without full page reloads.
React YouTube (react-youtube): A specific React component used to embed and control the YouTube video player, making integration seamless.
Recharts: A charting library used to visualize the results of polls with responsive bar charts in the Polls component.
Architecture & Concepts
Component-Based Architecture: The application is broken down into reusable components (e.g., VideoPlayer, ChatWindow, InteractionPanel), which is a core principle of React.
State Management: Local component state is managed using React Hooks. For cross-component state (like the theme), React's Context API (ThemeContext.tsx) is used.
Responsive Design: The use of Tailwind CSS's responsive prefixes (e.g., md:, lg:) indicates that the application is designed to adapt to different screen sizes, from mobile to desktop.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
