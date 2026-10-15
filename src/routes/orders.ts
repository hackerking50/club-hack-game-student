import { Router, Response } from "express";
import { db } from "../db";
import { AuthedRequest } from "../auth";

export const ordersRouter = Router();

// 주문 생성
ordersRouter.post("/", (req: AuthedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "로그인 필요" });
  const { productId, qty, price } = req.body ?? {};

  const product = db.prepare("SELECT * FROM products WHERE id = ?").get(productId) as any;
  if (!product) return res.status(404).json({ error: "상품 없음" });

  const unitPrice = price ?? product.price;
  const total = unitPrice * qty;

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.id) as any;
  if (user.balance < total) return res.status(400).json({ error: "잔액 부족" });

  db.prepare("UPDATE users SET balance = balance - ? WHERE id = ?").run(total, req.user.id);
  db.prepare("UPDATE products SET stock = stock - ? WHERE id = ?").run(qty, productId);
  const info = db
    .prepare("INSERT INTO orders (user_id, product_id, qty, total) VALUES (?, ?, ?, ?)")
    .run(req.user.id, productId, qty, total);

  res.json({ ok: true, orderId: info.lastInsertRowid, total });
});

// 주문 상세 조회
ordersRouter.get("/:id", (req: AuthedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "로그인 필요" });
  const row = db.prepare("SELECT * FROM orders WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "주문 없음" });
  res.json(row);
});
