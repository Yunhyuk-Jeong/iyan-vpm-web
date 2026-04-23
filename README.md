# Iyan Personal Webpage

의존성 없이 배포 가능한 개인 웹페이지 MVP입니다. 정적 파일만으로 동작하며, GitHub Pages나 Vercel의 static hosting에 바로 올릴 수 있습니다.

## Architecture

- `index.html`: 페이지 구조, 접근성 마크업, SEO/Open Graph 메타데이터
- `styles.css`: 디자인 토큰, 반응형 레이아웃, 다크 테마, 상태 스타일
- `script.js`: 프로젝트 데이터 렌더링, 테마 저장, 스크롤 헤더 상태

## Data Flow

1. `index.html`이 기본 섹션과 프로젝트 그리드 컨테이너를 로드합니다.
2. `script.js`의 `projects` 배열이 프로젝트 카드 데이터를 보유합니다.
3. 로드 시 프로젝트 카드 HTML이 생성되어 `#project-grid`에 삽입됩니다.
4. 테마 선택은 `localStorage`에 저장되어 다음 방문에도 유지됩니다.

## Personalization

- 이름: `index.html`의 `Iyan Kim` 텍스트 변경
- 이메일: `mailto:hello@example.com` 변경
- 프로젝트: `script.js`의 `projects` 배열 수정
- 색상: `styles.css`의 `:root` 디자인 토큰 수정
