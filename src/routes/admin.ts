import { Router, Response } from "express";
import { db } from "../db";
import { AuthedRequest, requireAdmin } from "../auth";

export const adminRouter = Router();

// 관리자 대시보드: 매점 금고 플래그 노출. admin 권한 탈취가 목표.
// requireAdmin 으로 보호 → 권한 상승에 성공해야만 플래그를 볼 수 있음.
adminRouter.get("/dashboard", requireAdmin, (_req: AuthedRequest, res: Response) => {
  const flag = db.prepare("SELECT v FROM secrets WHERE k = 'vault_flag'").get() as any;
  const users = db.prepare("SELECT id, username, role, balance FROM users").all();
  res.json({ message: "관리자 대시보드", flag: flag?.v, users });
});

// 프로필 수정: 사용자가 자기 정보를 바꾸는 엔드포인트
adminRouter.post("/profile", (req: AuthedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "로그인 필요" });
  const fields = req.body ?? {};
  for (const key of Object.keys(fields)) {
    db.prepare(`UPDATE users SET ${key} = ? WHERE id = ?`).run(fields[key], req.user.id);
  }
  const updated = db
    .prepare("SELECT id, username, role, balance FROM users WHERE id = ?")
    .get(req.user.id);
  res.json({ ok: true, user: updated });
});
