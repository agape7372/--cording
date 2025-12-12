import { createContext, useContext, useState } from 'react';

const AssessmentContext = createContext();

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within AssessmentProvider');
  }
  return context;
};

export const AssessmentProvider = ({ children }) => {
  // 현재 스텝
  const [currentStep, setCurrentStep] = useState(0);

  // 환자 기본 정보
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    gender: '',
    age: '',
    diagnosis: '',
    onsetDate: '',
    affectedSide: '',
    chiefComplaint: ''
  });

  // VAS (통증)
  const [vasData, setVasData] = useState({
    location: '',
    score: 0
  });

  // MAS (경직)
  const [masData, setMasData] = useState({
    upperExtremity: {
      rt: {},
      lt: {}
    },
    lowerExtremity: {
      rt: {},
      lt: {}
    }
  });

  // MMT (근력)
  const [mmtData, setMmtData] = useState({
    neckTrunk: {},
    upperExtremity: {
      rt: {},
      lt: {}
    },
    lowerExtremity: {
      rt: {},
      lt: {}
    }
  });

  // ROM (관절가동범위)
  const [romData, setRomData] = useState({
    neckTrunk: {},
    upperExtremity: {
      rt: {},
      lt: {}
    },
    lowerExtremity: {
      rt: {},
      lt: {}
    }
  });

  // BBS (균형)
  const [bbsData, setBbsData] = useState({});

  // 업데이트 함수들
  const updatePatientInfo = (field, value) => {
    setPatientInfo(prev => ({ ...prev, [field]: value }));
  };

  const updateVAS = (field, value) => {
    setVasData(prev => ({ ...prev, [field]: value }));
  };

  const updateMAS = (region, side, muscle, grade) => {
    setMasData(prev => ({
      ...prev,
      [region]: {
        ...prev[region],
        [side]: {
          ...prev[region][side],
          [muscle]: grade
        }
      }
    }));
  };

  const updateMMT = (region, side, muscle, grade) => {
    if (region === 'neckTrunk') {
      setMmtData(prev => ({
        ...prev,
        neckTrunk: {
          ...prev.neckTrunk,
          [muscle]: grade
        }
      }));
    } else {
      setMmtData(prev => ({
        ...prev,
        [region]: {
          ...prev[region],
          [side]: {
            ...prev[region][side],
            [muscle]: grade
          }
        }
      }));
    }
  };

  const updateROM = (region, side, joint, data) => {
    if (region === 'neckTrunk') {
      setRomData(prev => ({
        ...prev,
        neckTrunk: {
          ...prev.neckTrunk,
          [joint]: data
        }
      }));
    } else {
      setRomData(prev => ({
        ...prev,
        [region]: {
          ...prev[region],
          [side]: {
            ...prev[region][side],
            [joint]: data
          }
        }
      }));
    }
  };

  const updateBBS = (itemId, score) => {
    setBbsData(prev => ({ ...prev, [itemId]: score }));
  };

  // BBS 총점 계산
  const calculateBBSTotal = () => {
    return Object.values(bbsData).reduce((sum, score) => sum + (score || 0), 0);
  };

  // 모든 데이터 초기화
  const resetAssessment = () => {
    setCurrentStep(0);
    setPatientInfo({
      name: '',
      gender: '',
      age: '',
      diagnosis: '',
      onsetDate: '',
      affectedSide: '',
      chiefComplaint: ''
    });
    setVasData({ location: '', score: 0 });
    setMasData({
      upperExtremity: { rt: {}, lt: {} },
      lowerExtremity: { rt: {}, lt: {} }
    });
    setMmtData({
      neckTrunk: {},
      upperExtremity: { rt: {}, lt: {} },
      lowerExtremity: { rt: {}, lt: {} }
    });
    setRomData({
      neckTrunk: {},
      upperExtremity: { rt: {}, lt: {} },
      lowerExtremity: { rt: {}, lt: {} }
    });
    setBbsData({});
  };

  // MMT 모두 정상으로 설정
  const setAllMMTNormal = (region) => {
    if (region === 'neckTrunk') {
      const normalData = {};
      // 모든 neckTrunk 근육을 5(Normal)로
      setMmtData(prev => ({
        ...prev,
        neckTrunk: Object.keys(prev.neckTrunk).reduce((acc, key) => {
          acc[key] = '5';
          return acc;
        }, {})
      }));
    }
  };

  // ROM 모두 정상으로 설정
  const setAllROMNormal = (region, side, normalValues) => {
    if (region === 'neckTrunk') {
      setRomData(prev => ({
        ...prev,
        neckTrunk: Object.entries(normalValues).reduce((acc, [key, value]) => {
          acc[key] = { rom: value, pain: false };
          return acc;
        }, {})
      }));
    } else {
      setRomData(prev => ({
        ...prev,
        [region]: {
          ...prev[region],
          [side]: Object.entries(normalValues).reduce((acc, [key, value]) => {
            acc[key] = { rom: value, pain: false };
            return acc;
          }, {})
        }
      }));
    }
  };

  const value = {
    // State
    currentStep,
    patientInfo,
    vasData,
    masData,
    mmtData,
    romData,
    bbsData,
    // Setters
    setCurrentStep,
    updatePatientInfo,
    updateVAS,
    updateMAS,
    updateMMT,
    updateROM,
    updateBBS,
    // Utilities
    calculateBBSTotal,
    resetAssessment,
    setAllMMTNormal,
    setAllROMNormal
  };

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
};
