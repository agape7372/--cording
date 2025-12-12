/**
 * 첼 TOP - 리뷰 도우미 JavaScript
 * 스케줄 분석 및 시각화 로직
 */

// ========================================
// 전역 변수
// ========================================
const $ = id => document.getElementById(id);
let GLOBAL_DATA = null;

// ========================================
// 초기화
// ========================================
window.addEventListener('DOMContentLoaded', () => {
    const fi = $('file_input');
    if (fi) fi.onchange = e => handleFile(e.target.files[0]);

    const dropZone = $('drop_zone');
    if (dropZone) {
        dropZone.ondragover = e => {
            e.preventDefault();
            dropZone.style.background = '#f0fdfa';
            dropZone.style.borderColor = 'var(--accent)';
        };
        dropZone.ondragleave = e => {
            e.preventDefault();
            dropZone.style.background = '';
            dropZone.style.borderColor = '#cbd5e1';
        };
        dropZone.ondrop = e => {
            e.preventDefault();
            dropZone.style.background = '';
            dropZone.style.borderColor = '#cbd5e1';
            if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
        };
    }
});

// ========================================
// 앱 리셋
// ========================================
function resetApp() {
    $('result_area').classList.add('hidden');
    $('top_controls').classList.add('hidden');
    $('drop_zone').classList.remove('hidden');
    $('file_input').value = '';
    GLOBAL_DATA = null;
}

// ========================================
// 탭 전환 (내부)
// ========================================
function switchTab(id, btn) {
    document.querySelectorAll('.tab-content-block').forEach(el => el.classList.add('hidden'));
    $(id).classList.remove('hidden');
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
    btn.classList.add('active');
}

// ========================================
// 파일 처리
// ========================================
function handleFile(file) {
    if (!file) return;

    $('loading').classList.remove('hidden');
    $('result_area').classList.add('hidden');
    $('drop_zone').classList.add('hidden');

    const reader = new FileReader;
    reader.onload = e => {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            analyzeData(workbook);
        } catch (err) {
            alert("파일 읽기 오류: 형식을 확인해주세요.");
            resetApp();
            $('loading').classList.add('hidden');
        }
    };
    reader.readAsArrayBuffer(file);
}

// ========================================
// 시간 헤더 포맷팅
// ========================================
function formatTimeHeader(raw) {
    let clean = String(raw).replace(/\s+/g, '');
    const timePattern = /(\d{1,2}:\d{2})/;
    const match = clean.match(timePattern);
    if (!match) return raw;

    const startTimeStr = match[1];
    if (clean.includes('~')) {
        const parts = clean.split('~');
        if (parts[1] && /\d/.test(parts[1])) return clean.replace('~', '-');
    }

    const [hStr, mStr] = startTimeStr.split(':');
    let h = parseInt(hStr);
    let m = parseInt(mStr);
    m += 30;
    if (m >= 60) { m -= 60; h += 1; }
    const endTimeStr = `${h}:${m.toString().padStart(2, '0')}`;
    return `${startTimeStr}-${endTimeStr}`;
}

// ========================================
// 토큰 파싱
// ========================================
function parseToken(rawToken) {
    let name = String(rawToken).normalize('NFKC').replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    if (!name) return null;

    let results = [];

    // 전산화인지 처리
    if (name.includes("전산화인지")) {
        results.push({ code: "COG", source: 'prefix' });
        name = name.replace("전산화인지", "").trim() || "전산화인지";
    }

    // 로봇 패턴 (RG...R)
    const robotMatch = name.match(/^RG['\"']?([^'\"']+)['\"']?R$/i);
    if (robotMatch) {
        results.push({ code: "ROBOT", source: 'prefix' });
        name = robotMatch[1].trim();
    } else if (name.startsWith("RG") && name.endsWith("R") && name.length > 3) {
        results.push({ code: "ROBOT", source: 'prefix' });
        name = name.substring(2, name.length - 1).replace(/['\"']/g, '').trim();
    }

    // rTMS 처리
    if (name.toLowerCase().includes("rtms")) {
        results.push({ code: "RTMS", source: 'prefix' });
        name = "rTMS";
    }

    // 접두사 검색
    let prefixFound = false;
    for (let p of PREFIX_LIST) {
        if (name.toUpperCase().startsWith(p.toUpperCase())) {
            if (['COG', 'ROBOT', 'RTMS'].some(c => results.some(r => r.code === c))) break;
            let dbKey = p;
            if (CONTEXT_MAP[p] && CONTEXT_MAP[p].prefix) dbKey = CONTEXT_MAP[p].prefix;
            results.push({ code: dbKey, source: 'prefix' });
            name = name.substring(p.length).trim();
            prefixFound = true;
            break;
        }
    }

    // 접미사 검색
    for (let s of SUFFIX_LIST) {
        if (name.toUpperCase().endsWith(s.toUpperCase())) {
            let dbKey = s;
            if (CONTEXT_MAP[s] && CONTEXT_MAP[s].suffix) dbKey = CONTEXT_MAP[s].suffix;
            results.push({ code: dbKey, source: 'suffix' });
            name = name.substring(0, name.length - s.length).trim();
            break;
        }
    }

    return { name, found: results };
}

// ========================================
// 데이터 분석
// ========================================
function analyzeData(workbook) {
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

    // 헤더 행 찾기
    let headerRowIdx = rows.findIndex(r =>
        r.join(" ").includes("치료사") ||
        (r.join(" ").includes(":") && r.join(" ").includes("~"))
    );

    if (headerRowIdx === -1) {
        alert("유효한 스케줄 형식이 아닙니다.");
        resetApp();
        return;
    }

    const headers = rows[headerRowIdx];
    const timeCols = headers.map((h, i) => {
        const str = String(h).trim();
        if (str.includes(":") || str.includes("~")) {
            return { idx: i, label: formatTimeHeader(str) };
        }
        return null;
    }).filter(Boolean);

    const thColIdx = Math.max(headers.findIndex(h => String(h).includes("치료사")), 1);

    const state = {
        rowMap: [],
        therapistStats: {},
        conflictMap: {},
        adlTherapists: new Set,
        patientStats: {},
        timeCols: timeCols
    };

    let lastTherapist = null;

    for (let i = headerRowIdx + 1; i < rows.length; i++) {
        const row = rows[i];
        let therapist = String(row[thColIdx] || "").trim();
        const hasScheduleData = timeCols.some(tc => row[tc.idx] && String(row[tc.idx]).trim());

        if (therapist) lastTherapist = therapist;
        else if (lastTherapist && hasScheduleData) therapist = lastTherapist;
        else continue;

        if (!state.therapistStats[therapist]) {
            state.therapistStats[therapist] = { PT: 0, OT: 0 };
        }

        const rowData = { therapist, schedule: {} };

        timeCols.forEach(tc => {
            const cellVal = row[tc.idx];
            rowData.schedule[tc.idx] = [];
            if (!cellVal) return;

            const tokens = String(cellVal).split(/[\n,]+/)
                .map(s => s.trim())
                .filter(s => s && s !== '점심' && !s.includes("대체"));

            for (let k = 0; k < tokens.length; k++) {
                let result = parseToken(tokens[k]);

                // COG 다음 토큰이 이름인 경우
                if (result && result.found.some(f => f.code === 'COG') && k + 1 < tokens.length && !/^[A-Za-z]/.test(tokens[k + 1])) {
                    result.name = tokens[++k];
                }

                if (result) {
                    if (result.found.length === 0 && result.name === tokens[k]) {
                        result.found.push({ code: "ETC", source: 'prefix' });
                    }

                    const hasPrefix = result.found.some(r => r.source === 'prefix');
                    let countedForThisToken = false;
                    let validSumCounted = false;

                    result.found.forEach(item => {
                        let dbKey = item.code;
                        const info = TREATMENT_DB[dbKey] || { type: 'ETC', nb: false, cat: 'ETC', name: dbKey };
                        let skipStats = false;

                        if (hasPrefix && item.source === 'suffix') {
                            skipStats = true;
                        }

                        if (!info.isTime && !skipStats) {
                            if (info.type === 'PT') state.therapistStats[therapist].PT++;
                            else if (info.type === 'OT') state.therapistStats[therapist].OT++;

                            const cKey = `${tc.label}|${result.name}`;
                            if (!state.conflictMap[cKey]) state.conflictMap[cKey] = [];
                            state.conflictMap[cKey].push({ th: therapist, code: item.code });

                            if (!state.patientStats[result.name]) {
                                state.patientStats[result.name] = { total: 0, codes: [], validSum: 0, hasRec: false };
                            }
                            if (!countedForThisToken) {
                                state.patientStats[result.name].total++;
                                countedForThisToken = true;
                            }
                            state.patientStats[result.name].codes.push(dbKey);
                            if (info.cat === 'REC') state.patientStats[result.name].hasRec = true;
                            if (!info.nb) {
                                if (!validSumCounted) {
                                    state.patientStats[result.name].validSum++;
                                    validSumCounted = true;
                                }
                            }
                        }

                        if (tc.label.includes("7:30") || tc.label.includes("8:00")) {
                            state.adlTherapists.add(therapist);
                        }

                        rowData.schedule[tc.idx].push({
                            code: item.code.replace(/_PRE|_SUF/g, ''),
                            name: result.name,
                            info,
                            source: item.source
                        });
                    });
                }
            }
        });

        state.rowMap.push(rowData);
    }

    // 충돌 감지
    Object.entries(state.conflictMap).forEach(([key, list]) => {
        const uniqueTherapists = new Set(list.map(i => i.th));
        if (uniqueTherapists.size > 1) {
            state.conflictMap[key].isConflict = true;
        }
    });

    GLOBAL_DATA = state;
    renderVisual(state, timeCols);

    setTimeout(() => {
        $('loading').classList.add('hidden');
        $('result_area').classList.remove('hidden');
        $('top_controls').classList.remove('hidden');
    }, 300);
}

// ========================================
// 시각화 렌더링
// ========================================
function renderVisual(state, timeCols) {
    const conflicts = [];
    Object.entries(state.conflictMap).forEach(([k, list]) => {
        if (state.conflictMap[k].isConflict) {
            const [time, name] = k.split("|");
            conflicts.push({
                time,
                name,
                details: list.map(x => `${x.th}(${x.code.replace(/_PRE|_SUF/g, '')})`).join(', ')
            });
        }
    });

    const listEl = $('conflict_list');
    listEl.innerHTML = "";

    if (conflicts.length > 0) {
        $('conflict_dashboard').classList.remove('hidden');
        $('success_msg').classList.add('hidden');
        $('badge_cnt').innerText = conflicts.length;

        conflicts.forEach((c, idx) => {
            const free = getFreeTherapists(c.time, state);
            const html = `
                <div class="conflict-item">
                    <div style="flex:1;overflow:hidden;">
                        <div class="d-flex align-items-center mb-1">
                            <span class="badge bg-danger me-2">${c.time}</span>
                            <span class="fw-bold text-dark">${c.name}</span>
                        </div>
                        <div class="small text-muted text-truncate">${c.details}</div>
                    </div>
                    <button class="btn-icon-only ms-2" onclick="toggleSuggestion('sug_${idx}')">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </button>
                </div>
                <div id="sug_${idx}" class="suggestion-panel">
                    <span class="badge bg-secondary me-1">PT</span> ${free.pt.join(', ') || '-'}<br>
                    <span class="badge bg-warning text-dark me-1 mt-1">OT</span> ${free.ot.join(', ') || '-'}
                </div>
            `;
            listEl.innerHTML += html;
        });
    } else {
        $('conflict_dashboard').classList.add('hidden');
        $('success_msg').classList.remove('hidden');
    }

    // 테이블 생성
    let html = "<thead><tr><th>치료사</th>" +
        timeCols.map(t => `<th>${t.label}</th>`).join('') +
        "</tr></thead><tbody>";

    let lastTh = "";
    let lastJob = "";

    state.rowMap.forEach((row, i) => {
        const isMac = CONFIG.MACHINE_THERAPISTS.includes(row.therapist);
        const job = isMac ? "MAC" : (state.therapistStats[row.therapist].OT > state.therapistStats[row.therapist].PT ? "OT" : "PT");

        html += `<tr class="${(i > 0 && job !== lastJob) ? 'group-divider' : ''}">`;
        lastJob = job;

        if (row.therapist !== lastTh) {
            let span = 1;
            for (let k = i + 1; k < state.rowMap.length; k++) {
                if (state.rowMap[k].therapist === row.therapist) span++;
                else break;
            }
            html += `<td rowspan="${span}">${row.therapist}</td>`;
        }
        lastTh = row.therapist;

        let blocked = 0;
        timeCols.forEach(tc => {
            const pts = row.schedule[tc.idx];
            const isBlocked = checkBlocked(tc.label, row.therapist, state.adlTherapists.has(row.therapist));

            if (isBlocked && (!pts || pts.length === 0)) {
                blocked++;
            } else {
                if (blocked > 0) {
                    html += `<td colspan="${blocked}" class="cell-blocked"></td>`;
                    blocked = 0;
                }

                if (pts && pts.length > 0) {
                    const g = pts.reduce((acc, curr) => {
                        if (!acc[curr.name]) acc[curr.name] = [];
                        acc[curr.name].push(curr);
                        return acc;
                    }, {});

                    let patientList = Object.keys(g).map(name => {
                        const items = g[name];
                        const suffixItem = items.find(i => i.source === 'suffix');
                        const prefixItem = items.find(i => i.source === 'prefix');
                        const sortKey = (suffixItem ? suffixItem.code : (prefixItem ? prefixItem.code : 'ZZ'));
                        return { name, items, sortKey };
                    });

                    patientList.sort((a, b) => {
                        if (a.sortKey < b.sortKey) return -1;
                        if (a.sortKey > b.sortKey) return 1;
                        return a.name.localeCompare(b.name);
                    });

                    const content = patientList.map(p => {
                        const name = p.name;
                        const items = p.items;
                        const confData = state.conflictMap[`${tc.label}|${name}`];
                        const isConf = confData && confData.isConflict;
                        const is2F = items.some(x => x.info.floor === "2F");

                        const pre = items.filter(x => x.source === 'prefix' && !x.info.isTime)
                            .map(x => `<span class="txt-code-pre">${x.code}</span>`).join('');
                        const suf = items.filter(x => x.source === 'suffix' && !x.info.isTime)
                            .map(x => `<span class="txt-code-suf">${x.code}</span>`).join('');
                        const time = items.filter(x => x.info.isTime)
                            .map(x => `<span class="time-marker">${x.code}</span>`).join('');

                        return `<div class="patient-line ${isConf ? 'conflict-text' : ''}">
                            ${pre}<span class="txt-name">${name}</span>${suf}${time}
                            ${is2F ? '<span class="special-badge badge-2f">2F</span>' : ''}
                        </div>`;
                    }).join('');

                    const cellHasConf = pts.some(p => {
                        const c = state.conflictMap[`${tc.label}|${p.name}`];
                        return c && c.isConflict;
                    });

                    html += `<td class="${cellHasConf ? 'cell-conflict' : ''}">${content}</td>`;
                } else {
                    html += `<td></td>`;
                }
            }
        });

        if (blocked > 0) html += `<td colspan="${blocked}" class="cell-blocked"></td>`;
        html += "</tr>";
    });

    $('visual_table').innerHTML = html + "</tbody>";
    renderStats(state);
}

// ========================================
// 통계 렌더링
// ========================================
function renderStats(state) {
    const sorted = Object.keys(state.patientStats).sort();

    $('tbody_stats').innerHTML = sorted.map(name => {
        const s = state.patientStats[name];
        const counts = s.codes.reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), {});

        const pills = Object.entries(counts).map(([dbKey, cnt]) => {
            const info = TREATMENT_DB[dbKey] || { type: 'ETC', nb: false };
            const isNb = info.nb;
            const displayName = dbKey.replace(/_PRE|_SUF|_TIME/g, '');
            return `<span class="code-pill ${isNb ? 'is-nb' : ''}">${displayName} <b>${cnt}</b></span>`;
        }).join('');

        let status = `<span class="status-badge st-pro">전문</span>`;
        if (s.hasRec) {
            const score = s.validSum * 2;
            status = `<span class="status-badge ${score === CONFIG.TARGET ? 'st-ok' : (score < CONFIG.TARGET ? 'st-short' : 'st-over')}">
                ${score === CONFIG.TARGET ? '정상' : (score < CONFIG.TARGET ? '부족' : '초과')}
            </span>`;
        }

        return `<tr>
            <td class="fw-bold text-dark">${name}</td>
            <td><div class="pill-container">${pills}</div></td>
            <td class="text-center fw-bold text-primary">${s.total}</td>
            <td class="text-center">${status}</td>
        </tr>`;
    }).join('');
}

// ========================================
// 유틸리티 함수
// ========================================
function checkBlocked(time, therapist, isAdl) {
    return isAdl ?
        (time.includes("15:15") || time.includes("3:15") || time.includes("15:50") || time.includes("3:50")) :
        (time.includes("7:30") || time.includes("8:00"));
}

function getFreeTherapists(timeLabel, state) {
    const targetCol = state.timeCols.find(tc => tc.label === timeLabel);
    if (!targetCol) return { pt: [], ot: [] };

    const colIdx = targetCol.idx;
    const busyTherapists = new Set;

    state.rowMap.forEach(row => {
        if (row.schedule[colIdx] && row.schedule[colIdx].length > 0) {
            busyTherapists.add(row.therapist);
        }
    });

    const pt = [], ot = [];
    Object.keys(state.therapistStats).forEach(th => {
        if (CONFIG.MACHINE_THERAPISTS.includes(th)) return;
        if (busyTherapists.has(th)) return;
        if (checkBlocked(timeLabel, th, state.adlTherapists.has(th))) return;
        (state.therapistStats[th].PT >= state.therapistStats[th].OT ? pt : ot).push(th);
    });

    return { pt, ot };
}

function toggleSuggestion(id) {
    $(id).classList.toggle('show');
}
