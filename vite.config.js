// import react from '@vitejs/plugin-react-swc';
// import { defineConfig } from 'vite';

// export default defineConfig({
//   server: {
//     proxy: {
//       '/api': {
//         target: 'https://connect2uni-backend.onrender.com', // Proxy the backend server
//         changeOrigin: true,             // Handles CORS from the backend
//         secure: false,                  // If you're using HTTPS locally, set to false
//         rewrite: (path) => path.replace(/^\/api/, '') // Remove /api prefix if needed
//       }
//     }
//   },
//   plugins: [react()],
// });


// export default defineConfig({
//   server: {
//     proxy: {
//       '/api': {
//         target: 'https://connect2uni-backend.onrender.com', // Main backend server
//         changeOrigin: true, // Handles CORS
//         secure: false, // Set to false for local HTTPS
//         rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api prefix if needed
//       },
//       '/local-api': {
//         target: 'http://localhost:5173', // Local development server
//         changeOrigin: true, // Handles CORS
//         secure: false, // Set to false if you're not using HTTPS locally
//         rewrite: (path) => path.replace(/^\/local-api/, ''), // Remove /local-api prefix if needed
//       },
//     },
//   },
//   plugins: [react()],
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['a0c8-152-58-197-251.ngrok-free.app'], // Add the host here
  },
});

