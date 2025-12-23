# 포도알 핵심 기능 상세 명세서

## 1. 포도알 달성판 (Grape Board)

### 1.1 포도알 구성

```
포도알 배치 패턴 (14개 예시)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      🍇 🍇 🍇
     🍇 🍇 🍇 🍇
      🍇 🍇 🍇
     🍇 🍇 🍇 🍇

자연스러운 포도송이 형태로 배치
중앙에서 바깥으로 번호 매김
```

### 1.2 포도알 상태

| 상태 | 시각적 표현 | 인터랙션 |
|-----|-----------|---------|
| `empty` | 회색 클레이, 무광 | 터치 불가 (비활성) |
| `available` | 연보라 테두리, 살짝 빛남 | 터치 가능 |
| `completed` | 보라색 글로우, 반짝임 | 터치 시 bounce |
| `has_cheer` | 작은 💌 아이콘 | 터치 시 메시지 팝업 |

### 1.3 터치 인터랙션 상세

```dart
// 터치 시퀀스 구현
class GrapeInteraction {
  // Phase 1: Touch Down
  void onTouchStart() {
    // 스케일 축소 (0.92)
    // 그림자 축소
    // Light haptic
    scale = 0.92;
    HapticFeedback.lightImpact();
  }

  // Phase 2: Hold (300ms)
  void onHold() {
    // 색상 전환 (grey → purple)
    // 내부 그림자 강화
    // Continuous vibration
    colorTransition.start();
    innerShadow.increase();
  }

  // Phase 3: Release
  void onTouchEnd() {
    // 스케일 복원 + bounce
    // 글로우 효과 추가
    // "톡!" 사운드
    // Success haptic
    scale = 1.0;
    addGlowEffect();
    AudioPlayer.play('pop.mp3');
    HapticFeedback.mediumImpact();

    // 파티클 효과
    ParticleEmitter.emit(
      type: ParticleType.stars,
      count: 12,
      color: Colors.purple,
    );
  }
}
```

### 1.4 사운드 에셋

| 이벤트 | 사운드 | 파일명 |
|-------|-------|-------|
| 포도알 터치 | 부드러운 "톡" | `pop_soft.mp3` |
| 포도알 완료 | 밝은 "띵!" | `success_ding.mp3` |
| 응원 등장 | 마법 효과음 | `magic_reveal.mp3` |
| 전체 완료 | 팡파레 | `fanfare.mp3` |
| 스크래치 | 긁는 소리 | `scratch_loop.mp3` |
| 선물 공개 | 짜잔! | `tada.mp3` |

---

## 2. 조건부 선물 시스템

### 2.1 선물 유형

```typescript
enum RewardType {
  GIFTICON = 'gifticon',    // 모바일 상품권
  CASH = 'cash',            // 현금/포인트
  PHYSICAL = 'physical',    // 실물 선물
  EXPERIENCE = 'experience', // 경험 (밥, 여행 등)
  CUSTOM = 'custom'         // 사용자 정의
}

interface Reward {
  id: string;
  type: RewardType;
  title: string;
  description?: string;
  imageUrl: string;
  value?: number;           // 금액 (원)
  expiresAt?: Date;         // 유효기간
  barcode?: string;         // 기프티콘 바코드 (암호화)
  isUnlocked: boolean;
}
```

### 2.2 블러 알고리즘

```dart
// 진행률에 따른 블러 강도
double getBlurSigma(int completed, int total) {
  final progress = completed / total;

  // 비선형 감소 (처음엔 빠르게, 나중엔 천천히)
  // 기대감을 유지하면서 점진적 공개
  final curve = Curves.easeOutCubic.transform(progress);

  // Max blur: 25px, Min blur: 0px
  return 25.0 * (1 - curve);
}

// 시각적 효과 추가
Widget buildRewardPreview({
  required String imageUrl,
  required double blur,
}) {
  return Stack(
    children: [
      // 블러된 이미지
      ImageFiltered(
        imageFilter: ImageFilter.blur(sigmaX: blur, sigmaY: blur),
        child: Image.network(imageUrl),
      ),

      // 진행률 오버레이
      if (blur > 5)
        Center(
          child: Text(
            '🎁 선물이 기다려요',
            style: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
    ],
  );
}
```

### 2.3 에스크로 플로우

```
┌──────────────────────────────────────────────────────────────┐
│                    에스크로 시스템 플로우                     │
└──────────────────────────────────────────────────────────────┘

[주는 사람]                    [시스템]                    [받는 사람]
     │                           │                           │
     │  1. 선물 등록             │                           │
     │  ─────────────────────▶   │                           │
     │                           │                           │
     │  2. 결제 (기프티콘)        │                           │
     │  ─────────────────────▶   │                           │
     │                           │                           │
     │         3. 암호화 저장     │                           │
     │  ◀─────────────────────   │                           │
     │                           │                           │
     │         4. 챌린지 시작     │                           │
     │         ─────────────────────────────────────────────▶ │
     │                           │                           │
     │                           │     5. 매일 달성          │
     │                           │  ◀─────────────────────── │
     │                           │                           │
     │                           │     6. 전체 완료          │
     │                           │  ◀─────────────────────── │
     │                           │                           │
     │         7. 자동 복호화     │                           │
     │         ─────────────────────────────────────────────▶ │
     │                           │                           │
     │                           │     8. 선물 수령!         │
     │                           │  ◀─────────────────────── │
     │                           │                           │
     │     9. 감사 알림 수신      │                           │
     │  ◀─────────────────────   │                           │
     │                           │                           │
```

### 2.4 실패/취소 처리

```typescript
// 챌린지 만료 시
async function handleChallengeExpired(challengeId: string) {
  const challenge = await getChallenge(challengeId);
  const reward = await getReward(challengeId);

  if (!reward.isUnlocked) {
    // 선물 미해제 상태로 만료

    if (reward.type === 'gifticon') {
      // 기프티콘: 환불 또는 주는 사람에게 반환
      await refundToGiver(reward);
    }

    // 챌린지 상태 업데이트
    await updateChallenge(challengeId, { status: 'expired' });

    // 양쪽에 알림
    await notifyBoth(challenge, {
      title: '챌린지가 종료되었어요',
      body: '다음에 다시 도전해보세요!',
    });
  }
}

// 중도 포기 시
async function handleChallengeAbandoned(challengeId: string) {
  // 주는 사람 동의 필요
  await requestGiverApproval(challengeId);
}
```

---

## 3. 타임캡슐 응원 시스템

### 3.1 응원 메시지 타입

```typescript
interface CheerMessage {
  id: string;
  challengeId: string;
  grapePosition: number;      // 어떤 포도알에 숨겨질지
  type: 'text' | 'voice' | 'photo' | 'video';
  content?: string;           // 텍스트 내용
  mediaUrl?: string;          // 미디어 URL
  duration?: number;          // 음성/영상 길이 (초)
  isRevealed: boolean;
  revealedAt?: Date;
}
```

### 3.2 응원 등록 UI

```
┌─────────────────────────────────────┐
│        응원 메시지 심기             │
├─────────────────────────────────────┤
│                                     │
│  어떤 포도알에 심을까요?            │
│                                     │
│     🍇 🍇 🍇 🍇 🍇                  │
│    🍇 ❤️ 🍇 🍇 ❤️ 🍇               │  ← 하트: 선택된 위치
│     🍇 🍇 🍇 🍇 🍇                  │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  응원 유형 선택:                    │
│                                     │
│  ┌───────┐ ┌───────┐ ┌───────┐     │
│  │  💬   │ │  🎤   │ │  📷   │     │
│  │ 텍스트 │ │ 음성  │ │ 사진  │     │
│  └───────┘ └───────┘ └───────┘     │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ "화이팅! 넌 할 수 있어!" 📝 │   │
│  └─────────────────────────────┘   │
│                                     │
│          [ 응원 심기 ]              │
│                                     │
└─────────────────────────────────────┘
```

### 3.3 응원 팝업 애니메이션

```dart
class CheerRevealAnimation extends StatefulWidget {
  final CheerMessage cheer;

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Transform.scale(
          scale: _scaleAnimation.value,
          child: Opacity(
            opacity: _fadeAnimation.value,
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: Colors.purple.withOpacity(0.3),
                    blurRadius: 20,
                    spreadRadius: 5,
                  ),
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // 봉투 열리는 애니메이션
                  EnvelopeAnimation(),

                  // 메시지 내용
                  _buildCheerContent(cheer),

                  // 보낸 사람
                  Text('From: ${cheer.senderName}'),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
```

---

## 4. 스크래치 언락 시스템

### 4.1 스크래치 메커니즘

```dart
class ScratchCard extends StatefulWidget {
  final String revealImageUrl;
  final VoidCallback onComplete;

  @override
  Widget build(BuildContext context) {
    return Scratcher(
      // 스크래치 설정
      brushSize: 50,
      threshold: 60,  // 60% 긁으면 자동 완료
      color: Color(0xFFFFD700),  // 황금색

      // 스크래치 패턴
      image: Image.asset('assets/gold_texture.png'),

      // 콜백
      onChange: (value) {
        // 진행률에 따른 햅틱
        if (value > _lastProgress + 0.1) {
          HapticFeedback.selectionClick();
          _lastProgress = value;
        }
      },
      onThreshold: () {
        // 완료 처리
        _revealWithAnimation();
        onComplete();
      },

      // 숨겨진 내용
      child: Image.network(revealImageUrl),
    );
  }

  void _revealWithAnimation() {
    // 1. 강한 햅틱
    HapticFeedback.heavyImpact();

    // 2. 사운드
    AudioPlayer.play('tada.mp3');

    // 3. 남은 영역 자동 제거 애니메이션
    _scratchController.reveal(
      duration: Duration(milliseconds: 500),
      curve: Curves.easeOut,
    );

    // 4. 컨페티 효과
    ConfettiController.play();
  }
}
```

### 4.2 황금 포도알 디자인

```css
.golden-grape {
  width: 200px;
  height: 200px;
  border-radius: 50%;

  /* 황금 그라데이션 */
  background: linear-gradient(
    135deg,
    #FFE566 0%,
    #FFD700 25%,
    #FFA500 50%,
    #FFD700 75%,
    #FFE566 100%
  );

  /* 메탈릭 효과 */
  box-shadow:
    0 0 60px rgba(255, 215, 0, 0.6),
    inset 0 0 30px rgba(255, 255, 255, 0.4),
    inset 0 -20px 40px rgba(0, 0, 0, 0.2);

  /* 빛 반사 애니메이션 */
  animation: shine 3s ease-in-out infinite;
}

@keyframes shine {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
```

---

## 5. 알림 시스템

### 5.1 알림 유형

| 트리거 | 받는 사람 | 메시지 예시 |
|-------|----------|------------|
| 챌린지 생성 | 받는 사람 | "🍇 새로운 챌린지가 도착했어요!" |
| 챌린지 수락 | 주는 사람 | "✅ OO님이 챌린지를 수락했어요!" |
| 포도알 달성 | 주는 사람 | "🎉 OO님이 5번째 포도알을 채웠어요!" |
| 응원 확인 | 주는 사람 | "💌 OO님이 응원 메시지를 확인했어요" |
| 전체 완료 | 양쪽 | "🏆 축하해요! 모든 포도알을 모았어요!" |
| 리마인더 | 받는 사람 | "⏰ 오늘의 목표를 잊지 마세요!" |
| 독촉 (옵션) | 받는 사람 | "💪 OO님이 응원하고 있어요!" |

### 5.2 푸시 알림 구현

```dart
class NotificationService {
  static Future<void> scheduleReminder({
    required String challengeId,
    required TimeOfDay reminderTime,
  }) async {
    await FirebaseMessaging.instance.subscribeToTopic(
      'challenge_$challengeId',
    );

    // 매일 알림 스케줄
    await FlutterLocalNotificationsPlugin().zonedSchedule(
      challengeId.hashCode,
      '오늘의 포도알',
      '목표를 달성하고 포도알을 채워보세요! 🍇',
      _nextInstanceOfTime(reminderTime),
      NotificationDetails(
        android: AndroidNotificationDetails(
          'daily_reminder',
          '일일 리마인더',
          importance: Importance.high,
        ),
        iOS: DarwinNotificationDetails(
          sound: 'reminder.aiff',
        ),
      ),
      matchDateTimeComponents: DateTimeComponents.time,
      uiLocalNotificationDateInterpretation:
          UILocalNotificationDateInterpretation.absoluteTime,
    );
  }
}
```

---

## 6. 공유 시스템

### 6.1 공유 콘텐츠 유형

```typescript
interface ShareContent {
  type: 'invite' | 'progress' | 'complete' | 'thank';
  title: string;
  description: string;
  imageUrl: string;
  deepLink: string;
}

// 초대 공유
const inviteShare: ShareContent = {
  type: 'invite',
  title: '🍇 포도알 챌린지에 초대합니다!',
  description: 'OO님이 특별한 선물을 준비했어요. 포도알을 채우고 선물을 받아보세요!',
  imageUrl: 'https://podoal.app/share/invite.png',
  deepLink: 'podoal://challenge/abc123',
};

// 진행 공유
const progressShare: ShareContent = {
  type: 'progress',
  title: '🍇 포도알 진행중!',
  description: '7/14 달성! 반이나 왔어요!',
  imageUrl: 'https://podoal.app/share/progress/abc123.png',
  deepLink: 'podoal://challenge/abc123',
};

// 완료 공유
const completeShare: ShareContent = {
  type: 'complete',
  title: '🎉 포도알 챌린지 완료!',
  description: '14일 연속 목표 달성! 선물을 받았어요!',
  imageUrl: 'https://podoal.app/share/complete/abc123.png',
  deepLink: 'podoal://download',
};
```

### 6.2 카카오톡 공유 템플릿

```dart
class KakaoShareService {
  static Future<void> shareChallenge({
    required Challenge challenge,
    required ShareType type,
  }) async {
    final template = FeedTemplate(
      content: Content(
        title: _getTitle(challenge, type),
        description: _getDescription(challenge, type),
        imageUrl: Uri.parse(_getImageUrl(challenge, type)),
        link: Link(
          webUrl: Uri.parse('https://podoal.app/c/${challenge.shareCode}'),
          mobileWebUrl: Uri.parse('https://podoal.app/c/${challenge.shareCode}'),
        ),
      ),
      buttons: [
        Button(
          title: type == ShareType.invite ? '챌린지 확인하기' : '앱 다운로드',
          link: Link(
            webUrl: Uri.parse('https://podoal.app/c/${challenge.shareCode}'),
            mobileWebUrl: Uri.parse('https://podoal.app/c/${challenge.shareCode}'),
          ),
        ),
      ],
    );

    await ShareClient.instance.shareDefault(template: template);
  }
}
```

### 6.3 인스타그램 스토리 공유

```dart
class InstagramShareService {
  static Future<void> shareToStory({
    required String imageUrl,
    required String stickerUrl,
  }) async {
    // 배경 이미지 다운로드
    final backgroundFile = await _downloadImage(imageUrl);

    // 스티커 이미지 다운로드
    final stickerFile = await _downloadImage(stickerUrl);

    await SocialShare.shareInstagramStory(
      imagePath: backgroundFile.path,
      backgroundTopColor: '#9B7ED9',
      backgroundBottomColor: '#FFB88C',
      appId: 'com.podoal.app',
    );
  }
}
```

---

## 7. 분석 및 트래킹

### 7.1 이벤트 정의

```typescript
// 핵심 이벤트
const events = {
  // 온보딩
  'app_open': {},
  'signup_start': { method: 'kakao' | 'apple' | 'email' },
  'signup_complete': { method: string },

  // 챌린지
  'challenge_create_start': {},
  'challenge_create_complete': { grapeCount: number, rewardType: string },
  'challenge_share': { platform: 'kakao' | 'link' | 'sms' },
  'challenge_accept': { challengeId: string },
  'challenge_decline': { challengeId: string, reason: string },

  // 포도알
  'grape_tap': { position: number, challengeId: string },
  'grape_complete': { position: number, challengeId: string },
  'grape_streak': { streakDays: number },

  // 응원
  'cheer_create': { type: 'text' | 'voice' | 'photo', position: number },
  'cheer_reveal': { position: number },

  // 선물
  'reward_register': { type: string, value: number },
  'reward_unlock': { challengeId: string },
  'reward_scratch_start': {},
  'reward_scratch_complete': { scratchDuration: number },

  // 공유
  'share_progress': { platform: string, progress: number },
  'share_complete': { platform: string },
  'share_thank': {},
};
```

### 7.2 퍼널 분석

```
앱 설치 → 회원가입 → 첫 챌린지 생성/수락 → 첫 포도알 → ... → 완료

전환율 목표:
- 설치 → 가입: 60%
- 가입 → 첫 챌린지: 40%
- 첫 챌린지 → 첫 포도알: 80%
- 시작 → 완료: 50%
```

---

*이 문서는 포도알 앱의 핵심 기능에 대한 상세 명세입니다.*
