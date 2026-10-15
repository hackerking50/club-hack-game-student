import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const JWT_SECRET = "secret";

export interface AuthedRequest extends Request {
  user?: { id: number; username: string; role: string };
}

export function signToken(user: { id: number; username: string; role: string }): string {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "2h" }
  );
}

// 쿠키의 JWT를 검증해 req.user 를 채움.
export function authMiddleware(req: AuthedRequest, _res: Response, next: NextFunction): void {
  const token = req.cookies?.token;
  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as any;
      req.user = { id: payload.id, username: payload.username, role: payload.role };
    } catch {
      // 토큰이 유효하지 않으면 비로그인 상태로 진행
    }
  }
  next();
}

export function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction): void {
  if (req.user?.role === "admin") return next();
  res.status(403).json({ error: "관리자만 접근할 수 있습니다." });
}
