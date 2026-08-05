const fetch = require('node:http');

console.log("Testing IPv4 http://127.0.0.1:8080/api/v1/stories...");
const req1 = fetch.get("http://127.0.0.1:8080/api/v1/stories", (res) => {
  console.log("IPv4 Status Code:", res.statusCode);
});
req1.on('error', (e) => {
  console.error("IPv4 Error:", e.message);
});

console.log("Testing http://localhost:8080/api/v1/stories...");
const req2 = fetch.get("http://localhost:8080/api/v1/stories", (res) => {
  console.log("Localhost Status Code:", res.statusCode);
});
req2.on('error', (e) => {
  console.error("Localhost Error:", e.message);
});
