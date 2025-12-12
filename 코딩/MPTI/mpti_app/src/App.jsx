import { useState } from 'react';
import { AssessmentProvider } from './context/AssessmentContext';
import LandingPage from './pages/LandingPage';
import PatientListPage from './pages/PatientListPage';
import AssessmentPage from './pages/AssessmentPage';
import './styles/global.css';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([
    // 다양한 테스트 환자 데이터
    {
      id: 1,
      name: '김철수',
      gender: '남성',
      age: 65,
      diagnosis: 'stroke',
      onsetDate: '2024-06-15',
      affectedSide: 'rt',
      chiefComplaint: '우측 편마비로 인한 보행 장애, 상지 기능 저하',
      lastAssessment: '2024-12-08',
      // 평가 데이터 - 중등도 뇌졸중
      assessmentData: {
        vasScore: 4,
        vasLocation: '우측 어깨',
        bbsTotal: 32,
        mmtSummary: 'Rt UE: 2-3, Rt LE: 3-4',
        romSummary: 'Rt shoulder flex 120°, Rt knee flex 100°'
      }
    },
    {
      id: 2,
      name: '이영희',
      gender: '여성',
      age: 72,
      diagnosis: 'parkinsons',
      onsetDate: '2023-03-20',
      affectedSide: 'both',
      chiefComplaint: '보행 시 동결 현상, 자세 불안정, 소보증',
      lastAssessment: '2024-12-05',
      assessmentData: {
        vasScore: 2,
        vasLocation: '허리',
        bbsTotal: 38,
        mmtSummary: 'Gross 4-5, 경직 없음',
        romSummary: 'WNL'
      }
    },
    {
      id: 3,
      name: '박민수',
      gender: '남성',
      age: 45,
      diagnosis: 'sci',
      onsetDate: '2024-01-10',
      affectedSide: 'both',
      chiefComplaint: 'T10 완전 손상, 하지 마비, 휠체어 이동',
      lastAssessment: '2024-12-01',
      assessmentData: {
        vasScore: 6,
        vasLocation: '양측 하지 신경병증성 통증',
        bbsTotal: 8,
        mmtSummary: 'UE: 5, LE: 0',
        romSummary: 'LE ROM 제한'
      }
    },
    {
      id: 4,
      name: '최수진',
      gender: '여성',
      age: 58,
      diagnosis: 'stroke',
      onsetDate: '2024-09-01',
      affectedSide: 'lt',
      chiefComplaint: '좌측 편마비, 언어장애(브로카 실어증), 삼킴장애',
      lastAssessment: '2024-12-09',
      assessmentData: {
        vasScore: 3,
        vasLocation: '좌측 어깨 아탈구',
        bbsTotal: 28,
        mmtSummary: 'Lt UE: 1-2, Lt LE: 2-3',
        romSummary: 'Lt shoulder 제한'
      }
    },
    {
      id: 5,
      name: '정대호',
      gender: '남성',
      age: 35,
      diagnosis: 'tbi',
      onsetDate: '2024-08-20',
      affectedSide: 'rt',
      chiefComplaint: '교통사고 후 외상성 뇌손상, 인지기능 저하, 우측 반마비',
      lastAssessment: '2024-12-07',
      assessmentData: {
        vasScore: 5,
        vasLocation: '두통',
        bbsTotal: 42,
        mmtSummary: 'Rt: 3-4, Lt: 5',
        romSummary: 'WNL'
      }
    },
    {
      id: 6,
      name: '윤미경',
      gender: '여성',
      age: 48,
      diagnosis: 'ms',
      onsetDate: '2022-05-15',
      affectedSide: 'both',
      chiefComplaint: '다발성 경화증, 피로감, 양하지 근력약화, 균형장애',
      lastAssessment: '2024-12-06',
      assessmentData: {
        vasScore: 3,
        vasLocation: '양하지 경련',
        bbsTotal: 45,
        mmtSummary: 'LE: 3-4, UE: 4-5',
        romSummary: 'WNL'
      }
    },
    {
      id: 7,
      name: '강현우',
      gender: '남성',
      age: 78,
      diagnosis: 'stroke',
      onsetDate: '2024-11-01',
      affectedSide: 'lt',
      chiefComplaint: '급성기 뇌졸중, 좌측 완전마비, 의식명료',
      lastAssessment: '2024-12-10',
      assessmentData: {
        vasScore: 2,
        vasLocation: '없음',
        bbsTotal: 12,
        mmtSummary: 'Lt UE: 0-1, Lt LE: 1-2',
        romSummary: 'Lt 전반적 제한'
      }
    },
    {
      id: 8,
      name: '한소희',
      gender: '여성',
      age: 62,
      diagnosis: 'parkinsons',
      onsetDate: '2020-01-01',
      affectedSide: 'both',
      chiefComplaint: 'Hoehn & Yahr stage 3, 자세불안정, 낙상 경험 다수',
      lastAssessment: '2024-12-04',
      assessmentData: {
        vasScore: 4,
        vasLocation: '요통, 경부통',
        bbsTotal: 35,
        mmtSummary: 'Gross 4, 경직 G1-G1+',
        romSummary: '경추 ROM 제한'
      }
    }
  ]);

  // 페이지 네비게이션
  const handleNavigate = (page) => {
    setCurrentPage(page);
    if (page !== 'assessment') {
      setSelectedPatient(null);
    }
  };

  // 새 환자 추가
  const handleAddPatient = () => {
    const newPatient = {
      id: Date.now(),
      name: '',
      gender: '',
      age: '',
      diagnosis: '',
      onsetDate: '',
      affectedSide: '',
      chiefComplaint: '',
      lastAssessment: null
    };
    setSelectedPatient(newPatient);
    setCurrentPage('assessment');
  };

  // 환자 선택
  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setCurrentPage('assessment');
  };

  // 평가 저장
  const handleSaveAssessment = (assessmentData) => {
    const updatedPatient = {
      ...selectedPatient,
      ...assessmentData.patientInfo,
      lastAssessment: new Date().toISOString().split('T')[0]
    };

    if (patients.find(p => p.id === selectedPatient.id)) {
      // 기존 환자 업데이트
      setPatients(patients.map(p => p.id === selectedPatient.id ? updatedPatient : p));
    } else {
      // 새 환자 추가
      setPatients([...patients, updatedPatient]);
    }

    alert('저장되었습니다!');
    setCurrentPage('patients');
  };

  // 뒤로가기
  const handleBackToList = () => {
    setSelectedPatient(null);
    setCurrentPage('patients');
  };

  // 페이지 렌더링
  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'patients':
        return (
          <PatientListPage
            patients={patients}
            onAddPatient={handleAddPatient}
            onSelectPatient={handleSelectPatient}
            onNavigate={handleNavigate}
          />
        );
      case 'assessment':
        return (
          <AssessmentProvider key={selectedPatient?.id}>
            <AssessmentPage
              patient={selectedPatient}
              onSave={handleSaveAssessment}
              onBack={handleBackToList}
            />
          </AssessmentProvider>
        );
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return renderPage();
}

export default App;
