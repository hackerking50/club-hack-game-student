import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { initSchema } from "./db";
import { authMiddleware } from "./auth";
import { authRouter } from "./routes/auth";
import { productsRouter } from "./routes/products";
import { ordersRouter } from "./routes/orders";
import { adminRouter } from "./routes/admin";

initSchema();

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

app.use(express.json());
app.use(cookieParser());
app.use(authMiddleware);

// 정적 프론트엔드
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/admin", adminRouter);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`동아리 쇼핑몰 실행 중: http://localhost:${PORT}`);
  console.log(`[경고] 교육용 취약 앱입니다. 격리된 로컬 환경에서만 사용하세요.`);
});
