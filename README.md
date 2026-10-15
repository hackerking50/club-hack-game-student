# 🛒 동아리 매점 — 홈페이지 해킹 방어 게임

동아리 보안 실습용 **의도적으로 취약한** 쇼핑몰입니다.
공격으로 약점을 찾고, 코드를 고쳐 방어하는 것이 목표입니다.

> ⚠️ **윤리·안전 수칙**
> - 이 앱은 **교육용**이며 일부러 취약하게 만들어졌습니다. **격리된 로컬 환경에서만** 실행하세요.
> - 여기서 배운 공격 기법을 **허가받지 않은 실제 사이트에 사용하는 것은 불법**입니다.
> - 인터넷에 공개 배포하지 마세요.

## 요구 사항
- Node.js 22 이상 (내장 `node:sqlite` 사용 — 별도 DB 설치 불필요)

## 실행
```bash
npm install      # 최초 1회
npm run seed     # 초기 데이터 심기
npm run dev      # http://localhost:3000
```
DB를 처음 상태로 되돌리려면:
```bash
npm run reset
```
팀마다 포트를 나눠 여러 개 띄우려면:
```bash
PORT=3001 npm run dev   # 팀1
PORT=3002 npm run dev   # 팀2
```

## 진행 방식 (3라운드)
1. **공격 (블랙박스):** 소스 없이 `http://localhost:3000` 만 보고 숨은 플래그를 찾습니다.
2. **방어 (소스 공개):** 코드를 패치해 공격을 막습니다. 운영자 봇이 주기적으로 공격하고, 정상 기능도 함께 검사합니다.
   - 점수 = 막아낸 공격 + 정상 동작 유지. **입력을 다 막아 기능이 죽으면 감점**입니다.
3. **발표:** 원인 → 공격 과정 → 패치 방법을 팀별로 설명합니다.

## 등장 계정
| username | password | role |
|---|---|---|
| alice | alice123 | user |
| bob | bobpassword | user |
| admin | (추측 어려움 — 탈취가 목표) | admin |

## 주요 엔드포인트
| 메서드 | 경로 | 설명 |
|---|---|---|
| POST | `/api/auth/register` | 회원가입 |
| POST | `/api/auth/login` | 로그인 |
| GET  | `/api/auth/me` | 내 정보 |
| GET  | `/api/products` | 상품 목록 |
| GET  | `/api/products/search?q=` | 상품 검색 |
| GET  | `/api/products/:id/reviews` | 리뷰 조회 |
| POST | `/api/products/:id/reviews` | 리뷰 작성 |
| POST | `/api/orders` | 주문 |
| GET  | `/api/orders/:id` | 주문 상세 |
| POST | `/api/admin/profile` | 프로필 수정 |
| GET  | `/api/admin/dashboard` | 관리자 전용 (플래그) |

## 힌트 (막힐 때만)
- 입력창에 특수문자를 넣으면 서버가 어떻게 반응하나요?
- 브라우저 개발자도구의 **Network 탭**으로 요청 본문을 들여다보고, 값을 바꿔서 다시 보내 보세요.
- "나만 볼 수 있어야 하는 것"을 정말 나만 볼 수 있나요? 숫자로 된 id를 바꿔 보세요.
- 서버가 **클라이언트가 보낸 값을 그대로 믿는** 지점이 어디일까요?

행운을 빕니다. 🔐
