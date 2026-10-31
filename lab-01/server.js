// Plain Node.js HTTP Server using built-in http module
const http = require('http');

// Port configuration: process.env.PORT or default to 3000
const PORT = process.env.PORT || 3000;

// Create plain HTTP server
const server = http.createServer((req, res) => {
    // Set HTTP status code 200 and Content-Type header
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    
    // Return "Hello" as the response body
    res.end('Hello');
});

// Start listening on specified port
server.listen(PORT, () => {
    console.log(`Plain Node.js HTTP Server is running on http://localhost:${PORT}`);
});
