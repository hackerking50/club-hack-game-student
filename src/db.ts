import { DatabaseSync } from "node:sqlite";
import path from "path";

// Node 24 내장 SQLite. 네이티브 빌드가 필요 없음.
// 팀마다 컨테이너/폴더를 나누면 DB 파일도 분리됨.
export const db = new DatabaseSync(path.join(__dirname, "..", "shop.db"));
db.exec("PRAGMA journal_mode = WAL;");

export function initSchema(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role     TEXT NOT NULL DEFAULT 'user',
      balance  INTEGER NOT NULL DEFAULT 10000
    );

    CREATE TABLE IF NOT EXISTS products (
      id    INTEGER PRIMARY KEY AUTOINCREMENT,
      name  TEXT NOT NULL,
      price INTEGER NOT NULL,
      stock INTEGER NOT NULL DEFAULT 100,
      description TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS orders (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id  INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      qty      INTEGER NOT NULL,
      total    INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      author   TEXT NOT NULL,
      body     TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS secrets (k TEXT PRIMARY KEY, v TEXT);
  `);
}
