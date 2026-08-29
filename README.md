# 아브라함문

영국 직물의 헤리티지를 오늘의 감각으로 풀어낸 25cm 메리노울 머플러 브랜드 홈페이지입니다.

## 구성

- 홈 / 내 소개 / 제품(독립 페이지) / 이야기 / 연락하기
- 순수 HTML, CSS, JavaScript
- 모바일 반응형 레이아웃
- 키보드 탐색 및 모션 감소 설정 지원
- 별도의 빌드 과정 없음

## 로컬에서 보기

제품 데이터는 `fetch()`로 불러오므로 로컬 서버에서 확인해야 합니다. 다음 명령을 실행하세요.

```bash
python -m http.server 8000
```

그 다음 `http://localhost:8000`으로 접속합니다.

## 수정하기

- 페이지 내용: `index.html`
- 브랜드 소개 이야기: `about.html`
- 제품 목록 페이지: `products.html`
- 제품 데이터: `products.json`
- 색상과 레이아웃: `styles.css`
- 메뉴와 이메일 폼 동작: `script.js`
- 제품 카드 렌더링: `products.js`
- 제품 이미지: `assets/abrahammoon-merino-muffler.png`

이메일 신청 폼과 이야기 링크는 현재 데모용입니다.

새 제품은 `products.json`의 `products` 배열에 `name`, `tagline`, `price`, `image`, `url`을 추가하면 홈과 제품 페이지에 함께 반영됩니다. `tagline`은 카드에 표시되는 짧은 상황 문구입니다.
