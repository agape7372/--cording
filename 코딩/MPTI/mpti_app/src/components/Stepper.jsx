import { useAssessment } from '../context/AssessmentContext';

const STEPS = [
  { id: 0, label: '환자 정보', shortLabel: '정보' },
  { id: 1, label: 'MAS (경직)', shortLabel: 'MAS' },
  { id: 2, label: 'MMT (근력)', shortLabel: 'MMT' },
  { id: 3, label: 'ROM (가동범위)', shortLabel: 'ROM' },
  { id: 4, label: 'BBS (균형)', shortLabel: 'BBS' },
  { id: 5, label: '결과 리포트', shortLabel: '결과' }
];

const Stepper = () => {
  const { currentStep, setCurrentStep } = useAssessment();

  return (
    <div className="stepper">
      {STEPS.map((step, index) => (
        <div
          key={step.id}
          className={`step ${currentStep === index ? 'active' : ''} ${currentStep > index ? 'completed' : ''}`}
          onClick={() => currentStep > index && setCurrentStep(index)}
          style={{ cursor: currentStep > index ? 'pointer' : 'default' }}
        >
          <div className="step-number">
            {currentStep > index ? '✓' : index + 1}
          </div>
          <span className="step-label">{step.shortLabel}</span>
        </div>
      ))}
    </div>
  );
};

export default Stepper;
