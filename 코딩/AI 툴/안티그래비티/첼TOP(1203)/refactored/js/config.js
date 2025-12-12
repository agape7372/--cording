/**
 * 첼 TOP - 처방 코드 설정 파일
 * 이 파일에서 처방 코드를 쉽게 추가/수정할 수 있습니다.
 */

// ========================================
// 처방 데이터베이스
// ========================================
const TREATMENT_DB = {
    // PT - 회복기
    "RM": { name: "RM(회복기)", type: "PT", cat: "REC" },
    "RN": { name: "RN(회복기)", type: "PT", cat: "REC" },
    "RG": { name: "RG(회복기)", type: "PT", cat: "REC" },
    "MM": { name: "MM(회복기)", type: "PT", cat: "REC" },

    // PT - 전문
    "N": { name: "N(전문)", type: "PT", cat: "PRO" },
    "N7": { name: "N7(도수)", type: "PT", cat: "PRO", nb: true },
    "M15": { name: "M15(도수)", type: "PT", cat: "PRO", nb: true },
    "F": { name: "F(전문)", type: "PT", cat: "PRO" },
    "M_PRE": { name: "M(전문)", type: "PT", cat: "PRO" },

    // PT - 기구
    "C_SUF": { name: "C(기구)", type: "PT", cat: "EQ" },
    "Tt": { name: "Tt(기구)", type: "PT", cat: "EQ" },
    "T": { name: "T(기구)", type: "PT", cat: "EQ" },
    "S_SUF": { name: "S(기구)", type: "PT", cat: "EQ" },
    "M_SUF": { name: "M(기구)", type: "PT", cat: "EQ" },
    "CPM": { name: "CPM", type: "PT", cat: "EQ" },

    // OT - 회복기
    "RA": { name: "RA(회복기)", type: "OT", cat: "REC" },
    "RS": { name: "RS(회복기)", type: "OT", cat: "REC" },
    "RD": { name: "RD(회복기)", type: "OT", cat: "REC" },

    // OT - 전문
    "CA": { name: "CA(전문)", type: "OT", cat: "PRO" },
    "C_PRE": { name: "C(전문)", type: "OT", cat: "PRO" },
    "D_PRE": { name: "D(전문)", type: "OT", cat: "PRO" },
    "V": { name: "V(연하)", type: "OT", cat: "PRO" },
    "H7": { name: "H7(상지)", type: "OT", cat: "PRO", nb: true, floor: "2F" },
    "O7": { name: "O7(작업)", type: "OT", cat: "PRO", nb: true },

    // OT - 기타
    "COG": { name: "전산화인지", type: "OT", cat: "ETC" },
    "H": { name: "H(기타)", type: "OT", cat: "ETC" },

    // 공통
    "S_PRE": { name: "S(공통)", type: "ETC", cat: "ETC" },

    // 특수 치료 (2층)
    "RTMS": { name: "rTMS", type: "OT", cat: "SPC", nb: true, floor: "2F" },
    "W": { name: "W(보행)", type: "PT", cat: "SPC", nb: true, floor: "2F" },
    "ROBOT": { name: "로봇치료", type: "PT", cat: "SPC", nb: true, floor: "2F" },

    // 시간 코드
    "D_SUF": { name: "Daily", type: "ETC", isTime: true },
    "A": { name: "월수금", type: "ETC", isTime: true },
    "B": { name: "화목", type: "ETC", isTime: true }
};

// ========================================
// 파싱용 리스트 (길이순 정렬)
// ========================================
const PREFIX_LIST = [
    "RM", "RN", "RG", "MM", "N7", "N", "M15", "M", "F", "Tt",
    "RA", "RS", "RD", "CA", "C", "D", "H7", "O7", "H", "S",
    "W", "rTMs", "전산화인지", "COG"
].sort((a, b) => b.length - a.length);

const SUFFIX_LIST = [
    "CPM", "Tt", "C", "T", "S", "M", "V", "A", "B", "D"
].sort((a, b) => b.length - a.length);

// 접두사/접미사 구분 맵
const CONTEXT_MAP = {
    "M": { prefix: "M_PRE", suffix: "M_SUF" },
    "C": { prefix: "C_PRE", suffix: "C_SUF" },
    "S": { prefix: "S_PRE", suffix: "S_SUF" },
    "D": { prefix: "D_PRE", suffix: "D_SUF" }
};

// ========================================
// 앱 설정
// ========================================
const CONFIG = {
    TARGET: 16,  // 회복기 목표 단위
    MACHINE_THERAPISTS: ['이나예', '유태현'],  // 기계 담당 치료사
    ADL_TIMES: ["7:30", "8:00", "15:15", "15:50"]  // ADL 시간대
};
