import express from "express";
import cors from "cors";
import linksRouter from "./routes/links.js";
import healthRouter from "./routes/health.js";
import { handleRedirect } from "./controllers/linksController.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// frontend
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/api/links", linksRouter);
app.use("/healthz", healthRouter);

// redirect must be last
app.get("/:code", handleRedirect);

export default app;
