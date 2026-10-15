import { Router } from "express";
import { db } from "../db";
import { signToken, AuthedRequest } from "../auth";

export const authRouter = Router();

authRouter.post("/register", (req, res) => {
  const { username, password } = req.body ?? {};
  if (!username || !password) {
    return res.status(400).json({ error: "username, password 필요" });
  }
  try {
    const info = db
      .prepare("INSERT INTO users (username, password, role) VALUES (?, ?, 'user')")
      .run(String(username), String(password));
    return res.json({ ok: true, id: info.lastInsertRowid });
  } catch {
    return res.status(409).json({ error: "이미 존재하는 사용자" });
  }
});

authRouter.post("/login", (req, res) => {
  const { username, password } = req.body ?? {};

  const sql = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  try {
    const user = db.prepare(sql).get() as any;
    if (!user) return res.status(401).json({ error: "로그인 실패" });

    const token = signToken({ id: user.id, username: user.username, role: user.role });
    res.cookie("token", token, { httpOnly: true });
    return res.json({ ok: true, username: user.username, role: user.role });
  } catch (e: any) {
    return res.status(500).json({ error: "쿼리 오류", detail: e.message });
  }
});

authRouter.post("/logout", (_req, res) => {
  res.clearCookie("token");
  res.json({ ok: true });
});

authRouter.get("/me", (req: AuthedRequest, res) => {
  if (!req.user) return res.status(401).json({ error: "비로그인" });
  res.json(req.user);
});
