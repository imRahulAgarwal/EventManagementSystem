import "dotenv/config";
import express from "express";
import cors from "cors";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import panelRouter from "./routes/panelRoutes.js";
import morganMiddleware from "./middlewares/morganMiddleware.js";
import connectDatabase from "./configs/database.js";

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",").filter(Boolean);

await connectDatabase();

app.use(cors({ origin: allowedOrigins }));
app.use(morganMiddleware);

app.use("/panel", panelRouter);
app.use(errorMiddleware);

app.listen(PORT, () => console.log(`Server running at port http://localhost:${PORT}`));
