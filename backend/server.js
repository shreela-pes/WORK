import http from 'http'; // Native HTTP module
import app from './app.js'; // Import the Express app
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Create an HTTP server and pass the Express app to it
const server = http.createServer(app);

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
