/**
 * test-api.js  – Self-contained CRUD test script
 * Starts the server, runs all 5 CRUD tests, prints results, then exits.
 *
 * Usage:  node test-api.js
 */

const http = require("http");

const BASE = "http://localhost:3000";
let passed = 0;
let failed = 0;

// ─── Tiny HTTP helper ─────────────────────────────────────────────────────────
function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: "localhost",
      port: 3000,
      path,
      method,
      headers: {
        "Content-Type": "application/json",
        ...(payload ? { "Content-Length": Buffer.byteLength(payload) } : {}),
      },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

// ─── Assertion helper ─────────────────────────────────────────────────────────
function assert(label, condition, detail = "") {
  if (condition) {
    console.log(`  ✅  ${label}`);
    passed++;
  } else {
    console.log(`  ❌  ${label}${detail ? " — " + detail : ""}`);
    failed++;
  }
}

// ─── Tests ────────────────────────────────────────────────────────────────────
async function runTests() {
  console.log("\n=== CRUD API Tests ===\n");

  // 1. GET /books/  – all 9 seed books
  console.log("1. GET /books/");
  const all = await request("GET", "/books/");
  assert("Status 200", all.status === 200, `got ${all.status}`);
  assert("Returns array",  Array.isArray(all.body));
  assert("Has 9 seed rows", all.body.length === 9, `got ${all.body.length}`);
  console.log(`   Sample: ${JSON.stringify(all.body[0])}\n`);

  // 2. GET /books/1/
  console.log("2. GET /books/1/");
  const one = await request("GET", "/books/1/");
  assert("Status 200", one.status === 200, `got ${one.status}`);
  assert("Has id=1",   one.body.id === 1);
  console.log(`   Book: ${JSON.stringify(one.body)}\n`);

  // 3. GET /books/999/ – should 404
  console.log("3. GET /books/999/  (expect 404)");
  const notFound = await request("GET", "/books/999/");
  assert("Status 404", notFound.status === 404, `got ${notFound.status}`);
  assert("Error message present", !!notFound.body.error);
  console.log(`   Response: ${JSON.stringify(notFound.body)}\n`);

  // 4. POST /books/
  console.log("4. POST /books/");
  const postRes = await request("POST", "/books/", {
    title: "Clean Code",
    author: "Robert C. Martin",
    price: 450,
    pages: 464,
  });
  assert("Status 201",       postRes.status === 201, `got ${postRes.status}`);
  assert("Has new id",       typeof postRes.body.id === "number");
  assert("Title correct",    postRes.body.title === "Clean Code");
  assert("Author correct",   postRes.body.author === "Robert C. Martin");
  assert("Price correct",    postRes.body.price === 450);
  assert("Pages correct",    postRes.body.pages === 464);
  const newId = postRes.body.id;
  console.log(`   Created: ${JSON.stringify(postRes.body)}\n`);

  // 5. POST /books/ – missing fields (expect 400)
  console.log("5. POST /books/  (missing fields – expect 400)");
  const badPost = await request("POST", "/books/", { title: "Incomplete" });
  assert("Status 400", badPost.status === 400, `got ${badPost.status}`);
  console.log(`   Response: ${JSON.stringify(badPost.body)}\n`);

  // 6. PUT /books/:id/
  console.log(`6. PUT /books/${newId}/`);
  const putRes = await request("PUT", `/books/${newId}/`, {
    title: "Clean Code Second Edition",
    author: "Robert C. Martin",
    price: 499,
    pages: 480,
  });
  assert("Status 200",            putRes.status === 200, `got ${putRes.status}`);
  assert("Title updated",         putRes.body.title === "Clean Code Second Edition");
  assert("Price updated",         putRes.body.price === 499);
  assert("Pages updated",         putRes.body.pages === 480);
  console.log(`   Updated: ${JSON.stringify(putRes.body)}\n`);

  // 7. PUT /books/999/ – not found
  console.log("7. PUT /books/999/  (expect 404)");
  const putNF = await request("PUT", "/books/999/", { title: "Ghost" });
  assert("Status 404", putNF.status === 404, `got ${putNF.status}`);
  console.log(`   Response: ${JSON.stringify(putNF.body)}\n`);

  // 8. DELETE /books/:id/
  console.log(`8. DELETE /books/${newId}/`);
  const delRes = await request("DELETE", `/books/${newId}/`);
  assert("Status 200",       delRes.status === 200, `got ${delRes.status}`);
  assert("Message present",  !!delRes.body.message);
  console.log(`   Response: ${JSON.stringify(delRes.body)}\n`);

  // 9. DELETE /books/999/ – not found
  console.log("9. DELETE /books/999/  (expect 404)");
  const delNF = await request("DELETE", "/books/999/");
  assert("Status 404", delNF.status === 404, `got ${delNF.status}`);
  console.log(`   Response: ${JSON.stringify(delNF.body)}\n`);

  // 10. Verify deleted book is gone
  console.log(`10. GET /books/${newId}/  (verify deleted – expect 404)`);
  const gone = await request("GET", `/books/${newId}/`);
  assert("Status 404", gone.status === 404, `got ${gone.status}`);
  console.log(`   Response: ${JSON.stringify(gone.body)}\n`);

  // Summary
  console.log("=".repeat(40));
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log("=".repeat(40) + "\n");
}

// ─── Wait for server then test ────────────────────────────────────────────────
function waitForServer(retries = 10) {
  return new Promise((resolve, reject) => {
    const attempt = (n) => {
      const req = http.get("http://localhost:3000/books/", (res) => {
        res.resume();
        resolve();
      });
      req.on("error", () => {
        if (n <= 0) return reject(new Error("Server did not start in time"));
        setTimeout(() => attempt(n - 1), 500);
      });
      req.end();
    };
    attempt(retries);
  });
}

(async () => {
  try {
    await waitForServer();
    await runTests();
    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error("Test runner error:", err.message);
    process.exit(1);
  }
})();

