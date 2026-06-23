# Subculture Calendar

여러 서브컬처 게임의 이벤트 일정을 한곳에서 확인하는 React 프론트엔드 프로젝트입니다. 현재는 더미 데이터를 사용하며, 백엔드가 추가되면 서비스 계층을 API 호출로 교체하도록 구성했습니다.

## 실행 방법

```bash
npm install
npm run dev
```

```bash
npm run lint
npm run build
```

## 주요 기능

- 월간 캘린더와 가로 타임라인 보기
- 게임 및 일정 유형 필터
- 게임 목록 드래그 정렬
- 추천 팔레트와 직접 색상 선택
- 일정 검색, 날짜 이동 및 일시 강조
- 연도·월 빠른 선택
- 일정 상세 모달과 오프라인 장소 표시
- hover 툴팁과 활성 게임 범례
- 다크·라이트 테마
- 사용자 설정 저장과 반응형 슬라이드 패널

## 폴더 구조

```text
src/
├─ components/   화면 컴포넌트
├─ constants/    저장 키와 추천 색상
├─ data/         시연용 더미 데이터
├─ hooks/        localStorage 상태 관리
├─ services/     추후 API로 교체할 데이터 접근 계층
└─ utils/        날짜와 색상 처리 함수
```

## 백엔드 연동 예정 지점

`src/services/eventService.js`의 `getEvents()`가 현재 더미 데이터를 반환합니다. 백엔드 개발 시 이 함수 내부를 이벤트 조회 API 호출로 교체하면 됩니다.
