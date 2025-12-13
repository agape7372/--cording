#!/bin/bash

# MPTI 앱 자동 재시작 스크립트
# 프로세스가 중단되면 자동으로 재시작합니다

cd "/home/user/--cording/코딩/MPTI/mpti_app"

MAX_RETRIES=999999  # 무한 재시작
RETRY_COUNT=0
RESTART_DELAY=3     # 재시작 전 대기 시간 (초)

echo "========================================="
echo "MPTI 앱 자동 재시작 모니터 시작"
echo "최대 재시도 횟수: 무제한"
echo "재시작 대기 시간: ${RESTART_DELAY}초"
echo "========================================="
echo ""

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

    echo "[$TIMESTAMP] 시도 #${RETRY_COUNT}: MPTI 개발 서버 시작 중..."

    # npm run dev 실행
    npm run dev

    # 프로세스가 종료되면 여기로 옴
    EXIT_CODE=$?
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

    echo ""
    echo "[$TIMESTAMP] ⚠️  프로세스가 종료되었습니다 (종료 코드: $EXIT_CODE)"
    echo "[$TIMESTAMP] ${RESTART_DELAY}초 후 재시작합니다..."
    echo ""

    sleep $RESTART_DELAY
done

echo "[$TIMESTAMP] 최대 재시도 횟수에 도달했습니다."
