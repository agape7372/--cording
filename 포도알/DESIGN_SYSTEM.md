# 포도알 디자인 시스템

## 1. 디자인 철학

### 1.1 핵심 원칙

```
┌─────────────────────────────────────────────────────────────┐
│                    포도알 디자인 원칙                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  🎯 명확함 (Clarity)                                        │
│     └─ 한 눈에 이해되는 직관적인 인터페이스                  │
│                                                              │
│  ✨ 만족감 (Satisfaction)                                   │
│     └─ 터치할 때마다 느껴지는 물리적 피드백                  │
│                                                              │
│  💜 따뜻함 (Warmth)                                         │
│     └─ 관계와 응원이 느껴지는 감성적 경험                    │
│                                                              │
│  🎮 재미 (Playfulness)                                      │
│     └─ 게임처럼 즐거운 습관 형성                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 디자인 스타일: Claymorphism + Paper-cut

```
Claymorphism (클레이모피즘)
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 점토로 빚은 듯한 부드러운 3D 형태
• 내부 그림자와 외부 광원 효과
• 눌렀을 때 쫀득한 변형 애니메이션
• 따뜻하고 친근한 질감

Paper-cut (페이퍼컷)
━━━━━━━━━━━━━━━━━━━━━━━━━━
• 종이 질감의 배경
• 레이어가 겹쳐진 깊이감
• 스티커 느낌의 UI 요소
• 부드러운 그림자 처리
```

---

## 2. 컬러 시스템

### 2.1 Primary Colors

```css
/* 포도 퍼플 계열 - 주요 브랜드 컬러 */
:root {
  --grape-100: #F3ECFF;  /* 배경 틴트 */
  --grape-200: #E0D0FF;  /* 호버/비활성 */
  --grape-300: #C4A8FF;  /* 글로우 효과 */
  --grape-400: #A87FFF;  /* 보조 */
  --grape-500: #9B7ED9;  /* 메인 포도알 */
  --grape-600: #7B5FB9;  /* 눌림 상태 */
  --grape-700: #5B3F99;  /* 진한 강조 */
  --grape-800: #3B1F79;  /* 텍스트 */
  --grape-900: #1B0059;  /* 최진한 */
}
```

### 2.2 Secondary Colors

```css
/* 민트 그린 계열 - 성공/완료 */
:root {
  --mint-100: #E6FFF5;
  --mint-300: #7ED9B4;
  --mint-500: #00C896;
  --mint-700: #008060;
}

/* 피치 계열 - CTA/강조 */
:root {
  --peach-100: #FFF3EC;
  --peach-300: #FFD4B8;
  --peach-500: #FFB88C;
  --peach-700: #FF8C4C;
}

/* 스카이 블루 계열 - 정보/링크 */
:root {
  --sky-100: #E6F4FF;
  --sky-300: #87CEEB;
  --sky-500: #4BA3D0;
  --sky-700: #1A73B5;
}

/* 골드 계열 - 보상/특별 */
:root {
  --gold-100: #FFFBE6;
  --gold-300: #FFE566;
  --gold-500: #FFD700;
  --gold-700: #B8860B;
}
```

### 2.3 Neutral Colors

```css
/* 배경 및 표면 */
:root {
  --cream-white: #FFF9F0;      /* 메인 배경 */
  --paper-light: #FDF8F3;      /* 카드 배경 */
  --paper-medium: #F5EDE0;     /* 종이 질감 */
  --paper-dark: #E8E4DE;       /* 비활성 요소 */
}

/* 텍스트 */
:root {
  --text-primary: #4A4A4A;     /* 주요 텍스트 */
  --text-secondary: #8B8B8B;   /* 보조 텍스트 */
  --text-tertiary: #B5B5B5;    /* 힌트 텍스트 */
  --text-inverse: #FFFFFF;     /* 역상 텍스트 */
}
```

### 2.4 Semantic Colors

```css
:root {
  --success: #00C896;    /* 성공 */
  --warning: #FFB020;    /* 경고 */
  --error: #FF4D4D;      /* 에러 */
  --info: #4BA3D0;       /* 정보 */
}
```

### 2.5 컬러 사용 가이드

| 용도 | 컬러 | Hex |
|-----|------|-----|
| 완료된 포도알 | grape-500 | #9B7ED9 |
| 비활성 포도알 | paper-dark | #E8E4DE |
| CTA 버튼 | peach-500 | #FFB88C |
| 성공 메시지 | mint-500 | #00C896 |
| 황금 포도알 | gold-500 | #FFD700 |
| 앱 배경 | cream-white | #FFF9F0 |

---

## 3. 타이포그래피

### 3.1 폰트 패밀리

```css
:root {
  /* 기본 본문 폰트 */
  --font-primary: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;

  /* 강조/디스플레이 폰트 */
  --font-display: 'Gmarket Sans', 'Pretendard', sans-serif;

  /* 숫자 폰트 (고정폭) */
  --font-mono: 'SF Mono', 'Menlo', monospace;
}
```

### 3.2 폰트 스케일

```css
:root {
  /* Font Sizes */
  --text-xs: 11px;     /* 캡션, 라벨 */
  --text-sm: 13px;     /* 보조 텍스트 */
  --text-base: 15px;   /* 본문 */
  --text-md: 17px;     /* 강조 본문 */
  --text-lg: 20px;     /* 소제목 */
  --text-xl: 24px;     /* 제목 */
  --text-2xl: 32px;    /* 대제목 */
  --text-3xl: 40px;    /* 히어로 */
  --text-4xl: 56px;    /* 숫자 디스플레이 */

  /* Line Heights */
  --leading-tight: 1.2;
  --leading-normal: 1.5;
  --leading-relaxed: 1.7;

  /* Font Weights */
  --font-regular: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
}
```

### 3.3 텍스트 스타일 프리셋

```css
/* 히어로 텍스트 */
.text-hero {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: var(--font-extrabold);
  line-height: var(--leading-tight);
  color: var(--grape-800);
}

/* 페이지 제목 */
.text-title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  color: var(--text-primary);
}

/* 섹션 헤딩 */
.text-heading {
  font-family: var(--font-primary);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  line-height: var(--leading-normal);
  color: var(--text-primary);
}

/* 본문 */
.text-body {
  font-family: var(--font-primary);
  font-size: var(--text-base);
  font-weight: var(--font-regular);
  line-height: var(--leading-relaxed);
  color: var(--text-primary);
}

/* 보조 텍스트 */
.text-caption {
  font-family: var(--font-primary);
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
  line-height: var(--leading-normal);
  color: var(--text-secondary);
}

/* 라벨 */
.text-label {
  font-family: var(--font-primary);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  line-height: var(--leading-normal);
  color: var(--text-tertiary);
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

/* 숫자 강조 */
.text-number {
  font-family: var(--font-mono);
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  line-height: 1;
  color: var(--grape-500);
}
```

---

## 4. 간격 시스템

### 4.1 Spacing Scale

```css
:root {
  --space-0: 0;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
}
```

### 4.2 레이아웃 간격

```css
:root {
  /* 화면 패딩 */
  --screen-padding: var(--space-5);  /* 20px */

  /* 섹션 간격 */
  --section-gap: var(--space-8);     /* 32px */

  /* 카드 내부 패딩 */
  --card-padding: var(--space-5);    /* 20px */

  /* 요소 간 기본 간격 */
  --element-gap: var(--space-3);     /* 12px */

  /* 인라인 요소 간격 */
  --inline-gap: var(--space-2);      /* 8px */
}
```

---

## 5. 컴포넌트 라이브러리

### 5.1 포도알 (Grape Bead)

```css
/* 기본 포도알 */
.grape-bead {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  position: relative;
  cursor: pointer;

  /* 기본 트랜지션 */
  transition:
    transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.15s ease;
}

/* 비활성 상태 */
.grape-bead--empty {
  background: linear-gradient(
    145deg,
    #F0EDE8 0%,
    #E0DCD5 100%
  );
  box-shadow:
    4px 4px 12px rgba(0, 0, 0, 0.08),
    -2px -2px 8px rgba(255, 255, 255, 0.9),
    inset 2px 2px 6px rgba(255, 255, 255, 0.5),
    inset -2px -2px 6px rgba(0, 0, 0, 0.05);
}

/* 활성 상태 (터치 가능) */
.grape-bead--available {
  background: linear-gradient(
    145deg,
    #E0D0FF 0%,
    #C4A8FF 100%
  );
  box-shadow:
    4px 4px 12px rgba(155, 126, 217, 0.2),
    -2px -2px 8px rgba(255, 255, 255, 0.8),
    inset 2px 2px 6px rgba(255, 255, 255, 0.4),
    inset -2px -2px 6px rgba(0, 0, 0, 0.1);

  animation: pulse-subtle 2s ease-in-out infinite;
}

/* 완료 상태 */
.grape-bead--completed {
  background: linear-gradient(
    145deg,
    #C4A8FF 0%,
    #9B7ED9 50%,
    #7B5FB9 100%
  );
  box-shadow:
    0 0 20px rgba(155, 126, 217, 0.4),
    4px 4px 12px rgba(155, 126, 217, 0.3),
    inset 2px 2px 8px rgba(255, 255, 255, 0.3),
    inset -3px -3px 8px rgba(0, 0, 0, 0.2);
}

/* 터치 시 */
.grape-bead:active {
  transform: scale(0.92);
  box-shadow:
    2px 2px 6px rgba(0, 0, 0, 0.15),
    inset 4px 4px 8px rgba(0, 0, 0, 0.15),
    inset -2px -2px 4px rgba(255, 255, 255, 0.2);
}

/* 응원 메시지 있음 */
.grape-bead--has-cheer::after {
  content: '💌';
  position: absolute;
  top: -4px;
  right: -4px;
  font-size: 16px;
  animation: bounce 1s ease-in-out infinite;
}

/* 애니메이션 */
@keyframes pulse-subtle {
  0%, 100% { box-shadow: 0 0 0 0 rgba(155, 126, 217, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(155, 126, 217, 0); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 15px rgba(155, 126, 217, 0.5); }
  50% { box-shadow: 0 0 30px rgba(155, 126, 217, 0.7); }
}
```

### 5.2 버튼

```css
/* 기본 버튼 스타일 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);

  padding: var(--space-4) var(--space-6);
  border-radius: 16px;
  border: none;

  font-family: var(--font-primary);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);

  cursor: pointer;
  transition: all 0.2s ease;
}

/* Primary (피치) */
.btn--primary {
  background: linear-gradient(180deg, #FFB88C 0%, #FF9A6C 100%);
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

  box-shadow:
    0 4px 12px rgba(255, 184, 140, 0.4),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
}

.btn--primary:active {
  transform: translateY(2px);
  box-shadow:
    0 2px 6px rgba(255, 184, 140, 0.3),
    inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Secondary (아웃라인) */
.btn--secondary {
  background: transparent;
  color: var(--grape-600);
  border: 2px solid var(--grape-300);

  box-shadow: 0 2px 8px rgba(155, 126, 217, 0.1);
}

.btn--secondary:active {
  background: var(--grape-100);
  border-color: var(--grape-500);
}

/* Ghost (텍스트만) */
.btn--ghost {
  background: transparent;
  color: var(--text-secondary);
  padding: var(--space-2) var(--space-4);
}

.btn--ghost:active {
  color: var(--grape-600);
  background: var(--grape-100);
}

/* Sizes */
.btn--sm {
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-sm);
  border-radius: 12px;
}

.btn--lg {
  padding: var(--space-5) var(--space-8);
  font-size: var(--text-md);
  border-radius: 20px;
}

/* Full Width */
.btn--full {
  width: 100%;
}

/* Disabled */
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}
```

### 5.3 카드

```css
/* 기본 카드 */
.card {
  background: var(--paper-light);
  border-radius: 24px;
  padding: var(--card-padding);

  /* Paper-cut 효과 */
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.02),
    0 4px 8px rgba(0, 0, 0, 0.04),
    0 8px 16px rgba(0, 0, 0, 0.04);
}

/* 강조 카드 */
.card--elevated {
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.04),
    0 8px 16px rgba(0, 0, 0, 0.06),
    0 16px 32px rgba(0, 0, 0, 0.06);
}

/* 선물 카드 (글래스모피즘) */
.card--reward {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);

  box-shadow:
    0 8px 32px rgba(155, 126, 217, 0.15),
    inset 0 0 0 1px rgba(255, 255, 255, 0.2);
}

/* 터치 가능한 카드 */
.card--interactive {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card--interactive:active {
  transform: scale(0.98);
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.04),
    0 4px 8px rgba(0, 0, 0, 0.06);
}
```

### 5.4 입력 필드

```css
/* 기본 입력 */
.input {
  width: 100%;
  padding: var(--space-4);
  border-radius: 16px;

  background: var(--cream-white);
  border: 2px solid var(--paper-dark);

  font-family: var(--font-primary);
  font-size: var(--text-base);
  color: var(--text-primary);

  transition: all 0.2s ease;
}

.input::placeholder {
  color: var(--text-tertiary);
}

.input:focus {
  outline: none;
  border-color: var(--grape-400);
  box-shadow: 0 0 0 4px rgba(155, 126, 217, 0.15);
}

/* 텍스트 영역 */
.textarea {
  min-height: 120px;
  resize: vertical;
}

/* 라벨 */
.input-label {
  display: block;
  margin-bottom: var(--space-2);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
}

/* 에러 상태 */
.input--error {
  border-color: var(--error);
}

.input-error-message {
  margin-top: var(--space-1);
  font-size: var(--text-xs);
  color: var(--error);
}
```

### 5.5 진행률 표시

```css
/* 진행 바 */
.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--paper-dark);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar__fill {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--grape-400) 0%,
    var(--grape-500) 100%
  );
  border-radius: 4px;
  transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 원형 진행률 */
.progress-circle {
  position: relative;
  width: 120px;
  height: 120px;
}

.progress-circle__bg {
  fill: none;
  stroke: var(--paper-dark);
  stroke-width: 8;
}

.progress-circle__fill {
  fill: none;
  stroke: var(--grape-500);
  stroke-width: 8;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: center;
  transition: stroke-dashoffset 0.5s ease;
}

.progress-circle__text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--grape-700);
}
```

---

## 6. 그림자 시스템

### 6.1 Elevation Levels

```css
:root {
  /* Level 0 - Flat */
  --shadow-0: none;

  /* Level 1 - Subtle */
  --shadow-1:
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 2px 4px rgba(0, 0, 0, 0.04);

  /* Level 2 - Default */
  --shadow-2:
    0 2px 4px rgba(0, 0, 0, 0.04),
    0 4px 8px rgba(0, 0, 0, 0.06);

  /* Level 3 - Elevated */
  --shadow-3:
    0 4px 8px rgba(0, 0, 0, 0.04),
    0 8px 16px rgba(0, 0, 0, 0.06),
    0 16px 32px rgba(0, 0, 0, 0.04);

  /* Level 4 - Modal */
  --shadow-4:
    0 8px 16px rgba(0, 0, 0, 0.08),
    0 16px 32px rgba(0, 0, 0, 0.08),
    0 32px 64px rgba(0, 0, 0, 0.06);

  /* 컬러 그림자 */
  --shadow-grape:
    0 4px 16px rgba(155, 126, 217, 0.3);

  --shadow-peach:
    0 4px 16px rgba(255, 184, 140, 0.4);

  --shadow-gold:
    0 0 30px rgba(255, 215, 0, 0.5);
}
```

### 6.2 Clay 효과 그림자

```css
/* Claymorphism 그림자 패턴 */
.clay-shadow {
  box-shadow:
    /* 외부 그림자 */
    4px 4px 12px rgba(0, 0, 0, 0.15),
    -4px -4px 12px rgba(255, 255, 255, 0.8),
    /* 내부 하이라이트 */
    inset 2px 2px 6px rgba(255, 255, 255, 0.4),
    inset -2px -2px 6px rgba(0, 0, 0, 0.1);
}

/* 눌린 상태 */
.clay-shadow--pressed {
  box-shadow:
    1px 1px 4px rgba(0, 0, 0, 0.15),
    -1px -1px 4px rgba(255, 255, 255, 0.6),
    inset 3px 3px 8px rgba(0, 0, 0, 0.15),
    inset -2px -2px 4px rgba(255, 255, 255, 0.2);
}
```

---

## 7. 모션 & 애니메이션

### 7.1 Easing Curves

```css
:root {
  /* 기본 */
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);

  /* 진입 */
  --ease-in: cubic-bezier(0.4, 0, 1, 1);

  /* 퇴장 */
  --ease-out: cubic-bezier(0, 0, 0.2, 1);

  /* 탄성 (바운스) */
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* 스프링 */
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

### 7.2 Duration Scale

```css
:root {
  --duration-instant: 100ms;
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;
  --duration-slower: 600ms;
}
```

### 7.3 주요 애니메이션

```css
/* 포도알 완료 */
@keyframes grape-complete {
  0% {
    transform: scale(1);
  }
  30% {
    transform: scale(1.2);
  }
  50% {
    transform: scale(0.9);
  }
  70% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* 글로우 펄스 */
@keyframes glow-pulse {
  0%, 100% {
    box-shadow: 0 0 10px var(--grape-300);
    opacity: 0.8;
  }
  50% {
    box-shadow: 0 0 25px var(--grape-400);
    opacity: 1;
  }
}

/* 컨페티 */
@keyframes confetti-fall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

/* 페이드 인 업 */
@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 스케일 인 */
@keyframes scale-in {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* 반짝임 */
@keyframes sparkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}
```

---

## 8. 아이콘 시스템

### 8.1 아이콘 스타일

```
스타일: Rounded, Filled
선 두께: 2px
모서리: 완전 라운드
크기:
  - SM: 16px
  - MD: 20px (기본)
  - LG: 24px
  - XL: 32px
```

### 8.2 핵심 아이콘

```
Navigation:
  🏠 home         - 홈
  ←  back         - 뒤로
  ×  close        - 닫기
  ⚙️ settings     - 설정

Actions:
  +  add          - 추가
  ✓  check        - 완료
  🔗 share        - 공유
  📷 camera       - 카메라
  🎤 microphone   - 마이크

Status:
  🍇 grape        - 포도알
  🎁 gift         - 선물
  💌 message      - 메시지
  🔔 notification - 알림
  ⭐ star         - 별/보상
```

### 8.3 아이콘 컬러 규칙

| 상황 | 컬러 |
|-----|------|
| 기본 | text-secondary |
| 활성 | grape-600 |
| 비활성 | text-tertiary |
| 성공 | mint-500 |
| 경고 | warning |

---

## 9. 반응형 디자인

### 9.1 Breakpoints

```css
:root {
  --breakpoint-sm: 375px;   /* Small phone */
  --breakpoint-md: 414px;   /* Large phone */
  --breakpoint-lg: 768px;   /* Tablet */
  --breakpoint-xl: 1024px;  /* Desktop */
}
```

### 9.2 Safe Areas

```css
/* iOS Safe Area 대응 */
.container {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* 하단 버튼 영역 */
.bottom-action {
  padding-bottom: calc(env(safe-area-inset-bottom) + 20px);
}
```

### 9.3 포도알 그리드 반응형

```css
/* 화면 크기에 따른 포도알 크기 */
.grape-grid {
  --grape-size: 48px;
  gap: 8px;
}

@media (min-width: 375px) {
  .grape-grid {
    --grape-size: 52px;
    gap: 10px;
  }
}

@media (min-width: 414px) {
  .grape-grid {
    --grape-size: 56px;
    gap: 12px;
  }
}
```

---

## 10. 접근성 (Accessibility)

### 10.1 색상 대비

```
모든 텍스트는 WCAG 2.1 AA 기준 충족
- 일반 텍스트: 4.5:1 이상
- 큰 텍스트: 3:1 이상
```

### 10.2 터치 타겟

```css
/* 최소 터치 영역: 44x44px */
.touch-target {
  min-width: 44px;
  min-height: 44px;
}
```

### 10.3 모션 감소

```css
/* 사용자가 모션 감소를 선호할 경우 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 10.4 스크린 리더 지원

```html
<!-- 포도알 상태 설명 -->
<button
  class="grape-bead grape-bead--completed"
  aria-label="5번째 포도알, 완료됨"
  role="checkbox"
  aria-checked="true"
>
</button>

<!-- 진행률 -->
<div
  class="progress-bar"
  role="progressbar"
  aria-valuenow="7"
  aria-valuemin="0"
  aria-valuemax="14"
  aria-label="14개 중 7개 완료"
>
</div>
```

---

*이 디자인 시스템은 포도알 앱의 일관된 사용자 경험을 위한 가이드입니다.*
