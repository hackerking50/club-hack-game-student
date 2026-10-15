import { Router } from "express";
import { db } from "../db";

export const productsRouter = Router();

productsRouter.get("/", (_req, res) => {
  const rows = db.prepare("SELECT id, name, price, stock, description FROM products").all();
  res.json(rows);
});

productsRouter.get("/search", (req, res) => {
  const q = String(req.query.q ?? "");
  const sql = `SELECT id, name, price, description FROM products WHERE name LIKE '%${q}%'`;
  try {
    res.json(db.prepare(sql).all());
  } catch (e: any) {
    res.status(500).json({ error: "쿼리 오류", detail: e.message });
  }
});

productsRouter.get("/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "상품 없음" });
  res.json(row);
});

// 상품 리뷰 조회
productsRouter.get("/:id/reviews", (req, res) => {
  const rows = db
    .prepare("SELECT author, body, created_at FROM reviews WHERE product_id = ? ORDER BY id DESC")
    .all(req.params.id);
  res.json(rows);
});

// 리뷰 작성 (로그인 불필요하게 열어둠 — Stored XSS 체인용)
productsRouter.post("/:id/reviews", (req, res) => {
  const { author, body } = req.body ?? {};
  if (!body) return res.status(400).json({ error: "body 필요" });
  db.prepare("INSERT INTO reviews (product_id, author, body) VALUES (?, ?, ?)").run(
    req.params.id,
    String(author ?? "익명"),
    String(body)
  );
  res.json({ ok: true });
});
