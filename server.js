const http = require("http");
const fs = require("fs");
const path = require("path");

const host = "127.0.0.1";
const port = Number(process.env.PORT || 5173);
const root = path.resolve(__dirname);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  ".xls": "application/vnd.ms-excel",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

function send(response, statusCode, body, contentType = "text/plain; charset=utf-8") {
  response.writeHead(statusCode, {
    "Content-Type": contentType,
    "Cache-Control": "no-store"
  });
  response.end(body);
}

const server = http.createServer((request, response) => {
  const requestedUrl = new URL(request.url, `http://${host}:${port}`);
  const pathname = decodeURIComponent(requestedUrl.pathname);
  const requestedPath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const normalized = path.resolve(root, requestedPath);

  if (normalized !== root && !normalized.startsWith(root + path.sep)) {
    send(response, 403, "Forbidden");
    return;
  }

  fs.readFile(normalized, (error, content) => {
    if (error) {
      send(response, 404, "Not found");
      return;
    }

    const contentType = mimeTypes[path.extname(normalized).toLowerCase()] || "application/octet-stream";
    send(response, 200, content, contentType);
  });
});

server.listen(port, host, () => {
  console.log(`ControlPro listo en http://${host}:${port}`);
});
