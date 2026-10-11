
require("dotenv").config();

const http = require("http");
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const aiRoutes = require("./routes/ai");

// Only Socket.IO main setup
const { initializeSocket } = require("./socket/socket");

// Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const messageRoutes = require("./routes/messages");
const notificationRoutes = require("./routes/notifications");
const groupRoutes = require("./routes/groups");
const conversationRoutes = require("./routes/conversations");
const uploadRoutes = require("./routes/upload");

// Middleware
const errorMiddleware = require("./middleware/errorMiddleware");
const { apiLimiter } = require("./middleware/rateLimit");

const app = express();

/*
==================================================
CONFIG
==================================================
*/

const PORT = process.env.PORT || 5000;

const FRONTEND_URL =
  process.env.FRONTEND_URL ||
  "http://localhost:5173";

const MONGO_URI = process.env.MONGO_URL;

if (!MONGO_URI) {
  console.error(
    "MONGO_URL is missing in .env"
  );

  process.exit(1);
}

/*
==================================================
CORS
==================================================
*/

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

/*
==================================================
BODY PARSER
==================================================
*/

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

/*
==================================================
STATIC UPLOADS
==================================================
*/

app.use(
  "/uploads",
  express.static(
    path.join(
      __dirname,
      "uploads"
    )
  )
);

/*
==================================================
API RATE LIMIT
==================================================
*/

app.use(
  "/api",
  apiLimiter
);

/*
==================================================
HEALTH CHECK
==================================================
*/

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "ChatKaro backend is running",
  });
});

app.get(
  "/api/health",
  (req, res) => {
    res.json({
      success: true,
      message:
        "ChatKaro API is healthy",

      database:
        mongoose.connection.readyState === 1
          ? "connected"
          : "disconnected",
    });
  }
);

/*
==================================================
API ROUTES
==================================================
*/

app.use(
  "/api/ai",
  aiRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/messages",
  messageRoutes
);

app.get("/api/test-conversation", (req, res) => {
  res.json({
    success: true,
    message: "Conversation route is working",
  });
});

app.use(
  "/api/conversations",
  conversationRoutes
);

app.use(
  "/api/groups",
  groupRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.use(
  "/api/upload",
  uploadRoutes
);

/*
==================================================
404 HANDLER
==================================================
*/

app.use(
  (req, res) => {
    res.status(404).json({
      success: false,
      message:
        "API route not found",
      path: req.originalUrl,
    });
  }
);

/*
==================================================
ERROR HANDLER
==================================================
*/

app.use(errorMiddleware);

/*
==================================================
HTTP SERVER
==================================================
*/

const server =
  http.createServer(app);

/*
==================================================
SOCKET.IO
==================================================
*/

initializeSocket(server);

/*
==================================================
MONGODB CONNECTION
==================================================
*/

async function connectDatabase() {
  try {
    await mongoose.connect(
      MONGO_URI
    );

    console.log(
      "MongoDB Atlas connected successfully"
    );
  } catch (error) {
    console.error(
      "MongoDB connection error:",
      error.message
    );

    process.exit(1);
  }
}

/*
==================================================
START SERVER
==================================================
*/

async function startServer() {
  try {
    await connectDatabase();

    server.listen(
      PORT,
      () => {
        console.log(
          `ChatKaro backend running on port ${PORT}`
        );

        console.log(
          `Frontend URL: ${FRONTEND_URL}`
        );
      }
    );
  } catch (error) {
    console.error(
      "SERVER START ERROR:",
      error
    );

    process.exit(1);
  }
}

/*
==================================================
GRACEFUL SHUTDOWN
==================================================
*/

const shutdown = async () => {
  console.log(
    "Shutting down ChatKaro server..."
  );

  server.close(
    async () => {
      try {
        await mongoose.connection.close();

        console.log(
          "MongoDB connection closed"
        );

        process.exit(0);
      } catch (error) {
        console.error(
          "Shutdown error:",
          error
        );

        process.exit(1);
      }
    }
  );
};

process.on(
  "SIGINT",
  shutdown
);

process.on(
  "SIGTERM",
  shutdown
);

/*
==================================================
START
==================================================
*/

startServer();

module.exports = app;

