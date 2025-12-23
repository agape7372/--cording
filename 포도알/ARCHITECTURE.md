# 포도알 기술 아키텍처

## 1. 시스템 아키텍처 개요

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         포도알 시스템 아키텍처                           │
└─────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────┐
                              │   사용자    │
                              └──────┬──────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
              ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐
              │    iOS    │   │  Android  │   │    Web    │
              │  Flutter  │   │  Flutter  │   │  Flutter  │
              └─────┬─────┘   └─────┬─────┘   └─────┬─────┘
                    │                │                │
                    └────────────────┼────────────────┘
                                     │
                              ┌──────▼──────┐
                              │   Supabase  │
                              │   Gateway   │
                              └──────┬──────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         │                           │                           │
   ┌─────▼─────┐              ┌─────▼─────┐              ┌─────▼─────┐
   │   Auth    │              │  Database │              │  Storage  │
   │  Service  │              │ PostgreSQL│              │    S3     │
   └───────────┘              └───────────┘              └───────────┘
         │                           │                           │
   ┌─────▼─────┐              ┌─────▼─────┐              ┌─────▼─────┐
   │  Realtime │              │   Edge    │              │   Push    │
   │ WebSocket │              │ Functions │              │   FCM     │
   └───────────┘              └───────────┘              └───────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
              ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐
              │ KakaoPay  │   │  Kakao    │   │ Firebase  │
              │  Payment  │   │  Share    │   │ Analytics │
              └───────────┘   └───────────┘   └───────────┘
```

---

## 2. 기술 스택 상세

### 2.1 Frontend - Flutter

```yaml
Framework: Flutter 3.19+
Language: Dart 3.3+
Minimum SDK:
  iOS: 14.0
  Android: API 24 (Android 7.0)

Architecture:
  Pattern: Clean Architecture + Riverpod
  Structure:
    - presentation (UI, Widgets, Pages)
    - domain (Entities, Use Cases, Repositories)
    - data (Models, Data Sources, Repository Impl)

State Management:
  Primary: Riverpod 2.5+
  Local State: flutter_hooks

Dependencies:
  # Core
  flutter_riverpod: ^2.5.0
  flutter_hooks: ^0.20.0
  go_router: ^13.0.0

  # Supabase
  supabase_flutter: ^2.3.0

  # UI/Animation
  flutter_animate: ^4.3.0
  lottie: ^3.0.0
  rive: ^0.12.0

  # Haptics & Sound
  vibration: ^1.8.0
  audioplayers: ^5.2.0

  # Image Processing
  scratcher: ^2.5.0
  flutter_blurhash: ^0.8.0
  cached_network_image: ^3.3.0

  # Social
  kakao_flutter_sdk: ^1.8.0
  share_plus: ^7.2.0

  # Storage
  shared_preferences: ^2.2.0
  flutter_secure_storage: ^9.0.0

  # Push Notifications
  firebase_messaging: ^14.7.0
  flutter_local_notifications: ^16.3.0

  # Analytics
  firebase_analytics: ^10.7.0
  firebase_crashlytics: ^3.4.0

  # Utils
  intl: ^0.19.0
  uuid: ^4.3.0
  crypto: ^3.0.3
```

### 2.2 Backend - Supabase

```yaml
Services:
  Authentication:
    Providers:
      - Email/Password
      - Kakao OAuth
      - Apple Sign In
      - Google Sign In (Android only)

  Database:
    Engine: PostgreSQL 15
    Features:
      - Row Level Security (RLS)
      - Realtime subscriptions
      - Full-text search
      - JSON/JSONB support

  Storage:
    Buckets:
      - reward-images (public)
      - cheer-media (private)
      - user-avatars (public)

  Edge Functions:
    Runtime: Deno
    Functions:
      - encrypt-reward
      - decrypt-reward
      - process-payment
      - send-notification
      - generate-share-image

  Realtime:
    Channels:
      - challenge:{id} (progress updates)
      - user:{id} (notifications)
```

### 2.3 External Services

```yaml
Payment:
  Provider: KakaoPay
  Features:
    - 온라인 결제
    - 정기 결제 (프리미엄)
    - 환불 처리

Push Notifications:
  Provider: Firebase Cloud Messaging (FCM)
  Features:
    - 리마인더 알림
    - 진행 상황 알림
    - 마케팅 알림

Analytics:
  Provider: Firebase Analytics
  Events:
    - User engagement
    - Conversion tracking
    - Funnel analysis

Crash Reporting:
  Provider: Firebase Crashlytics
  Features:
    - Real-time crash reports
    - Non-fatal error logging
    - User impact analysis

Deep Linking:
  Provider: Firebase Dynamic Links
  Patterns:
    - podoal.app/c/{code} → Challenge invite
    - podoal.app/download → App store
```

---

## 3. 데이터베이스 스키마

### 3.1 ERD (Entity Relationship Diagram)

```
┌─────────────────┐       ┌─────────────────┐
│     users       │       │   challenges    │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │───┐   │ id (PK)         │
│ email           │   │   │ giver_id (FK)   │───┐
│ nickname        │   └──▶│ receiver_id (FK)│◀──┘
│ avatar_url      │       │ title           │
│ push_token      │       │ goal_description│
│ created_at      │       │ grape_count     │
│ updated_at      │       │ start_date      │
└─────────────────┘       │ end_date        │
                          │ share_code      │
                          │ status          │
                          │ created_at      │
                          └────────┬────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
       ┌──────▼──────┐      ┌─────▼──────┐      ┌─────▼──────┐
       │   grapes    │      │   rewards  │      │   cheers   │
       ├─────────────┤      ├────────────┤      ├────────────┤
       │ id (PK)     │      │ id (PK)    │      │ id (PK)    │
       │challenge_id │      │challenge_id│      │challenge_id│
       │ position    │      │ type       │      │grape_pos   │
       │ completed_at│      │ encrypted  │      │ type       │
       │ has_cheer   │      │ blur_url   │      │ content    │
       └─────────────┘      │ clear_url  │      │ media_url  │
                            │ is_unlocked│      │ is_revealed│
                            │ unlocked_at│      └────────────┘
                            └────────────┘
```

### 3.2 테이블 정의

```sql
-- ==========================================
-- 사용자 테이블
-- ==========================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  nickname VARCHAR(50) NOT NULL,
  avatar_url TEXT,
  push_token TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_users_email ON users(email);

-- RLS 정책
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- ==========================================
-- 챌린지 테이블
-- ==========================================
CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  giver_id UUID REFERENCES users(id) ON DELETE SET NULL,
  receiver_id UUID REFERENCES users(id) ON DELETE SET NULL,
  title VARCHAR(100) NOT NULL,
  goal_description TEXT,
  grape_count INT NOT NULL DEFAULT 12 CHECK (grape_count BETWEEN 7 AND 30),
  start_date DATE,
  end_date DATE,
  status VARCHAR(20) DEFAULT 'pending'
    CHECK (status IN ('pending', 'active', 'completed', 'expired', 'cancelled')),
  share_code VARCHAR(8) UNIQUE NOT NULL,
  reminder_time TIME,
  is_self_challenge BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_challenges_giver ON challenges(giver_id);
CREATE INDEX idx_challenges_receiver ON challenges(receiver_id);
CREATE INDEX idx_challenges_share_code ON challenges(share_code);
CREATE INDEX idx_challenges_status ON challenges(status);

-- RLS 정책
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own challenges"
  ON challenges FOR SELECT
  USING (
    auth.uid() = giver_id OR
    auth.uid() = receiver_id
  );

CREATE POLICY "Users can create challenges"
  ON challenges FOR INSERT
  WITH CHECK (auth.uid() = giver_id);

CREATE POLICY "Participants can update challenges"
  ON challenges FOR UPDATE
  USING (
    auth.uid() = giver_id OR
    auth.uid() = receiver_id
  );

-- ==========================================
-- 포도알 테이블
-- ==========================================
CREATE TABLE public.grapes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  position INT NOT NULL CHECK (position >= 1),
  completed_at TIMESTAMPTZ,
  has_cheer BOOLEAN DEFAULT FALSE,
  UNIQUE (challenge_id, position)
);

-- 인덱스
CREATE INDEX idx_grapes_challenge ON grapes(challenge_id);

-- RLS 정책
ALTER TABLE grapes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Challenge participants can view grapes"
  ON grapes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM challenges
      WHERE challenges.id = grapes.challenge_id
      AND (challenges.giver_id = auth.uid() OR challenges.receiver_id = auth.uid())
    )
  );

CREATE POLICY "Receiver can complete grapes"
  ON grapes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM challenges
      WHERE challenges.id = grapes.challenge_id
      AND challenges.receiver_id = auth.uid()
    )
  );

-- ==========================================
-- 선물 테이블
-- ==========================================
CREATE TABLE public.rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL
    CHECK (type IN ('gifticon', 'cash', 'physical', 'experience', 'custom')),
  title VARCHAR(100),
  description TEXT,
  value INT, -- 금액 (원)
  encrypted_data TEXT, -- 암호화된 바코드/쿠폰 코드
  blur_image_url TEXT,
  clear_image_url TEXT,
  is_unlocked BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_rewards_challenge ON rewards(challenge_id);

-- RLS 정책
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Giver can manage rewards"
  ON rewards FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM challenges
      WHERE challenges.id = rewards.challenge_id
      AND challenges.giver_id = auth.uid()
    )
  );

CREATE POLICY "Receiver can view unlocked rewards"
  ON rewards FOR SELECT
  USING (
    is_unlocked = TRUE AND
    EXISTS (
      SELECT 1 FROM challenges
      WHERE challenges.id = rewards.challenge_id
      AND challenges.receiver_id = auth.uid()
    )
  );

-- ==========================================
-- 응원 메시지 테이블
-- ==========================================
CREATE TABLE public.cheers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  grape_position INT NOT NULL,
  type VARCHAR(20) NOT NULL
    CHECK (type IN ('text', 'voice', 'photo', 'video')),
  content TEXT, -- 텍스트 내용
  media_url TEXT, -- 미디어 URL
  duration INT, -- 음성/영상 길이 (초)
  is_revealed BOOLEAN DEFAULT FALSE,
  revealed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (challenge_id, grape_position)
);

-- 인덱스
CREATE INDEX idx_cheers_challenge ON cheers(challenge_id);

-- RLS 정책
ALTER TABLE cheers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Giver can manage cheers"
  ON cheers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM challenges
      WHERE challenges.id = cheers.challenge_id
      AND challenges.giver_id = auth.uid()
    )
  );

CREATE POLICY "Receiver can view revealed cheers"
  ON cheers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM challenges
      WHERE challenges.id = cheers.challenge_id
      AND challenges.receiver_id = auth.uid()
    )
  );

-- ==========================================
-- 알림 테이블
-- ==========================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(100) NOT NULL,
  body TEXT,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE is_read = FALSE;

-- RLS 정책
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);
```

### 3.3 Realtime 구독

```sql
-- 챌린지 진행 상황 실시간 동기화
CREATE PUBLICATION challenge_updates FOR TABLE challenges, grapes;

-- 알림 실시간 수신
CREATE PUBLICATION notification_updates FOR TABLE notifications;
```

---

## 4. Edge Functions

### 4.1 선물 암호화/복호화

```typescript
// supabase/functions/encrypt-reward/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts"

const ENCRYPTION_KEY = Deno.env.get('REWARD_ENCRYPTION_KEY')!

serve(async (req) => {
  const { rewardData } = await req.json()

  // AES-GCM 암호화
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(ENCRYPTION_KEY),
    "AES-GCM",
    false,
    ["encrypt"]
  )

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(JSON.stringify(rewardData))
  )

  // IV + 암호문을 Base64로 인코딩
  const combined = new Uint8Array([...iv, ...new Uint8Array(encrypted)])
  const encryptedBase64 = btoa(String.fromCharCode(...combined))

  return new Response(
    JSON.stringify({ encryptedData: encryptedBase64 }),
    { headers: { "Content-Type": "application/json" } }
  )
})
```

```typescript
// supabase/functions/decrypt-reward/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { challengeId } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // 1. 모든 포도알 완료 확인
  const { data: grapes } = await supabase
    .from('grapes')
    .select('completed_at')
    .eq('challenge_id', challengeId)

  const allCompleted = grapes?.every(g => g.completed_at !== null)
  if (!allCompleted) {
    return new Response(
      JSON.stringify({ error: 'Not all grapes completed' }),
      { status: 400 }
    )
  }

  // 2. 선물 데이터 가져오기
  const { data: reward } = await supabase
    .from('rewards')
    .select('*')
    .eq('challenge_id', challengeId)
    .single()

  // 3. 복호화
  const decrypted = await decryptData(reward.encrypted_data)

  // 4. 상태 업데이트
  await supabase
    .from('rewards')
    .update({
      is_unlocked: true,
      unlocked_at: new Date().toISOString()
    })
    .eq('id', reward.id)

  return new Response(
    JSON.stringify({ reward: decrypted }),
    { headers: { "Content-Type": "application/json" } }
  )
})
```

### 4.2 푸시 알림 전송

```typescript
// supabase/functions/send-notification/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const FCM_SERVER_KEY = Deno.env.get('FCM_SERVER_KEY')!

interface NotificationPayload {
  userId: string
  title: string
  body: string
  type: string
  data?: Record<string, string>
}

serve(async (req) => {
  const payload: NotificationPayload = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // 1. 사용자 푸시 토큰 조회
  const { data: user } = await supabase
    .from('users')
    .select('push_token')
    .eq('id', payload.userId)
    .single()

  if (!user?.push_token) {
    return new Response(
      JSON.stringify({ error: 'No push token' }),
      { status: 400 }
    )
  }

  // 2. FCM 전송
  const fcmResponse = await fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      'Authorization': `key=${FCM_SERVER_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: user.push_token,
      notification: {
        title: payload.title,
        body: payload.body,
        sound: 'default',
      },
      data: {
        type: payload.type,
        ...payload.data,
      },
    }),
  })

  // 3. DB에 알림 저장
  await supabase
    .from('notifications')
    .insert({
      user_id: payload.userId,
      type: payload.type,
      title: payload.title,
      body: payload.body,
      data: payload.data || {},
    })

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { "Content-Type": "application/json" } }
  )
})
```

### 4.3 공유 이미지 생성

```typescript
// supabase/functions/generate-share-image/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { ImageMagick, initializeImageMagick } from 'https://deno.land/x/imagemagick_deno@0.0.25/mod.ts'

await initializeImageMagick()

serve(async (req) => {
  const { challengeId, type } = await req.json()

  // 챌린지 데이터 조회
  const challenge = await getChallengeData(challengeId)

  // 이미지 생성
  const image = await generateImage(challenge, type)

  // Storage에 업로드
  const imageUrl = await uploadToStorage(image, challengeId)

  return new Response(
    JSON.stringify({ imageUrl }),
    { headers: { "Content-Type": "application/json" } }
  )
})

async function generateImage(challenge: any, type: string) {
  // 진행 상황 카드 생성
  const completed = challenge.grapes.filter((g: any) => g.completed_at).length
  const total = challenge.grape_count

  // 템플릿 기반 이미지 생성
  // ... ImageMagick 처리
}
```

---

## 5. Flutter 아키텍처

### 5.1 폴더 구조

```
lib/
├── main.dart
├── app.dart
│
├── core/
│   ├── constants/
│   │   ├── colors.dart
│   │   ├── dimensions.dart
│   │   └── strings.dart
│   ├── theme/
│   │   ├── app_theme.dart
│   │   └── text_styles.dart
│   ├── utils/
│   │   ├── haptic_utils.dart
│   │   ├── sound_utils.dart
│   │   └── encryption_utils.dart
│   └── extensions/
│       └── context_extensions.dart
│
├── data/
│   ├── models/
│   │   ├── user_model.dart
│   │   ├── challenge_model.dart
│   │   ├── grape_model.dart
│   │   ├── reward_model.dart
│   │   └── cheer_model.dart
│   ├── repositories/
│   │   ├── auth_repository.dart
│   │   ├── challenge_repository.dart
│   │   └── notification_repository.dart
│   └── datasources/
│       ├── supabase_datasource.dart
│       └── local_datasource.dart
│
├── domain/
│   ├── entities/
│   │   ├── user.dart
│   │   ├── challenge.dart
│   │   ├── grape.dart
│   │   ├── reward.dart
│   │   └── cheer.dart
│   ├── repositories/
│   │   ├── i_auth_repository.dart
│   │   └── i_challenge_repository.dart
│   └── usecases/
│       ├── auth/
│       │   ├── sign_in_usecase.dart
│       │   └── sign_up_usecase.dart
│       ├── challenge/
│       │   ├── create_challenge_usecase.dart
│       │   ├── accept_challenge_usecase.dart
│       │   └── complete_grape_usecase.dart
│       └── reward/
│           └── unlock_reward_usecase.dart
│
├── presentation/
│   ├── providers/
│   │   ├── auth_provider.dart
│   │   ├── challenge_provider.dart
│   │   └── notification_provider.dart
│   ├── pages/
│   │   ├── splash/
│   │   ├── onboarding/
│   │   ├── auth/
│   │   ├── home/
│   │   ├── challenge/
│   │   │   ├── create/
│   │   │   ├── detail/
│   │   │   └── complete/
│   │   └── settings/
│   └── widgets/
│       ├── common/
│       │   ├── podo_button.dart
│       │   ├── podo_card.dart
│       │   └── podo_input.dart
│       ├── grape/
│       │   ├── grape_bead.dart
│       │   ├── grape_board.dart
│       │   └── grape_animation.dart
│       ├── reward/
│       │   ├── reward_preview.dart
│       │   └── scratch_card.dart
│       └── cheer/
│           └── cheer_popup.dart
│
├── router/
│   └── app_router.dart
│
└── services/
    ├── supabase_service.dart
    ├── notification_service.dart
    ├── analytics_service.dart
    └── share_service.dart
```

### 5.2 Riverpod Provider 구조

```dart
// ==========================================
// Auth Providers
// ==========================================

@riverpod
class Auth extends _$Auth {
  @override
  FutureOr<User?> build() async {
    return ref.read(authRepositoryProvider).getCurrentUser();
  }

  Future<void> signIn(String email, String password) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() =>
      ref.read(authRepositoryProvider).signIn(email, password)
    );
  }

  Future<void> signOut() async {
    await ref.read(authRepositoryProvider).signOut();
    state = const AsyncData(null);
  }
}

// ==========================================
// Challenge Providers
// ==========================================

@riverpod
class ChallengeList extends _$ChallengeList {
  @override
  FutureOr<List<Challenge>> build() async {
    final user = await ref.watch(authProvider.future);
    if (user == null) return [];

    return ref.read(challengeRepositoryProvider).getChallenges(user.id);
  }

  Future<void> refresh() async {
    ref.invalidateSelf();
  }
}

@riverpod
class ChallengeDetail extends _$ChallengeDetail {
  @override
  FutureOr<Challenge?> build(String challengeId) async {
    // Realtime 구독 설정
    final stream = ref.read(challengeRepositoryProvider)
        .watchChallenge(challengeId);

    ref.onDispose(() {
      // 구독 해제
    });

    return ref.read(challengeRepositoryProvider)
        .getChallenge(challengeId);
  }
}

// ==========================================
// Grape Providers
// ==========================================

@riverpod
class GrapeBoard extends _$GrapeBoard {
  @override
  FutureOr<List<Grape>> build(String challengeId) async {
    return ref.read(challengeRepositoryProvider)
        .getGrapes(challengeId);
  }

  Future<void> completeGrape(int position) async {
    final grapes = await future;
    final grape = grapes.firstWhere((g) => g.position == position);

    if (grape.completedAt != null) return;

    await ref.read(challengeRepositoryProvider)
        .completeGrape(grape.id);

    ref.invalidateSelf();
  }
}
```

### 5.3 핵심 위젯 구현

```dart
// ==========================================
// GrapeBead Widget
// ==========================================

class GrapeBead extends HookConsumerWidget {
  final Grape grape;
  final VoidCallback? onComplete;

  const GrapeBead({
    required this.grape,
    this.onComplete,
    super.key,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final animationController = useAnimationController(
      duration: const Duration(milliseconds: 300),
    );

    final scaleAnimation = Tween<double>(begin: 1.0, end: 0.92).animate(
      CurvedAnimation(
        parent: animationController,
        curve: Curves.easeOutCubic,
      ),
    );

    return GestureDetector(
      onTapDown: (_) {
        if (!grape.isAvailable) return;
        animationController.forward();
        HapticUtils.lightImpact();
      },
      onTapUp: (_) async {
        if (!grape.isAvailable) return;
        animationController.reverse();

        // 완료 처리
        await SoundUtils.playPop();
        HapticUtils.mediumImpact();
        onComplete?.call();

        // 응원 메시지 확인
        if (grape.hasCheer) {
          _showCheerPopup(context, grape);
        }
      },
      onTapCancel: () {
        animationController.reverse();
      },
      child: AnimatedBuilder(
        animation: scaleAnimation,
        builder: (context, child) {
          return Transform.scale(
            scale: scaleAnimation.value,
            child: child,
          );
        },
        child: Container(
          width: 56,
          height: 56,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: _getGradient(grape.state),
            boxShadow: _getShadow(grape.state),
          ),
          child: grape.hasCheer
              ? const _CheerIndicator()
              : null,
        ),
      ),
    );
  }

  LinearGradient _getGradient(GrapeState state) {
    switch (state) {
      case GrapeState.empty:
        return const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFFF0EDE8), Color(0xFFE0DCD5)],
        );
      case GrapeState.available:
        return const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFFE0D0FF), Color(0xFFC4A8FF)],
        );
      case GrapeState.completed:
        return const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFFC4A8FF), Color(0xFF9B7ED9), Color(0xFF7B5FB9)],
        );
    }
  }
}

// ==========================================
// ScratchCard Widget
// ==========================================

class ScratchCard extends StatefulWidget {
  final String revealImageUrl;
  final VoidCallback onComplete;

  const ScratchCard({
    required this.revealImageUrl,
    required this.onComplete,
    super.key,
  });

  @override
  State<ScratchCard> createState() => _ScratchCardState();
}

class _ScratchCardState extends State<ScratchCard> {
  double _scratchProgress = 0;
  bool _isRevealed = false;

  @override
  Widget build(BuildContext context) {
    return Scratcher(
      brushSize: 50,
      threshold: 60,
      color: const Color(0xFFFFD700), // Gold
      onChange: (value) {
        setState(() {
          _scratchProgress = value;
        });

        // 진행 중 햅틱
        if (value > _scratchProgress + 0.05) {
          HapticFeedback.selectionClick();
        }
      },
      onThreshold: () {
        setState(() {
          _isRevealed = true;
        });

        // 완료 효과
        HapticFeedback.heavyImpact();
        SoundUtils.playTada();
        widget.onComplete();
      },
      child: CachedNetworkImage(
        imageUrl: widget.revealImageUrl,
        fit: BoxFit.cover,
      ),
    );
  }
}
```

---

## 6. 보안 고려사항

### 6.1 데이터 암호화

```dart
// 선물 데이터 암호화 (AES-256-GCM)
class EncryptionService {
  static const _keyLength = 32; // 256 bits
  static const _ivLength = 12;  // 96 bits for GCM

  Future<String> encrypt(String plaintext) async {
    final key = await _getKey();
    final iv = _generateIV();

    final cipher = GCM(AES(key), iv);
    final encrypted = cipher.encrypt(utf8.encode(plaintext));

    // IV + ciphertext + tag
    final combined = Uint8List.fromList([
      ...iv,
      ...encrypted,
    ]);

    return base64.encode(combined);
  }

  Future<String> decrypt(String ciphertext) async {
    final key = await _getKey();
    final combined = base64.decode(ciphertext);

    final iv = combined.sublist(0, _ivLength);
    final encrypted = combined.sublist(_ivLength);

    final cipher = GCM(AES(key), iv);
    final decrypted = cipher.decrypt(encrypted);

    return utf8.decode(decrypted);
  }
}
```

### 6.2 인증 보안

```dart
// 토큰 보안 저장
class SecureTokenStorage {
  static const _storage = FlutterSecureStorage(
    aOptions: AndroidOptions(
      encryptedSharedPreferences: true,
    ),
    iOptions: IOSOptions(
      accessibility: KeychainAccessibility.first_unlock_this_device,
    ),
  );

  static Future<void> saveTokens({
    required String accessToken,
    required String refreshToken,
  }) async {
    await _storage.write(key: 'access_token', value: accessToken);
    await _storage.write(key: 'refresh_token', value: refreshToken);
  }

  static Future<void> clearTokens() async {
    await _storage.deleteAll();
  }
}
```

### 6.3 API 보안

```typescript
// Supabase RLS + 추가 검증
// Edge Function에서의 인증 확인
serve(async (req) => {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response('Unauthorized', { status: 401 })
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    return new Response('Invalid token', { status: 401 })
  }

  // 사용자 검증 통과 후 로직 진행
  // ...
})
```

---

## 7. 성능 최적화

### 7.1 이미지 최적화

```dart
// 이미지 캐싱 및 최적화
class OptimizedImage extends StatelessWidget {
  final String imageUrl;
  final double? width;
  final double? height;

  const OptimizedImage({
    required this.imageUrl,
    this.width,
    this.height,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return CachedNetworkImage(
      imageUrl: _getOptimizedUrl(imageUrl),
      width: width,
      height: height,
      memCacheWidth: width?.toInt(),
      memCacheHeight: height?.toInt(),
      fadeInDuration: const Duration(milliseconds: 200),
      placeholder: (context, url) => const ShimmerPlaceholder(),
      errorWidget: (context, url, error) => const ErrorPlaceholder(),
    );
  }

  String _getOptimizedUrl(String url) {
    // Supabase Storage 변환 URL 사용
    if (url.contains('supabase')) {
      return '$url?width=${width?.toInt()}&quality=80';
    }
    return url;
  }
}
```

### 7.2 리스트 최적화

```dart
// 챌린지 목록 lazy loading
class ChallengeListView extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final challenges = ref.watch(challengeListProvider);

    return challenges.when(
      data: (list) => ListView.builder(
        itemCount: list.length,
        itemBuilder: (context, index) {
          return ChallengeCard(
            key: ValueKey(list[index].id),
            challenge: list[index],
          );
        },
        // 최적화 설정
        addAutomaticKeepAlives: false,
        addRepaintBoundaries: true,
        cacheExtent: 100,
      ),
      loading: () => const ChallengeListSkeleton(),
      error: (e, s) => ErrorView(error: e),
    );
  }
}
```

### 7.3 애니메이션 최적화

```dart
// RepaintBoundary로 불필요한 리빌드 방지
class GrapeBoard extends StatelessWidget {
  final List<Grape> grapes;

  @override
  Widget build(BuildContext context) {
    return RepaintBoundary(
      child: Stack(
        children: grapes.map((grape) {
          return Positioned(
            left: grape.position.x,
            top: grape.position.y,
            child: RepaintBoundary(
              child: GrapeBead(grape: grape),
            ),
          );
        }).toList(),
      ),
    );
  }
}
```

---

## 8. 테스트 전략

### 8.1 단위 테스트

```dart
// UseCase 테스트
void main() {
  group('CompleteGrapeUseCase', () {
    late CompleteGrapeUseCase useCase;
    late MockChallengeRepository mockRepository;

    setUp(() {
      mockRepository = MockChallengeRepository();
      useCase = CompleteGrapeUseCase(mockRepository);
    });

    test('should complete grape when valid', () async {
      // Arrange
      when(mockRepository.completeGrape(any))
          .thenAnswer((_) async => Right(unit));

      // Act
      final result = await useCase.execute('grape-123');

      // Assert
      expect(result.isRight(), true);
      verify(mockRepository.completeGrape('grape-123')).called(1);
    });

    test('should fail when grape already completed', () async {
      // Arrange
      when(mockRepository.completeGrape(any))
          .thenAnswer((_) async => Left(GrapeAlreadyCompletedFailure()));

      // Act
      final result = await useCase.execute('grape-123');

      // Assert
      expect(result.isLeft(), true);
    });
  });
}
```

### 8.2 위젯 테스트

```dart
void main() {
  group('GrapeBead', () {
    testWidgets('should show empty state correctly', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: GrapeBead(
            grape: Grape(
              id: '1',
              position: 1,
              completedAt: null,
            ),
          ),
        ),
      );

      // 회색 배경 확인
      final container = tester.widget<Container>(find.byType(Container));
      final decoration = container.decoration as BoxDecoration;
      expect(decoration.gradient?.colors.first, const Color(0xFFF0EDE8));
    });

    testWidgets('should animate on tap', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: GrapeBead(
            grape: Grape.available(),
            onComplete: () {},
          ),
        ),
      );

      await tester.tap(find.byType(GrapeBead));
      await tester.pump(const Duration(milliseconds: 150));

      // 스케일 변화 확인
      final transform = tester.widget<Transform>(find.byType(Transform));
      expect(transform.transform.getMaxScaleOnAxis(), lessThan(1.0));
    });
  });
}
```

### 8.3 통합 테스트

```dart
void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('Challenge Flow', () {
    testWidgets('complete challenge e2e', (tester) async {
      await tester.pumpWidget(const MyApp());

      // 로그인
      await tester.tap(find.text('로그인'));
      await tester.pumpAndSettle();

      // 챌린지 선택
      await tester.tap(find.byType(ChallengeCard).first);
      await tester.pumpAndSettle();

      // 포도알 완료
      final grapeBeads = find.byType(GrapeBead);
      for (int i = 0; i < 12; i++) {
        await tester.tap(grapeBeads.at(i));
        await tester.pumpAndSettle();
      }

      // 스크래치 카드 등장 확인
      expect(find.byType(ScratchCard), findsOneWidget);

      // 스크래치 완료
      await tester.drag(
        find.byType(ScratchCard),
        const Offset(100, 100),
      );
      await tester.pumpAndSettle();

      // 축하 화면 확인
      expect(find.text('축하해요!'), findsOneWidget);
    });
  });
}
```

---

*이 문서는 포도알 앱의 기술 아키텍처 가이드입니다.*
