// server.ts
var express = require("express");
var helmet = require("helmet");
var rateLimit = require("express-rate-limit");
var cors = require("cors");
var app = express();
var PORT = process.env.PORT || 3e3;
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"]
    }
  }
}));
app.use(cors({
  origin: "*",
  credentials: true
}));
var rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});
app.use("/api/", rateLimiter);
app.use(express.json());
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    service: "eventive-co-zw"
  });
});
app.post("/api/events", (req, res) => {
  try {
    const event = {
      id: "evt-" + Date.now(),
      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
      date: req.body.date,
      timezone: req.body.timezone || "Africa/Harare",
      status: "upcoming",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    res.json({
      success: true,
      eventId: event.id,
      message: "Event created successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
app.get("/api/events/categories/zimbabwe", (req, res) => {
  const categories = [
    { name: "Weddings", pricing: "$200 - $5,000", venues: ["Harare Gardens", "Marsa Gardens"] },
    { name: "Cultural Festivals", pricing: "$50 - $1,000", venues: ["National Gallery"] },
    { name: "Corporate Events", pricing: "$100 - $3,000", venues: ["CBA Chamber"] },
    { name: "Sports Events", pricing: "$20 - $500", venues: ["Harare Sports Club"] }
  ];
  res.json({ success: true, categories });
});
var path = require("path");
var fs = require("fs");
var distPath = path.join(process.cwd(), "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}
function startServer() {
  app.listen(PORT, () => {
    console.log("\u2705 Eventive.co.zw running on port " + PORT);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
