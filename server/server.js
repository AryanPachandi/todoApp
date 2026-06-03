const express = require("express");
const cors    = require("cors");
const mongoose = require("mongoose");

const cookieParser = require("cookie-parser");
const CryptoJS = require("crypto-js");

const SECRET_KEY = "my_super_secret_key";

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// ─── MongoDB connection ────────────────────────────────────────────
const MONGO_URI = "mongodb+srv://pachandiaryan:aryanpach@aryanpachandi.bew7r.mongodb.net/todo";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log(">> MongoDB connected:", MONGO_URI))
  .catch((err) => { console.error("MongoDB connection error:", err); process.exit(1); });

// ─── Schema & Model ────────────────────────────────────────────────
const todoSchema = new mongoose.Schema(
  {
    text:     { type: String, required: true, trim: true },
    done:     { type: Boolean, default: false },
    priority: { type: String, enum: ["high", "medium", "low"], default: "medium" },
  },
  { timestamps: true }   // adds createdAt + updatedAt automatically
);

const Todo = mongoose.model("Todo", todoSchema);

// ─── GET /get-todos ────────────────────────────────────────────────
// Optional query param: ?filter=all|active|done
app.get("/get-todos", async (req, res) => {
  try {
    const { filter } = req.query;

    const query = {};
    if (filter === "active") query.done = false;
    if (filter === "done")   query.done = true;

    const [data, total, completed] = await Promise.all([
      Todo.find(query).sort({ createdAt: -1 }),
      Todo.countDocuments(),
      Todo.countDocuments({ done: true }),
    ]);

    res.json({ success: true, total, completed, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POST /add-todos ───────────────────────────────────────────────
// Body: { text: string, priority?: "high"|"medium"|"low" }
app.post("/add-todos", async (req, res) => {
  try {
    const { text, priority = "medium" } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: "text is required" });
    }

    const todo = await Todo.create({ text, priority });
    res.status(201).json({ success: true, data: todo });
  } catch (err) {
    // Mongoose validation error (e.g. bad priority value)
    if (err.name === "ValidationError") {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PUT /update-todos/:id ─────────────────────────────────────────
// Body: { text?: string, done?: boolean, priority?: string }
app.put("/update-todos/:id", async (req, res) => {
  try {
    const { text, done, priority } = req.body;

    const updates = {};
    if (text     !== undefined) updates.text     = text.trim();
    if (done     !== undefined) updates.done     = Boolean(done);
    if (priority !== undefined) updates.priority = priority;

    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }   // return updated doc + validate
    );

    if (!todo) {
      return res.status(404).json({ success: false, message: "Todo not found" });
    }

    res.json({ success: true, data: todo });
  } catch (err) {
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── DELETE /delete-todos/done/clear ──────────────────────────────
// Must be defined BEFORE /:id so Express doesn't treat "done" as an id
app.delete("/delete-todos/done/clear", async (req, res) => {
  try {
    const result = await Todo.deleteMany({ done: true });
    res.json({ success: true, removed: result.deletedCount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── DELETE /delete-todos/:id ──────────────────────────────────────
app.delete("/delete-todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({ success: false, message: "Todo not found" });
    }

    res.json({ success: true, data: todo });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid id format" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});


app.post("/admin-register", (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password required",
      });
    }

    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify({
        username,
        password,
      }),
      SECRET_KEY
    ).toString();

    res.cookie("admin", encrypted, {
      httpOnly: true,
      secure: false, // true in production with HTTPS
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Admin registered successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

app.post("/admin-login", (req, res) => {
  try {
    const { username, password } = req.body;

    const encrypted = req.cookies.admin;

    if (!encrypted) {
      return res.status(404).json({
        success: false,
        message: "No admin registered",
      });
    }

    const bytes = CryptoJS.AES.decrypt(
      encrypted,
      SECRET_KEY
    );

    const admin = JSON.parse(
      bytes.toString(CryptoJS.enc.Utf8)
    );

    if (
      admin.username === username &&
      admin.password === password
    ) {
      return res.json({
        success: true,
        message: "Login successful",
      });
    }

    res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});
// ─── 404 fallback ──────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.listen(3000, () => {
  console.log(">> Server running on http://localhost:3000");
});