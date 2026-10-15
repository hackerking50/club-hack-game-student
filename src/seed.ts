import { db, initSchema } from "./db";

// 초기 데이터 심기. `npm run reset` 으로 언제든 초기화 가능.
initSchema();

db.exec("DELETE FROM users; DELETE FROM products; DELETE FROM orders; DELETE FROM reviews;");

const insertUser = db.prepare(
  "INSERT INTO users (username, password, role, balance) VALUES (?, ?, ?, ?)"
);
// 참가자가 탈취를 목표로 삼는 관리자 계정. 비밀번호는 일부러 추측 어렵게.
insertUser.run("admin", "S3cureAdm1n!_do_not_share", "admin", 999999);
insertUser.run("alice", "alice123", "user", 10000);
insertUser.run("bob", "bobpassword", "user", 10000);

const insertProduct = db.prepare(
  "INSERT INTO products (name, price, stock, description) VALUES (?, ?, ?, ?)"
);
insertProduct.run("동아리 후드티", 25000, 50, "따뜻한 기념 후드티");
insertProduct.run("스티커 팩", 3000, 200, "노트북용 스티커 모음");
insertProduct.run("키캡 세트", 18000, 30, "기계식 키보드용 키캡");
insertProduct.run("한정판 뱃지", 100000, 1, "딱 하나뿐인 한정판");

const insertReview = db.prepare(
  "INSERT INTO reviews (product_id, author, body) VALUES (?, ?, ?)"
);
insertReview.run(1, "alice", "사이즈가 잘 맞아요!");
insertReview.run(2, "bob", "스티커 퀄리티 좋네요");

// 매점 금고 플래그: 1라운드(공격) 목표 중 하나.
db.exec(`CREATE TABLE IF NOT EXISTS secrets (k TEXT PRIMARY KEY, v TEXT);`);
db.prepare("INSERT OR REPLACE INTO secrets (k, v) VALUES (?, ?)").run(
  "vault_flag",
  "FLAG{congrats_you_breached_the_store}"
);

console.log("seed 완료: users 3, products 4, reviews 2, secrets 1");
