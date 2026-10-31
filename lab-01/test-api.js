const http = require('http');

const PORT = process.env.PORT || 3000;

function request(path) {
    return new Promise((resolve, reject) => {
        http.get(`http://localhost:${PORT}${path}`, (res) => {
            let data = '';
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                resolve({
                    path,
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: data
                });
            });
        }).on('error', reject);
    });
}

async function runTests() {
    console.log(`=== Testing Server Endpoints on Port ${PORT} ===\n`);
    const paths = ['/', '/about', '/time', '/unknown-route'];

    for (const p of paths) {
        try {
            const res = await request(p);
            console.log(`Path: ${p}`);
            console.log(`Status Code: ${res.statusCode}`);
            console.log(`Response Body: ${res.body}`);
            console.log('-------------------------------------------');
        } catch (err) {
            console.error(`Error requesting ${p}:`, err.message);
        }
    }
}

runTests();
