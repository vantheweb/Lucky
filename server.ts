import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Simulated In-memory DB for transactions (In production, use Firestore)
  const transactions = new Set();

  // API Route for SePay Webhook
  app.post("/api/webhooks/sepay", (req, res) => {
    const { 
      id, // Transaction ID from SePay
      content, // SPIN USERNAME
      amount,
      transfer_type // in/out
    } = req.body;

    console.log("SePay Webhook received:", req.body);
    
    if (transfer_type === 'in' && !transactions.has(id)) {
      transactions.add(id);
      // Logic to find user by 'content' and add 'amount' to their balance
      // Example: const username = content.replace('SPIN ', '');
      // Update balance in Firestore...
    }
    
    res.json({ success: true });
  });

  // API to get current app environment (useful for client)
  app.get("/api/config", (req, res) => {
    res.json({
      appUrl: process.env.APP_URL,
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
