# 알고PT Pro - React 참고 디자인 코드

> 이 파일은 참고용으로 저장된 React/TypeScript 버전 코드입니다.
> 현재 프로젝트(Vanilla JS)에 직접 반영하지 않습니다.

---

## App.tsx

```tsx
import { useState } from "react";
import {
  Home,
  Users,
  Activity,
  MessageSquare,
  Menu,
} from "lucide-react";
import { Dashboard } from "./components/Dashboard";
import { PatientList } from "./components/PatientList";
import { PatientDetail } from "./components/PatientDetail";
import { AssessmentFlow } from "./components/AssessmentFlow";
import { AIChat } from "./components/AIChat";
import { QuickToolsGrid } from "./components/QuickToolsGrid";

type TabType =
  | "home"
  | "patients"
  | "assessment"
  | "ai"
  | "more";

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>("home");
  const [showAssessment, setShowAssessment] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<
    (typeof patients)[0] | null
  >(null);

  // Mock data
  const stats = [
    {
      label: "총 환자",
      value: "24",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      label: "오늘 평가",
      value: "3",
      icon: Activity,
      color: "bg-green-500",
    },
    {
      label: "고위험",
      value: "2",
      icon: Activity,
      color: "bg-red-500",
    },
    {
      label: "개선률",
      value: "78%",
      icon: Activity,
      color: "bg-purple-500",
    },
  ];

  const patients = [
    {
      id: "1",
      name: "홍길동",
      age: 65,
      diagnosis: "뇌졸중",
      lastAssessment: "2일 전",
      bbs: 28,
      riskLevel: "medium" as const,
    },
    {
      id: "2",
      name: "김영희",
      age: 58,
      diagnosis: "파킨슨",
      lastAssessment: "5일 전",
      bbs: 42,
      riskLevel: "low" as const,
    },
    {
      id: "3",
      name: "이철수",
      age: 45,
      diagnosis: "SCI",
      lastAssessment: "1일 전",
      bbs: 15,
      riskLevel: "high" as const,
    },
    {
      id: "4",
      name: "박민수",
      age: 52,
      diagnosis: "뇌졸중",
      lastAssessment: "3일 전",
      bbs: 18,
      riskLevel: "high" as const,
    },
  ];

  const upcomingAssessments = [
    { name: "홍길동", time: "10:00", type: "재평가" },
    { name: "김영희", time: "14:00", type: "초기평가" },
    { name: "이철수", time: "16:00", type: "중간평가" },
  ];

  const handleSelectPatient = (
    patient: (typeof patients)[0],
  ) => {
    setSelectedPatient(patient);
  };

  const renderContent = () => {
    // 환자 상세 화면
    if (selectedPatient) {
      return (
        <PatientDetail
          patient={selectedPatient}
          onBack={() => setSelectedPatient(null)}
          onStartAssessment={() => setShowAssessment(true)}
        />
      );
    }

    switch (currentTab) {
      case "home":
        return (
          <Dashboard
            stats={stats}
            patients={patients}
            upcomingAssessments={upcomingAssessments}
          />
        );
      case "patients":
        return (
          <PatientList
            patients={patients}
            onSelectPatient={handleSelectPatient}
          />
        );
      case "assessment":
        return (
          <QuickToolsGrid
            onStartFullAssessment={() =>
              setShowAssessment(true)
            }
          />
        );
      case "ai":
        return <AIChat />;
      case "more":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">더보기</h2>
            <div className="space-y-3">
              <button className="w-full p-4 bg-white rounded-xl border border-gray-200 text-left">
                설정
              </button>
              <button className="w-full p-4 bg-white rounded-xl border border-gray-200 text-left">
                도움말
              </button>
              <button className="w-full p-4 bg-white rounded-xl border border-gray-200 text-left">
                버전 정보
              </button>
            </div>
          </div>
        );
      default:
        return (
          <Dashboard
            stats={stats}
            patients={patients}
            upcomingAssessments={upcomingAssessments}
          />
        );
    }
  };

  const tabs = [
    { id: "home" as TabType, label: "홈", icon: Home },
    { id: "patients" as TabType, label: "환자", icon: Users },
    {
      id: "assessment" as TabType,
      label: "평가",
      icon: Activity,
    },
    { id: "ai" as TabType, label: "AI", icon: MessageSquare },
    { id: "more" as TabType, label: "더보기", icon: Menu },
  ];

  if (showAssessment) {
    return (
      <AssessmentFlow
        onClose={() => setShowAssessment(false)}
      />
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 px-4 pt-6">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom">
        <div className="grid grid-cols-5 h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                  isActive ? "text-blue-600" : "text-gray-500"
                }`}
              >
                <Icon
                  className={`w-6 h-6 ${isActive ? "scale-110" : ""} transition-transform`}
                />
                <span
                  className={`text-xs ${isActive ? "font-semibold" : ""}`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
```

---

## styles/globals.css

```css
@custom-variant dark (&:is(.dark *));

:root {
  --font-size: 16px;
  --background: #ffffff;
  --foreground: oklch(0.145 0 0);
  --card: #ffffff;
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: #030213;
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.95 0.0058 264.53);
  --secondary-foreground: #030213;
  --muted: #ececf0;
  --muted-foreground: #717182;
  --accent: #e9ebef;
  --accent-foreground: #030213;
  --destructive: #d4183d;
  --destructive-foreground: #ffffff;
  --border: rgba(0, 0, 0, 0.1);
  --input: transparent;
  --input-background: #f3f3f5;
  --switch-background: #cbced4;
  --font-weight-medium: 500;
  --font-weight-normal: 400;
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --radius: 0.625rem;
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: #030213;
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.145 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.145 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.396 0.141 25.723);
  --destructive-foreground: oklch(0.637 0.237 25.331);
  --border: oklch(0.269 0 0);
  --input: oklch(0.269 0 0);
  --ring: oklch(0.439 0 0);
  --font-weight-medium: 500;
  --font-weight-normal: 400;
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(0.269 0 0);
  --sidebar-ring: oklch(0.439 0 0);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-input-background: var(--input-background);
  --color-switch-background: var(--switch-background);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }

  body {
    @apply bg-background text-foreground;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

@keyframes slide-down {
  from { transform: translateY(-100%); }
  to { transform: translateY(0); }
}

@keyframes scale-in {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.animate-fade-in { animation: fade-in 0.2s ease-out; }
.animate-slide-up { animation: slide-up 0.3s ease-out; }
.animate-slide-down { animation: slide-down 0.3s ease-out; }
.animate-scale-in { animation: scale-in 0.2s ease-out; }

.active\:scale-98:active { transform: scale(0.98); }
.active\:scale-95:active { transform: scale(0.95); }

.safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
.safe-top { padding-top: env(safe-area-inset-top); }

@media (hover: none) {
  button:active { opacity: 0.7; }
}

html { scroll-behavior: smooth; }

.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
```

---

## components/PatientDetail.tsx

```tsx
import { ArrowLeft, Phone, Mail, Calendar, Activity, TrendingUp, FileText, Clock } from 'lucide-react';

type Patient = {
  id: string;
  name: string;
  age: number;
  diagnosis: string;
  lastAssessment: string;
  bbs: number;
  riskLevel: 'high' | 'medium' | 'low';
};

type PatientDetailProps = {
  patient: Patient;
  onBack: () => void;
  onStartAssessment: () => void;
};

export function PatientDetail({ patient, onBack, onStartAssessment }: PatientDetailProps) {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'high': return '고위험';
      case 'medium': return '중등도';
      case 'low': return '양호';
      default: return '알 수 없음';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 -mx-4 -mt-6 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white mb-4 active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>환자 목록</span>
        </button>

        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl font-bold">
            {patient.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">{patient.name}</h1>
            <div className="flex items-center gap-2 text-blue-100">
              <span>{patient.age}세</span>
              <span>•</span>
              <span>{patient.diagnosis}</span>
            </div>
            <div className="mt-2">
              <span className={`text-xs px-3 py-1 rounded-full border ${getRiskColor(patient.riskLevel)}`}>
                {getRiskLabel(patient.riskLevel)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <button
          onClick={onStartAssessment}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl p-5 shadow-lg active:scale-98 transition-transform"
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="text-lg font-bold mb-1">평가 시작</div>
              <div className="text-sm text-purple-100">ROM + MMT + BBS 종합 평가</div>
            </div>
            <Activity className="w-6 h-6" />
          </div>
        </button>
      </div>

      {/* Assessment Stats */}
      <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">평가 지표</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="text-sm text-blue-700 mb-1">BBS 점수</div>
            <div className="text-3xl font-bold text-blue-900">{patient.bbs}<span className="text-lg text-blue-600">/56</span></div>
            <div className="text-xs text-blue-600 mt-1">균형 척도</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
            <div className="text-sm text-green-700 mb-1">ROM</div>
            <div className="text-3xl font-bold text-green-900">85<span className="text-lg text-green-600">%</span></div>
            <div className="text-xs text-green-600 mt-1">관절 가동 범위</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
            <div className="text-sm text-purple-700 mb-1">MMT</div>
            <div className="text-3xl font-bold text-purple-900">3.5<span className="text-lg text-purple-600">/5</span></div>
            <div className="text-xs text-purple-600 mt-1">근력 테스트</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
            <div className="text-sm text-orange-700 mb-1">개선률</div>
            <div className="text-3xl font-bold text-orange-900">+12<span className="text-lg text-orange-600">%</span></div>
            <div className="text-xs text-orange-600 mt-1">지난 달 대비</div>
          </div>
        </div>
      </div>

      {/* Treatment Progress */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-5 border border-blue-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">치료 진행도</h3>
            <p className="text-xs text-gray-600">지난 4주간의 변화</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700">균형 개선</span>
              <span className="font-semibold text-blue-600">73%</span>
            </div>
            <div className="h-2 bg-white rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600" style={{ width: '73%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700">근력 회복</span>
              <span className="font-semibold text-green-600">65%</span>
            </div>
            <div className="h-2 bg-white rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-400 to-green-600" style={{ width: '65%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700">가동 범위</span>
              <span className="font-semibold text-purple-600">80%</span>
            </div>
            <div className="h-2 bg-white rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600" style={{ width: '80%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## components/mobile/QuickTools.tsx

```tsx
import { X, Gauge, Ruler, Dumbbell, Timer, Camera, Mic, Activity, Target, TrendingUp } from 'lucide-react';
import { useState } from 'react';

type QuickToolsProps = {
  onClose: () => void;
};

type ToolType = null | 'vas' | 'rom' | 'walking' | 'balance' | 'voice' | 'mmt';

export function QuickTools({ onClose }: QuickToolsProps) {
  const [selectedTool, setSelectedTool] = useState<ToolType>(null);

  const tools = [
    {
      id: 'vas' as ToolType,
      name: 'VAS 통증 평가',
      description: '0-10점 통증 척도',
      icon: Gauge,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600'
    },
    {
      id: 'rom' as ToolType,
      name: 'ROM 빠른 측정',
      description: '단일 관절 측정',
      icon: Ruler,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      id: 'mmt' as ToolType,
      name: 'MMT 단일 테스트',
      description: '근력 0-5점',
      icon: Dumbbell,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      id: 'walking' as ToolType,
      name: '보행 거리 측정',
      description: '시간 + 거리 기록',
      icon: Timer,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      id: 'balance' as ToolType,
      name: '균형 테스트',
      description: '한발 서기 타이머',
      icon: Activity,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    {
      id: 'voice' as ToolType,
      name: '음성 메모',
      description: '빠른 녹음',
      icon: Mic,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-100',
      iconColor: 'text-pink-600'
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end animate-fade-in">
      <div className="bg-white rounded-t-3xl w-full max-h-[85vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">빠른 도구</h2>
            <p className="text-sm text-gray-500 mt-1">자주 사용하는 평가 도구</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full active:bg-gray-200 transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Tools Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-3 pb-6">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  className="bg-white border border-gray-200 rounded-2xl p-4 active:scale-95 transition-transform shadow-sm"
                >
                  <div className={`w-12 h-12 ${tool.bgColor} rounded-xl flex items-center justify-center mb-3`}>
                    <Icon className={`w-6 h-6 ${tool.iconColor}`} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 mb-1">{tool.name}</div>
                    <div className="text-xs text-gray-600">{tool.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## components/mobile/tools/VASPainScale.tsx

```tsx
import { X, Check, Frown, Meh, Smile } from 'lucide-react';
import { useState } from 'react';

type VASPainScaleProps = {
  onClose: () => void;
};

export function VASPainScale({ onClose }: VASPainScaleProps) {
  const [painLevel, setPainLevel] = useState(5);
  const [location, setLocation] = useState('');
  const [note, setNote] = useState('');

  const handleSave = () => {
    alert(`통증 기록 완료!\n위치: ${location}\n수준: ${painLevel}/10\n메모: ${note}`);
    onClose();
  };

  const getPainColor = () => {
    if (painLevel <= 3) return 'text-green-600';
    if (painLevel <= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPainLabel = () => {
    if (painLevel === 0) return '통증 없음';
    if (painLevel <= 3) return '경미한 통증';
    if (painLevel <= 6) return '중등도 통증';
    if (painLevel <= 8) return '심한 통증';
    return '극심한 통증';
  };

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button onClick={onClose} className="p-2 -ml-2 active:bg-gray-100 rounded-lg transition-colors">
          <X className="w-6 h-6 text-gray-600" />
        </button>
        <h2 className="font-bold text-gray-900">VAS 통증 평가</h2>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg active:bg-blue-700 transition-colors flex items-center gap-1"
        >
          <Check className="w-4 h-4" />
          저장
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          <div className={`text-6xl font-bold mb-2 ${getPainColor()}`}>
            {painLevel}
          </div>
          <div className={`text-lg font-semibold ${getPainColor()}`}>
            {getPainLabel()}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="mb-6">
            <input
              type="range"
              min="0"
              max="10"
              value={painLevel}
              onChange={(e) => setPainLevel(parseInt(e.target.value))}
              className="w-full h-3 appearance-none rounded-full"
            />
          </div>

          <div className="flex justify-between items-center mt-6">
            <div className="text-center">
              <Smile className="w-8 h-8 text-green-600 mx-auto mb-1" />
              <div className="text-xs text-gray-600">통증 없음</div>
            </div>
            <div className="text-center">
              <Meh className="w-8 h-8 text-yellow-600 mx-auto mb-1" />
              <div className="text-xs text-gray-600">보통</div>
            </div>
            <div className="text-center">
              <Frown className="w-8 h-8 text-red-600 mx-auto mb-1" />
              <div className="text-xs text-gray-600">극심함</div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900 px-1">
            자주 사용하는 위치
          </label>
          <div className="flex flex-wrap gap-2">
            {['목', '어깨', '팔꿈치', '손목', '허리', '무릎', '발목'].map((loc) => (
              <button
                key={loc}
                onClick={() => setLocation(loc)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm active:bg-gray-50 transition-colors"
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## components/mobile/tools/ROMQuickTest.tsx

```tsx
import { X, Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';

type ROMQuickTestProps = {
  onClose: () => void;
};

export function ROMQuickTest({ onClose }: ROMQuickTestProps) {
  const [joint, setJoint] = useState('무릎');
  const [movement, setMovement] = useState('신전');
  const [side, setSide] = useState('왼쪽');
  const [angle, setAngle] = useState('');

  const joints = {
    '어깨': ['굴곡', '신전', '외전', '내전', '외회전', '내회전'],
    '팔꿈치': ['굴곡', '신전'],
    '손목': ['굴곡', '신전', '요측편위', '척측편위'],
    '고관절': ['굴곡', '신전', '외전', '내전'],
    '무릎': ['굴곡', '신전'],
    '발목': ['배측굴곡', '저측굴곡', '내번', '외번']
  };

  const normalRanges: Record<string, Record<string, number>> = {
    '어깨': { '굴곡': 180, '신전': 60, '외전': 180, '내전': 50, '외회전': 90, '내회전': 90 },
    '팔꿈치': { '굴곡': 150, '신전': 0 },
    '손목': { '굴곡': 80, '신전': 70 },
    '고관절': { '굴곡': 120, '신전': 30, '외전': 45, '내전': 30 },
    '무릎': { '굴곡': 135, '신전': 0 },
    '발목': { '배측굴곡': 20, '저측굴곡': 50 }
  };

  const handleSave = () => {
    const normal = normalRanges[joint]?.[movement] || 0;
    const current = parseInt(angle) || 0;
    const difference = current - normal;

    alert(`ROM 기록 완료!\n${side} ${joint} ${movement}\n측정: ${angle}°\n정상: ${normal}°\n차이: ${difference > 0 ? '+' : ''}${difference}°`);
    onClose();
  };

  const getNormalRange = () => {
    return normalRanges[joint]?.[movement] || 0;
  };

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button onClick={onClose} className="p-2 -ml-2">
          <X className="w-6 h-6 text-gray-600" />
        </button>
        <h2 className="font-bold text-gray-900">ROM 빠른 측정</h2>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg active:bg-blue-700 transition-colors flex items-center gap-1"
        >
          <Check className="w-4 h-4" />
          저장
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="block text-sm font-semibold text-gray-900 mb-3">측정 부위</label>
          <div className="grid grid-cols-2 gap-2">
            {['왼쪽', '오른쪽'].map((s) => (
              <button
                key={s}
                onClick={() => setSide(s)}
                className={`py-3 rounded-xl border-2 transition-all ${
                  side === s
                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="block text-sm font-semibold text-gray-900 mb-3">관절</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.keys(joints).map((j) => (
              <button
                key={j}
                onClick={() => {
                  setJoint(j);
                  setMovement(joints[j as keyof typeof joints][0]);
                }}
                className={`py-2 rounded-lg text-sm ${
                  joint === j
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {j}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="block text-sm font-semibold text-gray-900 mb-3">동작</label>
          <div className="grid grid-cols-2 gap-2">
            {joints[joint as keyof typeof joints].map((m) => (
              <button
                key={m}
                onClick={() => setMovement(m)}
                className={`py-3 rounded-xl border-2 transition-all ${
                  movement === m
                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-gray-900">측정 각도</label>
            <span className="text-sm text-gray-500">
              정상: {getNormalRange()}°
            </span>
          </div>
          <div className="relative">
            <input
              type="number"
              value={angle}
              onChange={(e) => setAngle(e.target.value)}
              placeholder="각도 입력"
              className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-xl text-2xl font-bold text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl font-semibold text-gray-400">
              °
            </span>
          </div>

          <div className="grid grid-cols-6 gap-2 mt-3">
            {[0, 30, 45, 60, 90, 120, 135, 150, 180].map((deg) => (
              <button
                key={deg}
                onClick={() => setAngle(deg.toString())}
                className="py-2 bg-gray-100 rounded-lg text-sm active:bg-gray-200 transition-colors"
              >
                {deg}°
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 주요 디자인 특징

### 색상 시스템
- Primary: Blue (#2563EB 계열)
- Success: Green (#10B981 계열)
- Warning: Yellow (#F59E0B 계열)
- Danger: Red (#EF4444 계열)
- Purple: (#8B5CF6 계열)

### 컴포넌트 스타일
- 카드: `rounded-2xl`, `shadow-sm`, `border border-gray-100`
- 버튼: `rounded-xl`, `active:scale-95`, `transition-transform`
- 그라데이션 배경: `bg-gradient-to-r from-X-500 to-X-600`
- 진행 바: `h-2 bg-white rounded-full overflow-hidden`

### 애니메이션
- `animate-fade-in`: 0.2s ease-out 페이드인
- `animate-slide-up`: 0.3s ease-out 슬라이드업
- `active:scale-98`: 버튼 클릭 시 살짝 축소

### 레이아웃
- 하단 네비게이션: 5개 탭 (홈, 환자, 평가, AI, 더보기)
- safe-area 지원: `safe-bottom`, `safe-top`
- 그리드: `grid-cols-2` 기본
