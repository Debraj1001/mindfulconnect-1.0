// server.js - Simple Node.js server for authentication
const http = require("http")
const fs = require("fs")
const path = require("path")
const url = require("url")

// Define the port to run the server on
const PORT = process.env.PORT || 3000

// Create a simple session store (in a real app, you'd use a database)
const sessions = {}

// Create HTTP server
const server = http.createServer((req, res) => {
  // Parse the URL
  const parsedUrl = url.parse(req.url, true)
  const pathname = parsedUrl.pathname

  // Handle API endpoints
  if (pathname.startsWith("/api")) {
    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      res.statusCode = 204
      res.end()
      return
    }

    // Handle API routes
    if (pathname === "/api/check-session" && req.method === "GET") {
      // Get session ID from query parameters
      const sessionId = parsedUrl.query.sessionId

      // Check if session exists
      if (sessionId && sessions[sessionId]) {
        res.statusCode = 200
        res.setHeader("Content-Type", "application/json")
        res.end(
          JSON.stringify({
            authenticated: true,
            user: sessions[sessionId],
          }),
        )
      } else {
        res.statusCode = 200
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify({ authenticated: false }))
      }
      return
    }

    // Handle login API
    if (pathname === "/api/login" && req.method === "POST") {
      let body = ""

      req.on("data", (chunk) => {
        body += chunk.toString()
      })

      req.on("end", () => {
        try {
          const { email, password } = JSON.parse(body)

          // In a real app, you would validate credentials against a database
          // This is a simplified example
          if (email && password) {
            // Generate a session ID
            const sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

            // Store session
            sessions[sessionId] = {
              id: sessionId,
              email: email,
              name: email.split("@")[0],
            }

            res.statusCode = 200
            res.setHeader("Content-Type", "application/json")
            res.end(
              JSON.stringify({
                success: true,
                sessionId: sessionId,
                user: sessions[sessionId],
              }),
            )
          } else {
            res.statusCode = 400
            res.setHeader("Content-Type", "application/json")
            res.end(
              JSON.stringify({
                success: false,
                message: "Email and password are required",
              }),
            )
          }
        } catch (error) {
          res.statusCode = 400
          res.setHeader("Content-Type", "application/json")
          res.end(
            JSON.stringify({
              success: false,
              message: "Invalid request format",
            }),
          )
        }
      })
      return
    }

    // Handle logout API
    if (pathname === "/api/logout" && req.method === "POST") {
      let body = ""

      req.on("data", (chunk) => {
        body += chunk.toString()
      })

      req.on("end", () => {
        try {
          const { sessionId } = JSON.parse(body)

          // Remove session
          if (sessionId && sessions[sessionId]) {
            delete sessions[sessionId]
          }

          res.statusCode = 200
          res.setHeader("Content-Type", "application/json")
          res.end(JSON.stringify({ success: true }))
        } catch (error) {
          res.statusCode = 400
          res.setHeader("Content-Type", "application/json")
          res.end(
            JSON.stringify({
              success: false,
              message: "Invalid request format",
            }),
          )
        }
      })
      return
    }

    // If no API route matches
    res.statusCode = 404
    res.setHeader("Content-Type", "application/json")
    res.end(JSON.stringify({ error: "Not found" }))
    return
  }

  // Serve static files
  let filePath = "." + pathname
  if (filePath === "./") {
    filePath = "./index.html"
  }

  // Get the file extension
  const extname = String(path.extname(filePath)).toLowerCase()

  // Map file extensions to MIME types
  const mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".wav": "audio/wav",
    ".mp4": "video/mp4",
    ".woff": "application/font-woff",
    ".ttf": "application/font-ttf",
    ".eot": "application/vnd.ms-fontobject",
    ".otf": "application/font-otf",
    ".wasm": "application/wasm",
  }

  const contentType = mimeTypes[extname] || "application/octet-stream"

  // Read the file
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === "ENOENT") {
        // Page not found
        fs.readFile("./404.html", (error, content) => {
          res.writeHead(404, { "Content-Type": "text/html" })
          res.end(content, "utf-8")
        })
      } else {
        // Server error
        res.writeHead(500)
        res.end(`Server Error: ${error.code}`)
      }
    } else {
      // Success
      res.writeHead(200, { "Content-Type": contentType })
      res.end(content, "utf-8")
    }
  })
})

// Start the server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`)
})

