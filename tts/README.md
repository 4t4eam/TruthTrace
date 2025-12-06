1. 의존성 설치
- `npm i` 또는 `npm install`로 `ttn`과 `ttn/server` 폴더 의존성 설치.
2. .env 수정
- `ttn/server/.env`에서 공란을 채워야 제대로 작동.
- GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL, GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY, SERP_API_KEY, GEMINI_API_KEY를 채워야 함.
- 현재 저장소는 public이므로 private 저장소 env에 완전한 .env 파일을 제공함. 필요하면 활용하기 바람. (API 사용량 제한 고려할 것)
2. 실행
- `ttn`에서 `npm run dev`, `ttn/server`에서 `node index.js` 실행.
